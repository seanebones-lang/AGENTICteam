"""
Report Generator Agent v2.0
Dynamic report creation with AI-powered insights and visualizations
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from enum import Enum
from langchain_core.prompts import ChatPromptTemplate
from .base import BaseAgent
from datetime import datetime
import json


class ReportType(str, Enum):
    EXECUTIVE_SUMMARY = "executive_summary"
    TECHNICAL_ANALYSIS = "technical_analysis"
    PERFORMANCE_METRICS = "performance_metrics"
    SECURITY_AUDIT = "security_audit"
    FINANCIAL_REPORT = "financial_report"
    OPERATIONAL_DASHBOARD = "operational_dashboard"


class ReportFormat(str, Enum):
    PDF = "pdf"
    HTML = "html"
    JSON = "json"
    CSV = "csv"
    EXCEL = "excel"


class ChartType(str, Enum):
    LINE = "line"
    BAR = "bar"
    PIE = "pie"
    SCATTER = "scatter"
    HEATMAP = "heatmap"
    TABLE = "table"


class ReportSection(BaseModel):
    section_id: str
    title: str
    content: str
    chart_config: Optional[Dict[str, Any]] = None
    data_source: Optional[str] = None
    insights: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)


class ReportMetadata(BaseModel):
    report_id: str
    title: str
    report_type: ReportType
    generated_at: str
    data_period: str
    author: str = "AI Report Generator"
    version: str = "1.0"
    tags: List[str] = Field(default_factory=list)


class ReportOutput(BaseModel):
    metadata: ReportMetadata
    sections: List[ReportSection]
    executive_summary: str
    key_insights: List[str]
    recommendations: List[str]
    data_sources: List[str]
    generation_time_ms: int


class ReportGeneratorAgent(BaseAgent):
    """
    v2.0 Report Generator Agent
    
    Features:
    - AI-powered report generation with insights
    - Multiple report types and formats
    - Dynamic chart and visualization creation
    - Data analysis and trend identification
    - Executive summary generation
    - Actionable recommendations
    """
    
    def __init__(self, api_key: Optional[str] = None):
        super().__init__(
            agent_id="report-generator",
            model="claude-3-5-sonnet-20241022",  # Complex model for report analysis
            temperature=0.3,  # Moderate temperature for creative insights
            max_tokens=4096,
            api_key=api_key
        )
    
    async def _execute_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute report generation task"""
        report_type = task.get("report_type", ReportType.TECHNICAL_ANALYSIS)
        data_sources = task.get("data_sources", [])
        metrics_data = task.get("metrics_data", {})
        time_period = task.get("time_period", "Last 30 days")
        custom_sections = task.get("custom_sections", [])
        
        if not data_sources and not metrics_data:
            raise ValueError("Either data_sources or metrics_data is required")
        
        # Generate report metadata
        metadata = self._create_report_metadata(report_type, time_period, task)
        
        # Analyze data and generate insights
        insights = await self._analyze_data_for_insights(metrics_data, data_sources)
        
        # Generate report sections
        sections = await self._generate_report_sections(
            report_type, metrics_data, insights, custom_sections
        )
        
        # Create executive summary
        executive_summary = await self._generate_executive_summary(
            report_type, sections, insights
        )
        
        # Generate recommendations
        recommendations = await self._generate_recommendations(
            report_type, insights, metrics_data
        )
        
        return {
            "report_id": metadata.report_id,
            "metadata": metadata.dict(),
            "sections": [section.dict() for section in sections],
            "executive_summary": executive_summary,
            "key_insights": insights,
            "recommendations": recommendations,
            "generation_time_ms": task.get("generation_time_ms", 2500),
            "download_url": f"/reports/{metadata.report_id}/download",
            "confidence_score": 0.9
        }
    
    async def _analyze_data_for_insights(
        self, 
        metrics_data: Dict[str, Any], 
        data_sources: List[str]
    ) -> List[str]:
        """Analyze data to extract key insights"""
        
        analysis_prompt = ChatPromptTemplate.from_template("""
        Analyze this metrics data and identify key insights for reporting.
        
        Metrics Data: {metrics}
        Data Sources: {sources}
        
        Identify:
        1. Significant trends and patterns
        2. Performance anomalies or outliers
        3. Key performance indicators (KPIs)
        4. Comparative analysis opportunities
        5. Risk factors or concerns
        6. Growth opportunities
        7. Operational efficiency insights
        
        Provide 5-7 concise, actionable insights that would be valuable for:
        - Executive decision making
        - Operational improvements
        - Strategic planning
        - Risk management
        
        Format each insight as a clear, specific statement.
        """)
        
        response = await self.llm.ainvoke(
            analysis_prompt.format(
                metrics=json.dumps(metrics_data, indent=2)[:1500],
                sources=", ".join(data_sources) if data_sources else "Direct metrics"
            )
        )
        
        # Parse insights from response
        insights = []
        lines = response.content.split('\n')
        for line in lines:
            line = line.strip()
            if line and (line.startswith('-') or line.startswith('•') or line[0].isdigit()):
                # Clean up the insight text
                insight = line.lstrip('-•0123456789. ').strip()
                if insight and len(insight) > 10:
                    insights.append(insight)
        
        return insights[:7]  # Return max 7 insights
    
    async def _generate_report_sections(
        self, 
        report_type: str, 
        metrics_data: Dict, 
        insights: List[str], 
        custom_sections: List[Dict]
    ) -> List[ReportSection]:
        """Generate report sections based on type and data"""
        
        sections_prompt = ChatPromptTemplate.from_template("""
        Generate detailed report sections for a {report_type} report.
        
        Available Data: {metrics}
        Key Insights: {insights}
        
        Create 3-4 comprehensive sections that include:
        1. Section title and detailed content
        2. Relevant data analysis
        3. Visual representation suggestions (charts/graphs)
        4. Specific insights for each section
        5. Actionable recommendations
        
        Tailor content for:
        - Executive Summary: High-level overview for leadership
        - Technical Analysis: Detailed technical metrics and performance
        - Performance Metrics: KPI analysis and benchmarking
        - Security Audit: Security posture and compliance
        - Financial Report: Cost analysis and ROI metrics
        - Operational Dashboard: Real-time operational insights
        
        Make each section substantive with specific data points and analysis.
        """)
        
        response = await self.llm.ainvoke(
            sections_prompt.format(
                report_type=report_type,
                metrics=json.dumps(metrics_data, indent=2)[:1000],
                insights="\n".join(f"- {insight}" for insight in insights)
            )
        )
        
        # Generate standard sections based on report type
        sections = self._create_standard_sections(report_type, metrics_data, insights)
        
        # Add custom sections if provided
        for custom_section in custom_sections:
            sections.append(ReportSection(
                section_id=custom_section.get("id", f"custom_{len(sections)}"),
                title=custom_section.get("title", "Custom Section"),
                content=custom_section.get("content", "Custom content"),
                insights=custom_section.get("insights", []),
                recommendations=custom_section.get("recommendations", [])
            ))
        
        return sections
    
    async def _generate_executive_summary(
        self, 
        report_type: str, 
        sections: List[ReportSection], 
        insights: List[str]
    ) -> str:
        """Generate executive summary for the report"""
        
        summary_prompt = ChatPromptTemplate.from_template("""
        Create a compelling executive summary for this {report_type} report.
        
        Report Sections: {section_titles}
        Key Insights: {insights}
        
        The executive summary should:
        1. Provide a high-level overview of findings
        2. Highlight the most critical insights
        3. Summarize key recommendations
        4. Be concise but comprehensive (2-3 paragraphs)
        5. Be accessible to non-technical executives
        6. Include specific metrics and outcomes where relevant
        
        Focus on:
        - Business impact and implications
        - Strategic recommendations
        - Risk factors and opportunities
        - Next steps and priorities
        """)
        
        section_titles = [f"- {section.title}" for section in sections]
        
        response = await self.llm.ainvoke(
            summary_prompt.format(
                report_type=report_type,
                section_titles="\n".join(section_titles),
                insights="\n".join(f"- {insight}" for insight in insights)
            )
        )
        
        return response.content.strip()
    
    async def _generate_recommendations(
        self, 
        report_type: str, 
        insights: List[str], 
        metrics_data: Dict
    ) -> List[str]:
        """Generate actionable recommendations based on analysis"""
        
        recommendations_prompt = ChatPromptTemplate.from_template("""
        Generate specific, actionable recommendations based on this analysis.
        
        Report Type: {report_type}
        Key Insights: {insights}
        Metrics Summary: {metrics}
        
        Provide 4-6 recommendations that are:
        1. Specific and actionable
        2. Prioritized by impact and feasibility
        3. Include estimated timelines
        4. Address identified issues or opportunities
        5. Aligned with business objectives
        
        Format each recommendation with:
        - Clear action statement
        - Expected outcome
        - Implementation timeline
        - Priority level (High/Medium/Low)
        """)
        
        response = await self.llm.ainvoke(
            recommendations_prompt.format(
                report_type=report_type,
                insights="\n".join(f"- {insight}" for insight in insights),
                metrics=str(metrics_data)[:500]
            )
        )
        
        # Parse recommendations from response
        recommendations = []
        lines = response.content.split('\n')
        current_recommendation = ""
        
        for line in lines:
            line = line.strip()
            if line and (line.startswith('-') or line.startswith('•') or line[0].isdigit()):
                if current_recommendation:
                    recommendations.append(current_recommendation.strip())
                current_recommendation = line.lstrip('-•0123456789. ')
            elif line and current_recommendation:
                current_recommendation += " " + line
        
        if current_recommendation:
            recommendations.append(current_recommendation.strip())
        
        return recommendations[:6]  # Return max 6 recommendations
    
    def _create_report_metadata(
        self, 
        report_type: str, 
        time_period: str, 
        task: Dict
    ) -> ReportMetadata:
        """Create report metadata"""
        report_id = f"rpt_{int(__import__('time').time())}"
        
        return ReportMetadata(
            report_id=report_id,
            title=f"{report_type.replace('_', ' ').title()} Report",
            report_type=ReportType(report_type),
            generated_at=datetime.now().isoformat(),
            data_period=time_period,
            tags=task.get("tags", [report_type, "ai-generated"])
        )
    
    def _create_standard_sections(
        self, 
        report_type: str, 
        metrics_data: Dict, 
        insights: List[str]
    ) -> List[ReportSection]:
        """Create standard sections based on report type"""
        sections = []
        
        if report_type == ReportType.EXECUTIVE_SUMMARY:
            sections.extend([
                ReportSection(
                    section_id="overview",
                    title="Business Overview",
                    content="High-level business performance and key metrics analysis.",
                    chart_config={"type": "bar", "title": "Key Performance Indicators"},
                    insights=insights[:2]
                ),
                ReportSection(
                    section_id="strategic_insights",
                    title="Strategic Insights",
                    content="Strategic analysis and market positioning insights.",
                    insights=insights[2:4]
                )
            ])
        
        elif report_type == ReportType.TECHNICAL_ANALYSIS:
            sections.extend([
                ReportSection(
                    section_id="performance_metrics",
                    title="System Performance Analysis",
                    content="Detailed technical performance metrics and system health analysis.",
                    chart_config={"type": "line", "title": "Performance Trends"},
                    insights=insights[:3]
                ),
                ReportSection(
                    section_id="resource_utilization",
                    title="Resource Utilization",
                    content="Analysis of system resource usage and optimization opportunities.",
                    chart_config={"type": "heatmap", "title": "Resource Usage Patterns"},
                    insights=insights[3:5]
                )
            ])
        
        elif report_type == ReportType.SECURITY_AUDIT:
            sections.extend([
                ReportSection(
                    section_id="security_posture",
                    title="Security Posture Assessment",
                    content="Overall security health and vulnerability analysis.",
                    chart_config={"type": "pie", "title": "Security Risk Distribution"},
                    insights=insights[:2]
                ),
                ReportSection(
                    section_id="compliance_status",
                    title="Compliance Status",
                    content="Regulatory compliance assessment and gap analysis.",
                    insights=insights[2:4]
                )
            ])
        
        else:
            # Default sections for other report types
            sections.extend([
                ReportSection(
                    section_id="analysis",
                    title="Data Analysis",
                    content="Comprehensive data analysis and findings.",
                    insights=insights[:3]
                ),
                ReportSection(
                    section_id="trends",
                    title="Trends and Patterns",
                    content="Identified trends and patterns in the data.",
                    chart_config={"type": "line", "title": "Trend Analysis"},
                    insights=insights[3:5]
                )
            ])
        
        return sections
