import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

// Auto-login credentials — login page is bypassed but backend auth still works
const AUTO_LOGIN = { username: 'admin@hrms.com', password: 'admin123' };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const existingToken = localStorage.getItem('hrms_token');

    const doAutoLogin = () =>
      api.post('/auth/login', AUTO_LOGIN)
        .then(res => {
          // Backend wraps response: { success, message, data: { token, user } }
          const { token, user } = res.data ?? res;
          localStorage.setItem('hrms_token', token);
          setUser(user);
          setReady(true);
        })
        .catch(() => setReady(true));

    if (existingToken) {
      api.get('/auth/me')
        .then(res => { setUser(res.data ?? res); setReady(true); })
        .catch(() => {
          localStorage.removeItem('hrms_token');
          doAutoLogin();
        });
    } else {
      doAutoLogin();
    }
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    const { token, user } = res.data ?? res;
    localStorage.setItem('hrms_token', token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('hrms_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
