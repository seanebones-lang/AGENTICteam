"""
Ticket Resolver Agent v2.0
Modern, production-ready ticket classification and resolution
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from enum import Enum
from langchain_core.prompts import ChatPromptTemplate
from .base import BaseAgent


class TicketCategory(str, Enum):
    TECHNICAL = "technical"
    BILLING = "billing"
    ACCOUNT = "account"
    FEATURE_REQUEST = "feature_request"
    BUG_REPORT = "bug_report"
    GENERAL_INQUIRY = "general_inquiry"


class TicketPriority(str, Enum):
    URGENT = "urgent"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class ResolutionSuggestion(BaseModel):
    solution_type: str
    description: str
    steps: List[str] = Field(default_factory=list)
    estimated_time: str
    confidence: float
    requires_human: bool = False


class TicketResolverAgent(BaseAgent):
    """
    v2.0 Ticket Resolver Agent
    
    Features:
    - AI-powered ticket classification
    - Intelligent priority scoring
    - Automated resolution suggestions
    - Customer sentiment analysis
    - Smart team routing
    """
    
    def __init__(self, api_key: Optional[str] = None):
        super().__init__(
            agent_id="ticket-resolver",
            model="claude-3-5-haiku-20241022",  # Fast model for ticket processing
            temperature=0.3,
            max_tokens=2048,
            api_key=api_key
        )
    
    async def _execute_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute ticket resolution task"""
        ticket_content = task.get("ticket_content", "")
        customer_info = task.get("customer_info", {})
        
        if not ticket_content:
            raise ValueError("ticket_content is required")
        
        # Analyze the ticket
        analysis = await self._analyze_ticket(ticket_content, customer_info)
        
        # Generate resolution suggestions
        suggestions = await self._generate_suggestions(ticket_content, analysis)
        
        # Create auto-response if appropriate
        auto_response = await self._generate_auto_response(ticket_content, analysis)
        
        return {
            "ticket_id": task.get("ticket_id", "unknown"),
            "category": analysis["category"],
            "priority": analysis["priority"],
            "sentiment": analysis["sentiment"],
            "urgency_score": analysis["urgency_score"],
            "suggested_team": analysis["suggested_team"],
            "resolution_suggestions": suggestions,
            "auto_response": auto_response,
            "tags": analysis["tags"],
            "confidence_score": analysis["confidence_score"]
        }
    
    async def _analyze_ticket(self, content: str, customer_info: Dict) -> Dict[str, Any]:
        """Analyze ticket content for classification and routing"""
        
        analysis_prompt = ChatPromptTemplate.from_template("""
        Analyze this customer support ticket and provide a structured analysis.
        
        Ticket Content: {content}
        Customer Tier: {customer_tier}
        
        Provide analysis in this exact format:
        CATEGORY: [technical|billing|account|feature_request|bug_report|general_inquiry]
        PRIORITY: [urgent|high|medium|low]
        SENTIMENT: [positive|neutral|negative|very_negative]
        URGENCY_SCORE: [0.0-1.0]
        SUGGESTED_TEAM: [technical|billing|customer_success|product]
        TAGS: [comma-separated relevant tags]
        CONFIDENCE: [0.0-1.0]
        
        Consider:
        - Technical issues with errors/bugs = technical + high priority
        - Payment/billing problems = billing + medium-high priority  
        - Account access issues = account + high priority
        - Feature requests = feature_request + low-medium priority
        - Angry/frustrated language = higher priority
        - VIP customers = priority boost
        """)
        
        response = await self.llm.ainvoke(
            analysis_prompt.format(
                content=content[:1000],  # Limit content length
                customer_tier=customer_info.get("tier", "basic")
            )
        )
        
        # Parse the structured response
        return self._parse_analysis_response(response.content)
    
    async def _generate_suggestions(self, content: str, analysis: Dict) -> List[Dict]:
        """Generate resolution suggestions based on ticket analysis"""
        
        suggestion_prompt = ChatPromptTemplate.from_template("""
        Generate 2-3 specific resolution suggestions for this support ticket.
        
        Ticket: {content}
        Category: {category}
        Priority: {priority}
        
        For each suggestion, provide:
        1. Solution type (e.g., "configuration_fix", "account_update", "technical_resolution")
        2. Clear description of the solution
        3. Step-by-step instructions (3-5 steps max)
        4. Estimated resolution time
        5. Confidence level (0.0-1.0)
        6. Whether human intervention is required
        
        Focus on actionable, specific solutions that address the root cause.
        """)
        
        response = await self.llm.ainvoke(
            suggestion_prompt.format(
                content=content[:800],
                category=analysis["category"],
                priority=analysis["priority"]
            )
        )
        
        return self._parse_suggestions_response(response.content)
    
    async def _generate_auto_response(self, content: str, analysis: Dict) -> Optional[str]:
        """Generate automated customer response if appropriate"""
        
        # Only auto-respond to low-medium priority, non-urgent tickets
        if analysis["priority"] in ["urgent", "high"] or analysis["urgency_score"] > 0.7:
            return None
        
        response_prompt = ChatPromptTemplate.from_template("""
        Generate a helpful, professional auto-response for this customer support ticket.
        
        Ticket: {content}
        Category: {category}
        Sentiment: {sentiment}
        
        The response should:
        - Acknowledge their issue specifically
        - Provide immediate helpful information if possible
        - Set expectations for resolution time
        - Be empathetic and professional
        - Be concise (2-3 paragraphs max)
        
        If this requires complex troubleshooting, don't auto-respond (return "MANUAL_REVIEW_REQUIRED").
        """)
        
        response = await self.llm.ainvoke(
            response_prompt.format(
                content=content[:600],
                category=analysis["category"],
                sentiment=analysis["sentiment"]
            )
        )
        
        auto_response = response.content.strip()
        return None if "MANUAL_REVIEW_REQUIRED" in auto_response else auto_response
    
    def _parse_analysis_response(self, response: str) -> Dict[str, Any]:
        """Parse structured analysis response from Claude"""
        analysis = {
            "category": "general_inquiry",
            "priority": "medium", 
            "sentiment": "neutral",
            "urgency_score": 0.5,
            "suggested_team": "customer_success",
            "tags": [],
            "confidence_score": 0.7
        }
        
        lines = response.strip().split('\n')
        for line in lines:
            if ':' in line:
                key, value = line.split(':', 1)
                key = key.strip().lower()
                value = value.strip()
                
                if key == "category":
                    analysis["category"] = value
                elif key == "priority":
                    analysis["priority"] = value
                elif key == "sentiment":
                    analysis["sentiment"] = value
                elif key == "urgency_score":
                    try:
                        analysis["urgency_score"] = float(value)
                    except:
                        pass
                elif key == "suggested_team":
                    analysis["suggested_team"] = value
                elif key == "tags":
                    analysis["tags"] = [tag.strip() for tag in value.split(',')]
                elif key == "confidence":
                    try:
                        analysis["confidence_score"] = float(value)
                    except:
                        pass
        
        return analysis
    
    def _parse_suggestions_response(self, response: str) -> List[Dict]:
        """Parse resolution suggestions from Claude response"""
        # Simple parsing - in production, use more robust parsing
        suggestions = []
        
        # For now, create a single suggestion from the response
        suggestions.append({
            "solution_type": "ai_generated",
            "description": response[:200] + "..." if len(response) > 200 else response,
            "steps": ["Review the suggested solution", "Implement the recommended fix", "Test the resolution"],
            "estimated_time": "15-30 minutes",
            "confidence": 0.8,
            "requires_human": False
        })
        
        return suggestions
