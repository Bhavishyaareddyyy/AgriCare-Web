import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/api.js';
const Context = createContext(null);
export function AppProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('agricare-user')); } catch { return null; } });
  useEffect(() => { if (localStorage.getItem('agricare-token')) getCurrentUser().then(({user:current}) => { localStorage.setItem('agricare-user', JSON.stringify(current)); setUser(current); }).catch(() => { localStorage.removeItem('agricare-token'); localStorage.removeItem('agricare-user'); setUser(null); }); }, []);
  const [selectedCrop, setSelectedCrop] = useState(null), [diseaseImage, setDiseaseImage] = useState(null), [diseaseResult, setDiseaseResult] = useState(null);
  const login = (value, token) => { localStorage.setItem('agricare-user', JSON.stringify(value)); localStorage.setItem('agricare-token', token); setUser(value); };
  const logout = () => { localStorage.removeItem('agricare-user'); localStorage.removeItem('agricare-token'); try { for (let i = sessionStorage.length - 1; i >= 0; i--) { const key = sessionStorage.key(i); if (key?.startsWith('agricare-crop-results:')) sessionStorage.removeItem(key); } } catch {} if (diseaseImage?.preview) URL.revokeObjectURL(diseaseImage.preview); setSelectedCrop(null); setDiseaseImage(null); setDiseaseResult(null); setUser(null); };
  const value = useMemo(() => ({ user, login, logout, selectedCrop, setSelectedCrop, diseaseImage, setDiseaseImage, diseaseResult, setDiseaseResult }), [user, selectedCrop, diseaseImage, diseaseResult]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useApp = () => useContext(Context);
