#!/usr/bin/env python3
"""
Simple Launch Preparation Check for Agent Marketplace
Basic readiness assessment without external dependencies
"""

import os
import sys
import json
import subprocess
from datetime import datetime
from typing import Dict, List, Any

class SimpleLaunchChecker:
    """Simple launch readiness checker"""
    
    def __init__(self):
        self.results = []
        self.critical_issues = []
        self.recommendations = []
    
    def run_comprehensive_check(self) -> Dict[str, Any]:
        """Run comprehensive launch readiness assessment"""
        print("🚀 Starting Simple Launch Readiness Assessment")
        print("=" * 60)
        
        # Run all check categories
        self._check_system_requirements()
        self._check_environment_configuration()
        self._check_security_configuration()
        self._check_file_structure()
        self._check_documentation()
        
        # Generate report
        return self._generate_report()
    
    def _check_system_requirements(self):
        """Check system requirements"""
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
        
        # Check required modules
        required_modules = [
            "fastapi", "uvicorn", "pydantic", "sqlite3", "json", "datetime", "logging"
        ]
        
        for module in required_modules:
            try:
                __import__(module)
                self._add_result(f"Module: {module}", "System", "pass", "Available")
            except ImportError:
                if module in ["sqlite3", "json", "datetime", "logging"]:
                    self._add_result(f"Module: {module}", "System", "fail", "Missing (standard library)")
                    self.critical_issues.append(f"Missing standard library module: {module}")
                else:
                    self._add_result(f"Module: {module}", "System", "warning", "Not installed")
                    self.recommendations.append(f"Install {module}: pip install {module}")
        
        # Check disk space
        try:
            import shutil
            total, used, free = shutil.disk_usage(".")
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
            self._add_result("Disk Space", "System", "warning", f"Check failed: {str(e)}")
    
    def _check_environment_configuration(self):
        """Check environment configuration"""
        print("\n⚙️  Checking Environment Configuration...")
        
        # Check critical environment variables
        critical_vars = {
            "SECRET_KEY": "Application secret key",
            "DATABASE_URL": "Database connection string",
            "ANTHROPIC_API_KEY": "Anthropic API key for AI agents"
        }
        
        for var, description in critical_vars.items():
            value = os.getenv(var, "")
            if value:
                if var == "SECRET_KEY" and len(value) >= 32:
                    self._add_result(f"Environment: {var}", "Configuration", "pass", "Configured")
                elif var == "DATABASE_URL" and value.startswith(("sqlite://", "postgresql://", "mysql://")):
                    self._add_result(f"Environment: {var}", "Configuration", "pass", "Valid database URL")
                elif var == "ANTHROPIC_API_KEY" and len(value) > 20:
                    self._add_result(f"Environment: {var}", "Configuration", "pass", "Configured")
                else:
                    self._add_result(f"Environment: {var}", "Configuration", "warning", "May be invalid")
            else:
                self._add_result(f"Environment: {var}", "Configuration", "fail", "Not set")
                self.critical_issues.append(f"{var} not configured")
        
        # Check optional environment variables
        optional_vars = {
            "STRIPE_SECRET_KEY": "Payment processing",
            "REDIS_URL": "Caching and rate limiting",
            "CORS_ORIGINS": "Cross-origin configuration",
            "LOG_LEVEL": "Logging configuration"
        }
        
        for var, description in optional_vars.items():
            value = os.getenv(var, "")
            if value:
                self._add_result(f"Optional: {var}", "Configuration", "pass", "Configured")
            else:
                self._add_result(f"Optional: {var}", "Configuration", "warning", "Not configured")
                self.recommendations.append(f"Consider configuring {var} for {description}")
        
        # Check debug mode
        debug_mode = os.getenv("DEBUG", "false").lower()
        if debug_mode == "false":
            self._add_result("Debug Mode", "Configuration", "pass", "Disabled")
        else:
            self._add_result("Debug Mode", "Configuration", "fail", "Enabled (security risk)")
            self.critical_issues.append("Debug mode enabled in production")
    
    def _check_security_configuration(self):
        """Check security configuration"""
        print("\n🔒 Checking Security Configuration...")
        
        # Check secret key strength
        secret_key = os.getenv("SECRET_KEY", "")
        if secret_key:
            if len(secret_key) >= 32:
                self._add_result("Secret Key Length", "Security", "pass", f"{len(secret_key)} characters")
            else:
                self._add_result("Secret Key Length", "Security", "warning", 
                               f"{len(secret_key)} characters (should be 32+)")
                self.recommendations.append("Use a longer secret key (32+ characters)")
        
        # Check CORS configuration
        cors_origins = os.getenv("CORS_ORIGINS", "*")
        if cors_origins == "*":
            self._add_result("CORS Configuration", "Security", "warning", 
                           "Allows all origins (not recommended for production)")
            self.recommendations.append("Configure specific CORS origins")
        else:
            self._add_result("CORS Configuration", "Security", "pass", "Configured with specific origins")
        
        # Check for common security files
        security_files = [".env", "requirements.txt"]
        for filename in security_files:
            if os.path.exists(filename):
                # Check file permissions
                try:
                    import stat
                    file_stat = os.stat(filename)
                    file_mode = stat.filemode(file_stat.st_mode)
                    
                    if filename == ".env":
                        # .env should not be world-readable
                        if file_stat.st_mode & 0o044:  # Check if group or others can read
                            self._add_result(f"File Permissions: {filename}", "Security", "warning", 
                                           f"Too permissive: {file_mode}")
                            self.recommendations.append(f"Restrict permissions on {filename}: chmod 600 {filename}")
                        else:
                            self._add_result(f"File Permissions: {filename}", "Security", "pass", 
                                           f"Secure: {file_mode}")
                    else:
                        self._add_result(f"File Exists: {filename}", "Security", "pass", "Present")
                except Exception as e:
                    self._add_result(f"File Check: {filename}", "Security", "warning", f"Check failed: {str(e)}")
            else:
                if filename == ".env":
                    self._add_result(f"File: {filename}", "Security", "warning", "Not found (using system env vars?)")
                else:
                    self._add_result(f"File: {filename}", "Security", "fail", "Missing")
    
    def _check_file_structure(self):
        """Check file structure and required files"""
        print("\n📁 Checking File Structure...")
        
        # Check for main application files
        required_files = {
            "main.py": "Main application file",
            "database_setup.py": "Database setup",
            "simple_config.py": "Configuration management",
            "simple_monitoring.py": "Monitoring system"
        }
        
        for filename, description in required_files.items():
            if os.path.exists(filename):
                self._add_result(f"File: {filename}", "Structure", "pass", "Present")
            else:
                self._add_result(f"File: {filename}", "Structure", "fail", "Missing")
                self.critical_issues.append(f"Missing required file: {filename}")
        
        # Check for agent files
        agents_dir = "agents/packages"
        if os.path.exists(agents_dir):
            agent_files = [f for f in os.listdir(agents_dir) if f.endswith('.py') and f != '__init__.py']
            if len(agent_files) >= 10:
                self._add_result("Agent Files", "Structure", "pass", f"{len(agent_files)} agent files")
            else:
                self._add_result("Agent Files", "Structure", "warning", f"Only {len(agent_files)} agent files")
                self.recommendations.append("Ensure all 10 agents are implemented")
        else:
            self._add_result("Agents Directory", "Structure", "fail", "Missing")
            self.critical_issues.append("Agents directory not found")
        
        # Check for test files
        tests_dir = "tests"
        if os.path.exists(tests_dir):
            test_files = [f for f in os.listdir(tests_dir) if f.startswith('test_') and f.endswith('.py')]
            if len(test_files) >= 3:
                self._add_result("Test Files", "Structure", "pass", f"{len(test_files)} test files")
            else:
                self._add_result("Test Files", "Structure", "warning", f"Only {len(test_files)} test files")
        else:
            self._add_result("Tests Directory", "Structure", "warning", "Missing")
            self.recommendations.append("Create comprehensive test suite")
    
    def _check_documentation(self):
        """Check documentation completeness"""
        print("\n📚 Checking Documentation...")
        
        # Check for key documentation files
        doc_files = {
            "../README.md": "Project overview and setup",
            "../API_DOCUMENTATION.md": "API documentation", 
            "../DEPLOYMENT_GUIDE.md": "Deployment instructions"
        }
        
        for filename, description in doc_files.items():
            if os.path.exists(filename):
                # Check if file has content
                try:
                    with open(filename, 'r') as f:
                        content = f.read().strip()
                        if len(content) > 100:
                            self._add_result(f"Documentation: {os.path.basename(filename)}", "Documentation", "pass", "Complete")
                        else:
                            self._add_result(f"Documentation: {os.path.basename(filename)}", "Documentation", "warning", "Minimal content")
                except Exception as e:
                    self._add_result(f"Documentation: {os.path.basename(filename)}", "Documentation", "warning", f"Read error: {str(e)}")
            else:
                self._add_result(f"Documentation: {os.path.basename(filename)}", "Documentation", "warning", "Missing")
                self.recommendations.append(f"Create {description}")
        
        # Check for environment template
        env_templates = [".env.example", "env.template", "../env.template"]
        template_found = any(os.path.exists(template) for template in env_templates)
        
        if template_found:
            self._add_result("Environment Template", "Documentation", "pass", "Available")
        else:
            self._add_result("Environment Template", "Documentation", "warning", "Missing")
            self.recommendations.append("Create environment variable template")
    
    def _add_result(self, name: str, category: str, status: str, message: str):
        """Add a check result"""
        result = {
            "name": name,
            "category": category,
            "status": status,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        self.results.append(result)
        
        # Print result
        status_emoji = {
            "pass": "✅",
            "fail": "❌", 
            "warning": "⚠️",
            "skip": "⏭️"
        }
        print(f"  {status_emoji.get(status, '❓')} {name}: {message}")
    
    def _generate_report(self) -> Dict[str, Any]:
        """Generate launch readiness report"""
        
        # Count results by status
        status_counts = {"pass": 0, "fail": 0, "warning": 0, "skip": 0}
        category_counts = {}
        
        for result in self.results:
            status_counts[result["status"]] += 1
            
            category = result["category"]
            if category not in category_counts:
                category_counts[category] = {"pass": 0, "fail": 0, "warning": 0, "skip": 0}
            category_counts[category][result["status"]] += 1
        
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
        
        return {
            "overall_status": overall_status,
            "readiness_score": readiness_score,
            "total_checks": len(self.results),
            "passed_checks": status_counts["pass"],
            "failed_checks": status_counts["fail"],
            "warning_checks": status_counts["warning"],
            "skipped_checks": status_counts["skip"],
            "categories": category_counts,
            "critical_issues": self.critical_issues,
            "recommendations": self.recommendations,
            "check_results": self.results,
            "timestamp": datetime.now().isoformat()
        }

def run_simple_launch_check() -> Dict[str, Any]:
    """Run simple launch preparation assessment"""
    
    checker = SimpleLaunchChecker()
    report = checker.run_comprehensive_check()
    
    # Print summary
    print("\n" + "=" * 60)
    print("🚀 LAUNCH READINESS SUMMARY")
    print("=" * 60)
    
    print(f"Overall Status: {report['overall_status'].upper()}")
    print(f"Readiness Score: {report['readiness_score']:.1f}/100")
    print(f"Total Checks: {report['total_checks']}")
    print(f"✅ Passed: {report['passed_checks']}")
    print(f"❌ Failed: {report['failed_checks']}")
    print(f"⚠️ Warnings: {report['warning_checks']}")
    print(f"⏭️ Skipped: {report['skipped_checks']}")
    
    if report['critical_issues']:
        print(f"\n🚨 Critical Issues ({len(report['critical_issues'])}):")
        for issue in report['critical_issues']:
            print(f"  • {issue}")
    
    print(f"\n💡 Recommendations ({len(report['recommendations'])}):")
    for rec in report['recommendations'][:10]:  # Show top 10
        print(f"  • {rec}")
    
    print(f"\n📊 Category Breakdown:")
    for category, counts in report['categories'].items():
        total = sum(counts.values())
        passed = counts.get("pass", 0)
        print(f"  {category}: {passed}/{total} passed")
    
    # Save detailed report
    with open("simple_launch_readiness_report.json", "w") as f:
        json.dump(report, f, indent=2)
    
    print(f"\n📄 Detailed report saved to simple_launch_readiness_report.json")
    
    return report

if __name__ == "__main__":
    run_simple_launch_check()
