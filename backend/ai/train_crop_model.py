
import csv
import json
import os
from pathlib import Path

import joblib
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
)
from sklearn.model_selection import StratifiedGroupKFold
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier

from crop_inference import FEATURE_NAMES, MODEL_NAME


BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = Path(
    os.environ.get(
        "CROP_DATASET_PATH",
        BASE_DIR / "data" / "Crop_recommendation.csv",
    )
)
DEFAULT_MODEL_PATH = (
    BASE_DIR / "models" / "crop_recommendation_logistic_regression.joblib"
)
MODEL_PATH = Path(os.environ.get("CROP_MODEL_PATH", DEFAULT_MODEL_PATH))

if not DATASET_PATH.is_absolute():
    DATASET_PATH = BASE_DIR / DATASET_PATH
if not MODEL_PATH.is_absolute():
    MODEL_PATH = BASE_DIR / MODEL_PATH

DATASET_URL = (
    "https://figshare.com/articles/dataset/Crop_Recommendation_dataset/26308696"
)
DATASET_ORIGINAL_URL = (
    "https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset"
)
EXPECTED_ROWS_PER_LABEL = 100


def load_supported_rows():
    with DATASET_PATH.open(newline="", encoding="utf-8-sig") as stream:
        rows = list(csv.DictReader(stream))

    if not rows:
        raise ValueError(f"No training rows found in {DATASET_PATH}")

    required_columns = set(FEATURE_NAMES) | {"label"}
    missing_columns = required_columns - set(rows[0].keys())
    if missing_columns:
        raise ValueError(f"Dataset is missing columns: {sorted(missing_columns)}")

    for row in rows:
        label = row.get("label", "").strip().lower()
        if not label:
            raise ValueError("Dataset contains a row without a crop label.")

        row["label"] = label

        for name in FEATURE_NAMES:
            try:
                value = float(row[name])
            except (TypeError, ValueError) as error:
                raise ValueError(
                    f"Invalid numeric value in column {name!r}."
                ) from error

            if not np.isfinite(value):
                raise ValueError(
                    f"Non-finite numeric value in column {name!r}."
                )

            row[name] = value

    labels = {row["label"] for row in rows}
    row_counts = {
        label: sum(row["label"] == label for row in rows)
        for label in sorted(labels)
    }

    if any(count != EXPECTED_ROWS_PER_LABEL for count in row_counts.values()):
        raise ValueError(
            f"Expected {EXPECTED_ROWS_PER_LABEL} rows per crop; "
            f"found: {row_counts}"
        )

    return rows


def new_classifier():
    return make_pipeline(
        StandardScaler(),
        LogisticRegression(
            C=0.1,
            max_iter=3000,
            solver="lbfgs",
            random_state=42,
        ),
    )


def evaluation_metrics(labels, predictions, class_labels):
    report = classification_report(
        labels,
        predictions,
        labels=class_labels,
        output_dict=True,
        zero_division=0,
    )

    return {
        "accuracy": float(accuracy_score(labels, predictions)),
        "macroF1": float(
            f1_score(
                labels,
                predictions,
                labels=class_labels,
                average="macro",
                zero_division=0,
            )
        ),
        "perClass": {
            label: {
                "precision": float(report[label]["precision"]),
                "recall": float(report[label]["recall"]),
                "f1": float(report[label]["f1-score"]),
                "support": int(report[label]["support"]),
            }
            for label in class_labels
        },
        "confusionMatrix": confusion_matrix(
            labels, predictions, labels=class_labels
        ).tolist(),
    }


