#!/usr/bin/env python3
"""
Load Testing and Performance Optimization for Agent Marketplace
Comprehensive load testing, stress testing, and performance analysis
"""

import asyncio
import aiohttp
import time
import json
import statistics
import threading
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
from concurrent.futures import ThreadPoolExecutor, as_completed
import random
import logging

logger = logging.getLogger(__name__)

@dataclass
class LoadTestResult:
    """Load test result data"""
    endpoint: str
    method: str
    total_requests: int
    successful_requests: int
    failed_requests: int
    avg_response_time: float
    min_response_time: float
    max_response_time: float
    p95_response_time: float
    p99_response_time: float
    requests_per_second: float
    error_rate: float
    errors: List[str]
    duration_seconds: float
    timestamp: str

@dataclass
class PerformanceMetrics:
    """System performance metrics during load test"""
    cpu_percent: float
    memory_percent: float
    memory_used_mb: float
    active_connections: int
    response_times: List[float]
    error_count: int
    timestamp: str

class LoadTestScenario:
    """Load test scenario configuration"""
    
    def __init__(self, name: str, base_url: str = "http://localhost:8000"):
        self.name = name
        self.base_url = base_url
        self.requests = []
        self.concurrent_users = 10
        self.duration_seconds = 60
        self.ramp_up_seconds = 10
        
    def add_request(self, method: str, endpoint: str, payload: Dict = None, weight: int = 1):
        """Add a request to the scenario"""
        self.requests.append({
            "method": method,
            "endpoint": endpoint,
            "payload": payload,
            "weight": weight
        })
        
    def set_load_parameters(self, concurrent_users: int, duration_seconds: int, ramp_up_seconds: int = 10):
        """Set load testing parameters"""
        self.concurrent_users = concurrent_users
        self.duration_seconds = duration_seconds
        self.ramp_up_seconds = ramp_up_seconds

