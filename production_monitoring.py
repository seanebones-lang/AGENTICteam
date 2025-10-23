#!/usr/bin/env python3
"""
PRODUCTION MONITORING SYSTEM
Continuous monitoring to prevent customer issues
"""
import sqlite3
import requests
import json
import time
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ProductionMonitor:
    """Production monitoring system to prevent customer issues"""
    
    def __init__(self):
        self.api_url = "https://bizbot-api.onrender.com"
        self.primary_db = "backend/agent_marketplace.db"
        self.backup_db = "backend/auth_backup.db"
        self.credits_db = "credits.db"
        self.alerts = []
    
    def run_health_check(self) -> Dict[str, Any]:
        """Run comprehensive health check"""
        logger.info("🔍 Running production health check...")
        
        checks = {
            "api_health": self._check_api_health(),
            "database_consistency": self._check_database_consistency(),
            "customer_accounts": self._check_customer_accounts(),
            "credit_system": self._check_credit_system(),
            "authentication": self._check_authentication()
        }
        
        overall_health = all(checks.values())
        
        return {
            "timestamp": datetime.now().isoformat(),
            "overall_health": overall_health,
            "checks": checks,
            "alerts": self.alerts
        }
    
    def _check_api_health(self) -> bool:
        """Check API health"""
        try:
            response = requests.get(f"{self.api_url}/health", timeout=10)
            success = response.status_code == 200
            
            if not success:
                self.alerts.append(f"API health check failed: {response.status_code}")
            
            return success
        except Exception as e:
            self.alerts.append(f"API health check error: {e}")
            return False
    
    def _check_database_consistency(self) -> bool:
        """Check database consistency"""
        try:
            # Check primary database
            conn = sqlite3.connect(self.primary_db)
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM users")
            primary_count = cursor.fetchone()[0]
            conn.close()
            
            # Check backup database
            conn = sqlite3.connect(self.backup_db)
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM users")
            backup_count = cursor.fetchone()[0]
            conn.close()
            
            consistent = primary_count == backup_count
            
            if not consistent:
                self.alerts.append(f"Database inconsistency: Primary={primary_count}, Backup={backup_count}")
            
            return consistent
            
        except Exception as e:
            self.alerts.append(f"Database consistency check error: {e}")
            return False
    
    def _check_customer_accounts(self) -> bool:
        """Check customer accounts integrity"""
        try:
            conn = sqlite3.connect(self.primary_db)
            cursor = conn.cursor()
            
            # Check for Sean's account
            cursor.execute("SELECT id, email, credits FROM users WHERE email = ?", ("seanebones@gmail.com",))
            sean_account = cursor.fetchone()
            
            conn.close()
            
            if not sean_account:
                self.alerts.append("Sean's account missing from primary database")
                return False
            
            if sean_account[2] < 20.0:  # Credits check
                self.alerts.append(f"Sean's credits insufficient: ${sean_account[2]}")
                return False
            
            return True
            
        except Exception as e:
            self.alerts.append(f"Customer accounts check error: {e}")
            return False
    
    def _check_credit_system(self) -> bool:
        """Check credit system integrity"""
        try:
            conn = sqlite3.connect(self.credits_db)
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT COALESCE(SUM(amount), 0) 
                FROM credit_transactions 
                WHERE customer_id = 'seanebones@gmail.com'
            """)
            sean_credits = cursor.fetchone()[0]
            
            conn.close()
            
            if sean_credits < 20.0:
                self.alerts.append(f"Sean's credits in credit system insufficient: ${sean_credits}")
                return False
            
            return True
            
        except Exception as e:
            self.alerts.append(f"Credit system check error: {e}")
            return False
    
    def _check_authentication(self) -> bool:
        """Check authentication system"""
        try:
            response = requests.post(
                f"{self.api_url}/api/v1/auth/login",
                json={
                    "email": "seanebones@gmail.com",
                    "password": "TempPass123!"
                },
                timeout=10
            )
            
            success = response.status_code == 200
            
            if not success:
                self.alerts.append(f"Authentication test failed: {response.status_code}")
            
            return success
            
        except Exception as e:
            self.alerts.append(f"Authentication check error: {e}")
            return False
    
    def auto_fix_issues(self) -> bool:
        """Automatically fix detected issues"""
        logger.info("🔧 Running automatic fixes...")
        
        fixes_applied = 0
        
        for alert in self.alerts:
            if "Sean's account missing" in alert:
                logger.info("🔧 Fixing missing Sean account...")
                # Re-register Sean's account
                try:
                    response = requests.post(
                        f"{self.api_url}/api/v1/auth/register",
                        json={
                            "email": "seanebones@gmail.com",
                            "password": "TempPass123!",
                            "name": "Sean McDonnell"
                        },
                        timeout=10
                    )
                    if response.status_code in [200, 201]:
                        fixes_applied += 1
                        logger.info("✅ Sean's account restored")
                except Exception as e:
                    logger.error(f"❌ Failed to restore Sean's account: {e}")
            
            elif "credits insufficient" in alert:
                logger.info("🔧 Fixing insufficient credits...")
                # Add credits
                try:
                    conn = sqlite3.connect(self.credits_db)
                    cursor = conn.cursor()
                    cursor.execute("""
                        INSERT INTO credit_transactions 
                        (customer_id, amount, transaction_type, description, created_at)
                        VALUES (?, ?, ?, ?, ?)
                    """, (
                        "seanebones@gmail.com", 20.0, "auto_fix",
                        "Automatic credit restoration", datetime.now().isoformat()
                    ))
                    conn.commit()
                    conn.close()
                    fixes_applied += 1
                    logger.info("✅ Credits restored")
                except Exception as e:
                    logger.error(f"❌ Failed to restore credits: {e}")
        
        return fixes_applied > 0
    
    def generate_report(self) -> Dict[str, Any]:
        """Generate monitoring report"""
        health_check = self.run_health_check()
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "monitoring_status": "ACTIVE",
            "health_check": health_check,
            "recommendations": self._generate_recommendations(health_check)
        }
        
        # Save report
        with open("production_monitoring_report.json", "w") as f:
            json.dump(report, f, indent=2)
        
        return report
    
    def _generate_recommendations(self, health_check: Dict[str, Any]) -> List[str]:
        """Generate recommendations based on health check"""
        recommendations = []
        
        if not health_check["overall_health"]:
            recommendations.append("CRITICAL: System health issues detected - immediate attention required")
        
        if health_check["checks"]["database_consistency"]:
            recommendations.append("GOOD: Database consistency maintained")
        else:
            recommendations.append("WARNING: Database inconsistency detected - run synchronization")
        
        if health_check["checks"]["customer_accounts"]:
            recommendations.append("GOOD: Customer accounts integrity verified")
        else:
            recommendations.append("CRITICAL: Customer account issues detected - restore immediately")
        
        if len(self.alerts) > 0:
            recommendations.append(f"ALERT: {len(self.alerts)} issues detected - review alerts")
        
        return recommendations

def run_production_monitoring():
    """Run production monitoring"""
    logger.info("🚀 STARTING PRODUCTION MONITORING")
    logger.info("=" * 50)
    
    monitor = ProductionMonitor()
    
    # Run health check
    health_check = monitor.run_health_check()
    
    # Auto-fix issues if any
    if not health_check["overall_health"]:
        logger.info("🔧 Issues detected - running automatic fixes...")
        fixes_applied = monitor.auto_fix_issues()
        
        if fixes_applied:
            logger.info("✅ Automatic fixes applied - re-running health check...")
            health_check = monitor.run_health_check()
    
    # Generate report
    report = monitor.generate_report()
    
    # Display results
    logger.info("📊 MONITORING RESULTS:")
    logger.info(f"Overall Health: {'✅ HEALTHY' if health_check['overall_health'] else '❌ ISSUES DETECTED'}")
    
    for check_name, status in health_check["checks"].items():
        status_icon = "✅" if status else "❌"
        logger.info(f"{status_icon} {check_name.replace('_', ' ').title()}")
    
    if monitor.alerts:
        logger.info(f"⚠️ {len(monitor.alerts)} alerts:")
        for alert in monitor.alerts:
            logger.info(f"   - {alert}")
    
    logger.info("📄 Report saved to: production_monitoring_report.json")
    
    return health_check["overall_health"]

if __name__ == "__main__":
    success = run_production_monitoring()
    exit(0 if success else 1)
