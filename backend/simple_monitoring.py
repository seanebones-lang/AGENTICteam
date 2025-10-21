#!/usr/bin/env python3
"""
Simple Monitoring System for Agent Marketplace
Basic monitoring without complex dependencies
"""

import time
import logging
import asyncio
import json
from datetime import datetime
from typing import Dict, Any, List
from collections import defaultdict, deque
import threading

logger = logging.getLogger(__name__)

class SimpleMetrics:
    """Simple metrics collector"""
    
    def __init__(self):
        self.counters = defaultdict(float)
        self.gauges = defaultdict(float)
        self.histograms = defaultdict(lambda: deque(maxlen=100))
        self.lock = threading.Lock()
    
    def increment_counter(self, name: str, value: float = 1.0, labels: Dict[str, str] = None):
        """Increment a counter"""
        with self.lock:
            key = f"{name}:{json.dumps(labels or {}, sort_keys=True)}"
            self.counters[key] += value
    
    def set_gauge(self, name: str, value: float, labels: Dict[str, str] = None):
        """Set a gauge value"""
        with self.lock:
            key = f"{name}:{json.dumps(labels or {}, sort_keys=True)}"
            self.gauges[key] = value
    
    def observe_histogram(self, name: str, value: float, labels: Dict[str, str] = None):
        """Observe a histogram value"""
        with self.lock:
            key = f"{name}:{json.dumps(labels or {}, sort_keys=True)}"
            self.histograms[key].append(value)
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get all metrics"""
        with self.lock:
            return {
                "counters": dict(self.counters),
                "gauges": dict(self.gauges),
                "histograms": {k: list(v) for k, v in self.histograms.items()},
                "timestamp": datetime.now().isoformat()
            }

class SimpleHealthChecker:
    """Simple health checker"""
    
    def __init__(self):
        self.checks = {}
        self.results = {}
    
    def register_check(self, name: str, check_func):
        """Register a health check"""
        self.checks[name] = check_func
    
    async def run_all_checks(self) -> Dict[str, Any]:
        """Run all health checks"""
        results = {}
        
        for name, check_func in self.checks.items():
            start_time = time.time()
            try:
                if asyncio.iscoroutinefunction(check_func):
                    result = await check_func()
                else:
                    result = check_func()
                
                duration_ms = (time.time() - start_time) * 1000
                
                if isinstance(result, dict):
                    status = result.get("status", "healthy")
                    message = result.get("message", "OK")
                else:
                    status = "healthy" if result else "unhealthy"
                    message = "OK" if result else "Check failed"
                
                results[name] = {
                    "status": status,
                    "message": message,
                    "duration_ms": duration_ms,
                    "timestamp": datetime.now().isoformat()
                }
                
            except Exception as e:
                duration_ms = (time.time() - start_time) * 1000
                results[name] = {
                    "status": "unhealthy",
                    "message": f"Check failed: {str(e)}",
                    "duration_ms": duration_ms,
                    "timestamp": datetime.now().isoformat()
                }
        
        return results

class SimpleMonitor:
    """Simple monitoring system"""
    
    def __init__(self):
        self.metrics = SimpleMetrics()
        self.health_checker = SimpleHealthChecker()
        self.start_time = time.time()
        self._monitoring_active = False
        self._monitoring_task = None
        
        # Register default health checks
        self._register_default_checks()
    
    def _register_default_checks(self):
        """Register default health checks"""
        
        def check_basic():
            """Basic health check"""
            return {"status": "healthy", "message": "System operational"}
        
        def check_memory():
            """Memory check"""
            try:
                import psutil
                memory = psutil.virtual_memory()
                
                if memory.percent > 90:
                    return {"status": "unhealthy", "message": f"High memory usage: {memory.percent:.1f}%"}
                elif memory.percent > 80:
                    return {"status": "degraded", "message": f"Memory usage warning: {memory.percent:.1f}%"}
                else:
                    return {"status": "healthy", "message": f"Memory usage OK: {memory.percent:.1f}%"}
            except ImportError:
                return {"status": "healthy", "message": "Memory check unavailable (psutil not installed)"}
            except Exception as e:
                return {"status": "unhealthy", "message": f"Memory check error: {str(e)}"}
        
        self.health_checker.register_check("basic", check_basic)
        self.health_checker.register_check("memory", check_memory)
    
    async def start_monitoring(self, interval: int = 30):
        """Start monitoring"""
        if self._monitoring_active:
            return
        
        self._monitoring_active = True
        logger.info(f"Starting simple monitoring with {interval}s interval")
        
        async def monitoring_loop():
            while self._monitoring_active:
                try:
                    # Update system metrics
                    try:
                        import psutil
                        self.metrics.set_gauge("system_cpu_percent", psutil.cpu_percent())
                        self.metrics.set_gauge("system_memory_percent", psutil.virtual_memory().percent)
                    except ImportError:
                        pass  # psutil not available
                    
                    await asyncio.sleep(interval)
                except Exception as e:
                    logger.error(f"Monitoring loop error: {str(e)}")
                    await asyncio.sleep(interval)
        
        self._monitoring_task = asyncio.create_task(monitoring_loop())
    
    def stop_monitoring(self):
        """Stop monitoring"""
        self._monitoring_active = False
        if self._monitoring_task:
            self._monitoring_task.cancel()
        logger.info("Simple monitoring stopped")
    
    async def get_health_status(self) -> Dict[str, Any]:
        """Get health status"""
        checks = await self.health_checker.run_all_checks()
        
        # Determine overall status
        statuses = [check["status"] for check in checks.values()]
        if all(status == "healthy" for status in statuses):
            overall_status = "healthy"
        elif any(status == "unhealthy" for status in statuses):
            overall_status = "unhealthy"
        else:
            overall_status = "degraded"
        
        return {
            "status": overall_status,
            "timestamp": datetime.now().isoformat(),
            "checks": checks,
            "uptime_seconds": time.time() - self.start_time
        }
    
    def get_metrics_summary(self) -> Dict[str, Any]:
        """Get metrics summary"""
        app_metrics = self.metrics.get_metrics()
        
        # Add system metrics if available
        system_metrics = {}
        try:
            import psutil
            system_metrics = {
                "cpu_percent": psutil.cpu_percent(),
                "memory_percent": psutil.virtual_memory().percent,
                "timestamp": datetime.now().isoformat()
            }
        except ImportError:
            system_metrics = {
                "cpu_percent": 0,
                "memory_percent": 0,
                "timestamp": datetime.now().isoformat(),
                "note": "psutil not available"
            }
        
        return {
            "timestamp": datetime.now().isoformat(),
            "application_metrics": app_metrics,
            "system_metrics": system_metrics
        }
    
    def record_request(self, method: str, endpoint: str, status_code: int, duration: float):
        """Record HTTP request"""
        labels = {"method": method, "endpoint": endpoint, "status": str(status_code)}
        self.metrics.increment_counter("requests_total", labels=labels)
        self.metrics.observe_histogram("request_duration", duration, 
                                     {"method": method, "endpoint": endpoint})
    
    def record_agent_execution(self, agent_id: str, success: bool, duration: float, cost: float = 0.0):
        """Record agent execution"""
        status = "success" if success else "failure"
        self.metrics.increment_counter("agent_executions_total", 
                                     labels={"agent_id": agent_id, "status": status})
        self.metrics.observe_histogram("agent_execution_duration", duration, {"agent_id": agent_id})
        
        if cost > 0:
            self.metrics.observe_histogram("agent_execution_cost", cost, {"agent_id": agent_id})
    
    def record_credit_usage(self, user_tier: str, amount: float):
        """Record credit usage"""
        self.metrics.increment_counter("credits_used_total", amount, {"user_tier": user_tier})
    
    def record_rate_limit_hit(self, limit_type: str, user_tier: str):
        """Record rate limit hit"""
        self.metrics.increment_counter("rate_limit_hits_total", 
                                     labels={"limit_type": limit_type, "user_tier": user_tier})

# Global monitor instance
monitor = SimpleMonitor()

# Convenience functions
def record_request(method: str, endpoint: str, status_code: int, duration: float):
    """Record HTTP request"""
    monitor.record_request(method, endpoint, status_code, duration)

def record_agent_execution(agent_id: str, success: bool, duration: float, cost: float = 0.0):
    """Record agent execution"""
    monitor.record_agent_execution(agent_id, success, duration, cost)

def record_credit_usage(user_tier: str, amount: float):
    """Record credit usage"""
    monitor.record_credit_usage(user_tier, amount)

def record_rate_limit_hit(limit_type: str, user_tier: str):
    """Record rate limit hit"""
    monitor.record_rate_limit_hit(limit_type, user_tier)

if __name__ == "__main__":
    # Test the simple monitoring system
    async def test_monitoring():
        print("🔍 Testing simple monitoring system...")
        
        # Start monitoring
        await monitor.start_monitoring(interval=1)
        
        # Wait a bit
        await asyncio.sleep(2)
        
        # Get health status
        health = await monitor.get_health_status()
        print(f"Health status: {health['status']}")
        print(f"Checks: {len(health['checks'])}")
        
        # Record some test metrics
        monitor.record_request("GET", "/api/v1/packages", 200, 0.1)
        monitor.record_agent_execution("security-scanner", True, 1.5, 0.05)
        
        # Get metrics
        metrics = monitor.get_metrics_summary()
        print(f"Metrics collected: {len(metrics['application_metrics']['counters'])} counters")
        
        # Stop monitoring
        monitor.stop_monitoring()
        
        print("✅ Simple monitoring system test completed")
    
    asyncio.run(test_monitoring())
