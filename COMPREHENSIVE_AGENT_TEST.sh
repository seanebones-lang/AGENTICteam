#!/bin/bash

# Comprehensive Agent Testing Script
# Tests all 10 agents with real queries to verify production readiness

API_URL="https://bizbot-api.onrender.com/api/v1/packages"
API_KEY="demo-key-12345"
RESULTS_FILE="agent_test_results_$(date +%Y%m%d_%H%M%S).txt"

echo "=========================================="  | tee -a "$RESULTS_FILE"
echo "COMPREHENSIVE AGENT TESTING" | tee -a "$RESULTS_FILE"
echo "Started: $(date)" | tee -a "$RESULTS_FILE"
echo "=========================================="  | tee -a "$RESULTS_FILE"

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to test an agent
test_agent() {
    local agent_id=$1
    local query=$2
    local test_name=$3
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -e "\n[TEST $TOTAL_TESTS] $test_name" | tee -a "$RESULTS_FILE"
    echo "Agent: $agent_id" | tee -a "$RESULTS_FILE"
    echo "Query: $query" | tee -a "$RESULTS_FILE"
    
    response=$(curl -s -X POST "$API_URL/$agent_id/execute" \
      -H "Content-Type: application/json" \
      -H "X-API-Key: $API_KEY" \
      -d "{\"package_id\": \"$agent_id\", \"task\": \"$query\", \"engine_type\": \"crewai\"}" \
      --max-time 180 2>&1)
    
    # Check if response contains error
    if echo "$response" | grep -q "error\|Error\|ERROR\|database is locked\|timeout"; then
        echo "❌ FAILED" | tee -a "$RESULTS_FILE"
        echo "Error: $response" | tee -a "$RESULTS_FILE"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    else
        # Check if response has result
        if echo "$response" | grep -q "result"; then
            echo "✅ PASSED" | tee -a "$RESULTS_FILE"
            # Extract and display first 200 chars of result
            result=$(echo "$response" | python3 -c "import sys, json; data = json.load(sys.stdin); print(str(data.get('result', ''))[:200])" 2>/dev/null)
            echo "Result preview: $result..." | tee -a "$RESULTS_FILE"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            echo "⚠️  PARTIAL - No result field" | tee -a "$RESULTS_FILE"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
    fi
    
    # Small delay between tests
    sleep 2
}

echo -e "\n=========================================="  | tee -a "$RESULTS_FILE"
echo "1. TICKET RESOLVER AGENT" | tee -a "$RESULTS_FILE"
echo "=========================================="  | tee -a "$RESULTS_FILE"

test_agent "ticket-resolver" "Customer complaining about slow website load times on mobile, getting 502 errors intermittently" "Mobile Performance Issue"
test_agent "ticket-resolver" "User cannot login, says password reset email never arrived, checked spam folder" "Login & Email Issue"
test_agent "ticket-resolver" "Billing issue: charged twice for same subscription, wants immediate refund" "Billing Dispute"
test_agent "ticket-resolver" "API integration broken after update, returning 401 errors, production down" "Critical API Issue"
test_agent "ticket-resolver" "Account locked after 3 failed login attempts, user is CEO, urgent" "Account Lockout"

echo -e "\n=========================================="  | tee -a "$RESULTS_FILE"
echo "2. SECURITY SCANNER AGENT" | tee -a "$RESULTS_FILE"
echo "=========================================="  | tee -a "$RESULTS_FILE"

test_agent "security-scanner" "Scan https://example.com for OWASP Top 10 vulnerabilities" "OWASP Scan"
test_agent "security-scanner" "Check SSL/TLS configuration for api.mycompany.com" "SSL Check"
test_agent "security-scanner" "Analyze security headers for production.website.io" "Security Headers"
test_agent "security-scanner" "GDPR compliance check for user data handling in our app" "GDPR Compliance"
test_agent "security-scanner" "Scan for SQL injection vulnerabilities in login form" "SQL Injection Test"

