import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src', 'extractors'))

from quality_score import score_article, filter_by_quality


def test_score_article_max_quality():
    article = {
        "source": {"credibility": 1.0},
        "raw": {"body": "A" * 5000, "title": "Important AI News"}
    }
    score = score_article(article)
    assert 0 <= score <= 1
    assert score > 0.75


def test_score_article_low_quality():
    article = {
        "source": {"credibility": 0.1},
        "raw": {"body": "short", "title": "x"}
    }
    score = score_article(article)
    assert 0 <= score <= 1
    assert score < 0.5


def test_score_article_missing_body():
    article = {
        "source": {"credibility": 0.8},
        "raw": {"title": "Test"}
    }
    score = score_article(article)
    assert score < 0.35


def test_filter_by_quality_removes_low_scores():
    articles = [
        {"id": "1", "source": {"credibility": 0.9}, "raw": {"body": "A" * 3000, "title": "Good Article"}},
        {"id": "2", "source": {"credibility": 0.1}, "raw": {"body": "bad", "title": "Bad Article"}},
        {"id": "3", "source": {"credibility": 0.5}, "raw": {"body": "A" * 500, "title": "OK Article"}},
    ]
    scored = filter_by_quality(articles, min_score=0.3, top_n=10)
    ids = [a["id"] for a in scored]
    assert "1" in ids


def test_filter_by_quality_top_n():
    articles = [
        {"id": str(i), "source": {"credibility": 0.5 + i * 0.05}, "raw": {"body": "A" * (100 + i * 200), "title": f"Article {i}"}}
        for i in range(20)
    ]
    result = filter_by_quality(articles, min_score=0.0, top_n=5)
    assert len(result) == 5