class LoadTester:
    """Advanced load testing system"""
    
    def __init__(self):
        self.results = []
        self.performance_metrics = []
        self.session = None
        
    async def run_scenario(self, scenario: LoadTestScenario) -> List[LoadTestResult]:
        """Run a load test scenario"""
        logger.info(f"Starting load test scenario: {scenario.name}")
        logger.info(f"Parameters: {scenario.concurrent_users} users, {scenario.duration_seconds}s duration")
        
        # Create aiohttp session
        connector = aiohttp.TCPConnector(limit=scenario.concurrent_users * 2)
        timeout = aiohttp.ClientTimeout(total=30)
        self.session = aiohttp.ClientSession(connector=connector, timeout=timeout)
        
        try:
            # Start performance monitoring
            monitor_task = asyncio.create_task(self._monitor_performance(scenario.duration_seconds))
            
            # Run load test
            test_results = await self._execute_load_test(scenario)
            
            # Stop monitoring
            monitor_task.cancel()
            
            return test_results
            
        finally:
            await self.session.close()
    
    async def _execute_load_test(self, scenario: LoadTestScenario) -> List[LoadTestResult]:
        """Execute the actual load test"""
        start_time = time.time()
        
        # Create tasks for concurrent users
        tasks = []
        for user_id in range(scenario.concurrent_users):
            # Stagger user start times for ramp-up
            delay = (user_id / scenario.concurrent_users) * scenario.ramp_up_seconds
            task = asyncio.create_task(
                self._simulate_user(scenario, user_id, delay, start_time + scenario.duration_seconds)
            )
            tasks.append(task)
        
        # Wait for all users to complete
        user_results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Process results
        endpoint_results = {}
        for user_result in user_results:
            if isinstance(user_result, Exception):
                logger.error(f"User simulation failed: {user_result}")
                continue
                
            for endpoint, requests in user_result.items():
                if endpoint not in endpoint_results:
                    endpoint_results[endpoint] = []
                endpoint_results[endpoint].extend(requests)
        
        # Generate summary results
        test_results = []
        for endpoint, requests in endpoint_results.items():
            if requests:
                result = self._calculate_endpoint_results(endpoint, requests, time.time() - start_time)
                test_results.append(result)
        
        return test_results
    
    async def _simulate_user(self, scenario: LoadTestScenario, user_id: int, delay: float, end_time: float) -> Dict[str, List]:
        """Simulate a single user's behavior"""
        await asyncio.sleep(delay)
        
        user_results = {}
        
        while time.time() < end_time:
            # Select random request based on weights
            request = self._select_weighted_request(scenario.requests)
            
            endpoint_key = f"{request['method']} {request['endpoint']}"
            if endpoint_key not in user_results:
                user_results[endpoint_key] = []
            
            # Execute request
            start_time = time.time()
            try:
                url = f"{scenario.base_url}{request['endpoint']}"
                
                if request['method'].upper() == 'GET':
                    async with self.session.get(url) as response:
                        await response.text()
                        status_code = response.status
                elif request['method'].upper() == 'POST':
                    async with self.session.post(url, json=request['payload']) as response:
                        await response.text()
                        status_code = response.status
                else:
                    async with self.session.request(request['method'], url, json=request['payload']) as response:
                        await response.text()
                        status_code = response.status
                
                response_time = time.time() - start_time
                
                user_results[endpoint_key].append({
                    'response_time': response_time,
                    'status_code': status_code,
                    'success': 200 <= status_code < 400,
                    'error': None
                })
                
            except Exception as e:
                response_time = time.time() - start_time
                user_results[endpoint_key].append({
                    'response_time': response_time,
                    'status_code': 0,
                    'success': False,
                    'error': str(e)
                })
            
            # Random think time between requests (0.1 to 2 seconds)
            await asyncio.sleep(random.uniform(0.1, 2.0))
        
        return user_results
    
    def _select_weighted_request(self, requests: List[Dict]) -> Dict:
        """Select a request based on weights"""
        total_weight = sum(req['weight'] for req in requests)
        random_weight = random.uniform(0, total_weight)
        
        current_weight = 0
        for request in requests:
            current_weight += request['weight']
            if random_weight <= current_weight:
                return request
        
        return requests[-1]  # Fallback
    
    def _calculate_endpoint_results(self, endpoint: str, requests: List[Dict], duration: float) -> LoadTestResult:
        """Calculate results for an endpoint"""
        total_requests = len(requests)
        successful_requests = sum(1 for req in requests if req['success'])
        failed_requests = total_requests - successful_requests
        
        response_times = [req['response_time'] for req in requests]
        errors = [req['error'] for req in requests if req['error']]
        
        return LoadTestResult(
            endpoint=endpoint,
            method=endpoint.split()[0],
            total_requests=total_requests,
            successful_requests=successful_requests,
            failed_requests=failed_requests,
            avg_response_time=statistics.mean(response_times) if response_times else 0,
            min_response_time=min(response_times) if response_times else 0,
            max_response_time=max(response_times) if response_times else 0,
            p95_response_time=self._percentile(response_times, 95) if response_times else 0,
            p99_response_time=self._percentile(response_times, 99) if response_times else 0,
            requests_per_second=total_requests / duration if duration > 0 else 0,
            error_rate=(failed_requests / total_requests * 100) if total_requests > 0 else 0,
            errors=list(set(errors)),  # Unique errors
            duration_seconds=duration,
            timestamp=datetime.now().isoformat()
        )
    
    def _percentile(self, data: List[float], percentile: int) -> float:
        """Calculate percentile of response times"""
        if not data:
            return 0
        sorted_data = sorted(data)
        index = int(len(sorted_data) * percentile / 100)
        return sorted_data[min(index, len(sorted_data) - 1)]
    
    async def _monitor_performance(self, duration: int):
        """Monitor system performance during load test"""
        try:
            import psutil
        except ImportError:
            logger.warning("psutil not available for performance monitoring")
            return
        
        start_time = time.time()
        
        while time.time() - start_time < duration:
            try:
                metrics = PerformanceMetrics(
                    cpu_percent=psutil.cpu_percent(interval=1),
                    memory_percent=psutil.virtual_memory().percent,
                    memory_used_mb=psutil.virtual_memory().used / (1024 * 1024),
                    active_connections=len(psutil.net_connections()),
                    response_times=[],  # Would be populated from request monitoring
                    error_count=0,  # Would be populated from error monitoring
                    timestamp=datetime.now().isoformat()
                )
                
                self.performance_metrics.append(metrics)
                
            except Exception as e:
                logger.error(f"Performance monitoring error: {e}")
            
            await asyncio.sleep(5)  # Monitor every 5 seconds

