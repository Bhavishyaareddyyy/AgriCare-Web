# Local AI model notice

## Crop recommendation

AgriCare does not import a pretrained crop model and does not load the older Random Forest or intermediate Gradient Boosting artifacts. `train_crop_model.py` trains a scikit-learn `StandardScaler` + multinomial `LogisticRegression` pipeline and saves it to `models/crop_recommendation_logistic_regression.joblib`. The inference service requires this model identifier and has no fallback.

The source is Saroj Mali's [Crop Recommendation dataset on Figshare](https://figshare.com/articles/dataset/Crop_Recommendation_dataset/26308696), licensed CC BY 4.0; it is also distributed on [Kaggle](https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset). Its 2,200 rows are described by the publisher as augmented Indian rainfall, climate and fertilizer data. The CSV has N, P, K, temperature, humidity, ph, rainfall and label columns for 22 crops. Temperature is °C, humidity is relative humidity (%), and rainfall is mm, but rainfall's accumulation period and row-level source provenance are undocumented. The bundled CSV SHA-256 is 54a5a6e5408668e668667efc50de2fc867c1b875e0431b4f54dd331b0a109a4e.

The model uses only four dataset features in this exact order: temperature (°C), relative humidity (%), soil pH and rainfall (mm). It trains on 100 rows for each of 22 classes (2,200 rows total): apple, banana, blackgram, chickpea, coconut, coffee, cotton, grapes, jute, kidneybeans, lentil, maize, mango, mothbeans, mungbean, muskmelon, orange, papaya, pigeonpeas, pomegranate, rice and watermelon. Inference returns all 22 classes ordered by the fitted Logistic Regression model's `predict_proba` output. Express validates the complete class set and returns the five highest-ranked distinct crops. These are uncalibrated predicted probabilities across the model's classes; they are not probabilities of crop suitability or farm success. Explanations report which values fall within a crop's central 80% training range; that is a dataset comparison, not a causal explanation. The current fitted model's normalized absolute coefficient weights are humidity 0.352, rainfall 0.308, temperature 0.181 and pH 0.158.

The website asks for rainfall total over the **previous 12 months**. Since the dataset only says “rainfall in mm” and does not state its time window, this is a transparent but unresolved measurement mismatch; rainfall-related rankings may therefore be unreliable. The form also collects location, soil texture and farm area, but none appears in the training data. Those values are retained/displayed as context (location may retrieve separate weather context); they do not alter the model ranking. No seed/planting quantity is estimated because no validated crop-specific rate is available.

### Reproducible model evaluation

Training compares the selected scaled Logistic Regression with Gradient Boosting and Decision Tree baselines on the same first fold from StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=42), grouping identical feature vectors. On 1,760 training and 440 held-out rows, there were no duplicate vectors or train/test overlap. Logistic Regression measured 0.702 accuracy and 0.692 macro-F1. Metrics for all 22 classes and confusion matrices are stored in the model artifact.

Even an exact-duplicate-free split of this small, balanced, augmented dataset cannot rule out dependence between records from the undocumented augmentation process. Perfect held-out results, if observed, must not be interpreted as generalization to real farms. There is no independent field trial, location-aware evaluation, temporal rainfall definition, or validated soil-texture feature. The model is exploratory only; verify decisions with locally appropriate agricultural advice.

### Reproducing the local training

The CSV is 150,034 bytes (SHA-256 `54a5a6e5408668e668667eFC50DE2FC867C1B875E0431B4F54DD331B0A109A4E`; hex comparisons are case-insensitive). Train the bundled model with:

```powershell
cd C:\Users\bhavi\AgriCare-Web\backend\ai
.\.venv\Scripts\python.exe train_crop_model.py
```

The generated Logistic Regression joblib artifact is a local model file and is not a pretrained download. It stores the exact feature order, class labels, fitted model, supported ranges and evaluation results, and can be regenerated from the bundled CSV. Neither `crop_recommendation_rf.joblib` nor the intermediate Gradient Boosting artifact is loaded or used.