echo -e "\n=========================================="  | tee -a "$RESULTS_FILE"
echo "3. INCIDENT RESPONDER AGENT" | tee -a "$RESULTS_FILE"
echo "=========================================="  | tee -a "$RESULTS_FILE"

test_agent "incident-responder" "Database connection pool exhausted, 500 errors on checkout page" "DB Connection Issue"
test_agent "incident-responder" "Redis cache cluster down, all nodes unreachable, high latency" "Cache Failure"
test_agent "incident-responder" "DDoS attack detected, 10k requests/sec from single IP range" "DDoS Attack"
test_agent "incident-responder" "Memory leak in Node.js service, RAM usage at 95%, OOM imminent" "Memory Leak"
test_agent "incident-responder" "SSL certificate expired on production API, all requests failing" "SSL Expiration"

echo -e "\n=========================================="  | tee -a "$RESULTS_FILE"
echo "4. KNOWLEDGE BASE AGENT" | tee -a "$RESULTS_FILE"
echo "=========================================="  | tee -a "$RESULTS_FILE"

test_agent "knowledge-base" "How do I reset my password if I don't have access to my email?" "Password Reset"
test_agent "knowledge-base" "What's the difference between Pro and Enterprise plans?" "Plan Comparison"
test_agent "knowledge-base" "How to integrate the API with React using OAuth 2.0?" "API Integration"
test_agent "knowledge-base" "Troubleshoot webhook delivery failures and retry logic" "Webhook Issues"
test_agent "knowledge-base" "What are the rate limits for different API endpoints?" "Rate Limits"

echo -e "\n=========================================="  | tee -a "$RESULTS_FILE"
echo "5. DATA PROCESSOR AGENT" | tee -a "$RESULTS_FILE"
echo "=========================================="  | tee -a "$RESULTS_FILE"

test_agent "data-processor" "Transform CSV with 100k rows: normalize phone numbers, validate emails" "CSV Transform"
test_agent "data-processor" "ETL pipeline: extract from PostgreSQL, transform JSON, load to MongoDB" "ETL Pipeline"
test_agent "data-processor" "Clean dataset: remove duplicates, handle missing values, standardize dates" "Data Cleaning"
test_agent "data-processor" "Aggregate sales data by region, calculate YoY growth, generate report" "Sales Aggregation"
test_agent "data-processor" "Parse log files: extract errors, group by severity, identify patterns" "Log Analysis"

echo -e "\n=========================================="  | tee -a "$RESULTS_FILE"
echo "6. DEPLOYMENT AGENT" | tee -a "$RESULTS_FILE"
echo "=========================================="  | tee -a "$RESULTS_FILE"

test_agent "deployment-agent" "Deploy v2.5.0 to production using blue-green strategy" "Blue-Green Deploy"
test_agent "deployment-agent" "Rollback deployment due to 5xx error spike in last 5 minutes" "Emergency Rollback"
test_agent "deployment-agent" "Setup CI/CD pipeline for microservices with Docker and Kubernetes" "CI/CD Setup"
test_agent "deployment-agent" "Deploy to staging, run smoke tests, promote to prod if passing" "Staged Deployment"
test_agent "deployment-agent" "Canary deployment: route 10% traffic to new version, monitor metrics" "Canary Deploy"

echo -e "\n=========================================="  | tee -a "$RESULTS_FILE"
echo "7. AUDIT AGENT" | tee -a "$RESULTS_FILE"
echo "=========================================="  | tee -a "$RESULTS_FILE"

test_agent "audit-agent" "Audit all admin actions in last 30 days, flag suspicious activity" "Admin Audit"
test_agent "audit-agent" "Track data access patterns for HIPAA compliance audit" "HIPAA Audit"
test_agent "audit-agent" "Generate audit report for SOC 2 certification review" "SOC 2 Report"
test_agent "audit-agent" "Identify unauthorized API key usage and access anomalies" "API Key Audit"
test_agent "audit-agent" "Audit trail for financial transactions, detect irregularities" "Financial Audit"