def train_model():
    rows = load_supported_rows()

    features = np.asarray(
        [[float(row[name]) for name in FEATURE_NAMES] for row in rows],
        dtype=np.float64,
    )
    labels = np.asarray([row["label"] for row in rows])
    class_labels = sorted(set(labels.tolist()))

    if len(class_labels) < 2:
        raise ValueError("At least two crop classes are required for training.")

    row_counts = {
        label: int(np.sum(labels == label))
        for label in class_labels
    }

    feature_groups = {
        row: group
        for group, row in enumerate(
            dict.fromkeys(map(tuple, features.tolist()))
        )
    }
    groups = np.asarray(
        [feature_groups[tuple(row)] for row in features]
    )

    splitter = StratifiedGroupKFold(
        n_splits=5,
        shuffle=True,
        random_state=42,
    )
    train_indices, test_indices = next(
        splitter.split(features, labels, groups)
    )

    train_features = features[train_indices]
    test_features = features[test_indices]
    train_labels = labels[train_indices]
    test_labels = labels[test_indices]

    if set(train_labels) != set(class_labels) or set(test_labels) != set(class_labels):
        raise ValueError(
            "The grouped holdout must contain every crop class in both sets."
        )

    if set(groups[train_indices]) & set(groups[test_indices]):
        raise ValueError("Duplicate feature rows crossed the train/test split.")

    models = {
        "standardizedLogisticRegression": new_classifier(),
        "gradientBoostingBaseline": GradientBoostingClassifier(
            n_estimators=80,
            learning_rate=0.05,
            max_depth=2,
            min_samples_leaf=2,
            random_state=42,
        ),
        "decisionTreeBaseline": DecisionTreeClassifier(
            min_samples_leaf=2,
            class_weight="balanced",
            random_state=42,
        ),
    }

    evaluation = {
        "split": {
            "method": "StratifiedGroupKFold, first of five folds",
            "randomState": 42,
            "trainRows": int(len(train_indices)),
            "testRows": int(len(test_indices)),
            "uniqueFeatureVectors": int(len(feature_groups)),
            "duplicateFeatureRows": int(len(features) - len(feature_groups)),
            "trainTestDuplicateFeatureOverlap": 0,
        },
        "classLabels": class_labels,
        "featureNames": list(FEATURE_NAMES),
        "models": {},
    }

    for name, estimator in models.items():
        estimator.fit(train_features, train_labels)
        evaluation["models"][name] = evaluation_metrics(
            test_labels,
            estimator.predict(test_features),
            class_labels,
        )

    classifier = new_classifier().fit(features, labels)

    supported_ranges = {
        name: {
            "min": float(np.min(features[:, index])),
            "max": float(np.max(features[:, index])),
        }
        for index, name in enumerate(FEATURE_NAMES)
    }

    class_profiles = {}
    for label in class_labels:
        class_rows = features[labels == label]
        class_profiles[label] = {
            name: {
                "p10": float(np.quantile(class_rows[:, index], 0.1)),
                "p90": float(np.quantile(class_rows[:, index], 0.9)),
            }
            for index, name in enumerate(FEATURE_NAMES)
        }

    coefficients = classifier[-1].coef_
    absolute_weights = np.mean(np.abs(coefficients), axis=0)
    total_weight = float(absolute_weights.sum())

    feature_importances = [
        {
            "feature": name,
            "importance": float(absolute_weights[index] / total_weight),
        }
        for index, name in enumerate(FEATURE_NAMES)
    ]
    feature_importances.sort(
        key=lambda item: (-item["importance"], item["feature"])
    )

    bundle = {
        "model": classifier,
        "modelName": MODEL_NAME,
        "modelVersion": "4",
        "featureNames": list(FEATURE_NAMES),
        "classLabels": class_labels,
        "trainingDataset": DATASET_URL,
        "trainingDatasetOriginal": DATASET_ORIGINAL_URL,
        "trainingRows": len(rows),
        "supportedRanges": supported_ranges,
        "classProfiles": class_profiles,
        "featureImportances": feature_importances,
        "evaluation": evaluation,
        "heldOutAccuracy": evaluation["models"][
            "standardizedLogisticRegression"
        ]["accuracy"],
    }

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(bundle, MODEL_PATH, compress=3)

    print(
        json.dumps(
            {
                "model": MODEL_NAME,
                "modelVersion": bundle["modelVersion"],
                "algorithm": (
                    "scikit-learn StandardScaler + "
                    "multinomial LogisticRegression"
                ),
                "dataset": str(DATASET_PATH),
                "datasetRowsUsed": len(rows),
                "numberOfCrops": len(class_labels),
                "rowsPerCrop": row_counts,
                "evaluation": evaluation,
                "supportedRanges": supported_ranges,
                "featureImportances": feature_importances,
                "artifact": str(MODEL_PATH),
                "artifactBytes": MODEL_PATH.stat().st_size,
            },
            indent=2,
        )
    )

    return bundle


if __name__ == "__main__":
    train_model()
