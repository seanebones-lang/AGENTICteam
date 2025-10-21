/**
 * Authentication Hook
 */

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Customer, AuthTokens } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const response = await api.auth.me();
        setUser(response.data);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('access_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.auth.login(email, password);
      localStorage.setItem('access_token', response.data.access_token);
      await checkAuth();
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    tier?: string;
  }): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.auth.register(data.name, data.email, data.password);
      localStorage.setItem('access_token', response.data.access_token);
      await checkAuth();
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}

