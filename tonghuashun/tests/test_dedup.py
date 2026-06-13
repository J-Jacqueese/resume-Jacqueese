import json
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src', 'extractors'))

from dedup import deduplicate_articles, title_similarity


def test_title_similarity_identical():
    assert title_similarity("OpenAI Releases GPT-5", "OpenAI Releases GPT-5") > 0.95


def test_title_similarity_different():
    assert title_similarity("OpenAI Releases GPT-5", "Google Launches Gemini Ultra") < 0.5


def test_title_similarity_similar():
    sim = title_similarity(
        "OpenAI Releases GPT-5 with Enhanced Reasoning",
        "OpenAI Launches GPT-5: Better Reasoning Capabilities"
    )
    assert sim > 0.5


def test_deduplicate_removes_duplicates():
    articles = [
        {
            "id": "1",
            "source": {"credibility": 0.9, "name": "TechCrunch"},
            "raw": {"title": "OpenAI Releases GPT-5"}
        },
        {
            "id": "2",
            "source": {"credibility": 0.7, "name": "VentureBeat"},
            "raw": {"title": "OpenAI Releases GPT-5"}
        },
        {
            "id": "3",
            "source": {"credibility": 0.8, "name": "The Verge"},
            "raw": {"title": "Google Launches Gemini Ultra"}
        }
    ]
    result = deduplicate_articles(articles, threshold=0.8)
    ids = [a["id"] for a in result]
    assert "1" in ids  # higher credibility survives
    assert "2" not in ids  # duplicate, lower credibility removed
    assert "3" in ids  # unique article kept


def test_deduplicate_handles_empty():
    assert deduplicate_articles([]) == []


def test_deduplicate_handles_single():
    articles = [{"id": "1", "source": {"credibility": 0.9}, "raw": {"title": "Test"}}]
    assert deduplicate_articles(articles) == articles
