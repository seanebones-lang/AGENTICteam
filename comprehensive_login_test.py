#!/usr/bin/env python3
"""
Comprehensive Login System Testing Suite
Tests every aspect of authentication until it's bulletproof
"""
import requests
import json
import time
import sqlite3
from datetime import datetime
import os

class LoginSystemTester:
    def __init__(self):
        self.backend_url = "https://bizbot-api.onrender.com"
        self.frontend_url = "https://www.bizbot.store"
        self.test_results = []
        self.db_path = "credits.db"
        
    def log_test(self, test_name, success, details=""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        timestamp = datetime.now().strftime("%H:%M:%S")
        result = f"[{timestamp}] {status} {test_name}"
        if details:
            result += f" - {details}"
        print(result)
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": timestamp
        })
        return success
    
    def test_backend_health(self):
        """Test backend health and connectivity"""
        try:
            response = requests.get(f"{self.backend_url}/health", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            return self.log_test("Backend Health Check", success, details)
        except Exception as e:
            return self.log_test("Backend Health Check", False, str(e))
    
    def test_user_registration(self):
        """Test user registration flow"""
        test_email = f"testuser_{int(time.time())}@example.com"
        test_password = "TestPass123!"
        
        try:
            response = requests.post(
                f"{self.backend_url}/api/v1/auth/register",
                json={
                    "email": test_email,
                    "password": test_password,
                    "name": "Test User"
                },
                timeout=10
            )
            
            success = response.status_code == 201
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                details += f", Token: {data.get('access_token', 'N/A')[:20]}..."
                
            return self.log_test("User Registration", success, details)
            
        except Exception as e:
            return self.log_test("User Registration", False, str(e))
    
    def test_user_login(self):
        """Test user login flow"""
        # First register a test user
        test_email = f"logintest_{int(time.time())}@example.com"
        test_password = "TestPass123!"
        
        try:
            # Register
            reg_response = requests.post(
                f"{self.backend_url}/api/v1/auth/register",
                json={
                    "email": test_email,
                    "password": test_password,
                    "name": "Login Test User"
                },
                timeout=10
            )
            
            if reg_response.status_code != 201:
                return self.log_test("User Login", False, "Registration failed")
            
            # Now test login
            login_response = requests.post(
                f"{self.backend_url}/api/v1/auth/login",
                json={
                    "email": test_email,
                    "password": test_password
                },
                timeout=10
            )
            
            success = login_response.status_code == 200
            details = f"Status: {login_response.status_code}"
            
            if success:
                data = login_response.json()
                details += f", User: {data.get('user', {}).get('name', 'N/A')}"
                details += f", Credits: ${data.get('user', {}).get('credits', 'N/A')}"
                
            return self.log_test("User Login", success, details)
            
        except Exception as e:
            return self.log_test("User Login", False, str(e))
    
    def test_sean_account(self):
        """Test Sean's specific account"""
        try:
            response = requests.post(
                f"{self.backend_url}/api/v1/auth/login",
                json={
                    "email": "seanebones@gmail.com",
                    "password": "TempPass123!"
                },
                timeout=10
            )
            
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                details += f", User: {data.get('user', {}).get('name', 'N/A')}"
                details += f", Credits: ${data.get('user', {}).get('credits', 'N/A')}"
                
            return self.log_test("Sean's Account Login", success, details)
            
        except Exception as e:
            return self.log_test("Sean's Account Login", False, str(e))
    
    def test_credit_system(self):
        """Test credit system functionality"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Check Sean's credits
            cursor.execute("""
                SELECT COALESCE(SUM(amount), 0) 
                FROM credit_transactions 
                WHERE customer_id = 'seanebones@gmail.com'
            """)
            sean_credits = cursor.fetchone()[0]
            
            # Check total transactions
            cursor.execute("SELECT COUNT(*) FROM credit_transactions")
            total_transactions = cursor.fetchone()[0]
            
            conn.close()
            
            success = sean_credits >= 20.0  # Should have at least $20
            details = f"Sean's Credits: ${sean_credits}, Total Transactions: {total_transactions}"
            
            return self.log_test("Credit System", success, details)
            
        except Exception as e:
            return self.log_test("Credit System", False, str(e))
    
    def test_frontend_accessibility(self):
        """Test frontend page accessibility"""
        try:
            response = requests.get(f"{self.frontend_url}/login", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            # Check if page contains login form elements
            if success:
                content = response.text.lower()
                has_email_field = 'email' in content and 'input' in content
                has_password_field = 'password' in content and 'input' in content
                has_submit_button = 'submit' in content or 'sign in' in content
                
                form_complete = has_email_field and has_password_field and has_submit_button
                details += f", Form Complete: {form_complete}"
                
            return self.log_test("Frontend Accessibility", success, details)
            
        except Exception as e:
            return self.log_test("Frontend Accessibility", False, str(e))
    
    def test_api_endpoints(self):
        """Test all authentication API endpoints"""
        endpoints = [
            ("/api/v1/auth/register", "POST"),
            ("/api/v1/auth/login", "POST"),
            ("/api/v1/auth/token", "POST"),
            ("/health", "GET")
        ]
        
        all_success = True
        
        for endpoint, method in endpoints:
            try:
                url = f"{self.backend_url}{endpoint}"
                
                if method == "GET":
                    response = requests.get(url, timeout=5)
                else:
                    response = requests.post(url, json={}, timeout=5)
                
                # For auth endpoints, 400/422 is expected with empty data
                success = response.status_code in [200, 201, 400, 422]
                details = f"Status: {response.status_code}"
                
                test_name = f"API Endpoint {endpoint}"
                if not self.log_test(test_name, success, details):
                    all_success = False
                    
            except Exception as e:
                test_name = f"API Endpoint {endpoint}"
                if not self.log_test(test_name, False, str(e)):
                    all_success = False
        
        return all_success
    
    def test_database_integrity(self):
        """Test database structure and data integrity"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Check table structure
            cursor.execute("PRAGMA table_info(credit_transactions)")
            columns = cursor.fetchall()
            
            # Check for Sean's account
            cursor.execute("""
                SELECT COUNT(*) FROM credit_transactions 
                WHERE customer_id = 'seanebones@gmail.com'
            """)
            sean_transactions = cursor.fetchone()[0]
            
            # Check total records
            cursor.execute("SELECT COUNT(*) FROM credit_transactions")
            total_records = cursor.fetchone()[0]
            
            conn.close()
            
            success = len(columns) >= 6 and sean_transactions > 0  # Should have proper structure and Sean's data
            details = f"Columns: {len(columns)}, Sean's Transactions: {sean_transactions}, Total: {total_records}"
            
            return self.log_test("Database Integrity", success, details)
            
        except Exception as e:
            return self.log_test("Database Integrity", False, str(e))
    
    def run_comprehensive_test(self):
        """Run all tests and generate report"""
        print("🚀 Starting Comprehensive Login System Test")
        print("=" * 60)
        
        tests = [
            self.test_backend_health,
            self.test_api_endpoints,
            self.test_database_integrity,
            self.test_credit_system,
            self.test_user_registration,
            self.test_user_login,
            self.test_sean_account,
            self.test_frontend_accessibility
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            try:
                if test():
                    passed += 1
            except Exception as e:
                print(f"❌ Test {test.__name__} crashed: {e}")
        
        print("=" * 60)
        print(f"📊 TEST SUMMARY: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 ALL TESTS PASSED! Login system is fully functional.")
        else:
            print("⚠️ Some tests failed. Issues need to be addressed.")
            
        return passed == total
    
    def generate_report(self):
        """Generate detailed test report"""
        report = {
            "timestamp": datetime.now().isoformat(),
            "total_tests": len(self.test_results),
            "passed_tests": sum(1 for r in self.test_results if r["success"]),
            "failed_tests": sum(1 for r in self.test_results if not r["success"]),
            "results": self.test_results
        }
        
        with open("login_test_report.json", "w") as f:
            json.dump(report, f, indent=2)
        
        print(f"📄 Detailed report saved to: login_test_report.json")
        return report

if __name__ == "__main__":
    tester = LoginSystemTester()
    success = tester.run_comprehensive_test()
    tester.generate_report()
    
    if not success:
        print("\n🔧 FAILED TESTS REQUIRE IMMEDIATE ATTENTION!")
        exit(1)
    else:
        print("\n✅ LOGIN SYSTEM IS FULLY FUNCTIONAL!")
