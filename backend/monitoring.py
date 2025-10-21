#!/usr/bin/env python3
"""
Monitoring and Observability System for Agent Marketplace
Comprehensive monitoring, metrics, logging, and health checks
"""

import time
import psutil
import logging
import asyncio
import json
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional, Callable
from dataclasses import dataclass, asdict
from enum import Enum
from collections import defaultdict, deque
import threading
from contextlib import contextmanager

# Prometheus metrics (optional dependency)
try:
    from prometheus_client import Counter, Histogram, Gauge, Info, generate_latest, CONTENT_TYPE_LATEST
    PROMETHEUS_AVAILABLE = True
except ImportError:
    PROMETHEUS_AVAILABLE = False

class HealthStatus(str, Enum):
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"

class MetricType(str, Enum):
    COUNTER = "counter"
    GAUGE = "gauge"
    HISTOGRAM = "histogram"
    SUMMARY = "summary"

@dataclass
class HealthCheck:
    """Health check result"""
    name: str
    status: HealthStatus
    message: str
    timestamp: str
    duration_ms: float
    details: Dict[str, Any] = None

@dataclass
class MetricPoint:
    """Metric data point"""
    name: str
    value: float
    labels: Dict[str, str]
    timestamp: str
    metric_type: MetricType

@dataclass
class SystemMetrics:
    """System resource metrics"""
    cpu_percent: float
    memory_percent: float
    memory_used_mb: float
    memory_available_mb: float
    disk_percent: float
    disk_used_gb: float
    disk_free_gb: float
    network_bytes_sent: int
    network_bytes_recv: int
    active_connections: int
    timestamp: str

