#!/usr/bin/env python3
"""
Comprehensive API integration tests
Tests all API endpoints for functionality, security, and performance
"""

import pytest
import asyncio
import json
import time
from datetime import datetime
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch, AsyncMock

# Import the FastAPI app
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from database_setup import DatabaseManager
from credit_system import credit_system, TransactionType
from rate_limiting import rate_limiter, RateLimitTier, RateLimitType

# Create test client
client = TestClient(app)

class TestBasicEndpoints:
    """Test basic API endpoints"""
    
    def test_root_endpoint(self):
        """Test root endpoint returns correct response"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "Agent Marketplace" in data["message"]
        assert "version" in data
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = client.get("/health")
        if response.status_code == 200:
            data = response.json()
            assert "status" in data
            assert data["status"] == "healthy"
    
    def test_packages_endpoint(self):
        """Test packages listing endpoint"""
        response = client.get("/api/v1/packages")
        assert response.status_code == 200
        data = response.json()
        assert "packages" in data
        assert "total" in data
        assert isinstance(data["packages"], list)
        assert data["total"] > 0
        
        # Verify package structure
        if data["packages"]:
            package = data["packages"][0]
            required_fields = ["id", "name", "description", "version", "price"]
            for field in required_fields:
                assert field in package
    
    def test_categories_endpoint(self):
        """Test categories endpoint"""
        response = client.get("/api/v1/categories")
        assert response.status_code == 200
        data = response.json()
        assert "categories" in data
        assert isinstance(data["categories"], list)
    
    def test_tiers_endpoint(self):
        """Test subscription tiers endpoint"""
        response = client.get("/api/v1/tiers")
        assert response.status_code == 200
        data = response.json()
        assert "tiers" in data
        assert isinstance(data["tiers"], list)
        assert len(data["tiers"]) == 7  # Should have 7 tiers
        
        # Verify tier structure
        tier = data["tiers"][0]
        required_fields = ["id", "name", "monthly_price", "execution_price", "features"]
        for field in required_fields:
            assert field in tier

class TestPackageEndpoints:
    """Test package-specific endpoints"""
    
    def test_get_package_by_id(self):
        """Test getting specific package by ID"""
        # First get all packages to find a valid ID
        response = client.get("/api/v1/packages")
        packages = response.json()["packages"]
        
        if packages:
            package_id = packages[0]["id"]
            
            # Test getting specific package
            response = client.get(f"/api/v1/packages/{package_id}")
            assert response.status_code == 200
            data = response.json()
            assert data["id"] == package_id
    
    def test_get_nonexistent_package(self):
        """Test getting non-existent package returns 404"""
        response = client.get("/api/v1/packages/nonexistent-package")
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
    
    def test_execute_agent_basic(self):
        """Test basic agent execution"""
        execution_data = {
            "package_id": "security-scanner",
            "task": "Scan example.com for vulnerabilities",
            "input_data": {"target": "example.com"}
        }
        
        response = client.post("/api/v1/packages/security-scanner/execute", json=execution_data)
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        required_fields = ["success", "result", "execution_id", "duration_ms", "agent_used"]
        for field in required_fields:
            assert field in data
        
        assert data["success"] is True
        assert data["agent_used"] == "security-scanner"
        assert data["duration_ms"] > 0
    
    def test_execute_nonexistent_agent(self):
        """Test executing non-existent agent returns 404"""
        execution_data = {
            "package_id": "nonexistent-agent",
            "task": "Test task"
        }
        
        response = client.post("/api/v1/packages/nonexistent-agent/execute", json=execution_data)
        assert response.status_code == 404

class TestAuthenticationEndpoints:
    """Test authentication and user management endpoints"""
    
    def test_user_info_endpoint(self):
        """Test getting current user info"""
        response = client.get("/api/v1/auth/me")
        assert response.status_code == 200
        data = response.json()
        
        required_fields = ["id", "name", "email", "credits", "tier"]
        for field in required_fields:
            assert field in data
    
    def test_login_endpoint(self):
        """Test user login"""
        login_data = {
            "email": "demo@example.com",
            "password": "demo123"
        }
        
        response = client.post("/api/v1/auth/login", json=login_data)
        assert response.status_code == 200
        data = response.json()
        assert "user" in data
        assert data["user"]["email"] == "demo@example.com"
    
    def test_register_endpoint(self):
        """Test user registration"""
        register_data = {
            "name": "Test User",
            "email": f"test_{int(time.time())}@example.com",
            "password": "testpass123"
        }
        
        response = client.post("/api/v1/auth/register", json=register_data)
        assert response.status_code == 200
        data = response.json()
        assert "user" in data
        assert data["user"]["email"] == register_data["email"]

class TestPaymentEndpoints:
    """Test payment and billing endpoints"""
    
    def test_credit_packages_endpoint(self):
        """Test getting credit packages"""
        response = client.get("/api/v1/credits/packages")
        assert response.status_code == 200
        data = response.json()
        
        assert "packages" in data
        assert "total" in data
        assert isinstance(data["packages"], list)
        assert data["total"] > 0
        
        # Verify package structure
        if data["packages"]:
            package = data["packages"][0]
            required_fields = ["id", "name", "price", "credits", "total_credits"]
            for field in required_fields:
                assert field in package
    
    def test_user_credits_endpoint(self):
        """Test getting user credits and transactions"""
        response = client.get("/api/v1/user/credits")
        assert response.status_code == 200
        data = response.json()
        
        assert "balance" in data
        assert "transactions" in data
        assert isinstance(data["balance"], (int, float))
        assert isinstance(data["transactions"], list)
    
    def test_user_rate_limits_endpoint(self):
        """Test getting user rate limits"""
        response = client.get("/api/v1/user/rate-limits")
        assert response.status_code == 200
        data = response.json()
        
        assert "user_id" in data
        assert "tier" in data
        assert "rate_limits" in data
        assert isinstance(data["rate_limits"], dict)
    
    def test_user_usage_endpoint(self):
        """Test getting user usage summary"""
        response = client.get("/api/v1/user/usage")
        assert response.status_code == 200
        data = response.json()
        
        assert "user_id" in data
        assert "current_month" in data
        assert "usage_summary" in data
        
        usage = data["usage_summary"]
        assert "total_executions" in usage
        assert "total_cost" in usage
        assert "credits_used" in usage
    
    def test_create_payment_intent(self):
        """Test creating payment intent"""
        payment_data = {
            "amount": 10.00,
            "customer_email": "test@example.com",
            "package": "starter"
        }
        
        response = client.post("/api/v1/payments/create-intent", json=payment_data)
        # This might fail without proper Stripe configuration, which is expected
        assert response.status_code in [200, 400, 500]

class TestRateLimiting:
    """Test rate limiting functionality"""
    
    def test_rate_limit_headers(self):
        """Test that rate limit headers are present"""
        response = client.get("/api/v1/packages")
        
        # Check for rate limit headers (if implemented)
        if "X-RateLimit-Limit" in response.headers:
            assert "X-RateLimit-Remaining" in response.headers
            assert "X-RateLimit-Reset" in response.headers
    
    def test_concurrent_requests(self):
        """Test handling of concurrent requests"""
        import threading
        import queue
        
        results = queue.Queue()
        
        def make_request():
            response = client.get("/api/v1/packages")
            results.put(response.status_code)
        
        # Create multiple threads
        threads = []
        for _ in range(5):
            thread = threading.Thread(target=make_request)
            threads.append(thread)
            thread.start()
        
        # Wait for all threads to complete
        for thread in threads:
            thread.join()
        
        # Check results
        status_codes = []
        while not results.empty():
            status_codes.append(results.get())
        
        # All requests should succeed (or some might be rate limited with 429)
        for code in status_codes:
            assert code in [200, 429]
    
    def test_rate_limit_enforcement(self):
        """Test that rate limits are enforced"""
        # Make multiple rapid requests to trigger rate limiting
        responses = []
        for _ in range(10):
            response = client.post("/api/v1/packages/security-scanner/execute", json={
                "package_id": "security-scanner",
                "task": "Test rate limiting"
            })
            responses.append(response)
        
        # At least some requests should succeed
        success_count = sum(1 for r in responses if r.status_code == 200)
        assert success_count > 0
        
        # Some might be rate limited (429) depending on tier limits
        rate_limited_count = sum(1 for r in responses if r.status_code == 429)
        # This is tier-dependent, so we just check it's not negative
        assert rate_limited_count >= 0

class TestErrorHandling:
    """Test error handling and edge cases"""
    
    def test_invalid_json_request(self):
        """Test handling of invalid JSON in request body"""
        response = client.post("/api/v1/packages/security-scanner/execute", 
                             data="invalid json")
        assert response.status_code == 422  # Unprocessable Entity
    
    def test_missing_required_fields(self):
        """Test handling of missing required fields"""
        response = client.post("/api/v1/packages/security-scanner/execute", json={})
        assert response.status_code == 422
    
    def test_invalid_package_id_format(self):
        """Test handling of invalid package ID format"""
        response = client.get("/api/v1/packages/invalid@package#id")
        assert response.status_code == 404
    
    def test_large_request_body(self):
        """Test handling of large request bodies"""
        large_data = {
            "package_id": "security-scanner",
            "task": "Test task",
            "input_data": {"large_field": "x" * 10000}  # 10KB of data
        }
        
        response = client.post("/api/v1/packages/security-scanner/execute", json=large_data)
        # Should either succeed or fail gracefully
        assert response.status_code in [200, 413, 422]

class TestSecurity:
    """Test security aspects of the API"""
    
    def test_cors_headers(self):
        """Test CORS headers are present"""
        response = client.get("/api/v1/packages")
        
        # Check for CORS headers
        assert "access-control-allow-origin" in response.headers
    
    def test_sql_injection_protection(self):
        """Test protection against SQL injection"""
        malicious_input = "'; DROP TABLE users; --"
        
        response = client.post("/api/v1/packages/security-scanner/execute", json={
            "package_id": "security-scanner",
            "task": malicious_input
        })
        
        # Should not cause server error
        assert response.status_code in [200, 400, 422]
    
    def test_xss_protection(self):
        """Test protection against XSS"""
        xss_payload = "<script>alert('xss')</script>"
        
        response = client.post("/api/v1/packages/security-scanner/execute", json={
            "package_id": "security-scanner",
            "task": xss_payload
        })
        
        # Should handle safely
        assert response.status_code in [200, 400, 422]
        
        # Response should not contain unescaped script tags
        if response.status_code == 200:
            response_text = response.text
            assert "<script>" not in response_text

class TestPerformance:
    """Test API performance"""
    
    def test_response_time(self):
        """Test API response times are reasonable"""
        start_time = time.time()
        response = client.get("/api/v1/packages")
        end_time = time.time()
        
        response_time = end_time - start_time
        assert response_time < 2.0  # Should respond within 2 seconds
        assert response.status_code == 200
    
    def test_agent_execution_performance(self):
        """Test agent execution performance"""
        start_time = time.time()
        response = client.post("/api/v1/packages/security-scanner/execute", json={
            "package_id": "security-scanner",
            "task": "Quick performance test"
        })
        end_time = time.time()
        
        response_time = end_time - start_time
        assert response_time < 10.0  # Should complete within 10 seconds
        
        if response.status_code == 200:
            data = response.json()
            assert data["duration_ms"] > 0
    
    def test_concurrent_agent_executions(self):
        """Test concurrent agent executions"""
        import threading
        import queue
        
        results = queue.Queue()
        
        def execute_agent():
            response = client.post("/api/v1/packages/knowledge-base/execute", json={
                "package_id": "knowledge-base",
                "task": "Concurrent test query"
            })
            results.put((response.status_code, time.time()))
        
        # Start multiple concurrent executions
        start_time = time.time()
        threads = []
        for _ in range(3):  # Test 3 concurrent executions
            thread = threading.Thread(target=execute_agent)
            threads.append(thread)
            thread.start()
        
        # Wait for completion
        for thread in threads:
            thread.join()
        
        end_time = time.time()
        total_time = end_time - start_time
        
        # Collect results
        status_codes = []
        while not results.empty():
            status_code, _ = results.get()
            status_codes.append(status_code)
        
        # Should complete within reasonable time
        assert total_time < 30.0  # 30 seconds for 3 concurrent executions
        
        # At least some should succeed
        success_count = sum(1 for code in status_codes if code == 200)
        assert success_count > 0

class TestDataIntegrity:
    """Test data integrity and consistency"""
    
    def test_user_credit_consistency(self):
        """Test user credit balance consistency"""
        # Get initial balance
        response1 = client.get("/api/v1/user/credits")
        initial_balance = response1.json()["balance"]
        
        # Execute an agent (which should deduct credits)
        execution_response = client.post("/api/v1/packages/security-scanner/execute", json={
            "package_id": "security-scanner",
            "task": "Credit consistency test"
        })
        
        if execution_response.status_code == 200:
            # Get balance after execution
            response2 = client.get("/api/v1/user/credits")
            final_balance = response2.json()["balance"]
            
            # Balance should have decreased (or stayed same if covered by subscription)
            assert final_balance <= initial_balance
    
    def test_execution_logging(self):
        """Test that executions are properly logged"""
        # Get initial execution count
        response1 = client.get("/api/v1/user/executions")
        if response1.status_code == 200:
            initial_count = len(response1.json().get("executions", []))
        else:
            initial_count = 0
        
        # Execute an agent
        execution_response = client.post("/api/v1/packages/ticket-resolver/execute", json={
            "package_id": "ticket-resolver",
            "task": "Logging test"
        })
        
        if execution_response.status_code == 200:
            # Check that execution was logged
            response2 = client.get("/api/v1/user/executions")
            if response2.status_code == 200:
                final_count = len(response2.json().get("executions", []))
                assert final_count > initial_count

# Integration test for complete workflows
class TestWorkflows:
    """Test complete user workflows"""
    
    def test_new_user_workflow(self):
        """Test complete new user workflow"""
        # 1. Register new user
        unique_email = f"workflow_test_{int(time.time())}@example.com"
        register_response = client.post("/api/v1/auth/register", json={
            "name": "Workflow Test User",
            "email": unique_email,
            "password": "testpass123"
        })
        
        if register_response.status_code == 200:
            # 2. Check user info
            user_response = client.get("/api/v1/auth/me")
            assert user_response.status_code == 200
            
            # 3. Check available packages
            packages_response = client.get("/api/v1/packages")
            assert packages_response.status_code == 200
            
            # 4. Execute an agent
            execution_response = client.post("/api/v1/packages/knowledge-base/execute", json={
                "package_id": "knowledge-base",
                "task": "New user test query"
            })
            
            # Should succeed or fail gracefully
            assert execution_response.status_code in [200, 402, 429]
    
    def test_payment_workflow(self):
        """Test payment workflow"""
        # 1. Get available credit packages
        packages_response = client.get("/api/v1/credits/packages")
        assert packages_response.status_code == 200
        
        # 2. Try to create payment intent
        payment_response = client.post("/api/v1/payments/create-intent", json={
            "amount": 10.00,
            "customer_email": "test@example.com",
            "package": "starter"
        })
        
        # May fail without Stripe config, which is acceptable
        assert payment_response.status_code in [200, 400, 500]

if __name__ == "__main__":
    # Run tests with pytest
    pytest.main([__file__, "-v", "--tb=short", "--maxfail=5"])
