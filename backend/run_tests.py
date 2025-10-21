#!/usr/bin/env python3
"""
Comprehensive test runner for Agent Marketplace
Runs all tests with proper reporting and coverage analysis
"""

import os
import sys
import subprocess
import time
import json
from datetime import datetime
from typing import Dict, List, Any
import argparse

class TestRunner:
    """Comprehensive test runner with reporting"""
    
    def __init__(self):
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "test_suites": {},
            "overall_status": "unknown",
            "total_tests": 0,
            "passed_tests": 0,
            "failed_tests": 0,
            "skipped_tests": 0,
            "coverage_percent": 0.0,
            "duration_seconds": 0.0
        }
    
    def run_pytest_suite(self, test_file: str, suite_name: str) -> Dict[str, Any]:
        """Run a specific pytest suite"""
        print(f"\n🧪 Running {suite_name}...")
        print("=" * 60)
        
        start_time = time.time()
        
        try:
            # Run pytest with JSON output
            cmd = [
                sys.executable, "-m", "pytest",
                test_file,
                "-v",
                "--tb=short",
                "--json-report",
                f"--json-report-file=test_results_{suite_name.lower().replace(' ', '_')}.json",
                "--maxfail=10"
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            duration = time.time() - start_time
            
            # Parse results
            try:
                with open(f"test_results_{suite_name.lower().replace(' ', '_')}.json", 'r') as f:
                    json_results = json.load(f)
                
                suite_results = {
                    "status": "passed" if result.returncode == 0 else "failed",
                    "total_tests": json_results.get("summary", {}).get("total", 0),
                    "passed": json_results.get("summary", {}).get("passed", 0),
                    "failed": json_results.get("summary", {}).get("failed", 0),
                    "skipped": json_results.get("summary", {}).get("skipped", 0),
                    "duration_seconds": duration,
                    "output": result.stdout,
                    "errors": result.stderr if result.stderr else None
                }
                
                # Clean up JSON file
                os.remove(f"test_results_{suite_name.lower().replace(' ', '_')}.json")
                
            except (FileNotFoundError, json.JSONDecodeError):
                # Fallback parsing from stdout
                suite_results = {
                    "status": "passed" if result.returncode == 0 else "failed",
                    "total_tests": 0,
                    "passed": 0,
                    "failed": 0,
                    "skipped": 0,
                    "duration_seconds": duration,
                    "output": result.stdout,
                    "errors": result.stderr if result.stderr else None
                }
                
                # Try to parse basic info from output
                if "failed" in result.stdout.lower():
                    suite_results["status"] = "failed"
                elif "passed" in result.stdout.lower():
                    suite_results["status"] = "passed"
            
            print(f"✅ {suite_name} completed in {duration:.2f}s")
            if suite_results["status"] == "failed":
                print(f"❌ {suite_results['failed']} tests failed")
            else:
                print(f"✅ All tests passed")
            
            return suite_results
            
        except subprocess.TimeoutExpired:
            duration = time.time() - start_time
            print(f"⏰ {suite_name} timed out after {duration:.2f}s")
            
            return {
                "status": "timeout",
                "total_tests": 0,
                "passed": 0,
                "failed": 0,
                "skipped": 0,
                "duration_seconds": duration,
                "output": "",
                "errors": "Test suite timed out"
            }
            
        except Exception as e:
            duration = time.time() - start_time
            print(f"❌ {suite_name} failed with error: {str(e)}")
            
            return {
                "status": "error",
                "total_tests": 0,
                "passed": 0,
                "failed": 0,
                "skipped": 0,
                "duration_seconds": duration,
                "output": "",
                "errors": str(e)
            }
    
    def run_coverage_analysis(self) -> float:
        """Run coverage analysis"""
        print("\n📊 Running coverage analysis...")
        
        try:
            # Run pytest with coverage
            cmd = [
                sys.executable, "-m", "pytest",
                "tests/",
                "--cov=.",
                "--cov-report=term-missing",
                "--cov-report=json:coverage.json",
                "-q"
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
            
            # Parse coverage results
            try:
                with open("coverage.json", 'r') as f:
                    coverage_data = json.load(f)
                
                coverage_percent = coverage_data.get("totals", {}).get("percent_covered", 0.0)
                print(f"📈 Code coverage: {coverage_percent:.1f}%")
                
                # Clean up coverage file
                os.remove("coverage.json")
                
                return coverage_percent
                
            except (FileNotFoundError, json.JSONDecodeError):
                print("⚠️ Could not parse coverage results")
                return 0.0
                
        except Exception as e:
            print(f"❌ Coverage analysis failed: {str(e)}")
            return 0.0
    
    def run_security_tests(self) -> Dict[str, Any]:
        """Run security-specific tests"""
        print("\n🔒 Running security tests...")
        
        # Run security test suite
        return self.run_pytest_suite("tests/test_security.py", "Security Tests")
    
    def run_performance_tests(self) -> Dict[str, Any]:
        """Run performance tests"""
        print("\n⚡ Running performance tests...")
        
        # For now, this is part of the API tests
        # In a full implementation, you'd have separate performance tests
        return {
            "status": "skipped",
            "total_tests": 0,
            "passed": 0,
            "failed": 0,
            "skipped": 0,
            "duration_seconds": 0.0,
            "output": "Performance tests integrated into API tests",
            "errors": None
        }
    
    def run_all_tests(self, include_coverage: bool = True) -> Dict[str, Any]:
        """Run all test suites"""
        print("🚀 Starting comprehensive test suite...")
        print("=" * 80)
        
        overall_start_time = time.time()
        
        # Test suites to run
        test_suites = [
            ("tests/test_agents.py", "Agent Tests"),
            ("tests/test_api.py", "API Tests"),
            ("tests/test_security.py", "Security Tests")
        ]
        
        # Run each test suite
        for test_file, suite_name in test_suites:
            if os.path.exists(test_file):
                self.results["test_suites"][suite_name] = self.run_pytest_suite(test_file, suite_name)
            else:
                print(f"⚠️ Test file not found: {test_file}")
                self.results["test_suites"][suite_name] = {
                    "status": "skipped",
                    "total_tests": 0,
                    "passed": 0,
                    "failed": 0,
                    "skipped": 0,
                    "duration_seconds": 0.0,
                    "output": f"Test file not found: {test_file}",
                    "errors": None
                }
        
        # Run coverage analysis
        if include_coverage:
            self.results["coverage_percent"] = self.run_coverage_analysis()
        
        # Calculate overall results
        self.calculate_overall_results()
        
        # Total duration
        self.results["duration_seconds"] = time.time() - overall_start_time
        
        return self.results
    
    def calculate_overall_results(self):
        """Calculate overall test results"""
        total_tests = 0
        passed_tests = 0
        failed_tests = 0
        skipped_tests = 0
        
        all_passed = True
        any_failed = False
        
        for suite_name, suite_results in self.results["test_suites"].items():
            total_tests += suite_results["total_tests"]
            passed_tests += suite_results["passed"]
            failed_tests += suite_results["failed"]
            skipped_tests += suite_results["skipped"]
            
            if suite_results["status"] in ["failed", "error", "timeout"]:
                any_failed = True
                all_passed = False
        
        self.results["total_tests"] = total_tests
        self.results["passed_tests"] = passed_tests
        self.results["failed_tests"] = failed_tests
        self.results["skipped_tests"] = skipped_tests
        
        if any_failed:
            self.results["overall_status"] = "failed"
        elif all_passed and total_tests > 0:
            self.results["overall_status"] = "passed"
        else:
            self.results["overall_status"] = "no_tests"
    
    def print_summary(self):
        """Print test results summary"""
        print("\n" + "=" * 80)
        print("📋 TEST RESULTS SUMMARY")
        print("=" * 80)
        
        # Overall status
        status_emoji = {
            "passed": "✅",
            "failed": "❌",
            "no_tests": "⚠️"
        }
        
        print(f"{status_emoji.get(self.results['overall_status'], '❓')} Overall Status: {self.results['overall_status'].upper()}")
        print(f"⏱️  Total Duration: {self.results['duration_seconds']:.2f} seconds")
        print(f"🧪 Total Tests: {self.results['total_tests']}")
        print(f"✅ Passed: {self.results['passed_tests']}")
        print(f"❌ Failed: {self.results['failed_tests']}")
        print(f"⏭️  Skipped: {self.results['skipped_tests']}")
        
        if self.results["coverage_percent"] > 0:
            coverage_emoji = "🟢" if self.results["coverage_percent"] >= 80 else "🟡" if self.results["coverage_percent"] >= 60 else "🔴"
            print(f"{coverage_emoji} Coverage: {self.results['coverage_percent']:.1f}%")
        
        print("\n📊 Test Suite Breakdown:")
        for suite_name, suite_results in self.results["test_suites"].items():
            status_emoji = {
                "passed": "✅",
                "failed": "❌",
                "error": "💥",
                "timeout": "⏰",
                "skipped": "⏭️"
            }
            
            emoji = status_emoji.get(suite_results["status"], "❓")
            print(f"  {emoji} {suite_name}: {suite_results['status']} "
                  f"({suite_results['passed']}/{suite_results['total_tests']} passed, "
                  f"{suite_results['duration_seconds']:.2f}s)")
        
        # Recommendations
        print("\n💡 Recommendations:")
        if self.results["failed_tests"] > 0:
            print("  - Fix failing tests before deployment")
        if self.results["coverage_percent"] < 80:
            print("  - Increase test coverage (target: 80%+)")
        if self.results["overall_status"] == "passed":
            print("  - All tests passing! Ready for deployment")
        
        print("=" * 80)
    
    def save_results(self, filename: str = "test_results.json"):
        """Save test results to JSON file"""
        with open(filename, 'w') as f:
            json.dump(self.results, f, indent=2)
        print(f"📄 Test results saved to {filename}")

def main():
    """Main test runner function"""
    parser = argparse.ArgumentParser(description="Run Agent Marketplace test suite")
    parser.add_argument("--no-coverage", action="store_true", help="Skip coverage analysis")
    parser.add_argument("--output", "-o", default="test_results.json", help="Output file for results")
    parser.add_argument("--suite", choices=["agents", "api", "security", "all"], default="all", 
                       help="Specific test suite to run")
    
    args = parser.parse_args()
    
    # Change to backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    runner = TestRunner()
    
    if args.suite == "all":
        # Run all tests
        results = runner.run_all_tests(include_coverage=not args.no_coverage)
    else:
        # Run specific suite
        suite_files = {
            "agents": "tests/test_agents.py",
            "api": "tests/test_api.py", 
            "security": "tests/test_security.py"
        }
        
        test_file = suite_files[args.suite]
        suite_name = f"{args.suite.title()} Tests"
        
        if os.path.exists(test_file):
            suite_results = runner.run_pytest_suite(test_file, suite_name)
            runner.results["test_suites"][suite_name] = suite_results
            runner.calculate_overall_results()
        else:
            print(f"❌ Test file not found: {test_file}")
            return 1
    
    # Print summary
    runner.print_summary()
    
    # Save results
    runner.save_results(args.output)
    
    # Return appropriate exit code
    return 0 if runner.results["overall_status"] == "passed" else 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
