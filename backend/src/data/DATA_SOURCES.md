# Crop recommendation model and data audit

## Crop reference catalogue

`crops.js` contains 25 static crop-reference entries. The 22 trained classes map to catalog IDs, including `mungbean` to `green-gram`; groundnut, sorghum and wheat are catalogue-only entries and are not model predictions. Soil, season and crop-care details are source-backed references, not outputs of the machine-learning model. TNAU references are regional to Tamil Nadu; ICAR advisories are dated publications, not a live national suitability matrix.

## Trained model

The active artifact is a scikit-learn `StandardScaler` + multinomial `LogisticRegression` pipeline trained from the [ICFA Crop Recommendation dataset on Figshare](https://figshare.com/articles/dataset/Crop_Recommendation_dataset/26308696) (CC BY 4.0). It is also distributed on [Kaggle](https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset). Its publisher describes 2,200 records augmented from Indian rainfall, climate and fertilizer datasets. The CSV includes N/P/K, temperature, humidity, soil pH, rainfall and crop label. It has no location, soil-texture or season field, and does not document rainfall's accumulation period or per-row provenance.

Training uses all 2,200 rows: 100 examples each for the 22 classes apple, banana, blackgram, chickpea, coconut, coffee, cotton, grapes, jute, kidneybeans, lentil, maize, mango, mothbeans, mungbean, muskmelon, orange, papaya, pigeonpeas, pomegranate, rice and watermelon. It uses only temperature, humidity, pH and rainfall in that order, with a fitted standard scaler. The model returns all 22 classes ranked by its uncalibrated `predict_proba` scores; Express maps and persists the top five distinct crops. These scores are not probabilities of crop suitability or success.

Evaluation uses the first deterministic `StratifiedGroupKFold` split (random state 42): 1,760 training and 440 held-out rows, with exact duplicate feature vectors grouped. Logistic Regression measured 0.702 accuracy and 0.692 macro-F1. These scores do not establish field performance. Logistic Regression was selected because it gives nonzero influence to all four farmer measurements. Full metrics and limitations are in `backend/ai/MODEL-NOTICE.md` and the trained artifact.

The source's previous-12-month rainfall label is not known to match the dataset's unspecified rainfall period. The model rejects missing/nonfinite inputs and values outside observed training ranges. Location, soil texture, season and area are saved as context and do not affect its ranking. No seed quantity is estimated. Recommendations remain exploratory and need local agricultural validation.

## Runtime data categories

- The four model features are supplied by the farmer and passed without defaults.
- Location, soil type, season and area are required context, not model features.
- Crop-specific reference details come from the static official-source catalogue.
- Weather is a separate Open-Meteo forecast-model lookup, not a station observation or seasonal climate normal; it does not alter crop ranking, and failures do not generate replacement values.