class PerformanceOptimizer:
    """Performance optimization recommendations"""
    
    def __init__(self):
        self.recommendations = []
    
    def analyze_results(self, results: List[LoadTestResult]) -> List[str]:
        """Analyze load test results and provide optimization recommendations"""
        recommendations = []
        
        for result in results:
            # High response time
            if result.avg_response_time > 2.0:
                recommendations.append(
                    f"⚠️ {result.endpoint}: High average response time ({result.avg_response_time:.2f}s). "
                    "Consider caching, database optimization, or scaling."
                )
            
            # High error rate
            if result.error_rate > 5.0:
                recommendations.append(
                    f"❌ {result.endpoint}: High error rate ({result.error_rate:.1f}%). "
                    "Check error handling and resource limits."
                )
            
            # Low throughput
            if result.requests_per_second < 10:
                recommendations.append(
                    f"🐌 {result.endpoint}: Low throughput ({result.requests_per_second:.1f} RPS). "
                    "Consider performance optimization or horizontal scaling."
                )
            
            # High P99 latency
            if result.p99_response_time > 5.0:
                recommendations.append(
                    f"📈 {result.endpoint}: High P99 latency ({result.p99_response_time:.2f}s). "
                    "Some requests are very slow - investigate bottlenecks."
                )
        
        # General recommendations
        if not recommendations:
            recommendations.append("✅ Performance looks good! No major issues detected.")
        else:
            recommendations.extend([
                "\n🔧 General Optimization Tips:",
                "• Enable response caching for static content",
                "• Implement database connection pooling",
                "• Add CDN for static assets",
                "• Consider horizontal scaling for high load",
                "• Monitor and optimize database queries",
                "• Implement circuit breakers for external services"
            ])
        
        return recommendations

def create_standard_scenarios(base_url: str = "http://localhost:8000") -> List[LoadTestScenario]:
    """Create standard load test scenarios"""
    scenarios = []
    
    # Scenario 1: Light Load - Normal Usage
    light_load = LoadTestScenario("Light Load - Normal Usage", base_url)
    light_load.add_request("GET", "/", weight=2)
    light_load.add_request("GET", "/api/v1/packages", weight=5)
    light_load.add_request("GET", "/api/v1/tiers", weight=2)
    light_load.add_request("GET", "/api/v1/user/credits", weight=3)
    light_load.add_request("POST", "/api/v1/packages/security-scanner/execute", 
                          {"package_id": "security-scanner", "task": "Load test scan"}, weight=1)
    light_load.set_load_parameters(concurrent_users=10, duration_seconds=60)
    scenarios.append(light_load)
    
    # Scenario 2: Medium Load - Peak Usage
    medium_load = LoadTestScenario("Medium Load - Peak Usage", base_url)
    medium_load.add_request("GET", "/", weight=1)
    medium_load.add_request("GET", "/api/v1/packages", weight=4)
    medium_load.add_request("GET", "/api/v1/tiers", weight=2)
    medium_load.add_request("GET", "/api/v1/user/credits", weight=3)
    medium_load.add_request("GET", "/api/v1/user/rate-limits", weight=2)
    medium_load.add_request("POST", "/api/v1/packages/security-scanner/execute", 
                           {"package_id": "security-scanner", "task": "Peak load test"}, weight=2)
    medium_load.add_request("POST", "/api/v1/packages/ticket-resolver/execute", 
                           {"package_id": "ticket-resolver", "task": "Resolve test ticket"}, weight=1)
    medium_load.set_load_parameters(concurrent_users=50, duration_seconds=120)
    scenarios.append(medium_load)
    
    # Scenario 3: Heavy Load - Stress Test
    heavy_load = LoadTestScenario("Heavy Load - Stress Test", base_url)
    heavy_load.add_request("GET", "/api/v1/packages", weight=3)
    heavy_load.add_request("GET", "/api/v1/user/credits", weight=2)
    heavy_load.add_request("POST", "/api/v1/packages/security-scanner/execute", 
                          {"package_id": "security-scanner", "task": "Stress test scan"}, weight=3)
    heavy_load.add_request("POST", "/api/v1/packages/data-processor/execute", 
                          {"package_id": "data-processor", "task": "Heavy data processing"}, weight=2)
    heavy_load.add_request("POST", "/api/v1/packages/knowledge-base/execute", 
                          {"package_id": "knowledge-base", "task": "Knowledge query"}, weight=2)
    heavy_load.set_load_parameters(concurrent_users=100, duration_seconds=180)
    scenarios.append(heavy_load)
    
    # Scenario 4: Spike Test - Sudden Load Increase
    spike_test = LoadTestScenario("Spike Test - Sudden Load", base_url)
    spike_test.add_request("GET", "/api/v1/packages", weight=2)
    spike_test.add_request("POST", "/api/v1/packages/security-scanner/execute", 
                          {"package_id": "security-scanner", "task": "Spike test"}, weight=3)
    spike_test.set_load_parameters(concurrent_users=200, duration_seconds=60, ramp_up_seconds=5)
    scenarios.append(spike_test)
    
    return scenarios