## Plant disease detection

AgriCare uses `rodynaemad/plant-disease-dinov2-small`, a DINOv2-small feature extractor with a linear disease-classification head, exported as a quantized ONNX model. The classifier artifact is from model revision `06ebf5e308e100fd000d738c42b059ebb5f58a16`; its 38 ordered labels and the matching class centroids are bundled in `models/ood_meta.json` and `models/centroids.f32`. The centroid rejection metadata is from scanner revision `b26e704bd72c2fe05632ea6f7be680a2eca0d8f5`.

The 38 classes cover 14 crops: apple (scab, black rot, cedar apple rust, healthy); blueberry (healthy); cherry (powdery mildew, healthy); corn/maize (gray leaf spot, common rust, northern leaf blight, healthy); grape (black rot, Esca, Isariopsis leaf spot, healthy); orange (citrus greening); peach (bacterial spot, healthy); bell pepper (bacterial spot, healthy); potato (early blight, late blight, healthy); raspberry (healthy); soybean (healthy); squash (powdery mildew); strawberry (leaf scorch, healthy); tomato (bacterial spot, early blight, late blight, leaf mold, Septoria leaf spot, spider mites, target spot, yellow leaf curl virus, mosaic virus, healthy).

For AgriCare's focus crops, coverage includes tomato, potato, bell pepper and maize. Rice, wheat, cotton and groundnut are not classes and must not be given a disease label by this model.

### Size, runtime and licensing

The bundled quantized ONNX file is 23.11 MiB; centroids add 0.11 MiB. It runs on CPU with ONNX Runtime and does not require PyTorch, a GPU, hosted AI APIs or a paid key. The combined local service used about 193 MiB of process working set while both models were loaded and inference was running on this laptop; peak memory can vary with ONNX Runtime threading. The classifier is already bundled, so setup does not download another disease model.

- Fine-tuned model: [Hugging Face model card](https://huggingface.co/rodynaemad/plant-disease-dinov2-small), CC BY-SA 4.0.
- DINOv2-small backbone: [Meta model card](https://huggingface.co/facebook/dinov2-small), Apache 2.0.
- PlantVillage data: [Hugging Face dataset card](https://huggingface.co/datasets/mohanty/PlantVillage), CC BY-SA 3.0; cite Mohanty, Hughes and Salathé (2016).
- OOD centroid files and implementation reference: [Plant Disease Scanner](https://huggingface.co/spaces/rodynaemad/plant-disease-scanner), CC BY-SA 4.0.

### Preprocessing and unsupported-input handling

The ONNX input is float32 `pixel_values` with shape `[1, 3, 224, 224]`; outputs are 38 logits and a 768-dimensional feature vector. Images are converted to RGB, resized so the shortest edge is 256, center-cropped to 224, scaled to `[0, 1]`, ImageNet-normalized, and converted HWC to CHW.

The service computes the maximum cosine similarity between the model feature vector and the published 38 class centroids. It uses the publisher's threshold `0.699429452419281` (reported as calibrated for 99% of held-out PlantVillage leaves to pass). Below that value it returns `unsupported` and no crop/disease label. This is an OOD screening signal, not a guarantee: unsupported field photos can resemble training images and pass, while valid supported photos can be rejected.

The model card reports 98.86% accuracy and 98.49% macro F1 on a leaf-grouped PlantVillage held-out split; these are author-reported benchmark metrics, not independently reproduced and not field accuracy. PlantVillage consists of curated, mostly detached single-leaf images on plain backgrounds. Real farm photos, mixed symptoms, poor lighting, and unrepresented crop varieties remain outside the validated scope. The softmax score is uncalibrated and is not a probability of diagnosis. This system is a screening aid; confirm treatment decisions with a local agricultural expert.
