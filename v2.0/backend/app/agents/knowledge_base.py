"""
Knowledge Base Agent v2.0
Intelligent knowledge retrieval and management system
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from .base import BaseAgent
import json


class KnowledgeSource(BaseModel):
    source_id: str
    title: str
    content: str
    relevance_score: float
    last_updated: str
    source_type: str = "document"  # document, faq, article, manual


class KnowledgeResponse(BaseModel):
    query: str
    answer: str
    sources: List[KnowledgeSource] = Field(default_factory=list)
    confidence: float
    suggested_followups: List[str] = Field(default_factory=list)


class KnowledgeBaseAgent(BaseAgent):
    """
    v2.0 Knowledge Base Agent
    
    Features:
    - Intelligent knowledge retrieval
    - Context-aware question answering
    - Multi-source knowledge aggregation
    - Semantic search capabilities
    - Auto-generated follow-up suggestions
    """
    
    def __init__(self, api_key: Optional[str] = None):
        super().__init__(
            agent_id="knowledge-base",
            model="claude-3-5-haiku-20241022",  # Fast model for knowledge queries
            temperature=0.2,
            max_tokens=2048,
            api_key=api_key
        )
        
        # Sample knowledge base - in production, this would be a vector database
        self.knowledge_base = self._initialize_sample_knowledge()
    
    async def _execute_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute knowledge base query"""
        query = task.get("query", "")
        context = task.get("context", {})
        max_sources = task.get("max_sources", 3)
        
        if not query:
            raise ValueError("query is required")
        
        # Find relevant knowledge sources
        relevant_sources = await self._find_relevant_sources(query, max_sources)
        
        # Generate comprehensive answer
        answer = await self._generate_answer(query, relevant_sources, context)
        
        # Generate follow-up suggestions
        followups = await self._generate_followups(query, answer)
        
        return {
            "query": query,
            "answer": answer["content"],
            "sources": [source.dict() for source in relevant_sources],
            "confidence": answer["confidence"],
            "suggested_followups": followups,
            "total_sources_found": len(relevant_sources),
            "confidence_score": answer["confidence"]
        }
    
    async def _find_relevant_sources(self, query: str, max_sources: int) -> List[KnowledgeSource]:
        """Find relevant knowledge sources for the query"""
        
        # Simple keyword matching - in production, use vector similarity
        query_lower = query.lower()
        relevant_sources = []
        
        for source in self.knowledge_base:
            relevance_score = 0.0
            
            # Check title relevance
            if any(word in source["title"].lower() for word in query_lower.split()):
                relevance_score += 0.4
            
            # Check content relevance
            content_matches = sum(1 for word in query_lower.split() 
                                if word in source["content"].lower())
            relevance_score += min(content_matches * 0.1, 0.6)
            
            if relevance_score > 0.2:  # Minimum relevance threshold
                relevant_sources.append(KnowledgeSource(
                    source_id=source["id"],
                    title=source["title"],
                    content=source["content"],
                    relevance_score=relevance_score,
                    last_updated=source["last_updated"],
                    source_type=source["type"]
                ))
        
        # Sort by relevance and return top sources
        relevant_sources.sort(key=lambda x: x.relevance_score, reverse=True)
        return relevant_sources[:max_sources]
    
    async def _generate_answer(self, query: str, sources: List[KnowledgeSource], context: Dict) -> Dict[str, Any]:
        """Generate comprehensive answer using relevant sources"""
        
        sources_text = "\n\n".join([
            f"Source: {source.title}\nContent: {source.content[:500]}..."
            for source in sources
        ])
        
        answer_prompt = ChatPromptTemplate.from_template("""
        Answer the user's question using the provided knowledge sources.
        
        Question: {query}
        User Context: {context}
        
        Knowledge Sources:
        {sources}
        
        Instructions:
        1. Provide a comprehensive, accurate answer based on the sources
        2. If sources don't fully answer the question, acknowledge limitations
        3. Use clear, professional language
        4. Include specific details from sources when relevant
        5. If no relevant sources found, provide general guidance
        
        Format your response as:
        ANSWER: [Your comprehensive answer here]
        CONFIDENCE: [0.0-1.0 confidence score]
        """)
        
        response = await self.llm.ainvoke(
            answer_prompt.format(
                query=query,
                context=json.dumps(context) if context else "None provided",
                sources=sources_text if sources else "No specific sources found"
            )
        )
        
        return self._parse_answer_response(response.content)
    
    async def _generate_followups(self, query: str, answer: Dict) -> List[str]:
        """Generate relevant follow-up questions"""
        
        followup_prompt = ChatPromptTemplate.from_template("""
        Based on this Q&A interaction, suggest 2-3 relevant follow-up questions.
        
        Original Question: {query}
        Answer Provided: {answer}
        
        Generate follow-up questions that:
        1. Explore related topics
        2. Dive deeper into specific aspects
        3. Address common next steps
        4. Are practical and actionable
        
        Return only the questions, one per line.
        """)
        
        response = await self.llm.ainvoke(
            followup_prompt.format(
                query=query,
                answer=answer["content"][:300]
            )
        )
        
        # Parse follow-up questions
        followups = [
            line.strip().lstrip('1234567890.-').strip()
            for line in response.content.split('\n')
            if line.strip() and '?' in line
        ]
        
        return followups[:3]  # Return max 3 follow-ups
    
    def _parse_answer_response(self, response: str) -> Dict[str, Any]:
        """Parse answer and confidence from Claude response"""
        lines = response.strip().split('\n')
        answer_content = ""
        confidence = 0.7  # Default confidence
        
        for line in lines:
            if line.startswith("ANSWER:"):
                answer_content = line.replace("ANSWER:", "").strip()
            elif line.startswith("CONFIDENCE:"):
                try:
                    confidence = float(line.replace("CONFIDENCE:", "").strip())
                except:
                    pass
        
        # If no structured response, use the whole response as answer
        if not answer_content:
            answer_content = response.strip()
        
        return {
            "content": answer_content,
            "confidence": confidence
        }
    
    def _initialize_sample_knowledge(self) -> List[Dict[str, Any]]:
        """Initialize sample knowledge base - replace with real data in production"""
        return [
            {
                "id": "kb_001",
                "title": "Password Reset Process",
                "content": "To reset your password: 1) Go to login page 2) Click 'Forgot Password' 3) Enter your email 4) Check email for reset link 5) Follow link and create new password. Password must be at least 8 characters with uppercase, lowercase, number, and special character.",
                "type": "procedure",
                "last_updated": "2025-10-01"
            },
            {
                "id": "kb_002", 
                "title": "API Rate Limits",
                "content": "API rate limits: Free tier - 100 requests/hour, Basic tier - 1000 requests/hour, Pro tier - 10000 requests/hour, Enterprise - unlimited. Rate limit headers included in responses. Contact support for rate limit increases.",
                "type": "technical",
                "last_updated": "2025-10-15"
            },
            {
                "id": "kb_003",
                "title": "Billing and Subscription",
                "content": "Billing occurs monthly on signup date. Accepted payment methods: credit cards, PayPal, bank transfer (Enterprise). Invoices sent via email. Subscription changes take effect next billing cycle. Refunds available within 30 days.",
                "type": "billing",
                "last_updated": "2025-10-10"
            },
            {
                "id": "kb_004",
                "title": "Data Export and Backup",
                "content": "Data export available in dashboard under Settings > Export. Formats: JSON, CSV, XML. Full export includes all user data, settings, and history. Automated backups run daily. Enterprise customers get dedicated backup options.",
                "type": "feature",
                "last_updated": "2025-10-05"
            },
            {
                "id": "kb_005",
                "title": "Security and Privacy",
                "content": "Data encrypted in transit (TLS 1.3) and at rest (AES-256). SOC 2 Type II compliant. GDPR compliant with data processing agreements. No data shared with third parties without consent. Security audits conducted quarterly.",
                "type": "security",
                "last_updated": "2025-10-20"
            }
        ]
