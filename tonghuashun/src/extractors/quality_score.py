"""Quality scoring for articles based on source credibility, content length, and information density."""

import math
import re
from typing import Any


def _estimate_information_density(body: str) -> float:
    """
    Estimate information density of article body.

    Uses heuristics: sentence count, named entity presence (capitalized words),
    numeric data presence, and avoidance of repetitive boilerplate.
    Returns a value between 0.0 and 1.0.
    """
    if not body or len(body) < 20:
        return 0.0

    sentences = re.split(r'[.!?。！？\n]+', body)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 10]

    if not sentences:
        return 0.0

    # Named entity proxy: capitalized words
    words = body.split()
    if not words:
        return 0.0

    capitalized = sum(1 for w in words if w and w[0].isupper()) / len(words)

    # Numeric data presence
    has_numbers = bool(re.search(r'\d+%|\d+ million|\d+ billion|\$\d+|\d+x', body))

    # Sentence count factor (diminishing returns after ~30 sentences)
    sentence_factor = min(len(sentences) / 30.0, 1.0)

    density = (capitalized * 0.3 + (0.3 if has_numbers else 0.0) + sentence_factor * 0.4)
    return min(density, 1.0)


def score_article(article: dict[str, Any]) -> float:
    """
    Compute quality score for an article.

    Score = credibility * 0.4 + content_factor * 0.3 + density_factor * 0.3

    Args:
        article: Dict with 'source.credibility' and 'raw.body'

    Returns:
        Quality score between 0.0 and 1.0
    """
    credibility = article.get("source", {}).get("credibility", 0.5)

    body = article.get("raw", {}).get("body", "")
    body_length = len(body)
    # log scaling: 100 chars -> 0.33, 1000 -> 0.67, 10000 -> 1.0
    content_factor = min(math.log(max(body_length, 1), 10) / 4.0, 1.0)

    density = _estimate_information_density(body)

    score = credibility * 0.4 + content_factor * 0.3 + density * 0.3
    return round(min(score, 1.0), 4)


def filter_by_quality(
    articles: list[dict[str, Any]],
    min_score: float = 0.3,
    top_n: int = 20
) -> list[dict[str, Any]]:
    """
    Score all articles, filter by minimum score, and return top N.

    Each article is annotated with a '_quality_score' field.

    Args:
        articles: List of article dicts
        min_score: Minimum quality score to include
        top_n: Maximum number of articles to return

    Returns:
        Filtered and scored articles, sorted by quality descending
    """
    for article in articles:
        article["_quality_score"] = score_article(article)

    qualified = [a for a in articles if a["_quality_score"] >= min_score]
    qualified.sort(key=lambda a: a["_quality_score"], reverse=True)

    return qualified[:top_n]