async def run_comprehensive_load_test(base_url: str = "http://localhost:8000") -> Dict[str, Any]:
    """Run comprehensive load testing suite"""
    print("🚀 Starting Comprehensive Load Test Suite")
    print("=" * 60)
    
    load_tester = LoadTester()
    optimizer = PerformanceOptimizer()
    scenarios = create_standard_scenarios(base_url)
    
    all_results = []
    scenario_summaries = []
    
    for i, scenario in enumerate(scenarios, 1):
        print(f"\n📊 Running Scenario {i}/{len(scenarios)}: {scenario.name}")
        print(f"   Users: {scenario.concurrent_users}, Duration: {scenario.duration_seconds}s")
        
        try:
            results = await load_tester.run_scenario(scenario)
            all_results.extend(results)
            
            # Scenario summary
            total_requests = sum(r.total_requests for r in results)
            avg_response_time = statistics.mean([r.avg_response_time for r in results]) if results else 0
            error_rate = statistics.mean([r.error_rate for r in results]) if results else 0
            
            scenario_summaries.append({
                "name": scenario.name,
                "total_requests": total_requests,
                "avg_response_time": avg_response_time,
                "error_rate": error_rate,
                "endpoints_tested": len(results)
            })
            
            print(f"   ✅ Completed: {total_requests} requests, {avg_response_time:.2f}s avg, {error_rate:.1f}% errors")
            
        except Exception as e:
            print(f"   ❌ Failed: {str(e)}")
            scenario_summaries.append({
                "name": scenario.name,
                "error": str(e)
            })
    
    # Generate recommendations
    recommendations = optimizer.analyze_results(all_results)
    
    # Compile comprehensive report
    report = {
        "timestamp": datetime.now().isoformat(),
        "scenarios_run": len(scenarios),
        "total_requests": sum(r.total_requests for r in all_results),
        "scenario_summaries": scenario_summaries,
        "detailed_results": [asdict(result) for result in all_results],
        "performance_metrics": [asdict(metric) for metric in load_tester.performance_metrics],
        "recommendations": recommendations,
        "summary": {
            "avg_response_time": statistics.mean([r.avg_response_time for r in all_results]) if all_results else 0,
            "max_response_time": max([r.max_response_time for r in all_results]) if all_results else 0,
            "total_errors": sum(r.failed_requests for r in all_results),
            "overall_error_rate": statistics.mean([r.error_rate for r in all_results]) if all_results else 0
        }
    }
    
    return report

if __name__ == "__main__":
    # Run load tests
    async def main():
        report = await run_comprehensive_load_test()
        
        print("\n" + "=" * 60)
        print("📋 LOAD TEST SUMMARY")
        print("=" * 60)
        
        summary = report["summary"]
        print(f"Total Requests: {report['total_requests']}")
        print(f"Average Response Time: {summary['avg_response_time']:.2f}s")
        print(f"Max Response Time: {summary['max_response_time']:.2f}s")
        print(f"Total Errors: {summary['total_errors']}")
        print(f"Overall Error Rate: {summary['overall_error_rate']:.1f}%")
        
        print("\n🔧 Recommendations:")
        for rec in report["recommendations"]:
            print(f"  {rec}")
        
        # Save detailed report
        with open("load_test_report.json", "w") as f:
            json.dump(report, f, indent=2)
        print(f"\n📄 Detailed report saved to load_test_report.json")
    
    asyncio.run(main())
