import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data && res.data.success) {
          // Store user profile details (id, name, email, phone)
          setUser(res.data);
        }
      } catch (error) {
        console.error('Session verification failed:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register user
  const register = async (name, email, phone, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, phone, password });
      if (res.data && res.data.success) {
        const { token, ...userData } = res.data;
        localStorage.setItem('token', token);
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: 'Registration failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data && res.data.success) {
        const { token, ...userData } = res.data;
        localStorage.setItem('token', token);
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please verify credentials.';
      return { success: false, message };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
