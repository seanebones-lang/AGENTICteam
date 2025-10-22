import { GenericDocPage } from '@/components/docs/GenericDocPage'

export default function APIAuthPage() {
  return (
    <GenericDocPage
      title="API Authentication"
      category="API Reference"
      description="Comprehensive authentication methods and security best practices for API access"
      content={{
        sections: [
          {
            title: "API Key Authentication",
            content: (
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Include your API key in the Authorization header:
                </p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`curl https://api.agentmarketplace.com/v1/agents \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
                </pre>
              </div>
            )
          },
          {
            title: "JWT Token Exchange",
            content: (
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Exchange your API key for a short-lived JWT token:
                </p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`POST /v1/auth/token
Content-Type: application/json

{
  "api_key": "YOUR_API_KEY",
  "expires_in": 3600
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "expires_at": "2025-10-21T11:00:00Z"
}`}</code>
                </pre>
              </div>
            )
          },
          {
            title: "Security Best Practices",
            content: (
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Store API keys in environment variables, never in code</li>
                <li>Rotate keys every 90 days or immediately if compromised</li>
                <li>Use different keys for development, staging, and production</li>
                <li>Implement client-side rate limiting</li>
                <li>Use HTTPS for all API requests</li>
                <li>Monitor API key usage for suspicious activity</li>
              </ul>
            )
          },
          {
            title: "Obtaining an API Key",
            content: (
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Contact us to obtain your API key:
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Website:</strong> <a href="https://bizbot.store" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">bizbot.store</a>
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Phone:</strong> <a href="mailto:support@bizbot.store" className="text-blue-600 dark:text-blue-400 hover:underline">support@bizbot.store</a>
                  </p>
                </div>
              </div>
            )
          }
        ]
      }}
    />
  )
}

