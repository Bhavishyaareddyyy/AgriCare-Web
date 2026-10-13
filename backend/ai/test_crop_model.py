
import csv
import os
import unittest
from pathlib import Path

import joblib
import numpy as np

from crop_inference import (
    EXPECTED_CLASS_LABELS,
    FEATURE_NAMES,
    MODEL_NAME,
    CropInputError,
    predict_crops,
)

BASE_DIR = Path(__file__).resolve().parent

DATASET_PATH = Path(
    os.environ.get(
        "CROP_DATASET_PATH",
        BASE_DIR / "data" / "Crop_recommendation.csv",
    )
)

MODEL_PATH = Path(
    os.environ.get(
        "CROP_MODEL_PATH",
        BASE_DIR / "models" / "crop_recommendation_logistic_regression.joblib",
    )
)

if not DATASET_PATH.is_absolute():
    DATASET_PATH = BASE_DIR / DATASET_PATH

if not MODEL_PATH.is_absolute():
    MODEL_PATH = BASE_DIR / MODEL_PATH


def read_sample_inputs():
    selected_labels = {"chickpea", "cotton", "rice"}
    samples = {}

    with DATASET_PATH.open(newline="", encoding="utf-8-sig") as stream:
        for row in csv.DictReader(stream):
            label = row["label"].strip().lower()

            if label in selected_labels and label not in samples:
                samples[label] = {
                    name: float(row[name]) for name in FEATURE_NAMES
                }

            if len(samples) == len(selected_labels):
                break

    return samples


