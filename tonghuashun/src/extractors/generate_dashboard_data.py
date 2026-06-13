"""Generate dashboard_data.json from structured insights and analysis results.

This is the bridge between Python data processing and the HTML Dashboard.
The output JSON is consumed by index.html for rendering all visualizations.
"""

import json
from datetime import datetime, timezone
from typing import Any


def generate_dashboard_data(
    insights: list[dict[str, Any]],
    hot_topics: list[dict[str, Any]],
    trend_analysis: dict[str, str],
    risk_opportunities: list[dict[str, Any]],
    relation_graph: dict[str, Any]
) -> dict[str, Any]:
    """
    Transform structured analysis results into dashboard-ready JSON.

    Args:
        insights: List of StructuredInsight objects
        hot_topics: Top 3-5 hot topics with rank, title, summary
        trend_analysis: Dict with technology/application/policy/capital keys
        risk_opportunities: List of {type: risk|opportunity, title, description}
        relation_graph: Layer 3 RelationGraph with nodes, edges, clusters

    Returns:
        Dashboard data dict ready to be written as dashboard_data.json
    """

    # --- Overview ---
    sentiment_counts: dict[str, int] = {"positive": 0, "neutral": 0, "negative": 0}
    category_counts: dict[str, int] = {}
    domain_counts: dict[str, int] = {}
    org_counts: dict[str, int] = {}

    for insight in insights:
        # Sentiment
        s = insight.get("sentiment", {}).get("overall", "neutral")
        if s in sentiment_counts:
            sentiment_counts[s] += 1

        # Category
        cat = insight.get("classification", {}).get("category", "other")
        category_counts[cat] = category_counts.get(cat, 0) + 1

        # Domains
        for domain in insight.get("classification", {}).get("ai_domain", []):
            domain_counts[domain] = domain_counts.get(domain, 0) + 1

        # Organizations
        for org in insight.get("entities", {}).get("organizations", []):
            name = org.get("name", "Unknown")
            org_counts[name] = org_counts.get(name, 0) + 1

    # --- Impact Ranking ---
    impact_ranking = sorted(
        [
            {
                "id": ins["id"],
                "title": ins.get("_title", ins["id"]),
                "category": ins.get("classification", {}).get("category", "other"),
                "magnitude": ins.get("impact_assessment", {}).get("magnitude", 1),
                "scope": ins.get("impact_assessment", {}).get("scope", "industry")
            }
            for ins in insights
        ],
        key=lambda x: x["magnitude"],
        reverse=True
    )[:10]

    # --- Domain Radar ---
    radar_domains = ["LLM", "CV", "Robotics", "AI_Policy", "AI_Capital", "AI_Application"]
    domain_radar = [
        {"domain": d.replace("AI_", "").replace("_", " "), "count": domain_counts.get(d, 0)}
        for d in radar_domains
    ]

    # --- Entity Network ---
    org_nodes = [
        {"id": name, "group": "organization", "weight": count}
        for name, count in sorted(org_counts.items(), key=lambda x: x[1], reverse=True)[:15]
    ]

    entity_network = {
        "nodes": org_nodes,
        "edges": [
            {
                "source": edge["from"],
                "target": edge["to"],
                "relation": edge["relation"],
                "strength": edge["strength"]
            }
            for edge in relation_graph.get("edges", [])
        ],
        "clusters": relation_graph.get("clusters", [])
    }

    return {
        "metadata": {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "report_date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            "total_articles": len(insights)
        },
        "overview": {
            "total_articles": len(insights),
            "hot_topics_count": len(hot_topics),
            "risks_count": sum(1 for r in risk_opportunities if r.get("type") == "risk"),
            "opportunities_count": sum(1 for r in risk_opportunities if r.get("type") == "opportunity")
        },
        "hot_topics": hot_topics,
        "sentiment_distribution": sentiment_counts,
        "category_distribution": [
            {"category": cat, "count": count}
            for cat, count in sorted(category_counts.items(), key=lambda x: x[1], reverse=True)
        ],
        "domain_radar": domain_radar,
        "entity_network": entity_network,
        "impact_ranking": impact_ranking,
        "trend_summary": trend_analysis,
        "risk_opportunities": risk_opportunities
    }
