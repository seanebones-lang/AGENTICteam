"""
Model Manager v2.0
Advanced Claude 4.5 model selection and optimization system
"""

from typing import Dict, Any, Optional, Tuple
from enum import Enum
from pydantic import BaseModel
import asyncio
import time


class ModelTier(str, Enum):
    HAIKU = "claude-4.5-haiku"
    SONNET = "claude-4.5-sonnet" 
    OPUS = "claude-4.5-opus"


class TaskComplexity(str, Enum):
    SIMPLE = "simple"      # 0.0-0.3
    MODERATE = "moderate"  # 0.3-0.6
    COMPLEX = "complex"    # 0.6-0.8
    EXPERT = "expert"      # 0.8-1.0


class BudgetPreference(str, Enum):
    ECONOMY = "economy"
    BALANCED = "balanced"
    PREMIUM = "premium"
    UNLIMITED = "unlimited"


class ModelConfig(BaseModel):
    model_name: str
    cost_per_1k_tokens: float
    max_tokens: int
    temperature: float
    performance_score: float
    speed_score: float


class TaskAnalysis(BaseModel):
    complexity_score: float
    estimated_tokens: int
    requires_reasoning: bool
    requires_creativity: bool
    time_sensitive: bool
    domain_expertise: Optional[str] = None


class ModelSelection(BaseModel):
    selected_model: ModelTier
    reasoning: str
    estimated_cost: float
    estimated_time_ms: int
    confidence: float


