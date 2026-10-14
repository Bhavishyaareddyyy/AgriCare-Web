const DEFAULT_API_BASE = import.meta.env.DEV
  ? 'http://localhost:5000/api'
  : 'https://agricare-web.onrender.com/api';
const API_BASE = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE).replace(/\/+$/, '');
async function request(path, options = {}, timeoutMs = 20000) {
  let response;
  try { response = await fetch(`${API_BASE}/${path.replace(/^\/+/, '')}`, { ...options, headers: { ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...(localStorage.getItem('agricare-token') ? { Authorization: `Bearer ${localStorage.getItem('agricare-token')}` } : {}), ...options.headers }, signal: AbortSignal.timeout(timeoutMs) }); }
  catch { throw new Error('API_UNAVAILABLE'); }
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false) {
    const code = body.error?.code || 'REQUEST_FAILED';
    const messages = {
      INVALID_INPUT: body.error?.message || 'Check the submitted values and try again.',
      UNSUPPORTED_INPUT: body.error?.message || 'One or more measurements are outside the values represented by the local model.',
      EMAIL_EXISTS: 'An account with this email already exists. Try logging in instead.',
      INVALID_CREDENTIALS: 'Email or password is incorrect.',
      AUTH_NOT_CONFIGURED: 'Account sign-in is not configured on the server.',
      DATABASE_UNAVAILABLE: 'Database service is temporarily unavailable. Please try again later.',
      AUTH_REQUIRED: 'Please log in to continue.',
      LOCATION_NOT_FOUND: 'That location could not be resolved. Include a city or district name.',
      WEATHER_UNAVAILABLE: 'Weather could not be retrieved. Crop comparison still uses the entered conditions and available references.',
      NOT_FOUND: 'The saved record could not be found for this account.',
      INVALID_IMAGE: 'Use a valid JPEG, PNG, or WEBP image smaller than 5 MB.',
      MODEL_UNAVAILABLE: 'A local inference service is unavailable. Start it and retry.',
      INVALID_MODEL_RESPONSE: 'The local inference service returned an invalid result. No result was saved.',
    };
    const error = new Error(messages[code] || body.error?.message || 'Unable to complete your request. Please try again.');
    error.code = code;
    error.status = response.status;
    error.details = body.error?.details;
    throw error;
  }
  return body.data;
}
export const getCropRecommendations = form => request('/crops/recommend', { method: 'POST', body: JSON.stringify(form) });
export const getCropHistory = ({ page = 1, limit = 20 } = {}) => request(`/crops/history?page=${page}&limit=${limit}`);
export const getCropHistoryRecord = id => request(`/crops/history/${encodeURIComponent(id)}`);
export const getDiseaseHistory = () => request('/disease/history');
export const getCropCatalog = () => request('/crops/catalog');
export const getWeather = location => request(`/weather?location=${encodeURIComponent(location)}`);
export const analyzePlantImage = file => { const data = new FormData(); data.append('image', file); return request('/disease/check', { method: 'POST', body: data }, 30000); };
export const loginUser = credentials => request('/auth/login', { method:'POST', body:JSON.stringify(credentials) });
export const registerUser = data => request('/auth/signup', { method:'POST', body:JSON.stringify(data) });
export const getCurrentUser = () => request('/auth/me');
export const updateUserProfile = data => request('/users/profile', { method:'PUT', body:JSON.stringify(data) });
