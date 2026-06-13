import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src', 'extractors'))

from schema_validator import validate_raw_record, validate_structured_insight, validate_relation_graph


def test_validate_valid_raw_record():
    record = {
        "id": "abc-123",
        "source": {
            "name": "TechCrunch",
            "type": "tech_media",
            "url": "https://techcrunch.com/example",
            "credibility": 0.92
        },
        "fetch_metadata": {
            "fetched_at": "2026-06-13T08:00:00Z",
            "method": "websearch",
            "agent_id": "agent_a"
        },
        "raw": {
            "title": "OpenAI Releases GPT-5",
            "body": "OpenAI announced the release of GPT-5 today...",
            "published_at": "2026-06-13T06:30:00Z",
            "language": "en"
        }
    }
    is_valid, errors = validate_raw_record(record)
    assert is_valid, f"Expected valid but got errors: {errors}"


def test_validate_raw_record_missing_required():
    record = {"id": "abc"}
    is_valid, errors = validate_raw_record(record)
    assert not is_valid
    assert len(errors) > 0


def test_validate_raw_record_invalid_credibility():
    record = {
        "id": "abc",
        "source": {
            "name": "Test", "type": "tech_media",
            "url": "https://example.com", "credibility": 1.5
        },
        "fetch_metadata": {
            "fetched_at": "2026-06-13T08:00:00Z",
            "method": "websearch", "agent_id": "a"
        },
        "raw": {
            "title": "Test", "body": "Test body",
            "published_at": "2026-06-13T08:00:00Z", "language": "en"
        }
    }
    is_valid, errors = validate_raw_record(record)
    assert not is_valid


def test_validate_valid_structured_insight():
    insight = {
        "id": "insight-1",
        "raw_record_id": "abc-123",
        "classification": {
            "category": "product_launch",
            "sub_category": "LLM",
            "ai_domain": ["LLM"],
            "confidence": 0.95
        },
        "entities": {
            "organizations": [{"name": "OpenAI", "role": "developer"}],
            "people": [],
            "technologies": [{"name": "GPT-5", "maturity": "released", "category": "LLM"}],
            "metrics": []
        },
        "sentiment": {
            "overall": "positive",
            "certainty": 0.88,
            "signals": ["技术突破"]
        },
        "impact_assessment": {
            "scope": "global",
            "timeframe": "long_term",
            "magnitude": 5
        }
    }
    is_valid, errors = validate_structured_insight(insight)
    assert is_valid, f"Expected valid but got errors: {errors}"


def test_validate_structured_insight_invalid_magnitude():
    insight = {
        "id": "insight-1",
        "raw_record_id": "abc-123",
        "classification": {
            "category": "product_launch",
            "ai_domain": ["LLM"],
            "confidence": 0.95
        },
        "entities": {},
        "sentiment": {"overall": "positive", "certainty": 0.88},
        "impact_assessment": {"scope": "global", "timeframe": "long_term", "magnitude": 10}
    }
    is_valid, errors = validate_structured_insight(insight)
    assert not is_valid


def test_validate_valid_relation_graph():
    graph = {
        "nodes": ["id_1", "id_2"],
        "edges": [
            {
                "from": "id_1", "to": "id_2",
                "relation": "competes_with",
                "strength": 0.85,
                "explanation": "Direct competition"
            }
        ],
        "clusters": [
            {"theme": "LLM Competition", "members": ["id_1", "id_2"], "coverage": 0.78}
        ]
    }
    is_valid, errors = validate_relation_graph(graph)
    assert is_valid, f"Expected valid but got errors: {errors}"


def test_validate_relation_graph_invalid_relation():
    graph = {
        "nodes": ["id_1"],
        "edges": [
            {"from": "id_1", "to": "id_1", "relation": "invalid_type", "strength": 0.5, "explanation": "test"}
        ],
        "clusters": []
    }
    is_valid, errors = validate_relation_graph(graph)
    assert not is_valid