class MetricsCollector:
    """Collects and stores application metrics"""
    
    def __init__(self):
        self.metrics: Dict[str, List[MetricPoint]] = defaultdict(list)
        self.counters: Dict[str, float] = defaultdict(float)
        self.gauges: Dict[str, float] = defaultdict(float)
        self.histograms: Dict[str, deque] = defaultdict(lambda: deque(maxlen=1000))
        self.lock = threading.Lock()
        
        # Prometheus metrics if available
        if PROMETHEUS_AVAILABLE:
            self.prom_counters = {}
            self.prom_gauges = {}
            self.prom_histograms = {}
            self._init_prometheus_metrics()
    
    def _init_prometheus_metrics(self):
        """Initialize Prometheus metrics"""
        if not PROMETHEUS_AVAILABLE:
            return
        
        # Application metrics
        self.prom_counters['requests_total'] = Counter(
            'agent_marketplace_requests_total',
            'Total number of requests',
            ['method', 'endpoint', 'status']
        )
        
        self.prom_counters['agent_executions_total'] = Counter(
            'agent_marketplace_executions_total',
            'Total number of agent executions',
            ['agent_id', 'status']
        )
        
        self.prom_histograms['request_duration'] = Histogram(
            'agent_marketplace_request_duration_seconds',
            'Request duration in seconds',
            ['method', 'endpoint']
        )
        
        self.prom_histograms['agent_execution_duration'] = Histogram(
            'agent_marketplace_agent_execution_duration_seconds',
            'Agent execution duration in seconds',
            ['agent_id']
        )
        
        self.prom_gauges['active_users'] = Gauge(
            'agent_marketplace_active_users',
            'Number of active users'
        )
        
        self.prom_gauges['system_cpu_percent'] = Gauge(
            'agent_marketplace_system_cpu_percent',
            'System CPU usage percentage'
        )
        
        self.prom_gauges['system_memory_percent'] = Gauge(
            'agent_marketplace_system_memory_percent',
            'System memory usage percentage'
        )
        
        self.prom_counters['credits_used_total'] = Counter(
            'agent_marketplace_credits_used_total',
            'Total credits used',
            ['user_tier']
        )
        
        self.prom_counters['rate_limit_hits_total'] = Counter(
            'agent_marketplace_rate_limit_hits_total',
            'Total rate limit hits',
            ['limit_type', 'user_tier']
        )
    
    def increment_counter(self, name: str, value: float = 1.0, labels: Dict[str, str] = None):
        """Increment a counter metric"""
        with self.lock:
            key = f"{name}:{json.dumps(labels or {}, sort_keys=True)}"
            self.counters[key] += value
            
            # Store metric point
            self.metrics[name].append(MetricPoint(
                name=name,
                value=value,
                labels=labels or {},
                timestamp=datetime.now().isoformat(),
                metric_type=MetricType.COUNTER
            ))
            
            # Update Prometheus if available
            if PROMETHEUS_AVAILABLE and name in self.prom_counters:
                if labels:
                    self.prom_counters[name].labels(**labels).inc(value)
                else:
                    self.prom_counters[name].inc(value)
    
    def set_gauge(self, name: str, value: float, labels: Dict[str, str] = None):
        """Set a gauge metric"""
        with self.lock:
            key = f"{name}:{json.dumps(labels or {}, sort_keys=True)}"
            self.gauges[key] = value
            
            # Store metric point
            self.metrics[name].append(MetricPoint(
                name=name,
                value=value,
                labels=labels or {},
                timestamp=datetime.now().isoformat(),
                metric_type=MetricType.GAUGE
            ))
            
            # Update Prometheus if available
            if PROMETHEUS_AVAILABLE and name in self.prom_gauges:
                if labels:
                    self.prom_gauges[name].labels(**labels).set(value)
                else:
                    self.prom_gauges[name].set(value)
    
    def observe_histogram(self, name: str, value: float, labels: Dict[str, str] = None):
        """Observe a histogram metric"""
        with self.lock:
            key = f"{name}:{json.dumps(labels or {}, sort_keys=True)}"
            self.histograms[key].append(value)
            
            # Store metric point
            self.metrics[name].append(MetricPoint(
                name=name,
                value=value,
                labels=labels or {},
                timestamp=datetime.now().isoformat(),
                metric_type=MetricType.HISTOGRAM
            ))
            
            # Update Prometheus if available
            if PROMETHEUS_AVAILABLE and name in self.prom_histograms:
                if labels:
                    self.prom_histograms[name].labels(**labels).observe(value)
                else:
                    self.prom_histograms[name].observe(value)
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get all collected metrics"""
        with self.lock:
            return {
                "counters": dict(self.counters),
                "gauges": dict(self.gauges),
                "histograms": {k: list(v) for k, v in self.histograms.items()},
                "timestamp": datetime.now().isoformat()
            }
    
    def get_prometheus_metrics(self) -> str:
        """Get Prometheus-formatted metrics"""
        if not PROMETHEUS_AVAILABLE:
            return "# Prometheus not available\n"
        
        return generate_latest()

class HealthChecker:
    """Performs health checks on system components"""
    
    def __init__(self):
        self.checks: Dict[str, Callable] = {}
        self.results: Dict[str, HealthCheck] = {}
        self.lock = threading.Lock()
    
    def register_check(self, name: str, check_func: Callable):
        """Register a health check function"""
        self.checks[name] = check_func
    
    async def run_check(self, name: str) -> HealthCheck:
        """Run a specific health check"""
        if name not in self.checks:
            return HealthCheck(
                name=name,
                status=HealthStatus.UNHEALTHY,
                message="Check not found",
                timestamp=datetime.now().isoformat(),
                duration_ms=0
            )
        
        start_time = time.time()
        try:
            check_func = self.checks[name]
            if asyncio.iscoroutinefunction(check_func):
                result = await check_func()
            else:
                result = check_func()
            
            duration_ms = (time.time() - start_time) * 1000
            
            if isinstance(result, dict):
                health_check = HealthCheck(
                    name=name,
                    status=HealthStatus(result.get("status", "healthy")),
                    message=result.get("message", "OK"),
                    timestamp=datetime.now().isoformat(),
                    duration_ms=duration_ms,
                    details=result.get("details")
                )
            else:
                health_check = HealthCheck(
                    name=name,
                    status=HealthStatus.HEALTHY if result else HealthStatus.UNHEALTHY,
                    message="OK" if result else "Check failed",
                    timestamp=datetime.now().isoformat(),
                    duration_ms=duration_ms
                )
            
            with self.lock:
                self.results[name] = health_check
            
            return health_check
            
        except Exception as e:
            duration_ms = (time.time() - start_time) * 1000
            health_check = HealthCheck(
                name=name,
                status=HealthStatus.UNHEALTHY,
                message=f"Check failed: {str(e)}",
                timestamp=datetime.now().isoformat(),
                duration_ms=duration_ms
            )
            
            with self.lock:
                self.results[name] = health_check
            
            return health_check
    
    async def run_all_checks(self) -> Dict[str, HealthCheck]:
        """Run all registered health checks"""
        tasks = []
        for name in self.checks:
            tasks.append(self.run_check(name))
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        health_results = {}
        for i, result in enumerate(results):
            name = list(self.checks.keys())[i]
            if isinstance(result, Exception):
                health_results[name] = HealthCheck(
                    name=name,
                    status=HealthStatus.UNHEALTHY,
                    message=f"Check error: {str(result)}",
                    timestamp=datetime.now().isoformat(),
                    duration_ms=0
                )
            else:
                health_results[name] = result
        
        return health_results
    
    def get_overall_status(self) -> HealthStatus:
        """Get overall system health status"""
        with self.lock:
            if not self.results:
                return HealthStatus.UNHEALTHY
            
            statuses = [check.status for check in self.results.values()]
            
            if all(status == HealthStatus.HEALTHY for status in statuses):
                return HealthStatus.HEALTHY
            elif any(status == HealthStatus.UNHEALTHY for status in statuses):
                return HealthStatus.UNHEALTHY
            else:
                return HealthStatus.DEGRADED

class SystemMonitor:
    """Monitors system resources and performance"""
    
    def __init__(self):
        self.metrics_collector = MetricsCollector()
        self.health_checker = HealthChecker()
        self.logger = logging.getLogger(__name__)
        self._register_default_health_checks()
        self._monitoring_active = False
        self._monitoring_task = None
    
    def _register_default_health_checks(self):
        """Register default health checks"""
        
        def check_database():
            """Check database connectivity"""
            try:
                # This would check actual database connection
                # For now, simulate a check
                return {
                    "status": "healthy",
                    "message": "Database connection OK",
                    "details": {"connection_pool": "active"}
                }
            except Exception as e:
                return {
                    "status": "unhealthy",
                    "message": f"Database error: {str(e)}"
                }
        
        def check_redis():
            """Check Redis connectivity"""
            try:
                # This would check actual Redis connection
                return {
                    "status": "healthy",
                    "message": "Redis connection OK",
                    "details": {"ping": "pong"}
                }
            except Exception as e:
                return {
                    "status": "unhealthy",
                    "message": f"Redis error: {str(e)}"
                }
        
        def check_disk_space():
            """Check disk space"""
            try:
                disk_usage = psutil.disk_usage('/')
                free_percent = (disk_usage.free / disk_usage.total) * 100
                
                if free_percent < 10:
                    status = "unhealthy"
                    message = f"Low disk space: {free_percent:.1f}% free"
                elif free_percent < 20:
                    status = "degraded"
                    message = f"Disk space warning: {free_percent:.1f}% free"
                else:
                    status = "healthy"
                    message = f"Disk space OK: {free_percent:.1f}% free"
                
                return {
                    "status": status,
                    "message": message,
                    "details": {
                        "total_gb": round(disk_usage.total / (1024**3), 2),
                        "used_gb": round(disk_usage.used / (1024**3), 2),
                        "free_gb": round(disk_usage.free / (1024**3), 2),
                        "free_percent": round(free_percent, 1)
                    }
                }
            except Exception as e:
                return {
                    "status": "unhealthy",
                    "message": f"Disk check error: {str(e)}"
                }
        
        def check_memory():
            """Check memory usage"""
            try:
                memory = psutil.virtual_memory()
                
                if memory.percent > 90:
                    status = "unhealthy"
                    message = f"High memory usage: {memory.percent:.1f}%"
                elif memory.percent > 80:
                    status = "degraded"
                    message = f"Memory usage warning: {memory.percent:.1f}%"
                else:
                    status = "healthy"
                    message = f"Memory usage OK: {memory.percent:.1f}%"
                
                return {
                    "status": status,
                    "message": message,
                    "details": {
                        "total_mb": round(memory.total / (1024**2), 2),
                        "used_mb": round(memory.used / (1024**2), 2),
                        "available_mb": round(memory.available / (1024**2), 2),
                        "percent": round(memory.percent, 1)
                    }
                }
            except Exception as e:
                return {
                    "status": "unhealthy",
                    "message": f"Memory check error: {str(e)}"
                }
        
        # Register checks
        self.health_checker.register_check("database", check_database)
        self.health_checker.register_check("redis", check_redis)
        self.health_checker.register_check("disk_space", check_disk_space)
        self.health_checker.register_check("memory", check_memory)
    
    def collect_system_metrics(self) -> SystemMetrics:
        """Collect current system metrics"""
        try:
            # CPU metrics
            cpu_percent = psutil.cpu_percent(interval=1)
            
            # Memory metrics
            memory = psutil.virtual_memory()
            
            # Disk metrics
            disk = psutil.disk_usage('/')
            
            # Network metrics
            network = psutil.net_io_counters()
            
            # Connection count (approximate)
            connections = len(psutil.net_connections())
            
            metrics = SystemMetrics(
                cpu_percent=cpu_percent,
                memory_percent=memory.percent,
                memory_used_mb=memory.used / (1024**2),
                memory_available_mb=memory.available / (1024**2),
                disk_percent=(disk.used / disk.total) * 100,
                disk_used_gb=disk.used / (1024**3),
                disk_free_gb=disk.free / (1024**3),
                network_bytes_sent=network.bytes_sent,
                network_bytes_recv=network.bytes_recv,
                active_connections=connections,
                timestamp=datetime.now().isoformat()
            )
            
            # Update metrics collector
            self.metrics_collector.set_gauge("system_cpu_percent", cpu_percent)
            self.metrics_collector.set_gauge("system_memory_percent", memory.percent)
            self.metrics_collector.set_gauge("system_disk_percent", metrics.disk_percent)
            self.metrics_collector.set_gauge("system_active_connections", connections)
            
            return metrics
            
        except Exception as e:
            self.logger.error(f"Error collecting system metrics: {str(e)}")
            return SystemMetrics(
                cpu_percent=0, memory_percent=0, memory_used_mb=0,
                memory_available_mb=0, disk_percent=0, disk_used_gb=0,
                disk_free_gb=0, network_bytes_sent=0, network_bytes_recv=0,
                active_connections=0, timestamp=datetime.now().isoformat()
            )
    
    async def start_monitoring(self, interval: int = 30):
        """Start continuous monitoring"""
        if self._monitoring_active:
            return
        
        self._monitoring_active = True
        self.logger.info(f"Starting system monitoring with {interval}s interval")
        
        async def monitoring_loop():
            while self._monitoring_active:
                try:
                    # Collect system metrics
                    self.collect_system_metrics()
                    
                    # Run health checks
                    await self.health_checker.run_all_checks()
                    
                    await asyncio.sleep(interval)
                    
                except Exception as e:
                    self.logger.error(f"Monitoring loop error: {str(e)}")
                    await asyncio.sleep(interval)
        
        self._monitoring_task = asyncio.create_task(monitoring_loop())
    
    def stop_monitoring(self):
        """Stop continuous monitoring"""
        self._monitoring_active = False
        if self._monitoring_task:
            self._monitoring_task.cancel()
        self.logger.info("System monitoring stopped")
    
    @contextmanager
    def measure_time(self, metric_name: str, labels: Dict[str, str] = None):
        """Context manager to measure execution time"""
        start_time = time.time()
        try:
            yield
        finally:
            duration = time.time() - start_time
            self.metrics_collector.observe_histogram(metric_name, duration, labels)
    
    def record_request(self, method: str, endpoint: str, status_code: int, duration: float):
        """Record HTTP request metrics"""
        labels = {
            "method": method,
            "endpoint": endpoint,
            "status": str(status_code)
        }
        
        self.metrics_collector.increment_counter("requests_total", labels=labels)
        self.metrics_collector.observe_histogram("request_duration", duration, 
                                                {"method": method, "endpoint": endpoint})
    
    def record_agent_execution(self, agent_id: str, success: bool, duration: float, cost: float):
        """Record agent execution metrics"""
        status = "success" if success else "failure"
        
        self.metrics_collector.increment_counter("agent_executions_total", 
                                                labels={"agent_id": agent_id, "status": status})
        self.metrics_collector.observe_histogram("agent_execution_duration", duration, 
                                                {"agent_id": agent_id})
        
        if cost > 0:
            self.metrics_collector.observe_histogram("agent_execution_cost", cost, 
                                                    {"agent_id": agent_id})
    
    def record_credit_usage(self, user_tier: str, amount: float):
        """Record credit usage metrics"""
        self.metrics_collector.increment_counter("credits_used_total", amount, 
                                                {"user_tier": user_tier})
    
    def record_rate_limit_hit(self, limit_type: str, user_tier: str):
        """Record rate limit hit"""
        self.metrics_collector.increment_counter("rate_limit_hits_total", 
                                                labels={"limit_type": limit_type, "user_tier": user_tier})
    
    async def get_health_status(self) -> Dict[str, Any]:
        """Get comprehensive health status"""
        health_checks = await self.health_checker.run_all_checks()
        overall_status = self.health_checker.get_overall_status()
        system_metrics = self.collect_system_metrics()
        
        return {
            "status": overall_status.value,
            "timestamp": datetime.now().isoformat(),
            "checks": {name: asdict(check) for name, check in health_checks.items()},
            "system_metrics": asdict(system_metrics),
            "uptime_seconds": time.time() - getattr(self, '_start_time', time.time())
        }
    
    def get_metrics_summary(self) -> Dict[str, Any]:
        """Get metrics summary"""
        metrics = self.metrics_collector.get_metrics()
        system_metrics = self.collect_system_metrics()
        
        return {
            "timestamp": datetime.now().isoformat(),
            "application_metrics": metrics,
            "system_metrics": asdict(system_metrics)
        }

# Global monitor instance
monitor = SystemMonitor()

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

@contextmanager
def measure_time(metric_name: str, labels: Dict[str, str] = None):
    """Measure execution time"""
    with monitor.measure_time(metric_name, labels):
        yield

if __name__ == "__main__":
    # Test the monitoring system
    async def test_monitoring():
        print("🔍 Testing monitoring system...")
        
        # Start monitoring
        await monitor.start_monitoring(interval=5)
        
        # Wait a bit
        await asyncio.sleep(2)
        
        # Get health status
        health = await monitor.get_health_status()
        print(f"Health status: {health['status']}")
        
        # Record some test metrics
        monitor.record_request("GET", "/api/v1/packages", 200, 0.1)
        monitor.record_agent_execution("security-scanner", True, 1.5, 0.05)
        
        # Get metrics
        metrics = monitor.get_metrics_summary()
        print(f"Collected {len(metrics['application_metrics']['counters'])} counter metrics")
        
        # Stop monitoring
        monitor.stop_monitoring()
        
        print("✅ Monitoring system test completed")
    
    asyncio.run(test_monitoring())
