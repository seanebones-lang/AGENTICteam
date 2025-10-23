-- Agent Marketplace v2.0 Database Schema
-- Matches the exact schema specified in the plan

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    tier VARCHAR(50) DEFAULT 'solo',
    credits_balance FLOAT DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- User sessions with refresh tokens (matches plan schema exactly)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    device_fingerprint VARCHAR(32) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Free trial tracking (matches plan schema exactly)
CREATE TABLE IF NOT EXISTS free_trial_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_fingerprint VARCHAR(32) NOT NULL,
    agent_id VARCHAR(100),
    query_count INTEGER DEFAULT 0,
    first_query_at TIMESTAMP WITH TIME ZONE,
    last_query_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, device_fingerprint)
);

-- Execution history
CREATE TABLE IF NOT EXISTS execution_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    agent_id VARCHAR(100) NOT NULL,
    agent_name VARCHAR(255) NOT NULL,
    input_data TEXT NOT NULL,
    output_data TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    error_message TEXT,
    execution_time_ms INTEGER,
    token_count INTEGER,
    cost_usd FLOAT,
    device_fingerprint VARCHAR(32) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent packages
CREATE TABLE IF NOT EXISTS agent_packages (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    model_type VARCHAR(50) DEFAULT 'haiku',
    is_active BOOLEAN DEFAULT TRUE,
    price_per_execution FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_device_fingerprint ON user_sessions(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_free_trial_usage_device_fingerprint ON free_trial_usage(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_execution_history_user_id ON execution_history(user_id);
CREATE INDEX IF NOT EXISTS idx_execution_history_agent_id ON execution_history(agent_id);
CREATE INDEX IF NOT EXISTS idx_execution_history_created_at ON execution_history(created_at);

-- Insert default agent packages
INSERT INTO agent_packages (id, name, description, category, model_type, price_per_execution) VALUES
('ticket-resolver', 'Ticket Resolver', 'Autonomous customer support ticket resolution', 'Customer Support', 'haiku', 0.005),
('knowledge-base', 'Knowledge Base Agent', 'RAG-powered documentation and knowledge retrieval', 'Customer Support', 'haiku', 0.005),
('incident-responder', 'Incident Responder', 'Alert analysis and automated remediation', 'IT/DevOps', 'sonnet', 0.01),
('data-processor', 'Data Processor', 'ETL automation and data transformation', 'Operations', 'haiku', 0.005),
('report-generator', 'Report Generator', 'Automated analytics and report generation', 'Operations', 'sonnet', 0.01),
('workflow-orchestrator', 'Workflow Orchestrator', 'Multi-step automation and process management', 'Operations', 'sonnet', 0.01),
('escalation-manager', 'Escalation Manager', 'Smart routing and escalation handling', 'Customer Support', 'haiku', 0.005),
('deployment-agent', 'Deployment Agent', 'CI/CD management and automated deployments', 'IT/DevOps', 'sonnet', 0.01),
('audit-agent', 'Audit Agent', 'Compliance reporting and audit automation', 'Compliance', 'sonnet', 0.01),
('security-scanner', 'Security Scanner', 'Vulnerability detection and security analysis', 'Compliance', 'sonnet', 0.01)
ON CONFLICT (id) DO NOTHING;
