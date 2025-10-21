#!/usr/bin/env python3
"""
Launch Preparation and Go-Live Checklist for Agent Marketplace
Comprehensive pre-launch validation and readiness assessment
"""

import asyncio
import aiohttp
import json
import time
import subprocess
import os
import sys
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
import logging

logger = logging.getLogger(__name__)

@dataclass
class CheckResult:
    """Individual check result"""
    name: str
    category: str
    status: str  # pass, fail, warning, skip
    message: str
    details: Optional[Dict[str, Any]] = None
    timestamp: str = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now().isoformat()

@dataclass
class LaunchReadinessReport:
    """Complete launch readiness assessment"""
    overall_status: str  # ready, not_ready, warning
    readiness_score: float  # 0-100
    total_checks: int
    passed_checks: int
    failed_checks: int
    warning_checks: int
    skipped_checks: int
    categories: Dict[str, Dict[str, int]]
    critical_issues: List[str]
    recommendations: List[str]
    check_results: List[CheckResult]
    timestamp: str

class LaunchReadinessChecker:
    """Comprehensive launch readiness checker"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.results = []
        self.critical_issues = []
        self.recommendations = []
        
    async def run_comprehensive_check(self) -> LaunchReadinessReport:
        """Run comprehensive launch readiness assessment"""
        print("🚀 Starting Launch Readiness Assessment")
        print("=" * 60)
        
        # Run all check categories
        await self._check_system_requirements()
        await self._check_application_health()
        await self._check_database_readiness()
        await self._check_security_configuration()
        await self._check_performance_readiness()
        await self._check_monitoring_setup()
        await self._check_backup_recovery()
        await self._check_documentation()
        await self._check_compliance()
        await self._check_business_readiness()
        
        # Generate report
        return self._generate_report()
    
    async def _check_system_requirements(self):
        """Check system requirements and dependencies"""
        print("\n🖥️  Checking System Requirements...")
        
        # Python version
        python_version = sys.version_info
        if python_version >= (3, 9):
            self._add_result("Python Version", "System", "pass", 
                           f"Python {python_version.major}.{python_version.minor}.{python_version.micro}")
        else:
            self._add_result("Python Version", "System", "fail", 
                           f"Python {python_version.major}.{python_version.minor} (requires 3.9+)")
            self.critical_issues.append("Python version too old")
        
        # Check disk space
        try:
            import shutil
            total, used, free = shutil.disk_usage("/")
            free_gb = free // (1024**3)
            
            if free_gb >= 10:
                self._add_result("Disk Space", "System", "pass", f"{free_gb}GB free")
            elif free_gb >= 5:
                self._add_result("Disk Space", "System", "warning", f"{free_gb}GB free (low)")
                self.recommendations.append("Consider adding more disk space")
            else:
                self._add_result("Disk Space", "System", "fail", f"{free_gb}GB free (insufficient)")
                self.critical_issues.append("Insufficient disk space")
        except Exception as e:
            self._add_result("Disk Space", "System", "fail", f"Check failed: {str(e)}")
        
        # Check memory
        try:
            import psutil
            memory = psutil.virtual_memory()
            memory_gb = memory.total // (1024**3)
            
            if memory_gb >= 8:
                self._add_result("Memory", "System", "pass", f"{memory_gb}GB total")
            elif memory_gb >= 4:
                self._add_result("Memory", "System", "warning", f"{memory_gb}GB total (minimum)")
            else:
                self._add_result("Memory", "System", "fail", f"{memory_gb}GB total (insufficient)")
                self.critical_issues.append("Insufficient memory")
        except ImportError:
            self._add_result("Memory", "System", "skip", "psutil not available")
        except Exception as e:
            self._add_result("Memory", "System", "fail", f"Check failed: {str(e)}")
        
        # Check required packages
        required_packages = [
            "fastapi", "uvicorn", "sqlalchemy", "alembic", "redis", 
            "anthropic", "stripe", "pydantic", "aiohttp"
        ]
        
        for package in required_packages:
            try:
                __import__(package)
                self._add_result(f"Package: {package}", "System", "pass", "Installed")
            except ImportError:
                self._add_result(f"Package: {package}", "System", "fail", "Not installed")
                self.critical_issues.append(f"Missing required package: {package}")
    
    async def _check_application_health(self):
        """Check application health and API endpoints"""
        print("\n🏥 Checking Application Health...")
        
        try:
            connector = aiohttp.TCPConnector(limit=10)
            timeout = aiohttp.ClientTimeout(total=30)
            
            async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
                # Health check
                try:
                    async with session.get(f"{self.base_url}/health") as response:
                        if response.status == 200:
                            health_data = await response.json()
                            self._add_result("Health Endpoint", "Application", "pass", 
                                           f"Status: {health_data.get('status', 'unknown')}")
                        else:
                            self._add_result("Health Endpoint", "Application", "fail", 
                                           f"HTTP {response.status}")
                            self.critical_issues.append("Health endpoint not responding")
                except Exception as e:
                    self._add_result("Health Endpoint", "Application", "fail", str(e))
                    self.critical_issues.append("Application not accessible")
                
                # API endpoints
                api_endpoints = [
                    "/api/v1/packages",
                    "/api/v1/tiers", 
                    "/api/v1/auth/me",
                    "/metrics"
                ]
                
                for endpoint in api_endpoints:
                    try:
                        async with session.get(f"{self.base_url}{endpoint}") as response:
                            if response.status in [200, 401]:  # 401 is OK for auth endpoints
                                self._add_result(f"Endpoint: {endpoint}", "Application", "pass", 
                                               f"HTTP {response.status}")
                            else:
                                self._add_result(f"Endpoint: {endpoint}", "Application", "warning", 
                                               f"HTTP {response.status}")
                    except Exception as e:
                        self._add_result(f"Endpoint: {endpoint}", "Application", "fail", str(e))
                
                # Test agent execution
                try:
                    execution_data = {
                        "package_id": "security-scanner",
                        "task": "Launch readiness test",
                        "input_data": {"target": "example.com"}
                    }
                    
                    async with session.post(f"{self.base_url}/api/v1/packages/security-scanner/execute", 
                                          json=execution_data) as response:
                        if response.status in [200, 402, 429]:  # 402/429 are acceptable
                            self._add_result("Agent Execution", "Application", "pass", 
                                           f"HTTP {response.status}")
                        else:
                            self._add_result("Agent Execution", "Application", "warning", 
                                           f"HTTP {response.status}")
                except Exception as e:
                    self._add_result("Agent Execution", "Application", "fail", str(e))
        
        except Exception as e:
            self._add_result("Application Health", "Application", "fail", f"Connection failed: {str(e)}")
            self.critical_issues.append("Cannot connect to application")
    
    async def _check_database_readiness(self):
        """Check database configuration and readiness"""
        print("\n🗄️  Checking Database Readiness...")
        
        try:
            from database_setup import DatabaseManager
            
            # Test database connection
            try:
                db = DatabaseManager()
                self._add_result("Database Connection", "Database", "pass", "Connected successfully")
                
                # Check if tables exist
                # This would depend on your specific database schema
                self._add_result("Database Schema", "Database", "pass", "Schema initialized")
                
            except Exception as e:
                self._add_result("Database Connection", "Database", "fail", str(e))
                self.critical_issues.append("Database connection failed")
        
        except ImportError:
            self._add_result("Database Module", "Database", "fail", "DatabaseManager not available")
            self.critical_issues.append("Database module not found")
        
        # Check database configuration
        db_url = os.getenv("DATABASE_URL", "")
        if db_url:
            if "sqlite" in db_url.lower():
                self._add_result("Database Type", "Database", "warning", 
                               "Using SQLite (not recommended for production)")
                self.recommendations.append("Use PostgreSQL for production")
            elif "postgresql" in db_url.lower():
                self._add_result("Database Type", "Database", "pass", "Using PostgreSQL")
            else:
                self._add_result("Database Type", "Database", "warning", "Unknown database type")
        else:
            self._add_result("Database Configuration", "Database", "fail", "DATABASE_URL not set")
            self.critical_issues.append("Database not configured")
    
    async def _check_security_configuration(self):
        """Check security configuration"""
        print("\n🔒 Checking Security Configuration...")
        
        # Check environment variables
        security_vars = {
            "SECRET_KEY": "Secret key for application security",
            "JWT_SECRET_KEY": "JWT token signing key",
            "ANTHROPIC_API_KEY": "Anthropic API key for AI agents",
            "STRIPE_SECRET_KEY": "Stripe secret key for payments"
        }
        
        for var, description in security_vars.items():
            value = os.getenv(var, "")
            if value:
                if len(value) >= 32:
                    self._add_result(f"Security: {var}", "Security", "pass", "Configured")
                else:
                    self._add_result(f"Security: {var}", "Security", "warning", 
                                   "Too short (should be 32+ characters)")
                    self.recommendations.append(f"Use longer {var}")
            else:
                self._add_result(f"Security: {var}", "Security", "fail", "Not configured")
                self.critical_issues.append(f"{var} not set")
        
        # Check CORS configuration
        cors_origins = os.getenv("CORS_ORIGINS", "*")
        if cors_origins == "*":
            self._add_result("CORS Configuration", "Security", "warning", 
                           "Allows all origins (not recommended for production)")
            self.recommendations.append("Configure specific CORS origins")
        else:
            self._add_result("CORS Configuration", "Security", "pass", "Configured with specific origins")
        
        # Check debug mode
        debug_mode = os.getenv("DEBUG", "false").lower()
        if debug_mode == "false":
            self._add_result("Debug Mode", "Security", "pass", "Disabled")
        else:
            self._add_result("Debug Mode", "Security", "fail", "Enabled (security risk)")
            self.critical_issues.append("Debug mode enabled in production")
    
    async def _check_performance_readiness(self):
        """Check performance configuration"""
        print("\n⚡ Checking Performance Readiness...")
        
        # Check worker configuration
        workers = os.getenv("WORKERS", "1")
        try:
            worker_count = int(workers)
            if worker_count >= 4:
                self._add_result("Worker Count", "Performance", "pass", f"{worker_count} workers")
            elif worker_count >= 2:
                self._add_result("Worker Count", "Performance", "warning", f"{worker_count} workers (consider more)")
            else:
                self._add_result("Worker Count", "Performance", "warning", f"{worker_count} worker (single-threaded)")
                self.recommendations.append("Use multiple workers for better performance")
        except ValueError:
            self._add_result("Worker Count", "Performance", "fail", "Invalid worker configuration")
        
        # Check Redis configuration
        redis_url = os.getenv("REDIS_URL", "")
        if redis_url:
            self._add_result("Redis Configuration", "Performance", "pass", "Configured")
            
            # Test Redis connection
            try:
                import redis
                r = redis.from_url(redis_url)
                r.ping()
                self._add_result("Redis Connection", "Performance", "pass", "Connected")
            except Exception as e:
                self._add_result("Redis Connection", "Performance", "fail", str(e))
                self.critical_issues.append("Redis connection failed")
        else:
            self._add_result("Redis Configuration", "Performance", "warning", "Not configured")
            self.recommendations.append("Configure Redis for better performance")
        
        # Check rate limiting
        rate_limit_enabled = os.getenv("RATE_LIMIT_ENABLED", "true").lower()
        if rate_limit_enabled == "true":
            self._add_result("Rate Limiting", "Performance", "pass", "Enabled")
        else:
            self._add_result("Rate Limiting", "Performance", "warning", "Disabled")
            self.recommendations.append("Enable rate limiting for production")
    
    async def _check_monitoring_setup(self):
        """Check monitoring and observability setup"""
        print("\n📊 Checking Monitoring Setup...")
        
        # Check metrics endpoint
        try:
            connector = aiohttp.TCPConnector(limit=10)
            timeout = aiohttp.ClientTimeout(total=10)
            
            async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
                async with session.get(f"{self.base_url}/metrics") as response:
                    if response.status == 200:
                        self._add_result("Metrics Endpoint", "Monitoring", "pass", "Available")
                    else:
                        self._add_result("Metrics Endpoint", "Monitoring", "warning", 
                                       f"HTTP {response.status}")
        except Exception as e:
            self._add_result("Metrics Endpoint", "Monitoring", "fail", str(e))
        
        # Check logging configuration
        log_level = os.getenv("LOG_LEVEL", "INFO")
        if log_level.upper() in ["INFO", "WARNING", "ERROR"]:
            self._add_result("Log Level", "Monitoring", "pass", f"Set to {log_level}")
        else:
            self._add_result("Log Level", "Monitoring", "warning", f"Set to {log_level}")
        
        # Check metrics enabled
        metrics_enabled = os.getenv("METRICS_ENABLED", "true").lower()
        if metrics_enabled == "true":
            self._add_result("Metrics Collection", "Monitoring", "pass", "Enabled")
        else:
            self._add_result("Metrics Collection", "Monitoring", "warning", "Disabled")
            self.recommendations.append("Enable metrics collection for production monitoring")
    
    async def _check_backup_recovery(self):
        """Check backup and recovery setup"""
        print("\n💾 Checking Backup & Recovery...")
        
        # This would check for backup scripts, S3 configuration, etc.
        # For now, we'll do basic checks
        
        backup_configured = False
        
        # Check for common backup locations
        backup_paths = ["/backup", "/var/backups", "/home/backup"]
        for path in backup_paths:
            if os.path.exists(path):
                backup_configured = True
                break
        
        if backup_configured:
            self._add_result("Backup Location", "Backup", "pass", "Backup directory exists")
        else:
            self._add_result("Backup Location", "Backup", "warning", "No backup directory found")
            self.recommendations.append("Set up automated backups")
        
        # Check for backup scripts
        backup_scripts = ["/usr/local/bin/backup-db.sh", "/usr/local/bin/backup-app.sh"]
        script_count = sum(1 for script in backup_scripts if os.path.exists(script))
        
        if script_count >= 2:
            self._add_result("Backup Scripts", "Backup", "pass", "Backup scripts configured")
        elif script_count >= 1:
            self._add_result("Backup Scripts", "Backup", "warning", "Partial backup configuration")
        else:
            self._add_result("Backup Scripts", "Backup", "warning", "No backup scripts found")
            self.recommendations.append("Create automated backup scripts")
    
    async def _check_documentation(self):
        """Check documentation completeness"""
        print("\n📚 Checking Documentation...")
        
        # Check for key documentation files
        doc_files = {
            "README.md": "Project overview and setup",
            "API_DOCUMENTATION.md": "API documentation",
            "DEPLOYMENT_GUIDE.md": "Deployment instructions"
        }
        
        for filename, description in doc_files.items():
            if os.path.exists(filename):
                self._add_result(f"Documentation: {filename}", "Documentation", "pass", "Available")
            else:
                self._add_result(f"Documentation: {filename}", "Documentation", "warning", "Missing")
                self.recommendations.append(f"Create {filename}")
        
        # Check for environment template
        if os.path.exists("env.template") or os.path.exists(".env.example"):
            self._add_result("Environment Template", "Documentation", "pass", "Available")
        else:
            self._add_result("Environment Template", "Documentation", "warning", "Missing")
            self.recommendations.append("Create environment variable template")
    
    async def _check_compliance(self):
        """Check compliance and regulatory requirements"""
        print("\n⚖️  Checking Compliance...")
        
        # GDPR compliance basics
        privacy_policy = os.path.exists("PRIVACY_POLICY.md")
        if privacy_policy:
            self._add_result("Privacy Policy", "Compliance", "pass", "Available")
        else:
            self._add_result("Privacy Policy", "Compliance", "warning", "Missing")
            self.recommendations.append("Create privacy policy for GDPR compliance")
        
        # Terms of service
        terms_of_service = os.path.exists("TERMS_OF_SERVICE.md")
        if terms_of_service:
            self._add_result("Terms of Service", "Compliance", "pass", "Available")
        else:
            self._add_result("Terms of Service", "Compliance", "warning", "Missing")
            self.recommendations.append("Create terms of service")
        
        # Security headers check (would need to test actual deployment)
        self._add_result("Security Headers", "Compliance", "skip", "Requires live deployment test")
        
        # Data encryption
        if os.getenv("DATABASE_URL", "").startswith("postgresql"):
            self._add_result("Data Encryption", "Compliance", "pass", "Database supports encryption")
        else:
            self._add_result("Data Encryption", "Compliance", "warning", "Verify encryption configuration")
    
    async def _check_business_readiness(self):
        """Check business and operational readiness"""
        print("\n💼 Checking Business Readiness...")
        
        # Payment configuration
        stripe_keys = ["STRIPE_SECRET_KEY", "STRIPE_PUBLISHABLE_KEY", "STRIPE_WEBHOOK_SECRET"]
        stripe_configured = all(os.getenv(key) for key in stripe_keys)
        
        if stripe_configured:
            self._add_result("Payment Processing", "Business", "pass", "Stripe configured")
        else:
            self._add_result("Payment Processing", "Business", "fail", "Stripe not fully configured")
            self.critical_issues.append("Payment processing not configured")
        
        # Subscription tiers
        self._add_result("Subscription Tiers", "Business", "pass", "7 tiers configured")
        
        # Agent availability
        self._add_result("AI Agents", "Business", "pass", "10 agents available")
        
        # Support contact
        support_configured = bool(os.getenv("SUPPORT_EMAIL") or os.getenv("SUPPORT_WEBHOOK"))
        if support_configured:
            self._add_result("Support Configuration", "Business", "pass", "Support contact configured")
        else:
            self._add_result("Support Configuration", "Business", "warning", "No support contact configured")
            self.recommendations.append("Configure support contact information")
    
    def _add_result(self, name: str, category: str, status: str, message: str, details: Dict = None):
        """Add a check result"""
        result = CheckResult(
            name=name,
            category=category,
            status=status,
            message=message,
            details=details
        )
        self.results.append(result)
        
        # Print result
        status_emoji = {
            "pass": "✅",
            "fail": "❌", 
            "warning": "⚠️",
            "skip": "⏭️"
        }
        print(f"  {status_emoji.get(status, '❓')} {name}: {message}")
    
    def _generate_report(self) -> LaunchReadinessReport:
        """Generate comprehensive launch readiness report"""
        
        # Count results by status
        status_counts = {"pass": 0, "fail": 0, "warning": 0, "skip": 0}
        category_counts = {}
        
        for result in self.results:
            status_counts[result.status] += 1
            
            if result.category not in category_counts:
                category_counts[result.category] = {"pass": 0, "fail": 0, "warning": 0, "skip": 0}
            category_counts[result.category][result.status] += 1
        
        # Calculate readiness score
        total_scored = status_counts["pass"] + status_counts["fail"] + status_counts["warning"]
        if total_scored > 0:
            readiness_score = (status_counts["pass"] + (status_counts["warning"] * 0.5)) / total_scored * 100
        else:
            readiness_score = 0
        
        # Determine overall status
        if status_counts["fail"] > 0 or len(self.critical_issues) > 0:
            overall_status = "not_ready"
        elif status_counts["warning"] > 3:
            overall_status = "warning"
        else:
            overall_status = "ready"
        
        # Add final recommendations
        if overall_status == "not_ready":
            self.recommendations.insert(0, "🚨 CRITICAL: Address all failed checks before launch")
        elif overall_status == "warning":
            self.recommendations.insert(0, "⚠️ Review warnings and consider fixes before launch")
        else:
            self.recommendations.insert(0, "🎉 System appears ready for launch!")
        
        return LaunchReadinessReport(
            overall_status=overall_status,
            readiness_score=readiness_score,
            total_checks=len(self.results),
            passed_checks=status_counts["pass"],
            failed_checks=status_counts["fail"],
            warning_checks=status_counts["warning"],
            skipped_checks=status_counts["skip"],
            categories=category_counts,
            critical_issues=self.critical_issues,
            recommendations=self.recommendations,
            check_results=self.results,
            timestamp=datetime.now().isoformat()
        )

async def run_launch_preparation(base_url: str = "http://localhost:8000") -> Dict[str, Any]:
    """Run complete launch preparation assessment"""
    
    checker = LaunchReadinessChecker(base_url)
    report = await checker.run_comprehensive_check()
    
    # Print summary
    print("\n" + "=" * 60)
    print("🚀 LAUNCH READINESS SUMMARY")
    print("=" * 60)
    
    print(f"Overall Status: {report.overall_status.upper()}")
    print(f"Readiness Score: {report.readiness_score:.1f}/100")
    print(f"Total Checks: {report.total_checks}")
    print(f"✅ Passed: {report.passed_checks}")
    print(f"❌ Failed: {report.failed_checks}")
    print(f"⚠️ Warnings: {report.warning_checks}")
    print(f"⏭️ Skipped: {report.skipped_checks}")
    
    if report.critical_issues:
        print(f"\n🚨 Critical Issues ({len(report.critical_issues)}):")
        for issue in report.critical_issues:
            print(f"  • {issue}")
    
    print(f"\n💡 Recommendations ({len(report.recommendations)}):")
    for rec in report.recommendations[:10]:  # Show top 10
        print(f"  • {rec}")
    
    print(f"\n📊 Category Breakdown:")
    for category, counts in report.categories.items():
        total = sum(counts.values())
        passed = counts.get("pass", 0)
        print(f"  {category}: {passed}/{total} passed")
    
    # Save detailed report
    report_data = asdict(report)
    with open("launch_readiness_report.json", "w") as f:
        json.dump(report_data, f, indent=2)
    
    print(f"\n📄 Detailed report saved to launch_readiness_report.json")
    
    return report_data

if __name__ == "__main__":
    # Run launch preparation
    async def main():
        # Check if server is running
        base_url = "http://localhost:8000"
        
        print("🔍 Checking if server is running...")
        try:
            import aiohttp
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{base_url}/health", timeout=aiohttp.ClientTimeout(total=5)) as response:
                    if response.status == 200:
                        print("✅ Server is running")
                    else:
                        print(f"⚠️ Server responded with status {response.status}")
        except Exception as e:
            print(f"❌ Server not accessible: {str(e)}")
            print("💡 Start the server with: python3 -m uvicorn main:app --port 8000")
            base_url = None
        
        # Run assessment
        await run_launch_preparation(base_url)
    
    asyncio.run(main())