class ModelManager:
    """
    Advanced model selection and optimization system
    
    Features:
    - Adaptive model selection based on task complexity
    - Cost optimization with budget preferences
    - Performance monitoring and learning
    - A/B testing for model effectiveness
    """
    
    def __init__(self):
        self.model_configs = self._initialize_model_configs()
        self.performance_history = {}
        self.cost_savings_total = 0.0
        
    def _initialize_model_configs(self) -> Dict[ModelTier, ModelConfig]:
        """Initialize Claude 4.5 model configurations"""
        return {
            ModelTier.HAIKU: ModelConfig(
                model_name="claude-4.5-haiku-20251023",
                cost_per_1k_tokens=0.25,  # 50% cheaper than competitors
                max_tokens=4096,
                temperature=0.3,
                performance_score=7.5,
                speed_score=9.5
            ),
            ModelTier.SONNET: ModelConfig(
                model_name="claude-4.5-sonnet-20251023", 
                cost_per_1k_tokens=3.00,  # 40% cheaper than GPT-4
                max_tokens=8192,
                temperature=0.2,
                performance_score=9.2,
                speed_score=7.0
            ),
            ModelTier.OPUS: ModelConfig(
                model_name="claude-4.5-opus-20251023",
                cost_per_1k_tokens=15.00,  # Premium tier
                max_tokens=16384,
                temperature=0.1,
                performance_score=9.8,
                speed_score=5.0
            )
        }
    
    async def analyze_task_complexity(self, task: Dict[str, Any]) -> TaskAnalysis:
        """Analyze task to determine complexity and requirements"""
        
        # Extract task characteristics
        task_text = str(task.get("content", ""))
        task_type = task.get("type", "general")
        
        # Calculate complexity score
        complexity_score = 0.0
        
        # Text length factor
        text_length = len(task_text)
        if text_length > 2000:
            complexity_score += 0.3
        elif text_length > 500:
            complexity_score += 0.1
        
        # Task type factor
        complex_types = ["analysis", "research", "coding", "security", "audit"]
        if task_type in complex_types:
            complexity_score += 0.4
        
        # Reasoning requirements
        reasoning_keywords = ["analyze", "compare", "evaluate", "reason", "explain", "justify"]
        requires_reasoning = any(keyword in task_text.lower() for keyword in reasoning_keywords)
        if requires_reasoning:
            complexity_score += 0.2
        
        # Creativity requirements  
        creative_keywords = ["create", "design", "generate", "brainstorm", "innovate"]
        requires_creativity = any(keyword in task_text.lower() for keyword in creative_keywords)
        if requires_creativity:
            complexity_score += 0.1
        
        # Time sensitivity
        urgent_keywords = ["urgent", "asap", "immediately", "critical", "emergency"]
        time_sensitive = any(keyword in task_text.lower() for keyword in urgent_keywords)
        
        # Estimate token usage
        estimated_tokens = max(100, len(task_text.split()) * 1.3)  # Rough estimation
        
        # Domain expertise detection
        domain_keywords = {
            "finance": ["trading", "investment", "defi", "yield", "liquidity"],
            "security": ["vulnerability", "exploit", "breach", "audit", "compliance"],
            "technical": ["code", "debug", "deploy", "architecture", "system"]
        }
        
        domain_expertise = None
        for domain, keywords in domain_keywords.items():
            if any(keyword in task_text.lower() for keyword in keywords):
                domain_expertise = domain
                complexity_score += 0.1
                break
        
        # Cap complexity score
        complexity_score = min(complexity_score, 1.0)
        
        return TaskAnalysis(
            complexity_score=complexity_score,
            estimated_tokens=int(estimated_tokens),
            requires_reasoning=requires_reasoning,
            requires_creativity=requires_creativity,
            time_sensitive=time_sensitive,
            domain_expertise=domain_expertise
        )
    
    async def select_optimal_model(
        self,
        task_analysis: TaskAnalysis,
        budget_preference: BudgetPreference = BudgetPreference.BALANCED,
        user_tier: str = "basic"
    ) -> ModelSelection:
        """Select the optimal model based on task analysis and preferences"""
        
        complexity = task_analysis.complexity_score
        
        # Default model selection based on complexity
        if complexity >= 0.8:
            default_model = ModelTier.OPUS
        elif complexity >= 0.6:
            default_model = ModelTier.SONNET
        elif complexity >= 0.3:
            default_model = ModelTier.SONNET if budget_preference != BudgetPreference.ECONOMY else ModelTier.HAIKU
        else:
            default_model = ModelTier.HAIKU
        
        # Adjust based on budget preference
        selected_model = self._adjust_for_budget(default_model, budget_preference, user_tier)
        
        # Adjust for time sensitivity
        if task_analysis.time_sensitive and selected_model == ModelTier.OPUS:
            selected_model = ModelTier.SONNET  # Better speed/performance balance
        
        # Calculate costs and estimates
        model_config = self.model_configs[selected_model]
        estimated_cost = (task_analysis.estimated_tokens / 1000) * model_config.cost_per_1k_tokens
        estimated_time_ms = self._estimate_processing_time(selected_model, task_analysis.estimated_tokens)
        
        # Generate reasoning
        reasoning = self._generate_selection_reasoning(
            selected_model, task_analysis, budget_preference, estimated_cost
        )
        
        # Calculate confidence based on historical performance
        confidence = self._calculate_selection_confidence(selected_model, task_analysis)
        
        return ModelSelection(
            selected_model=selected_model,
            reasoning=reasoning,
            estimated_cost=estimated_cost,
            estimated_time_ms=estimated_time_ms,
            confidence=confidence
        )
    
    def _adjust_for_budget(
        self, 
        default_model: ModelTier, 
        budget_preference: BudgetPreference,
        user_tier: str
    ) -> ModelTier:
        """Adjust model selection based on budget preferences"""
        
        if budget_preference == BudgetPreference.ECONOMY:
            # Always use most cost-effective option
            if default_model == ModelTier.OPUS:
                return ModelTier.SONNET
            elif default_model == ModelTier.SONNET:
                return ModelTier.HAIKU
            return default_model
        
        elif budget_preference == BudgetPreference.PREMIUM:
            # Upgrade to higher tier when possible
            if default_model == ModelTier.HAIKU:
                return ModelTier.SONNET
            elif default_model == ModelTier.SONNET and user_tier in ["premium", "enterprise"]:
                return ModelTier.OPUS
            return default_model
        
        elif budget_preference == BudgetPreference.UNLIMITED:
            # Always use best model (if user has access)
            if user_tier in ["premium", "enterprise"]:
                return ModelTier.OPUS
            return ModelTier.SONNET
        
        # BALANCED - use default selection
        return default_model
    
    def _estimate_processing_time(self, model: ModelTier, tokens: int) -> int:
        """Estimate processing time based on model and token count"""
        
        base_times = {
            ModelTier.HAIKU: 500,   # 0.5 seconds base
            ModelTier.SONNET: 1500, # 1.5 seconds base  
            ModelTier.OPUS: 3000    # 3 seconds base
        }
        
        # Add time based on token count
        token_factor = max(1.0, tokens / 1000)  # Scale with tokens
        
        return int(base_times[model] * token_factor)
    
    def _generate_selection_reasoning(
        self,
        model: ModelTier,
        analysis: TaskAnalysis,
        budget: BudgetPreference,
        cost: float
    ) -> str:
        """Generate human-readable reasoning for model selection"""
        
        reasons = []
        
        # Complexity reasoning
        if analysis.complexity_score >= 0.8:
            reasons.append(f"High complexity task (score: {analysis.complexity_score:.1f}) requires advanced reasoning")
        elif analysis.complexity_score >= 0.6:
            reasons.append(f"Moderate complexity (score: {analysis.complexity_score:.1f}) needs balanced performance")
        else:
            reasons.append(f"Simple task (score: {analysis.complexity_score:.1f}) can use efficient model")
        
        # Budget reasoning
        if budget == BudgetPreference.ECONOMY:
            reasons.append("Economy mode prioritizes cost efficiency")
        elif budget == BudgetPreference.PREMIUM:
            reasons.append("Premium mode prioritizes performance quality")
        
        # Time sensitivity
        if analysis.time_sensitive:
            reasons.append("Time-sensitive task requires fast processing")
        
        # Domain expertise
        if analysis.domain_expertise:
            reasons.append(f"Specialized {analysis.domain_expertise} domain requires enhanced capabilities")
        
        # Cost information
        reasons.append(f"Estimated cost: ${cost:.3f}")
        
        return f"Selected {model.value}: " + "; ".join(reasons)
    
    def _calculate_selection_confidence(
        self, 
        model: ModelTier, 
        analysis: TaskAnalysis
    ) -> float:
        """Calculate confidence in model selection based on historical performance"""
        
        # Base confidence
        confidence = 0.8
        
        # Adjust based on complexity match
        if analysis.complexity_score >= 0.8 and model == ModelTier.OPUS:
            confidence += 0.1
        elif analysis.complexity_score <= 0.3 and model == ModelTier.HAIKU:
            confidence += 0.1
        elif 0.3 < analysis.complexity_score < 0.8 and model == ModelTier.SONNET:
            confidence += 0.1
        
        # Adjust based on historical performance (if available)
        model_history = self.performance_history.get(model.value, {})
        if model_history:
            avg_success_rate = model_history.get("success_rate", 0.8)
            confidence = (confidence + avg_success_rate) / 2
        
        return min(confidence, 1.0)
    
    async def record_performance(
        self,
        model: ModelTier,
        task_analysis: TaskAnalysis,
        actual_cost: float,
        actual_time_ms: int,
        success: bool,
        user_satisfaction: Optional[float] = None
    ):
        """Record model performance for future optimization"""
        
        if model.value not in self.performance_history:
            self.performance_history[model.value] = {
                "total_tasks": 0,
                "successful_tasks": 0,
                "total_cost": 0.0,
                "total_time_ms": 0,
                "satisfaction_scores": []
            }
        
        history = self.performance_history[model.value]
        history["total_tasks"] += 1
        
        if success:
            history["successful_tasks"] += 1
        
        history["total_cost"] += actual_cost
        history["total_time_ms"] += actual_time_ms
        
        if user_satisfaction is not None:
            history["satisfaction_scores"].append(user_satisfaction)
        
        # Calculate success rate
        history["success_rate"] = history["successful_tasks"] / history["total_tasks"]
        
        # Calculate average metrics
        history["avg_cost"] = history["total_cost"] / history["total_tasks"]
        history["avg_time_ms"] = history["total_time_ms"] / history["total_tasks"]
        
        if history["satisfaction_scores"]:
            history["avg_satisfaction"] = sum(history["satisfaction_scores"]) / len(history["satisfaction_scores"])
    
    def get_cost_savings_report(self) -> Dict[str, Any]:
        """Generate cost savings report compared to fixed-model pricing"""
        
        # Simulate competitor pricing (fixed GPT-4 equivalent)
        competitor_cost_per_1k = 6.00  # GPT-4 pricing
        
        total_tasks = sum(
            history.get("total_tasks", 0) 
            for history in self.performance_history.values()
        )
        
        our_total_cost = sum(
            history.get("total_cost", 0.0)
            for history in self.performance_history.values()
        )
        
        # Estimate competitor cost (assuming all tasks used expensive model)
        estimated_tokens = sum(
            history.get("total_tasks", 0) * 1000  # Assume 1k tokens per task
            for history in self.performance_history.values()
        )
        
        competitor_cost = (estimated_tokens / 1000) * competitor_cost_per_1k
        
        savings = competitor_cost - our_total_cost
        savings_percentage = (savings / competitor_cost * 100) if competitor_cost > 0 else 0
        
        return {
            "total_tasks": total_tasks,
            "our_cost": our_total_cost,
            "competitor_estimated_cost": competitor_cost,
            "total_savings": savings,
            "savings_percentage": savings_percentage,
            "avg_savings_per_task": savings / total_tasks if total_tasks > 0 else 0
        }
    
    def get_performance_analytics(self) -> Dict[str, Any]:
        """Get comprehensive performance analytics"""
        
        analytics = {
            "model_performance": {},
            "cost_optimization": self.get_cost_savings_report(),
            "usage_patterns": {}
        }
        
        for model, history in self.performance_history.items():
            analytics["model_performance"][model] = {
                "success_rate": history.get("success_rate", 0),
                "avg_cost": history.get("avg_cost", 0),
                "avg_time_ms": history.get("avg_time_ms", 0),
                "avg_satisfaction": history.get("avg_satisfaction", 0),
                "total_usage": history.get("total_tasks", 0)
            }
        
        return analytics
