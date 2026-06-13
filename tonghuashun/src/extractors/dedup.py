"""Deduplicate articles by title similarity using difflib.SequenceMatcher."""

from difflib import SequenceMatcher
from typing import Any


def title_similarity(title1: str, title2: str) -> float:
    """Compute similarity ratio between two titles (0.0 to 1.0)."""
    return SequenceMatcher(None, title1.lower().strip(), title2.lower().strip()).ratio()


def deduplicate_articles(articles: list[dict[str, Any]], threshold: float = 0.75) -> list[dict[str, Any]]:
    """
    Remove duplicate articles based on title similarity.

    When duplicates are found, the article with the highest source credibility survives.

    Args:
        articles: List of article dicts, each must have 'id', 'source.credibility', 'raw.title'
        threshold: Similarity ratio above which two articles are considered duplicates

    Returns:
        Deduplicated list of articles
    """
    if len(articles) <= 1:
        return list(articles)

    # Sort by credibility descending so higher-credibility articles are kept
    sorted_articles = sorted(
        articles,
        key=lambda a: a.get("source", {}).get("credibility", 0),
        reverse=True
    )

    kept: list[dict[str, Any]] = []
    kept_ids: set[str] = set()

    for article in sorted_articles:
        title = article.get("raw", {}).get("title", "")
        is_duplicate = False

        for existing in kept:
            existing_title = existing.get("raw", {}).get("title", "")
            if title_similarity(title, existing_title) >= threshold:
                is_duplicate = True
                break

        article_id = article.get("id", "")
        if not is_duplicate and article_id and article_id not in kept_ids:
            kept.append(article)
            kept_ids.add(article_id)

    return kept
