import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const TOKEN_KEY = "magnrey_admin_token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const setAuth = useCallback((tok) => {
    if (tok) {
      localStorage.setItem(TOKEN_KEY, tok);
      setToken(tok);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    }
  }, []);

  const authAxios = useCallback(
    (config = {}) => axios({
      ...config,
      baseURL: API,
      headers: { ...(config.headers || {}), Authorization: token ? `Bearer ${token}` : undefined },
    }),
    [token]
  );

  useEffect(() => {
    let cancelled = false;
    if (!token) { setUser(null); setChecking(false); return; }
    (async () => {
      try {
        const res = await axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!cancelled) { setUser(res.data); setChecking(false); }
      } catch {
        if (!cancelled) { setAuth(null); setChecking(false); }
      }
    })();
    return () => { cancelled = true; };
  }, [token, setAuth]);

  const login = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    setAuth(res.data.access_token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => setAuth(null);

  return (
    <AuthContext.Provider value={{ user, token, checking, login, logout, authAxios }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
