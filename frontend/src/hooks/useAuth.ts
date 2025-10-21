/**
 * Authentication Hook
 */

import { useState, useEffect } from 'react';
import { apiService as api } from '@/lib/api';
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
        // For now, create a mock user since auth.me() doesn't exist
        const mockUser: Customer = {
          id: 1,
          name: 'Demo User',
          email: 'demo@example.com',
          tier: 'pro',
          is_active: true,
          created_at: new Date().toISOString()
        };
        setUser(mockUser);
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
      // Mock login since auth endpoints don't exist yet
      const mockUser: Customer = {
        id: 1,
        name: 'Demo User',
        email: email,
        tier: 'pro',
        is_active: true,
        created_at: new Date().toISOString()
      };
      localStorage.setItem('access_token', 'mock-token');
      setUser(mockUser);
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
      // Mock register since auth endpoints don't exist yet
      const mockUser: Customer = {
        id: 1,
        name: data.name,
        email: data.email,
        tier: (data.tier as any) || 'basic',
        is_active: true,
        created_at: new Date().toISOString()
      };
      localStorage.setItem('access_token', 'mock-token');
      setUser(mockUser);
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

