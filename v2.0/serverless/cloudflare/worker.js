/**
 * Agent Marketplace v2.0 - Cloudflare Workers Template
 * Global edge deployment for <100ms latency
 */

// Cloudflare Workers environment
const AGENT_API_KEY = 'your-api-key-here'; // Set in Cloudflare dashboard
const AGENT_BASE_URL = 'https://api.agentmarketplace.com';

/**
 * Lightweight SDK for Cloudflare Workers
 */
class EdgeAgentSDK {
  constructor(apiKey, baseUrl) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async executeAgent(agentId, task) {
    const url = `${this.baseUrl}/v2/agents/${agentId}/execute`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'AgentMarketplace-Edge/2.0'
      },
      body: JSON.stringify(task)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }
}

/**
 * Cloudflare Workers fetch handler
 */
export default {
  async fetch(request, env, ctx) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Parse URL
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      
      // Health check endpoint
      if (url.pathname === '/health') {
        return new Response(JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: '2.0.0',
          edge: true,
          region: request.cf?.colo || 'unknown'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Agent execution endpoint: /agents/{agentId}
      if (pathParts[1] === 'agents' && pathParts[2] && request.method === 'POST') {
        const agentId = pathParts[2];
        
        // Parse request body
        const body = await request.json();
        
        if (!body.task) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Task is required'
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Initialize SDK
        const sdk = new EdgeAgentSDK(
          env.AGENT_API_KEY || AGENT_API_KEY,
          env.AGENT_BASE_URL || AGENT_BASE_URL
        );

        // Execute agent
        const startTime = Date.now();
        const response = await sdk.executeAgent(agentId, {
          task: body.task,
          context: body.context || {},
          options: body.options || {}
        });
        const executionTime = Date.now() - startTime;

        // Add edge metadata
        const edgeResponse = {
          ...response,
          edgeExecutionTime: executionTime,
          edgeLocation: request.cf?.colo || 'unknown',
          country: request.cf?.country || 'unknown',
          timestamp: new Date().toISOString()
        };

        return new Response(JSON.stringify(edgeResponse), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Default response
      return new Response(JSON.stringify({
        success: false,
        error: 'Endpoint not found',
        availableEndpoints: ['/health', '/agents/{agentId}']
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Edge execution failed:', error);

      return new Response(JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
