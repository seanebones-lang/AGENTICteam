/**
 * Agents Hook
 */

import { useState, useEffect } from 'react';
import { apiService as api } from '@/lib/api';
import { AgentPackage, Category } from '@/types';

export function useAgents(category?: string) {
  const [packages, setPackages] = useState<AgentPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPackages();
  }, [category]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAgents(category);
      setPackages(response.packages);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => fetchPackages();

  return {
    packages,
    loading,
    error,
    refetch,
  };
}

export function useAgent(packageId: string) {
  const [agent, setAgent] = useState<AgentPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAgent();
  }, [packageId]);

  const fetchAgent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAgent(packageId);
      setAgent(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch package');
    } finally {
      setLoading(false);
    }
  };

  return {
    agent,
    loading,
    error,
    refetch: fetchAgent,
  };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      // For now, return mock categories since we don't have a categories endpoint
      const mockCategories: Category[] = [
        { id: 'security', name: 'Security', description: 'Security and compliance agents', icon: 'shield' },
        { id: 'automation', name: 'Automation', description: 'Process automation agents', icon: 'zap' },
        { id: 'analytics', name: 'Analytics', description: 'Data analysis agents', icon: 'bar-chart' },
        { id: 'communication', name: 'Communication', description: 'Communication agents', icon: 'message-circle' },
      ];
      setCategories(mockCategories);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}

export function useExecuteAgent() {
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = async (
    packageId: string,
    task: string,
    engineType: string = 'crewai'
  ) => {
    try {
      setExecuting(true);
      setError(null);
      setResult(null);
      
      const response = await api.executeAgent(packageId, task, engineType);
      setResult(response);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Execution failed';
      setError(message);
      throw new Error(message);
    } finally {
      setExecuting(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return {
    execute,
    executing,
    result,
    error,
    reset,
  };
}

