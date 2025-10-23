/**
 * Agent Marketplace v2.0 - AWS Lambda Template
 * Deploy any agent as a serverless function
 */

const { AgentMarketplaceSDK } = require('@agentmarketplace/core');

// Initialize SDK with environment variables
const sdk = new AgentMarketplaceSDK({
  apiKey: process.env.AGENT_API_KEY,
  baseUrl: process.env.AGENT_BASE_URL || 'https://api.agentmarketplace.com'
});

/**
 * AWS Lambda handler
 */
exports.handler = async (event, context) => {
  console.log('Agent execution started:', JSON.stringify(event, null, 2));
  
  try {
    // Parse request body
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    
    // Extract agent ID from path or body
    const agentId = event.pathParameters?.agentId || body.agentId || 'ticket-resolver';
    
    // Prepare task
    const task = {
      task: body.task || body.query || '',
      context: body.context || {},
      options: body.options || {}
    };

    if (!task.task) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
          'Access-Control-Allow-Methods': 'POST,OPTIONS'
        },
        body: JSON.stringify({
          success: false,
          error: 'Task is required'
        })
      };
    }

    // Execute agent
    const startTime = Date.now();
    const response = await sdk.executeAgent(agentId, task);
    const executionTime = Date.now() - startTime;

    console.log(`Agent ${agentId} executed in ${executionTime}ms:`, {
      success: response.success,
      creditsUsed: response.creditsUsed,
      confidence: response.confidence
    });

    // Return response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      },
      body: JSON.stringify({
        ...response,
        lambdaExecutionTime: executionTime,
        region: process.env.AWS_REGION,
        requestId: context.awsRequestId
      })
    };

  } catch (error) {
    console.error('Agent execution failed:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
        requestId: context.awsRequestId
      })
    };
  }
};

/**
 * Health check handler
 */
exports.healthHandler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      region: process.env.AWS_REGION,
      requestId: context.awsRequestId
    })
  };
};
