/**
 * Agent Marketplace v2.0 - Vercel Function Template
 * Deploy agents as Vercel serverless functions
 */

import { AgentMarketplaceSDK } from '@agentmarketplace/core';

// Initialize SDK
const sdk = new AgentMarketplaceSDK({
  apiKey: process.env.AGENT_API_KEY,
  baseUrl: process.env.AGENT_BASE_URL || 'https://api.agentmarketplace.com'
});

/**
 * Vercel serverless function handler
 */
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    // Extract agent ID from URL
    const { agentId } = req.query;
    
    if (!agentId) {
      return res.status(400).json({
        success: false,
        error: 'Agent ID is required'
      });
    }

    // Parse request body
    const { task, context, options } = req.body;

    if (!task) {
      return res.status(400).json({
        success: false,
        error: 'Task is required'
      });
    }

    // Execute agent
    const startTime = Date.now();
    const response = await sdk.executeAgent(agentId, {
      task,
      context: context || {},
      options: options || {}
    });
    const executionTime = Date.now() - startTime;

    console.log(`Agent ${agentId} executed in ${executionTime}ms:`, {
      success: response.success,
      creditsUsed: response.creditsUsed,
      confidence: response.confidence
    });

    // Return response with Vercel metadata
    return res.status(200).json({
      ...response,
      vercelExecutionTime: executionTime,
      region: process.env.VERCEL_REGION,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Agent execution failed:', error);

    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}
