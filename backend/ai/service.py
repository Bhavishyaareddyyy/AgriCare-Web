import json
import io
import os
from http.server import BaseHTTPRequestHandler, HTTPServer

import joblib
import numpy as np
import onnxruntime as ort
from PIL import Image, ImageOps
from dotenv import load_dotenv

from crop_inference import (
    ALGORITHM_NAME as CROP_ALGORITHM_NAME,
    EXPECTED_CLASS_LABELS,
    CropInputError,
    MODEL_NAME as CROP_MODEL_NAME,
    predict_crops,
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"), override=False)


def local_path(environment_name, default_path):
    path = os.path.expanduser(os.environ.get(environment_name, default_path))
    if not os.path.isabs(path):
        path = os.path.join(BASE_DIR, path)
    return os.path.abspath(path)


MODEL_PATH = local_path(
    "DISEASE_MODEL_PATH",
    os.path.join(BASE_DIR, "models", "onnx", "model_with_features_quantized.onnx"),
)
METADATA_PATH = local_path(
    "DISEASE_METADATA_PATH",
    os.path.join(BASE_DIR, "models", "ood_meta.json"),
)
CENTROIDS_PATH = local_path(
    "DISEASE_CENTROIDS_PATH",
    os.path.join(BASE_DIR, "models", "centroids.f32"),
)
CROP_MODEL_PATH = local_path(
    "CROP_MODEL_PATH",
    os.path.join(BASE_DIR, "models", "crop_recommendation_logistic_regression.joblib"),
)
AI_HOST = os.environ.get("AI_HOST", "127.0.0.1")
AI_PORT = int(os.environ.get("AI_PORT", "8001"))
MODEL_NAME = "rodynaemad/plant-disease-dinov2-small"

session = ort.InferenceSession(
    MODEL_PATH,
    providers=["CPUExecutionProvider"]
)

inputs = {item.name: item for item in session.get_inputs()}
outputs = {item.name: item for item in session.get_outputs()}
if "pixel_values" not in inputs or not {"logits", "features"}.issubset(outputs):
    raise ValueError("Unexpected input/output tensors in the disease model")
INPUT_NAME = "pixel_values"
LOGITS_NAME = "logits"
FEATURES_NAME = "features"

with open(METADATA_PATH, "r", encoding="utf-8") as f:
    MODEL_METADATA = json.load(f)

CLASS_NAMES = MODEL_METADATA["labels"]
FEATURE_DIM = MODEL_METADATA["dim"]
OOD_THRESHOLD = MODEL_METADATA["threshold"]
CENTROIDS = np.fromfile(CENTROIDS_PATH, dtype="<f4")
if len(CENTROIDS) != len(CLASS_NAMES) * FEATURE_DIM:
    raise ValueError("OOD centroid file does not match model metadata")
CENTROIDS = CENTROIDS.reshape(len(CLASS_NAMES), FEATURE_DIM)
if len(CLASS_NAMES) != outputs[LOGITS_NAME].shape[-1]:
    raise ValueError("Model class count does not match model metadata")
crop_bundle = joblib.load(CROP_MODEL_PATH)
if crop_bundle.get("modelName") != CROP_MODEL_NAME:
    raise ValueError(
        "Configured crop artifact is not the required standardized Logistic Regression model; "
        "the service will not fall back to another crop model."
    )
if crop_bundle.get("classLabels") != list(EXPECTED_CLASS_LABELS):
    raise ValueError(
        "Configured crop artifact must contain all 22 supported crop classes."
    )


class ImageInputError(ValueError):
    pass


def preprocess(image_bytes):
    try:
        with Image.open(io.BytesIO(image_bytes)) as opened:
            image = ImageOps.exif_transpose(opened).convert("RGB")
    except (OSError, ValueError) as error:
        raise ImageInputError("The uploaded file is not a readable image.") from error
    if not image.width or not image.height or image.width > 8000 or image.height > 8000 or image.width * image.height > 25_000_000:
        raise ImageInputError("The uploaded image dimensions exceed the supported limits.")

    # Model card pipeline: Resize(256), CenterCrop(224), RGB, ImageNet normalization.
    # The bundled ONNX input shape [1, 3, 224, 224] was verified from session metadata.
    width, height = image.size
    scale = 256 / min(width, height)
    resized = (round(width * scale), round(height * scale))
    image = image.resize(resized, Image.Resampling.BICUBIC)
    left = (image.width - 224) // 2
    top = (image.height - 224) // 2
    image = image.crop((left, top, left + 224, top + 224))

    array = np.asarray(image).astype(np.float32) / 255.0

    mean = np.array(
        [0.485, 0.456, 0.406],
        dtype=np.float32
    )

    std = np.array(
        [0.229, 0.224, 0.225],
        dtype=np.float32
    )

    array = (array - mean) / std

    # HWC -> CHW
    array = np.transpose(array, (2, 0, 1))

    # Add batch dimension
    return np.expand_dims(array, axis=0).astype(np.float32)


def predict(image_bytes):
    input_tensor = preprocess(image_bytes)

    logits, features = session.run(
        [LOGITS_NAME, FEATURES_NAME],
        {INPUT_NAME: input_tensor}
    )
    logits = logits[0]
    features = features[0]
    if not np.isfinite(logits).all() or not np.isfinite(features).all():
        raise ValueError("Model returned non-finite values")

    exp_values = np.exp(logits - np.max(logits))
    probabilities = exp_values / np.sum(exp_values)
    top_indices = np.argsort(probabilities)[-5:][::-1]
    top5 = [
        {"label": CLASS_NAMES[int(index)], "confidence": float(probabilities[index])}
        for index in top_indices
    ]

    feature_norm = np.linalg.norm(features)
    if feature_norm == 0:
        similarity = -1.0
    else:
        similarity = float(np.max(CENTROIDS @ features / feature_norm))

    result = {
        "model": MODEL_NAME,
        "oodSimilarity": similarity,
        "oodThreshold": OOD_THRESHOLD,
        "top5": top5,
    }
    if similarity < OOD_THRESHOLD:
        return {
            **result,
            "status": "unsupported",
            "label": None,
            "confidence": None,
            "message": "This photo is outside the image distribution the model was validated on. It may be an unsupported crop, a field photo, or an unclear image. No disease result was produced.",
        }

    index = int(np.argmax(probabilities))
    return {
        **result,
        "status": "classified",
        "label": CLASS_NAMES[index],
        "confidence": float(probabilities[index]),
        "message": None,
    }


class Handler(BaseHTTPRequestHandler):
    def send_json(self, status, value):
        body = json.dumps(value).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/health":
            self.send_json(200, {
                "success": True,
                "service": "AgriCare Local AI",
                "diseaseModel": {
                    "name": MODEL_NAME,
                    "classes": len(CLASS_NAMES),
                    "oodRejection": True,
                },
                "cropModel": {
                    "name": CROP_MODEL_NAME,
                    "algorithm": CROP_ALGORITHM_NAME,
                    "version": crop_bundle["modelVersion"],
                    "trainingDataset": crop_bundle["trainingDataset"],
                    "trainingRows": crop_bundle["trainingRows"],
                    "heldOutAccuracy": crop_bundle["heldOutAccuracy"],
                    "evaluation": crop_bundle["evaluation"],
                    "featureNames": crop_bundle["featureNames"],
                    "supportedRanges": crop_bundle["supportedRanges"],
                },
            })
            return

        self.send_json(404, {"error": {"code": "NOT_FOUND"}})

    def do_POST(self):
        if self.path not in {"/predict", "/crop/recommend"}:
            self.send_json(404, {"error": {"code": "NOT_FOUND"}})
            return

        is_crop_request = self.path == "/crop/recommend" or (
            self.path == "/predict"
            and self.headers.get("Content-Type", "").split(";", 1)[0].strip().lower() == "application/json"
        )

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            maximum_length = 64 * 1024 if is_crop_request else 5 * 1024 * 1024
            if content_length <= 0 or content_length > maximum_length:
                self.send_json(400, {"error": {"code": "INVALID_REQUEST"}})
                return
            image_bytes = self.rfile.read(content_length)
            if not is_crop_request:
                try:
                    result = predict(image_bytes)
                except ImageInputError as error:
                    print(type(error).__name__ + ": " + str(error), flush=True)
                    self.send_json(400, {"error": {"code": "INVALID_IMAGE", "message": "The uploaded image could not be preprocessed."}})
                    return
            else:
                try:
                    raw_inputs = json.loads(image_bytes)
                    result = predict_crops(crop_bundle, raw_inputs)
                except CropInputError as error:
                    status = 422 if error.code == "UNSUPPORTED_INPUT" else 400
                    self.send_json(status, {
                        "error": {
                            "code": error.code,
                            "message": str(error),
                            "details": error.details,
                        }
                    })
                    return
                except (json.JSONDecodeError, UnicodeDecodeError):
                    self.send_json(400, {"error": {"code": "INVALID_INPUT", "message": "Provide crop model inputs as JSON."}})
                    return
            self.send_json(200, result)
        except (BrokenPipeError, ConnectionResetError):
            return
        except Exception as error:
            print(type(error).__name__ + ": " + str(error), flush=True)
            self.send_json(500, {"error": {"code": "INFERENCE_FAILED", "message": "Local model inference failed."}})

    def log_message(self, format, *args):
        print(format % args)


print("AgriCare Plant Disease AI")
print("Model:", MODEL_PATH)
print("Classes:", len(CLASS_NAMES))
print("Input:", INPUT_NAME)
print("Crop model:", CROP_MODEL_PATH)
print("Running on http://{}:{}".format(AI_HOST, AI_PORT))

server = HTTPServer(
    (AI_HOST, AI_PORT),
    Handler
)

server.serve_forever()
