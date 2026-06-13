import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src', 'extractors'))

from generate_dashboard_data import generate_dashboard_data


def test_generate_dashboard_data_structure():
    insights = [
        {
            "id": "i1",
            "classification": {"category": "product_launch", "ai_domain": ["LLM"], "confidence": 0.95},
            "entities": {
                "organizations": [{"name": "OpenAI", "role": "developer"}],
                "technologies": [{"name": "GPT-5", "maturity": "released", "category": "LLM"}],
                "people": [],
                "metrics": []
            },
            "sentiment": {"overall": "positive", "certainty": 0.9},
            "impact_assessment": {"scope": "global", "timeframe": "long_term", "magnitude": 5}
        },
        {
            "id": "i2",
            "classification": {"category": "policy", "ai_domain": ["AI_Policy"], "confidence": 0.8},
            "entities": {
                "organizations": [{"name": "EU Commission", "role": "regulator"}],
                "technologies": [],
                "people": [],
                "metrics": []
            },
            "sentiment": {"overall": "neutral", "certainty": 0.75},
            "impact_assessment": {"scope": "regional", "timeframe": "short_term", "magnitude": 3}
        }
    ]

    hot_topics = [
        {"rank": 1, "title": "GPT-5 Launch", "insight_ids": ["i1"], "magnitude": 5, "summary": "Big release"},
        {"rank": 2, "title": "EU AI Act Update", "insight_ids": ["i2"], "magnitude": 3, "summary": "Policy change"}
    ]

    trend_analysis = {
        "technology": "LLM多模态能力成为标配",
        "application": "AI应用向企业级渗透",
        "policy": "全球AI监管框架加速成形",
        "capital": "AI投资向应用层转移"
    }

    risk_opportunities = [
        {"type": "risk", "title": "监管不确定性", "description": "EU AI Act可能影响..."},
        {"type": "opportunity", "title": "LLM应用层机会", "description": "垂直行业..."}
    ]

    relation_graph = {
        "nodes": ["i1", "i2"],
        "edges": [],
        "clusters": [{"theme": "AI Industry Evolution", "members": ["i1", "i2"], "coverage": 0.8}]
    }

    data = generate_dashboard_data(insights, hot_topics, trend_analysis, risk_opportunities, relation_graph)

    # Check required top-level keys
    assert "metadata" in data
    assert "overview" in data
    assert "hot_topics" in data
    assert "sentiment_distribution" in data
    assert "category_distribution" in data
    assert "domain_radar" in data
    assert "entity_network" in data
    assert "impact_ranking" in data
    assert "trend_summary" in data
    assert "risk_opportunities" in data

    # Check overview
    assert data["overview"]["total_articles"] == 2
    assert data["overview"]["hot_topics_count"] == 2

    # Check sentiment
    assert data["sentiment_distribution"]["positive"] == 1
    assert data["sentiment_distribution"]["neutral"] == 1

    # Check impact ranking
    assert len(data["impact_ranking"]) == 2
    assert data["impact_ranking"][0]["magnitude"] == 5


def test_generate_dashboard_data_empty_insights():
    data = generate_dashboard_data([], [], {}, [], {"nodes": [], "edges": [], "clusters": []})
    assert data["overview"]["total_articles"] == 0
    assert data["sentiment_distribution"] == {"positive": 0, "neutral": 0, "negative": 0}
