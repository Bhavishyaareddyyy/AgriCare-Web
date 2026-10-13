
import math
import numpy as np

FEATURE_NAMES = ("temperature", "humidity", "ph", "rainfall")
EXPECTED_CLASS_LABELS = (
    "apple",
    "banana",
    "blackgram",
    "chickpea",
    "coconut",
    "coffee",
    "cotton",
    "grapes",
    "jute",
    "kidneybeans",
    "lentil",
    "maize",
    "mango",
    "mothbeans",
    "mungbean",
    "muskmelon",
    "orange",
    "papaya",
    "pigeonpeas",
    "pomegranate",
    "rice",
    "watermelon",
)
MODEL_NAME = "local-logistic-crop-recommendation"
ALGORITHM_NAME = "scikit-learn StandardScaler + multinomial LogisticRegression"

FEATURE_LABELS = {
    "temperature": "temperature",
    "humidity": "humidity",
    "ph": "soil pH",
    "rainfall": "rainfall",
}


class CropInputError(ValueError):
    def __init__(self, message, details=None, code="INVALID_INPUT"):
        super().__init__(message)
        self.details = details or {}
        self.code = code


def validate_crop_inputs(raw_inputs, supported_ranges):
    if not isinstance(raw_inputs, dict):
        raise CropInputError("Provide the four measured climate and soil inputs.")

    missing = [
        name for name in FEATURE_NAMES
        if name not in raw_inputs
        or raw_inputs[name] is None
        or raw_inputs[name] == ""
    ]

    if missing:
        raise CropInputError(
            "Enter temperature, humidity, soil pH and rainfall.",
            {"missing": missing},
        )

    values = {}
    out_of_range = {}

    for name in FEATURE_NAMES:
        value = raw_inputs[name]

        if isinstance(value, bool):
            raise CropInputError(
                "Every model input must be a finite number.",
                {"field": name},
            )

        try:
            number = float(value)
        except (TypeError, ValueError) as error:
            raise CropInputError(
                "Every model input must be a finite number.",
                {"field": name},
            ) from error

        if not math.isfinite(number):
            raise CropInputError(
                "Every model input must be a finite number.",
                {"field": name},
            )

        values[name] = number
        allowed = supported_ranges[name]

        if number < allowed["min"] or number > allowed["max"]:
            out_of_range[name] = {"value": number, **allowed}

    if out_of_range:
        raise CropInputError(
            "Measurements are outside the model's supported training ranges.",
            {
                "outOfRange": out_of_range,
                "supportedRanges": supported_ranges,
            },
            code="UNSUPPORTED_INPUT",
        )

    return values


def predict_crops(bundle, raw_inputs):
    if bundle.get("modelName") != MODEL_NAME:
        raise ValueError(
    "The configured artifact is not the required standardized logistic crop model"
)

    if bundle.get("featureNames") != list(FEATURE_NAMES):
        raise ValueError("Crop model feature order does not match.")

    if (
        bundle.get("classLabels") != list(EXPECTED_CLASS_LABELS)
        or bundle.get("classLabels")
        != sorted(bundle["model"].classes_.tolist())
    ):
        raise ValueError("Crop model class labels do not match.")

    values = validate_crop_inputs(
        raw_inputs, bundle["supportedRanges"]
    )

    row = np.asarray(
        [[values[name] for name in FEATURE_NAMES]],
        dtype=np.float64,
    )

    scores = bundle["model"].predict_proba(row)[0]

    ranked = sorted(
        zip(bundle["model"].classes_, scores),
        key=lambda item: (-float(item[1]), str(item[0])),
    )

    predictions = []

    # Return every crop supported by the trained model.
    for rank, (label, model_score) in enumerate(ranked, start=1):
        profile = bundle["classProfiles"][str(label)]

        matching_features = [
            name for name in FEATURE_NAMES
            if profile[name]["p10"] <= values[name] <= profile[name]["p90"]
        ]

        if matching_features:
            reason = (
                "Entered measurements fall within central training-data "
                "ranges for: "
                + ", ".join(
                    FEATURE_LABELS[name] for name in matching_features
                )
                + "."
            )
        else:
            reason = (
                "No entered measurements fall within this crop's central "
                "training-data ranges. Treat this as a low-support ranking."
            )

        predictions.append({
            "label": str(label),
            "rank": rank,
            "modelScore": float(model_score),
            "matchingFeatures": matching_features,
            "explanation": reason,
        })

    return {
        "model": MODEL_NAME,
        "algorithm": ALGORITHM_NAME,
        "modelVersion": bundle["modelVersion"],
        "trainingDataset": bundle["trainingDataset"],
        "trainingRows": bundle["trainingRows"],
        "featureNames": bundle["featureNames"],
        "classLabels": bundle["classLabels"],
        "evaluation": bundle["evaluation"],
        "heldOutAccuracy": bundle["heldOutAccuracy"],
        "scoreDescription": (
            "Uncalibrated Logistic Regression predicted probabilities rank "
            "the 22 supported classes; they are not probabilities of crop "
            "suitability or farm success."
        ),
        "supportedRanges": bundle["supportedRanges"],
        "input": values,
        "inputContextNote": (
            "Location, soil texture, season and farm area are not model "
            "features and do not change the crop ranking."
        ),
        "primaryPrediction": predictions[0],
        "predictions": predictions,
        "allPredictions": predictions,
        "totalCrops": len(predictions),
    }
