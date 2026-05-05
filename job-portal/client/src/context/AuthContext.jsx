import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        const userData = res.data.user || res.data.data;
        setUser(userData);
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (userData, token) => {
    if (token) {
      localStorage.setItem('token', token);
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/auth'; 
  };

  // Performance optimize karne ke liye useMemo
  const value = useMemo(() => ({
    user, 
    setUser, 
    login, 
    logout, 
    loading, 
    checkAuth,
    isAuthenticated: !!user 
  }), [user, loading, checkAuth]);

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px] animate-pulse">
            Verifying Session...
          </p>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};