echo -e "\n=========================================="  | tee -a "$RESULTS_FILE"
echo "8. REPORT GENERATOR AGENT" | tee -a "$RESULTS_FILE"
echo "=========================================="  | tee -a "$RESULTS_FILE"

test_agent "report-generator" "Generate Q4 2024 performance report with revenue, growth, KPIs" "Q4 Report"
test_agent "report-generator" "Create executive summary: user metrics, engagement, retention" "Executive Summary"
test_agent "report-generator" "Monthly SLA report: uptime, incidents, response times" "SLA Report"
test_agent "report-generator" "Generate customer satisfaction report with NPS scores and feedback" "CSAT Report"
test_agent "report-generator" "Create security incident report for October 2024" "Security Report"

echo -e "\n=========================================="  | tee -a "$RESULTS_FILE"
echo "9. WORKFLOW ORCHESTRATOR AGENT" | tee -a "$RESULTS_FILE"
echo "=========================================="  | tee -a "$RESULTS_FILE"

test_agent "workflow-orchestrator" "Orchestrate user onboarding: create account, send email, provision resources" "User Onboarding"
test_agent "workflow-orchestrator" "Setup approval workflow: request → manager → finance → execute" "Approval Workflow"
test_agent "workflow-orchestrator" "Automate incident response: detect → alert → triage → remediate" "Incident Automation"
test_agent "workflow-orchestrator" "Coordinate data pipeline: extract → transform → validate → load" "Data Pipeline"
test_agent "workflow-orchestrator" "Setup multi-step deployment: build → test → stage → approve → prod" "Deploy Workflow"

echo -e "\n=========================================="  | tee -a "$RESULTS_FILE"
echo "10. ESCALATION MANAGER AGENT" | tee -a "$RESULTS_FILE"
echo "=========================================="  | tee -a "$RESULTS_FILE"

test_agent "escalation-manager" "Ticket #12345 unresolved for 48 hours, customer is VIP, escalate" "VIP Escalation"
test_agent "escalation-manager" "Production incident severity 1, no response from on-call engineer" "Sev1 Escalation"
test_agent "escalation-manager" "Security vulnerability reported, needs immediate executive attention" "Security Escalation"
test_agent "escalation-manager" "Customer threatening to cancel \$100k contract, escalate to sales VP" "Contract Risk"
test_agent "escalation-manager" "SLA breach imminent, ticket aging 23 hours, target is 24 hours" "SLA Breach"

# Final Summary
echo -e "\n=========================================="  | tee -a "$RESULTS_FILE"
echo "TEST SUMMARY" | tee -a "$RESULTS_FILE"
echo "=========================================="  | tee -a "$RESULTS_FILE"
echo "Total Tests: $TOTAL_TESTS" | tee -a "$RESULTS_FILE"
echo "Passed: $PASSED_TESTS ✅" | tee -a "$RESULTS_FILE"
echo "Failed: $FAILED_TESTS ❌" | tee -a "$RESULTS_FILE"
echo "Success Rate: $(awk "BEGIN {printf \"%.1f\", ($PASSED_TESTS/$TOTAL_TESTS)*100}")%" | tee -a "$RESULTS_FILE"
echo "=========================================="  | tee -a "$RESULTS_FILE"

# Determine launch readiness
if [ $FAILED_TESTS -le 5 ]; then
    echo "✅ LAUNCH READY - System is production-ready!" | tee -a "$RESULTS_FILE"
elif [ $FAILED_TESTS -le 10 ]; then
    echo "⚠️  REVIEW NEEDED - Minor issues detected" | tee -a "$RESULTS_FILE"
else
    echo "❌ NOT READY - Critical issues found, fix before launch" | tee -a "$RESULTS_FILE"
fi

echo -e "\nCompleted: $(date)" | tee -a "$RESULTS_FILE"
echo "Results saved to: $RESULTS_FILE" | tee -a "$RESULTS_FILE"