class CropModelTests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.bundle = joblib.load(MODEL_PATH)
        cls.samples = read_sample_inputs()
        cls.expected_crop_count = len(cls.bundle["classLabels"])

    def test_standardized_logistic_model_ranks_all_supported_crops(self):
        self.assertEqual(self.bundle["modelName"], MODEL_NAME)
        self.assertEqual(
            self.bundle["modelName"],
            "local-logistic-crop-recommendation",
        )
        self.assertEqual(set(self.samples), {"chickpea", "cotton", "rice"})
        self.assertEqual(
            self.bundle["classLabels"],
            list(EXPECTED_CLASS_LABELS),
        )
        self.assertEqual(self.bundle["trainingRows"], 2200)
        self.assertEqual(len(self.bundle["classLabels"]), 22)

        results = {
            label: predict_crops(self.bundle, inputs)
            for label, inputs in self.samples.items()
        }

        for label, result in results.items():
            self.assertEqual(result["input"], self.samples[label])
            self.assertEqual(
                len(result["predictions"]),
                self.expected_crop_count,
            )
            self.assertEqual(
                result["predictions"],
                result["allPredictions"],
            )
            self.assertEqual(
                result["totalCrops"],
                self.expected_crop_count,
            )
            self.assertEqual(
                result["primaryPrediction"],
                result["predictions"][0],
            )
            self.assertEqual(
                [item["rank"] for item in result["predictions"]],
                list(range(1, self.expected_crop_count + 1)),
            )

            scores = [
                item["modelScore"] for item in result["predictions"]
            ]
            self.assertTrue(
                all(
                    scores[index] >= scores[index + 1]
                    for index in range(len(scores) - 1)
                )
            )
            self.assertAlmostEqual(sum(scores), 1.0, places=6)

            labels = [item["label"] for item in result["predictions"]]
            self.assertEqual(len(labels), len(set(labels)))
            self.assertEqual(set(labels), set(self.bundle["classLabels"]))

        self.assertEqual(
            len({
                result["primaryPrediction"]["label"]
                for result in results.values()
            }),
            3,
        )

    def test_dataset_has_100_rows_for_every_expected_model_class(self):
        with DATASET_PATH.open(newline="", encoding="utf-8-sig") as stream:
            counts = {}
            for row in csv.DictReader(stream):
                label = row["label"].strip().lower()
                counts[label] = counts.get(label, 0) + 1

        self.assertEqual(set(counts), set(EXPECTED_CLASS_LABELS))
        self.assertEqual(len(counts), 22)
        self.assertTrue(all(count == 100 for count in counts.values()))

    def test_identical_inputs_produce_identical_rankings_and_scores(self):
        first = predict_crops(self.bundle, self.samples["rice"])
        second = predict_crops(self.bundle, self.samples["rice"])
        self.assertEqual(first, second)

    def test_each_supported_feature_has_nonzero_weight_and_changes_model_scores(self):
        base = {
            "temperature": 25,
            "humidity": 65,
            "ph": 6.5,
            "rainfall": 100,
        }

        importance = {
            item["feature"]: item["importance"]
            for item in self.bundle["featureImportances"]
        }

        self.assertEqual(set(importance), set(FEATURE_NAMES))
        self.assertTrue(
            all(importance[name] > 0 for name in FEATURE_NAMES),
            importance,
        )

        base_scores = self.bundle["model"].predict_proba(
            [[base[name] for name in FEATURE_NAMES]]
        )[0]

        changed_values = {
            "temperature": 20,
            "humidity": 20,
            "ph": 8.5,
            "rainfall": 250,
        }

        for name, value in changed_values.items():
            changed = dict(base)
            changed[name] = value

            changed_scores = self.bundle["model"].predict_proba(
                [[changed[key] for key in FEATURE_NAMES]]
            )[0]

            self.assertGreater(
                float(np.max(np.abs(base_scores - changed_scores))),
                0.001,
                name,
            )

    def test_substantially_different_inputs_change_rankings(self):
        warm_humid_low_rain = predict_crops(
            self.bundle,
            {
                "temperature": 25,
                "humidity": 65,
                "ph": 6.5,
                "rainfall": 100,
            },
        )

        cool_dry_alkaline = predict_crops(
            self.bundle,
            {
                "temperature": 20,
                "humidity": 20,
                "ph": 8.5,
                "rainfall": 250,
            },
        )

        hot_humid_wet = predict_crops(
            self.bundle,
            {
                "temperature": 29,
                "humidity": 80,
                "ph": 5.5,
                "rainfall": 280,
            },
        )

        self.assertNotEqual(
            [row["label"] for row in warm_humid_low_rain["predictions"][:3]],
            [row["label"] for row in cool_dry_alkaline["predictions"][:3]],
        )

        self.assertNotEqual(
            [row["label"] for row in cool_dry_alkaline["predictions"][:3]],
            [row["label"] for row in hot_humid_wet["predictions"][:3]],
        )

        self.assertEqual(cool_dry_alkaline["input"]["ph"], 8.5)

    def test_missing_and_non_finite_measurements_are_rejected(self):
        sample = dict(self.samples["rice"])
        del sample["humidity"]

        with self.assertRaises(CropInputError) as missing:
            predict_crops(self.bundle, sample)

        self.assertEqual(missing.exception.code, "INVALID_INPUT")

        sample = dict(self.samples["rice"])
        sample["humidity"] = float("nan")

        with self.assertRaises(CropInputError) as non_finite:
            predict_crops(self.bundle, sample)

        self.assertEqual(non_finite.exception.code, "INVALID_INPUT")

    def test_out_of_training_range_measurements_are_rejected(self):
        sample = dict(self.samples["rice"])
        sample["rainfall"] = (
            self.bundle["supportedRanges"]["rainfall"]["max"] + 0.01
        )

        with self.assertRaises(CropInputError) as context:
            predict_crops(self.bundle, sample)

        self.assertIn(
            "rainfall",
            context.exception.details["outOfRange"],
        )
        self.assertEqual(
            context.exception.code,
            "UNSUPPORTED_INPUT",
        )

    def test_training_artifact_records_leakage_safe_model_comparison(self):
        evaluation = self.bundle["evaluation"]

        self.assertEqual(
            evaluation["split"]["method"],
            "StratifiedGroupKFold, first of five folds",
        )
        self.assertEqual(
            evaluation["split"]["trainTestDuplicateFeatureOverlap"],
            0,
        )
        self.assertEqual(
            evaluation["split"]["duplicateFeatureRows"],
            0,
        )
        self.assertEqual(
            evaluation["classLabels"],
            self.bundle["classLabels"],
        )
        self.assertEqual(
            evaluation["featureNames"],
            list(FEATURE_NAMES),
        )
        self.assertEqual(
            set(evaluation["models"]),
            {
                "standardizedLogisticRegression",
                "gradientBoostingBaseline",
                "decisionTreeBaseline",
            },
        )

        for metrics in evaluation["models"].values():
            self.assertEqual(
                len(metrics["confusionMatrix"]),
                len(self.bundle["classLabels"]),
            )
            self.assertEqual(
                set(metrics["perClass"]),
                set(self.bundle["classLabels"]),
            )

    def test_old_random_forest_artifact_is_rejected_without_fallback(self):
        old_artifact = dict(self.bundle)
        old_artifact["modelName"] = (
            "local-random-forest-crop-recommendation"
        )

        with self.assertRaisesRegex(
            ValueError,
            "not the required standardized logistic crop model",
        ):
            predict_crops(old_artifact, self.samples["rice"])


if __name__ == "__main__":
    unittest.main()
