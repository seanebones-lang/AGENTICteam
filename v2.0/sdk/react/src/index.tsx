/**
 * Agent Marketplace v2.0 - React SDK
 * Beautiful, minimalistic React components for AI agents
 */

import React, { useState, useCallback } from 'react';
import { AgentMarketplaceSDK, AgentTask, AgentResponse } from '@agentmarketplace/core';

export interface AgentComponentProps {
  agentId: string;
  apiKey: string;
  theme?: 'light' | 'dark';
  className?: string;
  onResponse?: (response: AgentResponse) => void;
  onError?: (error: string) => void;
}

// Base styles for minimalistic design
const getBaseStyles = (theme: 'light' | 'dark') => ({
  container: {
    background: theme === 'dark' ? '#000000' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    border: `1px solid ${theme === 'dark' ? '#333333' : '#e5e5e5'}`,
    borderRadius: '8px',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: '500px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: `1px solid ${theme === 'dark' ? '#333333' : '#e5e5e5'}`,
    borderRadius: '4px',
    background: theme === 'dark' ? '#111111' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    fontFamily: 'inherit',
    fontSize: '14px',
    resize: 'vertical' as const,
  },
  button: {
    background: '#0070f3',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '12px',
    fontFamily: 'inherit',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    background: '#cccccc',
    cursor: 'not-allowed',
  },
  result: {
    marginTop: '15px',
    padding: '15px',
    borderRadius: '4px',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  resultSuccess: {
    background: theme === 'dark' ? '#0f3a2e' : '#f0f9ff',
    border: '1px solid #0070f3',
  },
  resultError: {
    background: theme === 'dark' ? '#3a0f0f' : '#fef2f2',
    border: '1px solid #ef4444',
  }
});

/**
 * Generic Agent Component
 */
export const AgentComponent: React.FC<AgentComponentProps & {
  placeholder?: string;
  title?: string;
  inputType?: 'textarea' | 'input';
}> = ({ 
  agentId, 
  apiKey, 
  theme = 'light', 
  className = '',
  placeholder = 'Enter your query...',
  title = 'AI Agent',
  inputType = 'textarea',
  onResponse,
  onError 
}) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AgentResponse | null>(null);
  
  const sdk = new AgentMarketplaceSDK({ apiKey });
  const styles = getBaseStyles(theme);

  const handleExecute = useCallback(async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await sdk.executeAgent(agentId, { task: input.trim() });
      setResult(response);
      onResponse?.(response);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setResult({
        success: false,
        result: {},
        confidence: 0,
        creditsUsed: 0,
        executionTimeMs: 0,
        model: 'unknown',
        error: errorMsg
      });
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [input, agentId, apiKey, onResponse, onError]);

  const InputComponent = inputType === 'textarea' ? 'textarea' : 'input';

  return (
    <div style={styles.container} className={className}>
      <h3 style={{ margin: '0 0 15px 0', color: '#0070f3' }}>{title}</h3>
      
      <InputComponent
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        style={{
          ...styles.input,
          height: inputType === 'textarea' ? '100px' : '40px',
        }}
        disabled={loading}
      />
      
      <button
        onClick={handleExecute}
        disabled={loading || !input.trim()}
        style={{
          ...styles.button,
          ...(loading || !input.trim() ? styles.buttonDisabled : {}),
        }}
      >
        {loading ? 'Processing...' : 'Execute'}
      </button>

      {result && (
        <div 
          style={{
            ...styles.result,
            ...(result.success ? styles.resultSuccess : styles.resultError),
          }}
        >
          <strong>{result.success ? '✅ Success' : '❌ Error'}:</strong><br />
          {result.success ? (
            <>
              {typeof result.result === 'object' ? 
                JSON.stringify(result.result, null, 2) : 
                String(result.result)
              }
              <br />
              <small>
                Confidence: {Math.round(result.confidence * 100)}% | 
                Credits: {result.creditsUsed} | 
                Time: {result.executionTimeMs}ms
              </small>
            </>
          ) : (
            result.error
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Specialized Agent Components
 */
export const TicketResolver: React.FC<Omit<AgentComponentProps, 'agentId'>> = (props) => (
  <AgentComponent
    {...props}
    agentId="ticket-resolver"
    title="🎫 Ticket Resolver"
    placeholder="Paste your support ticket here..."
  />
);

export const SecurityScanner: React.FC<Omit<AgentComponentProps, 'agentId'>> = (props) => (
  <AgentComponent
    {...props}
    agentId="security-scanner"
    title="🔒 Security Scanner"
    placeholder="Enter URL or paste code to scan..."
  />
);

export const KnowledgeBase: React.FC<Omit<AgentComponentProps, 'agentId'>> = (props) => (
  <AgentComponent
    {...props}
    agentId="knowledge-base"
    title="📚 Knowledge Base"
    placeholder="Ask any question..."
    inputType="input"
  />
);

export const IncidentResponder: React.FC<Omit<AgentComponentProps, 'agentId'>> = (props) => (
  <AgentComponent
    {...props}
    agentId="incident-responder"
    title="🚨 Incident Responder"
    placeholder="Describe the incident..."
  />
);

export const DataProcessor: React.FC<Omit<AgentComponentProps, 'agentId'>> = (props) => (
  <AgentComponent
    {...props}
    agentId="data-processor"
    title="📊 Data Processor"
    placeholder="Describe your data processing task..."
  />
);

// Hook for programmatic usage
export const useAgent = (agentId: string, apiKey: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sdk = new AgentMarketplaceSDK({ apiKey });

  const execute = useCallback(async (task: AgentTask): Promise<AgentResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await sdk.executeAgent(agentId, task);
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [agentId, apiKey]);

  return { execute, loading, error };
};

// Export types
export type { AgentConfig, AgentTask, AgentResponse } from '@agentmarketplace/core';
