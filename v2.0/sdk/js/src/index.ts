/**
 * Agent Marketplace v2.0 - JavaScript SDK
 * Embed AI agents anywhere with 3 lines of code
 */

export interface AgentConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
}

export interface AgentTask {
  task: string;
  context?: Record<string, any>;
  options?: {
    model?: 'haiku' | 'sonnet' | 'opus';
    budget?: 'economy' | 'balanced' | 'premium';
    priority?: 'low' | 'medium' | 'high';
  };
}

export interface AgentResponse {
  success: boolean;
  result: Record<string, any>;
  confidence: number;
  creditsUsed: number;
  executionTimeMs: number;
  model: string;
  error?: string;
}

export class AgentMarketplaceSDK {
  private config: AgentConfig;
  private baseUrl: string;

  constructor(config: AgentConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.agentmarketplace.com';
  }

  /**
   * Execute any agent with a simple API call
   */
  async executeAgent(agentId: string, task: AgentTask): Promise<AgentResponse> {
    const url = `${this.baseUrl}/v2/agents/${agentId}/execute`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        result: {},
        confidence: 0,
        creditsUsed: 0,
        executionTimeMs: 0,
        model: 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get agent health status
   */
  async getAgentHealth(agentId: string): Promise<{ status: string; responseTime: number }> {
    const url = `${this.baseUrl}/v2/agents/${agentId}/health`;
    
    const start = Date.now();
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
    });
    const responseTime = Date.now() - start;

    const data = await response.json();
    return { status: data.status, responseTime };
  }

  /**
   * List available agents
   */
  async listAgents(): Promise<string[]> {
    const url = `${this.baseUrl}/v2/agents`;
    
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
    });

    const data = await response.json();
    return data.agents || [];
  }
}

// Convenience classes for specific agents
export class TicketResolver extends AgentMarketplaceSDK {
  async resolve(ticket: string, context?: Record<string, any>): Promise<AgentResponse> {
    return this.executeAgent('ticket-resolver', { task: ticket, context });
  }
}

export class SecurityScanner extends AgentMarketplaceSDK {
  async scan(target: string, scanType: 'code' | 'web' | 'config' = 'web'): Promise<AgentResponse> {
    return this.executeAgent('security-scanner', { 
      task: `Scan ${target}`, 
      context: { scanType, target } 
    });
  }
}

export class KnowledgeBase extends AgentMarketplaceSDK {
  async query(question: string, context?: Record<string, any>): Promise<AgentResponse> {
    return this.executeAgent('knowledge-base', { task: question, context });
  }
}

export class IncidentResponder extends AgentMarketplaceSDK {
  async respond(incident: string, severity: 'low' | 'medium' | 'high' | 'critical'): Promise<AgentResponse> {
    return this.executeAgent('incident-responder', { 
      task: incident, 
      context: { severity } 
    });
  }
}

export class DataProcessor extends AgentMarketplaceSDK {
  async process(data: any[], operation: 'extract' | 'transform' | 'validate'): Promise<AgentResponse> {
    return this.executeAgent('data-processor', { 
      task: `Process data: ${operation}`, 
      context: { data, operation } 
    });
  }
}

// Web Components for vanilla HTML
if (typeof window !== 'undefined') {
  // Register web components
  class AgentTicketResolverElement extends HTMLElement {
    private sdk: TicketResolver | null = null;
    
    connectedCallback() {
      const apiKey = this.getAttribute('api-key');
      const theme = this.getAttribute('theme') || 'light';
      
      if (!apiKey) {
        console.error('AgentTicketResolver: api-key attribute is required');
        return;
      }

      this.sdk = new TicketResolver({ apiKey });
      this.render(theme);
    }

    private render(theme: string) {
      const isDark = theme === 'dark';
      
      this.innerHTML = `
        <div style="
          background: ${isDark ? '#000000' : '#ffffff'};
          color: ${isDark ? '#ffffff' : '#000000'};
          border: 1px solid ${isDark ? '#333333' : '#e5e5e5'};
          border-radius: 8px;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 500px;
        ">
          <h3 style="margin: 0 0 15px 0; color: #0070f3;">AI Ticket Resolver</h3>
          <textarea 
            id="ticket-input" 
            placeholder="Paste your support ticket here..."
            style="
              width: 100%;
              height: 100px;
              padding: 10px;
              border: 1px solid ${isDark ? '#333333' : '#e5e5e5'};
              border-radius: 4px;
              background: ${isDark ? '#111111' : '#ffffff'};
              color: ${isDark ? '#ffffff' : '#000000'};
              font-family: inherit;
              resize: vertical;
            "
          ></textarea>
          <button 
            id="resolve-btn"
            style="
              background: #0070f3;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 4px;
              cursor: pointer;
              margin-top: 10px;
              font-family: inherit;
              font-weight: 500;
            "
          >
            Resolve Ticket
          </button>
          <div id="result" style="margin-top: 15px; display: none;"></div>
        </div>
      `;

      // Add event listener
      const button = this.querySelector('#resolve-btn') as HTMLButtonElement;
      const input = this.querySelector('#ticket-input') as HTMLTextAreaElement;
      const result = this.querySelector('#result') as HTMLDivElement;

      button.addEventListener('click', async () => {
        if (!this.sdk || !input.value.trim()) return;

        button.textContent = 'Resolving...';
        button.disabled = true;

        try {
          const response = await this.sdk.resolve(input.value.trim());
          
          result.style.display = 'block';
          result.innerHTML = `
            <div style="
              background: ${response.success ? '#f0f9ff' : '#fef2f2'};
              border: 1px solid ${response.success ? '#0070f3' : '#ef4444'};
              border-radius: 4px;
              padding: 15px;
              margin-top: 10px;
            ">
              <strong>${response.success ? '✅ Resolved' : '❌ Error'}:</strong><br>
              ${response.success ? response.result.resolution || 'Resolution generated' : response.error}
              ${response.success ? `<br><small>Confidence: ${Math.round(response.confidence * 100)}% | Credits: ${response.creditsUsed}</small>` : ''}
            </div>
          `;
        } catch (error) {
          result.style.display = 'block';
          result.innerHTML = `<div style="color: #ef4444;">Error: ${error}</div>`;
        }

        button.textContent = 'Resolve Ticket';
        button.disabled = false;
      });
    }
  }

  // Register the web component
  customElements.define('agent-ticket-resolver', AgentTicketResolverElement);
}

// Export everything
export default AgentMarketplaceSDK;
