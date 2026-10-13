# AgriCare backend

Node 20+ and Python 3.10+ services. Express uses MongoDB Atlas through Mongoose for accounts, profiles, recommendations and disease-result history.

## Local setup and services

From PowerShell, install the local Python runtime and train the crop model once:

```powershell
cd C:\Users\bhavi\AgriCare-Web\backend\ai
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe train_crop_model.py
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
.\.venv\Scripts\python.exe service.py
```

The existing lightweight Python HTTP service binds only to `127.0.0.1:8001` by default, preserving the disease model's service. It does not require adding FastAPI, Uvicorn or pandas: Python's standard CSV and HTTP libraries are used, and NumPy, joblib and scikit-learn are already required by the local models. Its `.env` supports `AI_HOST`, `AI_PORT`, `CROP_MODEL_PATH`, `DISEASE_MODEL_PATH`, `DISEASE_METADATA_PATH` and `DISEASE_CENTROIDS_PATH`. Defaults point to the model files in this folder. Set `CROP_ML_URL` in the backend `.env` to configure the crop API base URL; it defaults to `http://127.0.0.1:8001` and takes precedence over the shared `INFERENCE_URL`. Crop JSON requests use `POST /predict`; the same path remains the existing disease-image endpoint for binary image uploads. `GET /health` reports both models. No hosted inference API or paid key is used.

The disease classifier is already bundled as a 23.11 MiB quantized ONNX model; it is not downloaded again during setup. The crop model is a locally trained scikit-learn `StandardScaler` + multinomial `LogisticRegression` pipeline, saved as `models/crop_recommendation_logistic_regression.joblib`. It replaces both the former Random Forest and the intermediate Gradient Boosting model. Data source, license, reproducible training, metrics and limitations are documented in `ai/MODEL-NOTICE.md` and `src/data/DATA_SOURCES.md`.

In a separate terminal, start Express only if there is not already an AgriCare API listening on port 5000:

```powershell
cd C:\Users\bhavi\AgriCare-Web\backend
npm.cmd install
npm.cmd start
```

Check `http://localhost:5000/api/health` before starting it. Use either `npm.cmd start` or `npm.cmd run dev`, not both. Both run one non-watching server process; press `Ctrl+C` in that server's terminal before starting it again. If another process owns port 5000, startup prints `EADDRINUSE` and exits without killing that process. To inspect the owner safely, run `Get-NetTCPConnection -State Listen -LocalPort 5000 | Select-Object LocalAddress,OwningProcess`, then inspect it with `Get-CimInstance Win32_Process -Filter "ProcessId = <PID>"`.

Keep `.env` files private. Set `MONGODB_URI` and a random `JWT_SECRET` of at least 32 characters in `backend/.env`; add the connecting IP to Atlas network access and use a read/write database user. `FRONTEND_ORIGIN` is a comma-separated allowlist (default `http://localhost:5173`). Without a reachable database, database-backed authentication and crop-history operations return `503`.

From the project root, keep `VITE_API_BASE_URL=http://localhost:5000/api` in `.env.local`, then run `npm.cmd run dev` for the React/Vite frontend.

## Local inference behavior

The crop recommender uses a locally trained standardized Logistic Regression pipeline over all 22 crop classes in the 2,200-row dataset (100 records per class). It requires farmer-entered temperature, humidity, soil pH and rainfall; it rejects missing values and values outside the training rows' observed ranges. The inference service returns the model's probability-ranked classes, and Express saves and displays the five highest-ranked distinct crops. Those probabilities are uncalibrated and are not probabilities of crop success. Training compares Logistic Regression with Gradient Boosting and Decision Tree on a deterministic duplicate-grouped holdout and saves measured metrics. The Figshare/ICFA source is an augmented dataset with no row-level provenance, no location/soil-texture/season features, and no rainfall period definition. The form's previous-12-month rainfall value may not match the dataset. Location, soil type, season and land area are context only and do not change the model ranking. Catalogue-only crops outside the 22 trained classes are not ranked. No seed requirement is estimated. Results are exploratory, not field-validated agronomic advice.

The local disease service runs `rodynaemad/plant-disease-dinov2-small` through the bundled CPU ONNX model. It covers 38 PlantVillage classes across 14 crops, including tomato, potato, bell pepper and maize; it does not cover rice, wheat, cotton or groundnut. Images are held in memory and not saved by the inference service. Its centroid OOD check can abstain on field photos but cannot guarantee rejection of every unsupported image. Classified softmax scores are uncalibrated. Disease outputs are preliminary screening results, not diagnoses. See `ai/MODEL-NOTICE.md` for licenses, preprocessing, data limits and class details.

## Endpoints

- `GET /api/health`
- `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me`
- `PUT /api/users/profile`
- `POST /api/crops/recommend` (authenticated JSON includes location, soil type, area, `areaUnit`, `temperature`, `humidity`, `soilPH` and `rainfall` in mm for the previous 12 months; optional `requestId`)
- `GET /api/crops/history?page=1&limit=20` (authenticated, newest first)
- `GET /api/crops/history/:id` (authenticated; only returns the current user's record)
- `GET /api/crops/catalog`
- `POST /api/disease/check` (`multipart/form-data`, field `image`, maximum 5 MB)
- `GET /api/disease/health`
- `GET /api/disease/history` (authenticated)
- `GET /api/weather?location=Guntur`
- `GET /api/languages`

Success responses use `{success:true,data:...}` and errors use `{success:false,error:{code:...}}`. Weather is Open-Meteo forecast-model data, not an observation or seasonal rainfall total. Failed weather lookup returns an unavailable message and never substitutes fixed values.

## Tests

```powershell
cd C:\Users\bhavi\AgriCare-Web\backend
npm.cmd test
cd C:\Users\bhavi\AgriCare-Web\backend\ai
.\.venv\Scripts\python.exe -m unittest test_crop_model.py
```

Keep `.env` files private; frontend Vite variables must not contain secrets.
