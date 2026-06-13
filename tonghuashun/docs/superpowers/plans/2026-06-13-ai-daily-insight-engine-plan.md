# AI Daily Insight Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 6-phase AI daily insight engine that collects AI news from 3 parallel sources, extracts structured insights via a 3-layer schema, performs multi-dimensional analysis with adversarial verification, and outputs a Markdown report + interactive HTML dashboard.

**Architecture:** Hybrid Python + TypeScript stack. Claude Code Workflow script orchestrates 6 phases: parallel data collection → dedup barrier → structured extraction pipeline → fan-out analysis → adversarial verification → report synthesis. Python handles data processing & validation, HTML/D3.js/ECarts handles interactive visualization.

**Tech Stack:** Claude Code Workflow (JS), Python 3.x (jsonschema, difflib, json), HTML + D3.js + ECharts CDN

---

## File Structure

```
ai-daily-insight/
├── data/
│   ├── raw/2026-06-13/          # 3 JSON files from Phase 1 agents
│   ├── processed/               # deduped + scored articles
│   └── structured/              # Schema-extracted insights
├── output/
│   ├── reports/                 # Markdown daily report
│   ├── dashboard/               # index.html + dashboard_data.json
│   └── examples/                # Pre-generated example output
├── src/
│   ├── workflow/
│   │   └── daily-insight-workflow.js   # Main orchestration
│   ├── extractors/
│   │   ├── dedup.py
│   │   ├── quality_score.py
│   │   ├── schema_validator.py
│   │   └── generate_dashboard_data.py
│   ├── prompts/
│   │   ├── collection_en_media.md
│   │   ├── collection_aggregator.md
│   │   ├── collection_zh_media.md
│   │   ├── extraction.md
│   │   ├── analysis_hotspots.md
│   │   ├── analysis_trends.md
│   │   ├── analysis_risks.md
│   │   ├── verification.md
│   │   └── report_synthesis.md
│   └── schemas/
│       ├── raw_record.schema.json
│       ├── structured_insight.schema.json
│       └── relation_graph.schema.json
├── tests/
│   ├── test_dedup.py
│   ├── test_quality_score.py
│   ├── test_schema_validator.py
│   └── test_generate_dashboard_data.py
├── docs/superpowers/
│   ├── specs/2026-06-13-ai-daily-insight-engine-design.md
│   └── plans/2026-06-13-ai-daily-insight-engine-plan.md
├── README.md
└── .gitignore
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `.gitignore` (update if needed)
- Create: `requirements.txt`
- Create: all empty directories via `mkdir -p`

- [ ] **Step 1: Create directory structure**

Run:
```bash
mkdir -p data/raw/2026-06-13 data/processed data/structured \
  output/reports output/dashboard output/examples \
  src/workflow src/extractors src/prompts src/schemas \
  tests
```

- [ ] **Step 2: Write requirements.txt**

Write `requirements.txt`:
```
jsonschema>=4.20.0
```

- [ ] **Step 3: Update .gitignore**

Read the existing `.gitignore`, then Edit to append:
```
# Python virtualenv
.venv/
venv/

# Python cache
__pycache__/
*.pyc

# Data (keep structure, ignore content)
data/raw/*
data/processed/*
data/structured/*
!data/raw/.gitkeep
!data/processed/.gitkeep
!data/structured/.gitkeep

# Output examples (keep structure)
output/reports/*
output/dashboard/*
!output/reports/.gitkeep
!output/dashboard/.gitkeep
!output/examples/
```

- [ ] **Step 4: Create .gitkeep files for empty dirs**

Run:
```bash
touch data/raw/.gitkeep data/processed/.gitkeep data/structured/.gitkeep \
  output/reports/.gitkeep output/dashboard/.gitkeep
```

- [ ] **Step 5: Commit scaffold**

```bash
git add -A
git commit -m "chore: scaffold project structure for AI Daily Insight Engine"
```

---

### Task 2: JSON Schema Definitions

**Files:**
- Create: `src/schemas/raw_record.schema.json`
- Create: `src/schemas/structured_insight.schema.json`
- Create: `src/schemas/relation_graph.schema.json`

- [ ] **Step 1: Write RawRecord JSON Schema**

Write `src/schemas/raw_record.schema.json`:
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "raw_record.schema.json",
  "title": "RawRecord",
  "description": "Layer 1: Original news data with source metadata and fetch provenance",
  "type": "object",
  "required": ["id", "source", "fetch_metadata", "raw"],
  "properties": {
    "id": {
      "type": "string",
      "description": "UUID v4 for this record"
    },
    "source": {
      "type": "object",
      "required": ["name", "type", "url", "credibility"],
      "properties": {
        "name": { "type": "string", "description": "Source name, e.g. TechCrunch" },
        "type": {
          "type": "string",
          "enum": ["tech_media", "aggregator", "official", "social_media"]
        },
        "url": { "type": "string", "format": "uri" },
        "credibility": { "type": "number", "minimum": 0, "maximum": 1 }
      }
    },
    "fetch_metadata": {
      "type": "object",
      "required": ["fetched_at", "method", "agent_id"],
      "properties": {
        "fetched_at": { "type": "string", "format": "date-time" },
        "method": { "type": "string", "enum": ["websearch", "api", "manual"] },
        "agent_id": { "type": "string" }
      }
    },
    "raw": {
      "type": "object",
      "required": ["title", "body", "published_at", "language"],
      "properties": {
        "title": { "type": "string", "minLength": 1 },
        "body": { "type": "string", "minLength": 1 },
        "url": { "type": "string", "format": "uri" },
        "published_at": { "type": "string", "format": "date-time" },
        "language": { "type": "string", "enum": ["en", "zh"] }
      }
    }
  }
}
```

- [ ] **Step 2: Write StructuredInsight JSON Schema**

Write `src/schemas/structured_insight.schema.json`:
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "structured_insight.schema.json",
  "title": "StructuredInsight",
  "description": "Layer 2: Structured extraction with classification, entities, sentiment, and impact assessment",
  "type": "object",
  "required": ["id", "raw_record_id", "classification", "entities", "sentiment", "impact_assessment"],
  "properties": {
    "id": { "type": "string", "description": "UUID v4 for this insight" },
    "raw_record_id": { "type": "string", "description": "Reference to RawRecord.id" },
    "classification": {
      "type": "object",
      "required": ["category", "ai_domain", "confidence"],
      "properties": {
        "category": {
          "type": "string",
          "enum": ["product_launch", "funding", "research", "policy", "acquisition", "partnership", "other"]
        },
        "sub_category": { "type": "string" },
        "ai_domain": {
          "type": "array",
          "minItems": 1,
          "items": {
            "type": "string",
            "enum": ["LLM", "CV", "Robotics", "Speech", "RL", "AGI", "AI_Safety", "AI_Infra", "AI_Application", "AI_Policy", "AI_Capital"]
          }
        },
        "confidence": { "type": "number", "minimum": 0, "maximum": 1 }
      }
    },
    "entities": {
      "type": "object",
      "properties": {
        "organizations": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["name", "role"],
            "properties": {
              "name": { "type": "string" },
              "role": { "type": "string" }
            }
          }
        },
        "people": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["name"],
            "properties": {
              "name": { "type": "string" },
              "title": { "type": "string" },
              "org": { "type": "string" }
            }
          }
        },
        "technologies": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["name", "maturity", "category"],
            "properties": {
              "name": { "type": "string" },
              "maturity": { "type": "string", "enum": ["emerging", "developing", "released", "mature", "deprecated"] },
              "category": { "type": "string" }
            }
          }
        },
        "metrics": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["name", "value", "unit"],
            "properties": {
              "name": { "type": "string" },
              "value": { "type": "number" },
              "unit": { "type": "string" }
            }
          }
        }
      }
    },
    "sentiment": {
      "type": "object",
      "required": ["overall", "certainty"],
      "properties": {
        "overall": { "type": "string", "enum": ["positive", "neutral", "negative"] },
        "certainty": { "type": "number", "minimum": 0, "maximum": 1 },
        "signals": { "type": "array", "items": { "type": "string" } }
      }
    },
    "impact_assessment": {
      "type": "object",
      "required": ["scope", "timeframe", "magnitude"],
      "properties": {
        "scope": { "type": "string", "enum": ["industry", "regional", "global"] },
        "timeframe": { "type": "string", "enum": ["immediate", "short_term", "long_term"] },
        "magnitude": { "type": "integer", "minimum": 1, "maximum": 5 }
      }
    }
  }
}
```

- [ ] **Step 3: Write RelationGraph JSON Schema**

Write `src/schemas/relation_graph.schema.json`:
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "relation_graph.schema.json",
  "title": "RelationGraph",
  "description": "Layer 3: Event relationship network with edges and thematic clusters",
  "type": "object",
  "required": ["nodes", "edges", "clusters"],
  "properties": {
    "nodes": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Array of StructuredInsight IDs in this graph"
    },
    "edges": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["from", "to", "relation", "strength", "explanation"],
        "properties": {
          "from": { "type": "string" },
          "to": { "type": "string" },
          "relation": {
            "type": "string",
            "enum": ["competes_with", "enables", "contradicts", "extends", "responds_to"]
          },
          "strength": { "type": "number", "minimum": 0, "maximum": 1 },
          "explanation": { "type": "string", "minLength": 1 }
        }
      }
    },
    "clusters": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["theme", "members", "coverage"],
        "properties": {
          "theme": { "type": "string", "minLength": 1 },
          "members": {
            "type": "array",
            "items": { "type": "string" },
            "minItems": 2
          },
          "coverage": { "type": "number", "minimum": 0, "maximum": 1 }
        }
      }
    }
  }
}
```

- [ ] **Step 4: Commit schemas**

```bash
git add src/schemas/
git commit -m "feat: add 3-layer JSON Schema definitions (RawRecord, StructuredInsight, RelationGraph)"
```

---

### Task 3: Python Data Processing Scripts — Dedup

**Files:**
- Create: `src/extractors/dedup.py`
- Create: `tests/test_dedup.py`

- [ ] **Step 1: Write failing test for dedup**

Write `tests/test_dedup.py`:
```python
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/lucismarvin/Desktop/简历+资料/面试/tonghuashun && python -m pytest tests/test_dedup.py -v`
Expected: FAIL with "ModuleNotFoundError: No module named 'dedup'"

- [ ] **Step 3: Write dedup.py implementation**

Write `src/extractors/dedup.py`:
```python
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
        
        if not is_duplicate and article["id"] not in kept_ids:
            kept.append(article)
            kept_ids.add(article["id"])
    
    return kept
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/lucismarvin/Desktop/简历+资料/面试/tonghuashun && python -m pytest tests/test_dedup.py -v`
Expected: 5 PASS

- [ ] **Step 5: Commit dedup**

```bash
git add src/extractors/dedup.py tests/test_dedup.py
git commit -m "feat: add article deduplication by title similarity with credibility-based survival"
```

---

### Task 4: Python Data Processing Scripts — Quality Score

**Files:**
- Create: `src/extractors/quality_score.py`
- Create: `tests/test_quality_score.py`

- [ ] **Step 1: Write failing test for quality_score**

Write `tests/test_quality_score.py`:
```python
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
    assert score > 0.8


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
    assert score < 0.3


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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/lucismarvin/Desktop/简历+资料/面试/tonghuashun && python -m pytest tests/test_quality_score.py -v`
Expected: FAIL with "ModuleNotFoundError"

- [ ] **Step 3: Write quality_score.py implementation**

Write `src/extractors/quality_score.py`:
```python
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/lucismarvin/Desktop/简历+资料/面试/tonghuashun && python -m pytest tests/test_quality_score.py -v`
Expected: 5 PASS

- [ ] **Step 5: Commit quality_score**

```bash
git add src/extractors/quality_score.py tests/test_quality_score.py
git commit -m "feat: add article quality scoring with credibility, content length, and information density"
```

---

### Task 5: Python Data Processing Scripts — Schema Validator

**Files:**
- Create: `src/extractors/schema_validator.py`
- Create: `tests/test_schema_validator.py`

- [ ] **Step 1: Install jsonschema dependency**

Run: `cd /Users/lucismarvin/Desktop/简历+资料/面试/tonghuashun && pip install jsonschema`

- [ ] **Step 2: Write failing test for schema_validator**

Write `tests/test_schema_validator.py`:
```python
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
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd /Users/lucismarvin/Desktop/简历+资料/面试/tonghuashun && python -m pytest tests/test_schema_validator.py -v`
Expected: FAIL

- [ ] **Step 4: Write schema_validator.py implementation**

Write `src/extractors/schema_validator.py`:
```python
"""Validate AI-generated data against JSON Schemas using jsonschema library."""

import json
import os
from typing import Any

from jsonschema import validate, ValidationError


_SCHEMA_DIR = os.path.join(os.path.dirname(__file__), '..', 'schemas')


def _load_schema(name: str) -> dict[str, Any]:
    """Load a JSON Schema file from the schemas directory."""
    path = os.path.join(_SCHEMA_DIR, name)
    with open(path, 'r') as f:
        return json.load(f)


def validate_raw_record(record: dict[str, Any]) -> tuple[bool, list[str]]:
    """
    Validate a record against RawRecord schema.
    
    Returns:
        Tuple of (is_valid, list_of_error_messages)
    """
    schema = _load_schema('raw_record.schema.json')
    try:
        validate(instance=record, schema=schema)
        return True, []
    except ValidationError as e:
        return False, [str(e)]


def validate_structured_insight(insight: dict[str, Any]) -> tuple[bool, list[str]]:
    """
    Validate an insight against StructuredInsight schema.
    Also runs logical validation: confidence in [0,1], magnitude in [1,5].
    
    Returns:
        Tuple of (is_valid, list_of_error_messages)
    """
    schema = _load_schema('structured_insight.schema.json')
    errors: list[str] = []
    
    try:
        validate(instance=insight, schema=schema)
    except ValidationError as e:
        errors.append(str(e))
    
    # Logical validation beyond JSON Schema
    classification = insight.get("classification", {})
    confidence = classification.get("confidence")
    if confidence is not None and not (0 <= confidence <= 1):
        errors.append(f"classification.confidence must be between 0 and 1, got {confidence}")
    
    impact = insight.get("impact_assessment", {})
    magnitude = impact.get("magnitude")
    if magnitude is not None and not (1 <= magnitude <= 5):
        errors.append(f"impact_assessment.magnitude must be between 1 and 5, got {magnitude}")
    
    sentiment = insight.get("sentiment", {})
    certainty = sentiment.get("certainty")
    if certainty is not None and not (0 <= certainty <= 1):
        errors.append(f"sentiment.certainty must be between 0 and 1, got {certainty}")
    
    is_valid = len(errors) == 0
    return is_valid, errors


def validate_relation_graph(graph: dict[str, Any]) -> tuple[bool, list[str]]:
    """
    Validate a graph against RelationGraph schema.
    
    Returns:
        Tuple of (is_valid, list_of_error_messages)
    """
    schema = _load_schema('relation_graph.schema.json')
    try:
        validate(instance=graph, schema=schema)
        return True, []
    except ValidationError as e:
        return False, [str(e)]


def validate_all_insights(insights: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    """
    Validate a batch of structured insights.
    
    Returns:
        Tuple of (valid_insights, rejected_insights_with_errors)
    """
    valid: list[dict[str, Any]] = []
    rejected: list[dict[str, Any]] = []
    
    for insight in insights:
        is_valid, errors = validate_structured_insight(insight)
        if is_valid:
            valid.append(insight)
        else:
            rejected.append({"insight": insight, "errors": errors})
    
    return valid, rejected
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd /Users/lucismarvin/Desktop/简历+资料/面试/tonghuashun && python -m pytest tests/test_schema_validator.py -v`
Expected: 7 PASS

- [ ] **Step 6: Commit schema_validator**

```bash
git add src/extractors/schema_validator.py tests/test_schema_validator.py
git commit -m "feat: add JSON Schema validator for all 3 layers with logical validation"
```

---

### Task 6: Python Data Processing Scripts — Dashboard Data Generator

**Files:**
- Create: `src/extractors/generate_dashboard_data.py`
- Create: `tests/test_generate_dashboard_data.py`

- [ ] **Step 1: Write failing test for dashboard data generator**

Write `tests/test_generate_dashboard_data.py`:
```python
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/lucismarvin/Desktop/简历+资料/面试/tonghuashun && python -m pytest tests/test_generate_dashboard_data.py -v`
Expected: FAIL

- [ ] **Step 3: Write generate_dashboard_data.py implementation**

Write `src/extractors/generate_dashboard_data.py`:
```python
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
    sentiment_counts = {"positive": 0, "neutral": 0, "negative": 0}
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/lucismarvin/Desktop/简历+资料/面试/tonghuashun && python -m pytest tests/test_generate_dashboard_data.py -v`
Expected: 2 PASS

- [ ] **Step 5: Commit dashboard data generator**

```bash
git add src/extractors/generate_dashboard_data.py tests/test_generate_dashboard_data.py
git commit -m "feat: add dashboard data generator bridging Python analysis to HTML visualization"
```

---

### Task 7: Prompt Templates

**Files:**
- Create: `src/prompts/collection_en_media.md`
- Create: `src/prompts/collection_aggregator.md`
- Create: `src/prompts/collection_zh_media.md`
- Create: `src/prompts/extraction.md`
- Create: `src/prompts/analysis_hotspots.md`
- Create: `src/prompts/analysis_trends.md`
- Create: `src/prompts/analysis_risks.md`
- Create: `src/prompts/verification.md`
- Create: `src/prompts/report_synthesis.md`

- [ ] **Step 1: Write collection prompt for English tech media**

Write `src/prompts/collection_en_media.md`:
```markdown
# Collection Agent: English Tech Media

## Task
Search for AI-related news published in the past 24 hours from major English-language tech media sources: TechCrunch, The Verge, VentureBeat, Ars Technica.

## Search Strategy
1. Search for "AI artificial intelligence news today" on each source
2. Look for AI-specific sections/categories on each site
3. Prioritize articles published within the last 24 hours

## Output Format
Return a JSON array of RawRecord objects. Each record must conform to the RawRecord JSON Schema:

```json
[
  {
    "id": "<uuid>",
    "source": {
      "name": "<publication name>",
      "type": "tech_media",
      "url": "<article URL>",
      "credibility": <0.0-1.0, TechCrunch=0.92, The Verge=0.90, VentureBeat=0.85, Ars Technica=0.88>
    },
    "fetch_metadata": {
      "fetched_at": "<ISO8601 now>",
      "method": "websearch",
      "agent_id": "collection_en_media"
    },
    "raw": {
      "title": "<article title>",
      "body": "<article body text or detailed summary, at least 200 chars>",
      "url": "<article URL>",
      "published_at": "<ISO8601>",
      "language": "en"
    }
  }
]
```

## Quality Requirements
- Minimum 8 articles, target 10
- Body must contain substantial content (>200 chars)
- Published within the past 24 hours
- Must be AI/ML related (not general tech)
- Include diverse categories: product launches, research, funding, policy

## Credibility Guide
| Source | Credibility | Reason |
|--------|-------------|--------|
| TechCrunch | 0.92 | Major tech publication, editorial standards |
| The Verge | 0.90 | Major tech publication, editorial standards |
| Ars Technica | 0.88 | Technical depth, fact-checked |
| VentureBeat | 0.85 | AI-focused coverage, industry standard |
```

- [ ] **Step 2: Write collection prompt for aggregator platforms**

Write `src/prompts/collection_aggregator.md`:
```markdown
# Collection Agent: Aggregator Platforms

## Task
Search for AI-related news, discussions, and product launches from community-driven aggregator platforms: Hacker News, Product Hunt, GitHub Trending repositories.

## Search Strategy
1. Search Hacker News for AI-related posts with >50 points in past 24h
2. Check Product Hunt for AI product launches in past 24h
3. Check GitHub Trending for AI/ML repositories

## Output Format
Return a JSON array of RawRecord objects:

```json
[
  {
    "id": "<uuid>",
    "source": {
      "name": "<Hacker News | Product Hunt | GitHub>",
      "type": "aggregator",
      "url": "<item URL>",
      "credibility": <HN=0.75, PH=0.70, GitHub=0.80>
    },
    "fetch_metadata": {
      "fetched_at": "<ISO8601 now>",
      "method": "websearch",
      "agent_id": "collection_aggregator"
    },
    "raw": {
      "title": "<item title>",
      "body": "<description or discussion summary, at least 150 chars>",
      "url": "<item URL>",
      "published_at": "<ISO8601>",
      "language": "en"
    }
  }
]
```

## Quality Requirements
- Minimum 5 articles, target 8
- For Hacker News: prioritize high-score, high-comment posts
- For Product Hunt: prioritize AI/ML products with significant upvotes
- For GitHub: prioritize repos with >100 stars gained in past day
```

- [ ] **Step 3: Write collection prompt for Chinese tech media**

Write `src/prompts/collection_zh_media.md`:
```markdown
# Collection Agent: Chinese Tech Media

## Task
Search for AI-related news published in the past 24 hours from major Chinese-language tech media: 机器之心 (jiqizhixin), 量子位 (QbitAI), 36氪 AI section.

## Search Strategy
1. Search "AI 人工智能 最新新闻 今天" on each source
2. Check each site's AI-specific sections
3. Prioritize articles published within the last 24 hours

## Output Format
Return a JSON array of RawRecord objects:

```json
[
  {
    "id": "<uuid>",
    "source": {
      "name": "<机器之心 | 量子位 | 36氪>",
      "type": "tech_media",
      "url": "<article URL>",
      "credibility": <机器之心=0.85, 量子位=0.83, 36氪=0.82>
    },
    "fetch_metadata": {
      "fetched_at": "<ISO8601 now>",
      "method": "websearch",
      "agent_id": "collection_zh_media"
    },
    "raw": {
      "title": "<article title in original language>",
      "body": "<article body text or detailed summary, at least 150 chars>",
      "url": "<article URL>",
      "published_at": "<ISO8601>",
      "language": "zh"
    }
  }
]
```

## Quality Requirements
- Minimum 5 articles, target 8
- Body must contain substantial content (>150 chars)
- Published within the past 24 hours
- Must be AI/ML related
- Retain original Chinese text (do not translate)
```

- [ ] **Step 4: Write extraction prompt**

Write `src/prompts/extraction.md`:
```markdown
# Extraction Agent: Structured Insight Extraction

## Task
Extract structured information from a single news article. Produce a StructuredInsight object conforming to the provided JSON Schema.

## Input
You will receive a RawRecord object with the article's title, body, source, and metadata.

## Extraction Guidelines

### Classification
- `category`: Choose from: product_launch, funding, research, policy, acquisition, partnership, other
- `ai_domain`: Identify AI subdomains. Options: LLM, CV, Robotics, Speech, RL, AGI, AI_Safety, AI_Infra, AI_Application, AI_Policy, AI_Capital
- `confidence`: How confident are you in this classification? (0.0-1.0). Lower if article is ambiguous.

### Entities
Extract named entities mentioned in the article:
- **organizations**: Companies, institutions, labs (name + role: developer|investor|regulator|user|competitor)
- **people**: Named individuals (name + optional title + org)
- **technologies**: Specific AI technologies/products (name + maturity: emerging|developing|released|mature|deprecated + category)
- **metrics**: Quantifiable claims (name + value + unit, e.g., "accuracy: 94.5 percentile")

### Sentiment
- `overall`: positive (breakthrough, growth, opportunity) | neutral (factual report) | negative (risk, failure, concern)
- `certainty`: How clear is the sentiment? (0.0-1.0)
- `signals`: 1-3 key phrases supporting the sentiment assessment

### Impact Assessment
- `scope`: industry (affects one sector) | regional (affects a region/country) | global (worldwide impact)
- `timeframe`: immediate (hours-days) | short_term (weeks-months) | long_term (years)
- `magnitude`: 1 (minor) to 5 (transformative). Consider: how many people affected? How much money involved? Does it change the competitive landscape?

## Output
Return a valid StructuredInsight JSON object matching the provided schema exactly.
```

- [ ] **Step 5: Write analysis prompts (hotspots, trends, risks)**

Write `src/prompts/analysis_hotspots.md`:
```markdown
# Analysis Agent: Hot Topic Identification

## Task
Identify the Top 3-5 most important AI events from a collection of StructuredInsight objects. Rank by impact and significance.

## Input
Array of StructuredInsight objects (each with classification, entities, sentiment, impact_assessment).

## Analysis Framework
1. **Impact-first ranking**: Primary sort by impact_assessment.magnitude × scope (global=3, regional=2, industry=1)
2. **Clustering**: Group related insights that cover the same event from different sources
3. **Significance check**: Is this event likely to be discussed/remembered in a week? A month?

## Output Format
```json
[
  {
    "rank": 1,
    "title": "Concise event title (max 80 chars)",
    "insight_ids": ["id1", "id2"],
    "magnitude": 5,
    "summary": "2-3 sentence summary of what happened and why it matters",
    "key_players": ["Org1", "Org2"],
    "category": "product_launch|funding|research|policy|other"
  }
]
```
Return exactly 3-5 hot topics, sorted by rank.
```

Write `src/prompts/analysis_trends.md`:
```markdown
# Analysis Agent: Trend Analysis

## Task
Analyze trends across all StructuredInsight objects in four dimensions: Technology, Application, Policy, Capital.

## Input
Array of all StructuredInsight objects.

## Analysis Guidelines
For each dimension, identify 1-2 emerging trends supported by at least 2 articles. Be specific — avoid generic statements like "AI is growing."

### Technology
- What technical capabilities are becoming mainstream?
- What new architectures or approaches are gaining traction?
- Is there a shift in technical focus (e.g., from scale to efficiency)?

### Application
- Which industries/sectors are seeing increased AI adoption?
- What use cases are moving from experimental to production?
- Any notable enterprise AI deployments?

### Policy
- New regulations or government initiatives?
- Shifts in regulatory stance (more strict vs more permissive)?
- International AI governance developments?

### Capital
- Investment trends: which AI subsectors are attracting funding?
- M&A activity: consolidation patterns?
- Notable funding rounds or valuation changes?

## Output Format
```json
{
  "technology": "Specific trend description with evidence (2-4 sentences)",
  "application": "Specific trend description with evidence (2-4 sentences)",
  "policy": "Specific trend description with evidence (2-4 sentences)",
  "capital": "Specific trend description with evidence (2-4 sentences)"
}
```
```

Write `src/prompts/analysis_risks.md`:
```markdown
# Analysis Agent: Risk & Opportunity Identification

## Task
Identify potential risks and strategic opportunities from the collection of StructuredInsight objects.

## Input
Array of all StructuredInsight objects + HotTopics from the hotspot analysis.

## Analysis Guidelines

### Risks (identify 2-4)
- **Regulatory risk**: New policies that could constrain AI development/deployment
- **Competitive risk**: Market shifts that threaten incumbents
- **Technical risk**: Limitations, failures, or safety concerns revealed
- **Market risk**: Overheating, bubble signals, concentration risk

### Opportunities (identify 2-4)
- **Market gap**: Underserved segments revealed by current offerings
- **Technology transfer**: Research breakthroughs applicable to new domains
- **Ecosystem play**: Infrastructure/tooling needs created by new products
- **Geographic expansion**: Regional opportunities highlighted by news

## Output Format
```json
[
  {
    "type": "risk",
    "title": "Short risk title (max 60 chars)",
    "description": "Detailed explanation with evidence from the data (2-4 sentences)",
    "severity": "high|medium|low",
    "related_insight_ids": ["id1"]
  },
  {
    "type": "opportunity",
    "title": "Short opportunity title (max 60 chars)",
    "description": "Detailed explanation with evidence from the data (2-4 sentences)",
    "potential": "high|medium|low",
    "related_insight_ids": ["id2"]
  }
]
```
Return 4-8 items total (mix of risks and opportunities).
```

- [ ] **Step 6: Write verification prompt**

Write `src/prompts/verification.md`:
```markdown
# Verification Agent: Adversarial Review

## Task
You are a SKEPTIC. Your job is to critically examine an AI-generated conclusion and try to REFUTE it. Default to skeptical unless the evidence is compelling.

## Input
You will receive:
1. The claim/conclusion to verify
2. The specific lens you should apply
3. The original data/insights that support the claim

## Your Lens: {LENS}
- **Fact-check lens**: Does the original data actually support this claim? Is anything misrepresented or exaggerated? Did the analyst read something into the data that isn't there?
- **Logic lens**: Is the reasoning sound? Are there logical fallacies (correlation≠causation, hasty generalization, false dichotomy)? Are there alternative explanations that were ignored?
- **Statistical lens**: Is the sample size sufficient? Is this an outlier being presented as a trend? Is there selection bias in which articles were included?

## Verdict Criteria
- **REFUTE** if: Claim is contradicted by data, reasoning is fundamentally flawed, or evidence is grossly insufficient
- **WEAK** if: Claim has some support but overstates certainty, ignores counter-evidence, or extrapolates too far
- **CONFIRM** if: Claim is well-supported by data, reasoning is sound, and conclusions are proportionate to evidence

## Output Format
```json
{
  "lens": "{LENS}",
  "verdict": "CONFIRM|WEAK|REFUTE",
  "confidence": 0.0-1.0,
  "reasoning": "Detailed explanation of your verdict (2-4 sentences)",
  "specific_issues": ["Issue 1 if any", "Issue 2 if any"]
}
```
```

- [ ] **Step 7: Write report synthesis prompt**

Write `src/prompts/report_synthesis.md`:
```markdown
# Synthesis Agent: Daily Report Generation

## Task
Synthesize all verified analysis results into a comprehensive Markdown daily report and generate the RelationGraph (Layer 3).

## Input
1. Verified HotTopics (after adversarial verification)
2. TrendAnalysis (verified)
3. RiskOpportunities (verified)
4. All StructuredInsight objects

## Report Structure

### Section 1: Executive Summary (3-5 sentences)
One-paragraph overview of today's AI landscape. What's the dominant theme?

### Section 2: Today's Top Stories (table)
| Rank | Event | Impact | Category | Key Players |
Rank by verified importance. 3-5 entries.

### Section 3: Deep Dive — Top Story (300-500 words)
For the #1 story: Background context, what happened, why it matters, who is affected, what to watch next.

### Section 4: Trend Analysis
Technology | Application | Policy | Capital — each with 2-4 sentences of evidence-backed insight.

### Section 5: Risk & Opportunity Radar
Table format: Type (Risk/Opportunity) | Title | Severity/Potential | Description

### Section 6: Looking Ahead
2-3 things to watch in the coming days/weeks based on today's signals.

## RelationGraph Construction
Also produce a RelationGraph (Layer 3) showing:
- Nodes: All insight IDs referenced in this report
- Edges: Meaningful relationships between events (competes_with, enables, contradicts, extends, responds_to)
- Clusters: 1-3 thematic clusters grouping related events

## Output
Return BOTH:
1. The complete Markdown report as a string
2. A valid RelationGraph JSON object

```json
{
  "markdown_report": "# AI Daily Insight Report\n...",
  "relation_graph": {
    "nodes": [...],
    "edges": [...],
    "clusters": [...]
  }
}
```
```

- [ ] **Step 8: Commit prompt templates**

```bash
git add src/prompts/
git commit -m "feat: add 9 prompt templates for all workflow phases — collection, extraction, analysis, verification, synthesis"
```

---

### Task 8: HTML Dashboard

**Files:**
- Create: `output/dashboard/index.html`

- [ ] **Step 1: Write the complete HTML Dashboard**

Write `output/dashboard/index.html`:
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI Daily Insight Dashboard — 2026-06-13</title>
<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js"></script>
<script src="https://d3js.org/d3.v7.min.js"></script>
<style>
:root {
  --bg: #0f0f1a;
  --card-bg: #1a1a2e;
  --border: #2a2a4a;
  --text: #e0e0e0;
  --text-dim: #888;
  --accent: #00d4ff;
  --positive: #4caf50;
  --negative: #f44336;
  --neutral: #ff9800;
  --warning: #ffd93d;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 24px;
  line-height: 1.5;
}
.header {
  text-align: center;
  margin-bottom: 32px;
}
.header h1 {
  font-size: 28px;
  background: linear-gradient(135deg, var(--accent), #7c4dff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.header .date {
  color: var(--text-dim);
  font-size: 14px;
  margin-top: 4px;
}
.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}
.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}
.card .number { font-size: 36px; font-weight: 700; }
.card .label { font-size: 13px; color: var(--text-dim); margin-top: 4px; }
.card .number.accent { color: var(--accent); }
.card .number.positive { color: var(--positive); }
.card .number.warning { color: var(--warning); }
.card .number.negative { color: var(--negative); }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.chart-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}
.chart-card h3 {
  font-size: 15px;
  margin-bottom: 12px;
  color: var(--text);
}
.chart { width: 100%; height: 320px; }
.chart-lg { width: 100%; height: 420px; }
.chart-sm { width: 100%; height: 260px; }
.hot-topics { margin-bottom: 24px; }
.hot-topic-item {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 12px;
}
.hot-topic-item .rank {
  display: inline-block;
  background: var(--accent);
  color: var(--bg);
  font-weight: 700;
  font-size: 14px;
  padding: 2px 10px;
  border-radius: 20px;
  margin-right: 12px;
}
.hot-topic-item h4 { display: inline; font-size: 17px; }
.hot-topic-item .meta { color: var(--text-dim); font-size: 13px; margin: 8px 0; }
.hot-topic-item p { font-size: 14px; margin-top: 8px; color: #ccc; }
.trend-section {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}
.trend-section h3 { margin-bottom: 8px; }
.trend-dim { display: inline-block; background: #2a2a4a; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-right: 8px; }
.risk-opp-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
.risk-opp-table th, .risk-opp-table td { padding: 10px 12px; text-align: left; border-bottom: 1px solid var(--border); font-size: 13px; }
.risk-opp-table th { color: var(--text-dim); font-weight: 600; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
.badge-risk { background: rgba(244,67,54,0.2); color: var(--negative); }
.badge-opportunity { background: rgba(76,175,80,0.2); color: var(--positive); }
.badge-high { background: rgba(244,67,54,0.15); color: #ff6b6b; }
.badge-medium { background: rgba(255,152,0,0.15); color: var(--neutral); }
.badge-low { background: rgba(76,175,80,0.15); color: var(--positive); }
footer { text-align: center; color: var(--text-dim); font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border); }
@media (max-width: 768px) { .grid-2, .grid-3 { grid-template-columns: 1fr; } }
</style>
</head>
<body>

<div class="header">
  <h1>🤖 AI Daily Insight Dashboard</h1>
  <div class="date" id="report-date">Loading...</div>
</div>

<div class="overview-cards" id="overview-cards"></div>

<div class="hot-topics" id="hot-topics"></div>

<div class="grid-2">
  <div class="chart-card"><h3>📊 Category Distribution</h3><div class="chart" id="chart-category"></div></div>
  <div class="chart-card"><h3>🎭 Sentiment Analysis</h3><div class="chart" id="chart-sentiment"></div></div>
</div>

<div class="grid-2">
  <div class="chart-card"><h3>📈 Impact Ranking (Top 10)</h3><div class="chart" id="chart-impact"></div></div>
  <div class="chart-card"><h3>🎯 AI Domain Radar</h3><div class="chart" id="chart-radar"></div></div>
</div>

<div class="chart-card" style="margin-bottom:16px">
  <h3>🔗 Entity Relationship Network</h3>
  <div class="chart-lg" id="chart-network"></div>
</div>

<div class="trend-section" id="trend-section"></div>

<div class="chart-card" style="margin-bottom:16px">
  <h3>⚠️ Risk & Opportunity Radar</h3>
  <table class="risk-opp-table" id="risk-opp-table">
    <thead><tr><th>Type</th><th>Title</th><th>Level</th><th>Description</th></tr></thead>
    <tbody></tbody>
  </table>
</div>

<footer>Generated by AI Daily Insight Engine · Data sources: TechCrunch, The Verge, Hacker News, 机器之心, 量子位, 36氪</footer>

<script>
// Load dashboard data
fetch('dashboard_data.json')
  .then(r => r.json())
  .then(data => {
    renderOverview(data.overview);
    renderHotTopics(data.hot_topics);
    renderCategoryChart(data.category_distribution);
    renderSentimentChart(data.sentiment_distribution);
    renderImpactChart(data.impact_ranking);
    renderRadarChart(data.domain_radar);
    renderNetworkChart(data.entity_network);
    renderTrends(data.trend_summary);
    renderRiskOppTable(data.risk_opportunities);
    document.getElementById('report-date').textContent = 'Report Date: ' + data.metadata.report_date;
  })
  .catch(err => {
    console.error('Failed to load dashboard data:', err);
    document.body.innerHTML = '<div style="text-align:center;padding:100px;color:#f44336"><h2>⚠️ Dashboard Data Not Found</h2><p>Please run the pipeline to generate dashboard_data.json</p></div>';
  });

function renderOverview(ov) {
  document.getElementById('overview-cards').innerHTML = `
    <div class="card"><div class="number accent">${ov.total_articles}</div><div class="label">Articles Analyzed</div></div>
    <div class="card"><div class="number warning">${ov.hot_topics_count}</div><div class="label">Hot Topics</div></div>
    <div class="card"><div class="number negative">${ov.risks_count}</div><div class="label">Risks Identified</div></div>
    <div class="card"><div class="number positive">${ov.opportunities_count}</div><div class="label">Opportunities Found</div></div>
  `;
}

function renderHotTopics(topics) {
  if (!topics || !topics.length) return;
  document.getElementById('hot-topics').innerHTML = `
    <h2 style="margin-bottom:16px">🔥 Today's Top Stories</h2>
    ${topics.map(t => `
      <div class="hot-topic-item">
        <span class="rank">#${t.rank}</span>
        <h4>${t.title}</h4>
        <div class="meta">Impact: ${'⭐'.repeat(t.magnitude)} · ${t.category || ''} · ${(t.key_players || []).join(', ')}</div>
        <p>${t.summary}</p>
      </div>
    `).join('')}
  `;
}

function renderCategoryChart(data) {
  const chart = echarts.init(document.getElementById('chart-category'));
  chart.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['45%', '75%'],
      itemStyle: { borderRadius: 6, borderColor: '#0f0f1a', borderWidth: 3 },
      label: { color: '#888', fontSize: 12 },
      data: data.map(d => ({ name: d.category, value: d.count }))
    }]
  });
}

function renderSentimentChart(data) {
  const chart = echarts.init(document.getElementById('chart-sentiment'));
  chart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['Positive', 'Neutral', 'Negative'], axisLabel: { color: '#888' } },
    yAxis: { type: 'value', axisLabel: { color: '#888' } },
    series: [{
      type: 'bar',
      data: [
        { value: data.positive || 0, itemStyle: { color: '#4caf50' } },
        { value: data.neutral || 0, itemStyle: { color: '#ff9800' } },
        { value: data.negative || 0, itemStyle: { color: '#f44336' } }
      ],
      barWidth: '50%'
    }]
  });
}

function renderImpactChart(data) {
  if (!data || !data.length) return;
  const chart = echarts.init(document.getElementById('chart-impact'));
  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', max: 5, axisLabel: { color: '#888' } },
    yAxis: { type: 'category', data: data.map(d => d.title).reverse(), axisLabel: { color: '#ccc', fontSize: 11, width: 120, overflow: 'truncate' } },
    series: [{
      type: 'bar',
      data: data.map(d => ({ value: d.magnitude, itemStyle: { color: d.magnitude >= 4 ? '#ff6b6b' : d.magnitude >= 3 ? '#ffd93d' : '#00d4ff' } })),
      barWidth: '60%',
      label: { show: true, position: 'right', color: '#888' }
    }]
  });
}

function renderRadarChart(data) {
  if (!data || !data.length) return;
  const chart = echarts.init(document.getElementById('chart-radar'));
  const maxCount = Math.max(...data.map(d => d.count), 1);
  chart.setOption({
    radar: {
      indicator: data.map(d => ({ name: d.domain, max: maxCount })),
      center: ['50%', '55%'],
      radius: '70%',
      axisName: { color: '#ccc', fontSize: 11 }
    },
    series: [{
      type: 'radar',
      data: [{ value: data.map(d => d.count), name: 'Article Count', areaStyle: { color: 'rgba(0,212,255,0.2)' }, lineStyle: { color: '#00d4ff' }, itemStyle: { color: '#00d4ff' } }]
    }]
  });
}

function renderNetworkChart(data) {
  if (!data || !data.nodes || !data.nodes.length) {
    document.getElementById('chart-network').innerHTML = '<div style="text-align:center;padding:100px;color:#888">No entity relationship data available</div>';
    return;
  }
  const width = document.getElementById('chart-network').clientWidth;
  const height = 420;
  const svg = d3.select('#chart-network').append('svg').attr('width', width).attr('height', height);
  
  const nodes = data.nodes.map(d => ({ ...d, radius: Math.max(8, Math.min(30, d.weight * 5)) }));
  const links = (data.edges || []).map(d => ({ source: d.source, target: d.target, relation: d.relation, strength: d.strength }));
  
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(d => d.radius + 2));
  
  const link = svg.append('g').selectAll('line').data(links).join('line')
    .attr('stroke', '#2a2a4a').attr('stroke-width', d => Math.max(1, d.strength * 3));
  
  const node = svg.append('g').selectAll('circle').data(nodes).join('circle')
    .attr('r', d => d.radius).attr('fill', '#00d4ff').attr('opacity', 0.8)
    .call(d3.drag().on('start', (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
      .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
      .on('end', (e, d) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; }));
  
  const label = svg.append('g').selectAll('text').data(nodes).join('text')
    .text(d => d.id).attr('font-size', 10).attr('fill', '#ccc').attr('text-anchor', 'middle').attr('dy', d => d.radius + 12);
  
  simulation.on('tick', () => {
    link.attr('x1', d => d.source.x).attr('y1', d => d.source.y).attr('x2', d => d.target.x).attr('y2', d => d.target.y);
    node.attr('cx', d => d.x).attr('cy', d => d.y);
    label.attr('x', d => d.x).attr('y', d => d.y);
  });
  
  // Legend for relation types
  const relationTypes = [...new Set(links.map(l => l.relation))];
  const legend = svg.append('g').attr('transform', `translate(10, ${height - 20 - relationTypes.length * 20})`);
  relationTypes.forEach((rel, i) => {
    legend.append('rect').attr('x', 0).attr('y', i * 20).attr('width', 12).attr('height', 12).attr('fill', '#00d4ff').attr('opacity', 0.6);
    legend.append('text').attr('x', 18).attr('y', i * 20 + 10).text(rel.replace(/_/g, ' ')).attr('fill', '#888').attr('font-size', 10);
  });
}

function renderTrends(trends) {
  if (!trends) return;
  document.getElementById('trend-section').innerHTML = `
    <h3>📈 Trend Analysis</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
      <div><span class="trend-dim">Technology</span><p style="margin-top:6px;font-size:13px">${trends.technology || 'N/A'}</p></div>
      <div><span class="trend-dim">Application</span><p style="margin-top:6px;font-size:13px">${trends.application || 'N/A'}</p></div>
      <div><span class="trend-dim">Policy</span><p style="margin-top:6px;font-size:13px">${trends.policy || 'N/A'}</p></div>
      <div><span class="trend-dim">Capital</span><p style="margin-top:6px;font-size:13px">${trends.capital || 'N/A'}</p></div>
    </div>
  `;
}

function renderRiskOppTable(items) {
  if (!items || !items.length) return;
  document.querySelector('#risk-opp-table tbody').innerHTML = items.map(item => `
    <tr>
      <td><span class="badge ${item.type === 'risk' ? 'badge-risk' : 'badge-opportunity'}">${item.type.toUpperCase()}</span></td>
      <td>${item.title}</td>
      <td><span class="badge badge-${item.severity || item.potential || 'medium'}">${item.severity || item.potential || 'medium'}</span></td>
      <td>${item.description}</td>
    </tr>
  `).join('');
}
</script>
</body>
</html>
```

- [ ] **Step 2: Commit HTML Dashboard**

```bash
git add output/dashboard/index.html
git commit -m "feat: add interactive HTML Dashboard with ECharts + D3.js — 6 visualization components"
```

---

### Task 9: Workflow Orchestration Script

**Files:**
- Create: `src/workflow/daily-insight-workflow.js`

**Important**: This is a Claude Code Workflow script. It orchestrates the 6 phases using the Workflow tool's `agent()`, `parallel()`, `pipeline()`, and `phase()` functions.

- [ ] **Step 1: Write workflow orchestration script**

Write `src/workflow/daily-insight-workflow.js`:
```javascript
export const meta = {
  name: 'ai-daily-insight',
  description: '6-phase AI Daily Insight Engine: collect → dedup → extract → analyze → verify → report',
  phases: [
    { title: 'Collect', detail: '3 parallel agents collecting from EN media, aggregators, ZH media' },
    { title: 'Process', detail: 'Deduplicate and quality-score collected articles' },
    { title: 'Extract', detail: 'Pipeline extraction of structured insights from each article' },
    { title: 'Analyze', detail: 'Fan-out analysis: hotspots, trends, risks + relation graph' },
    { title: 'Verify', detail: 'Adversarial verification: 3 skeptic lenses per claim' },
    { title: 'Synthesize', detail: 'Report generation and dashboard data creation' }
  ]
};

// ============================================================
// Phase 1: Multi-source Parallel Data Collection
// ============================================================
phase('Collect');

const [enResults, aggResults, zhResults] = await parallel([
  // Agent A: English Tech Media
  () => agent(
    `You are an AI news collector. Search for AI-related news published in the past 24 hours from TechCrunch, The Verge, VentureBeat, and Ars Technica.

Use WebSearch to find recent AI news articles. Use WebFetch to get full article content.

Return a JSON array of 8-10 RawRecord objects conforming to this schema:
{
  "id": "<uuid>",
  "source": { "name": "...", "type": "tech_media", "url": "...", "credibility": <0.85-0.92> },
  "fetch_metadata": { "fetched_at": "<ISO8601>", "method": "websearch", "agent_id": "collection_en_media" },
  "raw": { "title": "...", "body": "<at least 200 chars>", "url": "...", "published_at": "<ISO8601>", "language": "en" }
}

Credibility: TechCrunch=0.92, The Verge=0.90, Ars Technica=0.88, VentureBeat=0.85
Only include articles from the past 24 hours. Articles must be AI/ML related.`,
    { label: 'collect:en_media', phase: 'Collect', schema: COLLECTION_SCHEMA }
  ),

  // Agent B: Aggregator Platforms
  () => agent(
    `You are an AI news collector. Search for AI-related news and discussions from community aggregators: Hacker News, Product Hunt, GitHub Trending.

Use WebSearch to find recent AI-related posts. Use WebFetch to get details.

Return a JSON array of 5-8 RawRecord objects conforming to this schema:
{
  "id": "<uuid>",
  "source": { "name": "<Hacker News|Product Hunt|GitHub>", "type": "aggregator", "url": "...", "credibility": <0.70-0.80> },
  "fetch_metadata": { "fetched_at": "<ISO8601>", "method": "websearch", "agent_id": "collection_aggregator" },
  "raw": { "title": "...", "body": "<at least 150 chars>", "url": "...", "published_at": "<ISO8601>", "language": "en" }
}

Credibility: HN=0.75, ProductHunt=0.70, GitHub=0.80
Prioritize high-engagement posts (HN >50 points, PH significant upvotes, GitHub >100 stars recently).`,
    { label: 'collect:aggregators', phase: 'Collect', schema: COLLECTION_SCHEMA }
  ),

  // Agent C: Chinese Tech Media
  () => agent(
    `You are an AI news collector. Search for AI-related news published in the past 24 hours from Chinese tech media: 机器之心 (jiqizhixin), 量子位 (QbitAI), 36氪 AI section.

Use WebSearch with Chinese keywords like "AI 人工智能 最新新闻 今天". Use WebFetch to get full article content.

Return a JSON array of 5-8 RawRecord objects conforming to this schema:
{
  "id": "<uuid>",
  "source": { "name": "<机器之心|量子位|36氪>", "type": "tech_media", "url": "...", "credibility": <0.82-0.85> },
  "fetch_metadata": { "fetched_at": "<ISO8601>", "method": "websearch", "agent_id": "collection_zh_media" },
  "raw": { "title": "<original Chinese title>", "body": "<at least 150 chars, keep Chinese text>", "url": "...", "published_at": "<ISO8601>", "language": "zh" }
}

Credibility: 机器之心=0.85, 量子位=0.83, 36氪=0.82
Keep all text in original Chinese — do not translate. Ensure articles are AI/ML related.`,
    { label: 'collect:zh_media', phase: 'Collect', schema: COLLECTION_SCHEMA }
  )
]);

// Merge all collected articles
const allArticles = [
  ...(enResults || []),
  ...(aggResults || []),
  ...(zhResults || [])
];

log(`Collected ${allArticles.length} articles total (EN: ${(enResults || []).length}, AGG: ${(aggResults || []).length}, ZH: ${(zhResults || []).length})`);

// ============================================================
// Phase 2: Process — Dedup + Quality Scoring (Python)
// ============================================================
phase('Process');

// Write collected data to JSON files for Python processing
// (This happens in the execution environment via Bash)
log('Running Python dedup and quality scoring...');

// Note: actual Python execution will be done via Bash tool during execution
// The workflow script defines the orchestration logic; the implementation
// uses a combination of agent() calls and Bash tool invocations

// ============================================================
// Phase 3: Structured Extraction (Pipeline)
// ============================================================
phase('Extract');

// For each article, extract structured insights using Pipeline
// Each article is independent — no barrier needed
const insights = await pipeline(
  allArticles.slice(0, 20), // Top 20 after quality filtering
  article => agent(
    `Extract structured information from this news article:

TITLE: ${article.raw.title}
SOURCE: ${article.source.name} (credibility: ${article.source.credibility})
PUBLISHED: ${article.raw.published_at}
BODY: ${article.raw.body.substring(0, 3000)}

Extract according to the StructuredInsight schema:
{
  "id": "<new uuid>",
  "raw_record_id": "${article.id}",
  "classification": {
    "category": "product_launch|funding|research|policy|acquisition|partnership|other",
    "sub_category": "...",
    "ai_domain": ["LLM|CV|Robotics|Speech|RL|AGI|AI_Safety|AI_Infra|AI_Application|AI_Policy|AI_Capital"],
    "confidence": 0.0-1.0
  },
  "entities": {
    "organizations": [{"name": "...", "role": "developer|investor|regulator|user|competitor"}],
    "people": [{"name": "...", "title": "...", "org": "..."}],
    "technologies": [{"name": "...", "maturity": "emerging|developing|released|mature|deprecated", "category": "..."}],
    "metrics": [{"name": "...", "value": 0.0, "unit": "..."}]
  },
  "sentiment": {
    "overall": "positive|neutral|negative",
    "certainty": 0.0-1.0,
    "signals": ["key signal 1", "key signal 2"]
  },
  "impact_assessment": {
    "scope": "industry|regional|global",
    "timeframe": "immediate|short_term|long_term",
    "magnitude": 1-5
  }
}

Be precise. Only extract information explicitly present in the article. Set confidence lower if information is ambiguous.`,
    { label: `extract:${article.raw.title.substring(0, 40)}`, phase: 'Extract', schema: EXTRACTION_SCHEMA }
  )
);

const validInsights = insights.filter(Boolean);
log(`Extracted ${validInsights.length} structured insights from ${allArticles.length} articles`);

// ============================================================
// Phase 4: Multi-dimensional Analysis (Fan-out)
// ============================================================
phase('Analyze');

const insightsJSON = JSON.stringify(validInsights);

const [hotTopics, trendAnalysis, riskOpportunities] = await parallel([
  // Agent D: Hot Topic Identification
  () => agent(
    `Identify the Top 3-5 most important AI events from these structured insights:

${insightsJSON}

Rank by impact (magnitude × scope impact). Group related insights covering the same event.
Return JSON array: [{rank, title, insight_ids, magnitude, summary, key_players, category}]`,
    { label: 'analyze:hotspots', phase: 'Analyze', schema: HOT_TOPICS_SCHEMA }
  ),

  // Agent E: Trend Analysis
  () => agent(
    `Analyze AI trends from these structured insights across 4 dimensions:

${insightsJSON}

For each dimension (technology, application, policy, capital), identify 1-2 specific trends supported by at least 2 articles. Be specific — no generic statements.
Return JSON: {technology, application, policy, capital} each with a 2-4 sentence evidence-backed description.`,
    { label: 'analyze:trends', phase: 'Analyze', schema: TREND_SCHEMA }
  ),

  // Agent F: Risk & Opportunity Identification
  () => agent(
    `Identify risks and strategic opportunities from these insights:

${insightsJSON}

Hot topics identified: ${JSON.stringify(hotTopics)}

Identify 2-4 risks and 2-4 opportunities. Each must reference specific insights.
Return JSON array: [{type: "risk|opportunity", title, description, severity|potential: "high|medium|low", related_insight_ids}]`,
    { label: 'analyze:risks', phase: 'Analyze', schema: RISK_OPP_SCHEMA }
  )
]);

// Agent G: Relation Graph (depends on D/E/F results)
const relationGraph = await agent(
  `Build a relationship network from these analysis results:

HOT TOPICS: ${JSON.stringify(hotTopics)}
TRENDS: ${JSON.stringify(trendAnalysis)}
RISKS/OPPORTUNITIES: ${JSON.stringify(riskOpportunities)}
INSIGHTS: ${insightsJSON}

Identify meaningful relationships between events:
- competes_with: Two companies/products directly competing
- enables: One event makes another possible
- contradicts: Findings that conflict
- extends: One development builds on another
- responds_to: Reaction to a previous event

Also identify 1-3 thematic clusters.

Return a RelationGraph JSON: {nodes: [...insight_ids], edges: [{from, to, relation, strength, explanation}], clusters: [{theme, members, coverage}]}`,
  { label: 'analyze:relations', phase: 'Analyze', schema: RELATION_GRAPH_SCHEMA }
);

log(`Analysis complete — ${(hotTopics || []).length} hot topics, trends in 4 dimensions, ${(riskOpportunities || []).length} risks/opportunities`);

// ============================================================
// Phase 5: Adversarial Verification
// ============================================================
phase('Verify');

// Each hot topic claim gets 3 skeptic reviews
const verificationResults = await pipeline(
  (hotTopics || []).map(t => ({ ...t, claims: [t.summary] })),
  async (topic) => {
    const votes = await parallel([
      () => agent(
        `FACT-CHECK LENS: Critically examine this claim about an AI news event.

CLAIM: "${topic.summary}"
SUPPORTING DATA: ${JSON.stringify(validInsights.filter(i => topic.insight_ids.includes(i.id)))}

Is the claim supported by the data? Is anything misrepresented or exaggerated?
Verdict must be CONFIRM, WEAK, or REFUTE.
Return JSON: {lens: "fact_check", verdict: "CONFIRM|WEAK|REFUTE", confidence: 0.0-1.0, reasoning: "...", specific_issues: [...]}`,
        { label: `verify:fact:${topic.title.substring(0, 30)}`, phase: 'Verify', schema: VERDICT_SCHEMA }
      ),
      () => agent(
        `LOGIC LENS: Critically examine the reasoning behind this claim.

CLAIM: "${topic.summary}"
SUPPORTING DATA: ${JSON.stringify(validInsights.filter(i => topic.insight_ids.includes(i.id)))}

Are there logical fallacies? Correlation confused with causation? Alternative explanations ignored?
Verdict must be CONFIRM, WEAK, or REFUTE.
Return JSON: {lens: "logic", verdict: "CONFIRM|WEAK|REFUTE", confidence: 0.0-1.0, reasoning: "...", specific_issues: [...]}`,
        { label: `verify:logic:${topic.title.substring(0, 30)}`, phase: 'Verify', schema: VERDICT_SCHEMA }
      ),
      () => agent(
        `STATISTICAL LENS: Examine whether this claim overgeneralizes.

CLAIM: "${topic.summary}"
SUPPORTING DATA: ${JSON.stringify(validInsights.filter(i => topic.insight_ids.includes(i.id)))}

Is the sample sufficient? Is an outlier presented as a trend? Selection bias in data sources?
Verdict must be CONFIRM, WEAK, or REFUTE.
Return JSON: {lens: "statistical", verdict: "CONFIRM|WEAK|REFUTE", confidence: 0.0-1.0, reasoning: "...", specific_issues: [...]}`,
        { label: `verify:stats:${topic.title.substring(0, 30)}`, phase: 'Verify', schema: VERDICT_SCHEMA }
      )
    ]);

    const validVotes = votes.filter(Boolean);
    const confirmCount = validVotes.filter(v => v.verdict === 'CONFIRM').length;
    const refuteCount = validVotes.filter(v => v.verdict === 'REFUTE').length;

    let status;
    if (confirmCount >= 2) status = 'confirmed';
    else if (refuteCount >= 2) status = 'rejected';
    else status = 'downgraded';

    return { ...topic, verification: { votes: validVotes, status } };
  }
);

const verifiedTopics = (verificationResults || []).filter(t => t.verification.status !== 'rejected');
const downgradedTopics = (verificationResults || []).filter(t => t.verification.status === 'downgraded');

log(`Verification complete — ${verifiedTopics.length} confirmed, ${downgradedTopics.length} downgraded, ${(verificationResults || []).length - verifiedTopics.length - downgradedTopics.length} rejected`);

// ============================================================
// Phase 6: Report Synthesis & Output Generation
// ============================================================
phase('Synthesize');

// Generate the final Markdown report and dashboard data
const reportResult = await agent(
  `Synthesize all verified analysis into a comprehensive Markdown daily report.

VERIFIED HOT TOPICS: ${JSON.stringify(verifiedTopics)}
DOWNGRADED TOPICS: ${JSON.stringify(downgradedTopics)}
TREND ANALYSIS: ${JSON.stringify(trendAnalysis)}
RISKS & OPPORTUNITIES: ${JSON.stringify(riskOpportunities)}
ALL INSIGHTS: ${insightsJSON}

Generate a Markdown report with these sections:
1. Executive Summary (3-5 sentences)
2. Today's Top Stories (ranked table with impact, category, key players)
3. Deep Dive — #1 Story (300-500 words background + impact analysis)
4. Trend Analysis (technology, application, policy, capital)
5. Risk & Opportunity Radar (table with type, title, severity/potential, description)
6. Looking Ahead (2-3 things to watch)

Also produce a RelationGraph JSON showing how events connect.

IMPORTANT: Include the report_date as "2026-06-13" in the title.

Return JSON: {markdown_report: "<full markdown string>", relation_graph: {nodes, edges, clusters}}`,
  { label: 'synthesize:report', phase: 'Synthesize', schema: REPORT_SCHEMA }
);

log('Report synthesized successfully');

// Return the complete results for downstream processing
return {
  collected_count: allArticles.length,
  extracted_count: validInsights.length,
  verified_topics: verifiedTopics,
  downgraded_topics: downgradedTopics,
  trend_analysis: trendAnalysis,
  risk_opportunities: riskOpportunities,
  relation_graph: reportResult?.relation_graph || relationGraph,
  markdown_report: reportResult?.markdown_report || '',
  all_insights: validInsights
};

// ============================================================
// JSON Schemas for Structured Output
// ============================================================

const COLLECTION_SCHEMA = {
  type: 'array',
  items: {
    type: 'object',
    required: ['id', 'source', 'fetch_metadata', 'raw'],
    properties: {
      id: { type: 'string' },
      source: {
        type: 'object',
        required: ['name', 'type', 'url', 'credibility'],
        properties: {
          name: { type: 'string' },
          type: { type: 'string', enum: ['tech_media', 'aggregator', 'official', 'social_media'] },
          url: { type: 'string' },
          credibility: { type: 'number', minimum: 0, maximum: 1 }
        }
      },
      fetch_metadata: {
        type: 'object',
        required: ['fetched_at', 'method', 'agent_id'],
        properties: {
          fetched_at: { type: 'string' },
          method: { type: 'string' },
          agent_id: { type: 'string' }
        }
      },
      raw: {
        type: 'object',
        required: ['title', 'body', 'published_at', 'language'],
        properties: {
          title: { type: 'string', minLength: 1 },
          body: { type: 'string', minLength: 1 },
          url: { type: 'string' },
          published_at: { type: 'string' },
          language: { type: 'string', enum: ['en', 'zh'] }
        }
      }
    }
  }
};

const EXTRACTION_SCHEMA = {
  type: 'object',
  required: ['id', 'raw_record_id', 'classification', 'entities', 'sentiment', 'impact_assessment'],
  properties: {
    id: { type: 'string' },
    raw_record_id: { type: 'string' },
    classification: {
      type: 'object',
      required: ['category', 'ai_domain', 'confidence'],
      properties: {
        category: { type: 'string', enum: ['product_launch', 'funding', 'research', 'policy', 'acquisition', 'partnership', 'other'] },
        sub_category: { type: 'string' },
        ai_domain: { type: 'array', items: { type: 'string' }, minItems: 1 },
        confidence: { type: 'number', minimum: 0, maximum: 1 }
      }
    },
    entities: {
      type: 'object',
      properties: {
        organizations: { type: 'array', items: { type: 'object', required: ['name', 'role'] } },
        people: { type: 'array', items: { type: 'object', required: ['name'] } },
        technologies: { type: 'array', items: { type: 'object', required: ['name', 'maturity', 'category'] } },
        metrics: { type: 'array', items: { type: 'object', required: ['name', 'value', 'unit'] } }
      }
    },
    sentiment: {
      type: 'object',
      required: ['overall', 'certainty'],
      properties: {
        overall: { type: 'string', enum: ['positive', 'neutral', 'negative'] },
        certainty: { type: 'number', minimum: 0, maximum: 1 },
        signals: { type: 'array', items: { type: 'string' } }
      }
    },
    impact_assessment: {
      type: 'object',
      required: ['scope', 'timeframe', 'magnitude'],
      properties: {
        scope: { type: 'string', enum: ['industry', 'regional', 'global'] },
        timeframe: { type: 'string', enum: ['immediate', 'short_term', 'long_term'] },
        magnitude: { type: 'integer', minimum: 1, maximum: 5 }
      }
    }
  }
};

const HOT_TOPICS_SCHEMA = {
  type: 'array',
  minItems: 3,
  maxItems: 5,
  items: {
    type: 'object',
    required: ['rank', 'title', 'insight_ids', 'magnitude', 'summary'],
    properties: {
      rank: { type: 'integer', minimum: 1, maximum: 5 },
      title: { type: 'string', minLength: 1 },
      insight_ids: { type: 'array', items: { type: 'string' }, minItems: 1 },
      magnitude: { type: 'integer', minimum: 1, maximum: 5 },
      summary: { type: 'string', minLength: 1 },
      key_players: { type: 'array', items: { type: 'string' } },
      category: { type: 'string' }
    }
  }
};

const TREND_SCHEMA = {
  type: 'object',
  required: ['technology', 'application', 'policy', 'capital'],
  properties: {
    technology: { type: 'string', minLength: 1 },
    application: { type: 'string', minLength: 1 },
    policy: { type: 'string', minLength: 1 },
    capital: { type: 'string', minLength: 1 }
  }
};

const RISK_OPP_SCHEMA = {
  type: 'array',
  minItems: 4,
  maxItems: 8,
  items: {
    type: 'object',
    required: ['type', 'title', 'description'],
    properties: {
      type: { type: 'string', enum: ['risk', 'opportunity'] },
      title: { type: 'string', minLength: 1 },
      description: { type: 'string', minLength: 1 },
      severity: { type: 'string', enum: ['high', 'medium', 'low'] },
      potential: { type: 'string', enum: ['high', 'medium', 'low'] },
      related_insight_ids: { type: 'array', items: { type: 'string' } }
    }
  }
};

const VERDICT_SCHEMA = {
  type: 'object',
  required: ['lens', 'verdict', 'confidence', 'reasoning'],
  properties: {
    lens: { type: 'string', enum: ['fact_check', 'logic', 'statistical'] },
    verdict: { type: 'string', enum: ['CONFIRM', 'WEAK', 'REFUTE'] },
    confidence: { type: 'number', minimum: 0, maximum: 1 },
    reasoning: { type: 'string', minLength: 1 },
    specific_issues: { type: 'array', items: { type: 'string' } }
  }
};

const RELATION_GRAPH_SCHEMA = {
  type: 'object',
  required: ['nodes', 'edges', 'clusters'],
  properties: {
    nodes: { type: 'array', items: { type: 'string' } },
    edges: {
      type: 'array',
      items: {
        type: 'object',
        required: ['from', 'to', 'relation', 'strength', 'explanation'],
        properties: {
          from: { type: 'string' },
          to: { type: 'string' },
          relation: { type: 'string', enum: ['competes_with', 'enables', 'contradicts', 'extends', 'responds_to'] },
          strength: { type: 'number', minimum: 0, maximum: 1 },
          explanation: { type: 'string', minLength: 1 }
        }
      }
    },
    clusters: {
      type: 'array',
      items: {
        type: 'object',
        required: ['theme', 'members', 'coverage'],
        properties: {
          theme: { type: 'string', minLength: 1 },
          members: { type: 'array', items: { type: 'string' }, minItems: 2 },
          coverage: { type: 'number', minimum: 0, maximum: 1 }
        }
      }
    }
  }
};

const REPORT_SCHEMA = {
  type: 'object',
  required: ['markdown_report', 'relation_graph'],
  properties: {
    markdown_report: { type: 'string', minLength: 100 },
    relation_graph: { type: 'object' }
  }
};
```

- [ ] **Step 2: Commit workflow script**

```bash
git add src/workflow/daily-insight-workflow.js
git commit -m "feat: add 6-phase workflow orchestration — parallel collection, pipeline extraction, fan-out analysis, adversarial verification"
```

---

### Task 10: README Documentation

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write README.md**

Write `README.md`:
```markdown
# AI Daily Insight Engine 🤖

> **AI 舆情分析日报系统** — 从每日新闻信息中提取结构化洞察，生成可读的分析报告与交互式可视化结果。

## 🎯 项目概览

本系统通过 Claude Code Workflow 的 6 Phase 多 Agent 编排，自动完成从数据采集到报告输出的完整流程：

```
Phase 1: 多源并行采集（3 Agent × 3 渠道）
   ↓
Phase 2: 去重 + 质量打分（Barrier 汇聚）
   ↓
Phase 3: 结构化抽取（Pipeline: 每篇文章独立 Agent）
   ↓
Phase 4: 多维分析（Fan-out: 热点/趋势/风险 并行 + 关系网络）
   ↓
Phase 5: 对抗性验证（每个结论 × 3 Skeptic 视角）
   ↓
Phase 6: 报告合成 + 交互式 Dashboard 生成
```

## 📊 输出示例

- **Markdown 日报**: [`output/examples/2026-06-13-ai-daily-report.md`](output/examples/)
- **交互式 Dashboard**: 打开 [`output/dashboard/index.html`](output/dashboard/index.html) 查看

## 🏗️ 系统架构

### 技术栈

| 层级 | 技术 | 用途 |
|------|------|------|
| 编排层 | Claude Code Workflow (JS) | 多 Agent 编排：Parallel/Pipeline/Barrier |
| 数据层 | Python 3.x | 数据处理、验证、Dashboard 数据生成 |
| 可视化层 | HTML + ECharts + D3.js | 交互式 Dashboard（6 个图表组件） |
| 数据桥 | JSON | Python ↔ Web 之间的标准化接口 |

### 三层数据模型 (Schema)

| 层级 | 名称 | 职责 |
|------|------|------|
| Layer 1 | RawRecord | 原始事实：数据溯源、来源可信度、获取元数据 |
| Layer 2 | StructuredInsight | 结构化属性：分类、实体抽取、情感分析、影响评估 |
| Layer 3 | RelationGraph | 关系网络：事件间的因果/竞争/延续关系、主题聚类 |

### 模型分层策略

| Phase | 模型 | 理由 |
|-------|------|------|
| Phase 1 数据采集 | Haiku | 搜索 + 筛选，不需要深度推理 |
| Phase 3 结构化抽取 | Sonnet | 需要准确性，但规模大（~15篇） |
| Phase 4 多维分析 | Opus | 趋势判断和深度分析需要最强推理 |
| Phase 5 对抗性验证 | Sonnet × 3 | 独立视角并行质疑 |
| Phase 6 报告合成 | Opus | 最终文案质量 |

## 📁 项目结构

```
ai-daily-insight/
├── data/
│   ├── raw/              # 原始采集数据（不可变）
│   ├── processed/         # 清洗 & 去重后
│   └── structured/        # Schema 结构化抽取结果
├── output/
│   ├── reports/           # Markdown 日报
│   ├── dashboard/         # HTML Dashboard
│   └── examples/          # 输出示例
├── src/
│   ├── workflow/          # Workflow 编排脚本
│   ├── extractors/        # Python 数据处理脚本
│   ├── prompts/           # Prompt 模板（集中管理）
│   └── schemas/           # JSON Schema 定义
├── tests/                 # Python 单元测试
└── docs/superpowers/      # 设计文档 & 实施计划
```

## 🔧 数据源

### 三渠道并行采集

| 渠道 | 来源 | 语言 | 可信度 |
|------|------|------|--------|
| 英文科技媒体 | TechCrunch, The Verge, VentureBeat, Ars Technica | EN | 0.85–0.92 |
| 聚合平台 | Hacker News, Product Hunt, GitHub Trending | EN | 0.70–0.80 |
| 中文科技媒体 | 机器之心, 量子位, 36氪 AI | ZH | 0.82–0.85 |

### 选择理由

- **多样性**: 中英文混合，覆盖媒体/社区/官方三种视角
- **互补性**: 英文源提供一手资讯，中文源提供中国视角
- **可获取性**: 全部通过 WebSearch/WebFetch 获取，无需 API Key
- **可信度**: 优先选择知名科技媒体，避免内容农场

## 🛡️ 工程质量

### 错误处理：四级分级

| 等级 | 场景 | 策略 |
|------|------|------|
| L1 致命 | 所有数据源均失败 | 终止 Pipeline，生成错误报告 |
| L2 降级 | 单个数据源失败 | 跳过问题条目，报告中标注 |
| L3 可恢复 | 格式错误、API 超时 | 自动重试（3次），指数退避 |
| L4 质量警告 | Confidence 低、数量不足 | 继续执行，标注"数据置信度偏低" |

### AI 输出验证

- Schema 验证: Python `jsonschema` 库校验结构
- 逻辑验证: confidence ∈ [0,1]、magnitude ∈ [1,5]、日期格式 ISO8601
- 一致性验证: 多维数据交叉检查

### 对抗性验证

每个 AI 生成的结论必须经过 3 个独立视角的 Skeptic Agent 质疑：
1. 事实核查：原始数据是否真的支持结论？
2. 逻辑一致性：推理链条是否有漏洞？
3. 统计代表性：样本量是否足够？

≥2/3 通过 → 保留；1/3 通过 → 降级标注；0/3 → 丢弃。

## 📝 关键架构决策 (ADR)

| ADR | 决策 | 理由 |
|-----|------|------|
| ADR-1 | Workflow 编排而非单脚本 | 展示多 Agent 编排能力，对抗性验证需要独立视角 |
| ADR-2 | Phase 2 Barrier, Phase 3 Pipeline | Barrier 因数据依赖，Pipeline 因独立抽取 |
| ADR-3 | 三层 Schema 而非扁平模型 | 数据溯源与信息提取解耦，各有独立职责 |
| ADR-4 | HTML Dashboard 而非 Python 可视化 | 交互式 > 静态图片，GitHub Pages 零环境部署 |

## 🚀 快速开始

### 前置条件

- Python 3.9+
- `pip install jsonschema`

### 运行 Pipeline

```bash
# 方式 1: 通过 Claude Code Workflow 运行
# 在 Claude Code 中加载 src/workflow/daily-insight-workflow.js

# 方式 2: 手动分步运行
# Step 1: 数据采集（使用 Claude Code Agent + WebSearch/WebFetch）
# Step 2: 数据处理
python src/extractors/dedup.py
python src/extractors/quality_score.py
# Step 3: 结构化抽取（使用 Claude Code Agent + StructuredOutput）
# Step 4-5: 分析 + 验证（使用 Claude Code Agent）
# Step 6: 生成 Dashboard 数据
python src/extractors/generate_dashboard_data.py
```

### 运行测试

```bash
python -m pytest tests/ -v
```

## 📄 输出示例

生成一份完整的 AI 分析日报，包含：

1. **今日 AI 领域主要热点** (Top 3-5)
2. **重要事件深度总结** (背景 + 影响分析)
3. **趋势判断** (技术/应用/政策/资本 4 维度)
4. **风险与机会提示**
5. **交互式 Dashboard** (6 个可视化组件)

## 🔗 相关文档

- [设计规格书](docs/superpowers/specs/2026-06-13-ai-daily-insight-engine-design.md)
- [实施计划](docs/superpowers/plans/2026-06-13-ai-daily-insight-engine-plan.md)
```

- [ ] **Step 2: Commit README**

```bash
git add README.md
git commit -m "docs: add comprehensive README with ADR, architecture, data sources, and quality engineering"
```

---

### Task 11: Generate Example Output (Integration Run)

**Files:**
- Create: `output/examples/.gitkeep` (placeholder for example output)

- [ ] **Step 1: Create example output directory**

Run:
```bash
mkdir -p output/examples
```

- [ ] **Step 2: Run entire Python test suite to verify all components**

Run:
```bash
cd /Users/lucismarvin/Desktop/简历+资料/面试/tonghuashun && python -m pytest tests/ -v
```
Expected: All tests pass (dedup 5 + quality 5 + schema 7 + dashboard 2 = 19 PASS)

- [ ] **Step 3: Verify project structure is complete**

Run:
```bash
cd /Users/lucismarvin/Desktop/简历+资料/面试/tonghuashun && find . -type f -not -path './.git/*' -not -path './.superpowers/*' | sort
```
Expected: All files from the file structure map present.

- [ ] **Step 4: Commit final state**

```bash
git add -A
git commit -m "chore: finalize project — all components ready for integration run"
```

---

## Integration Run Guide (After All Tasks Complete)

Once all individual components are built and tested, run the full pipeline:

1. **Launch the Workflow** — Use Claude Code's Workflow tool to execute `src/workflow/daily-insight-workflow.js`
2. **Save outputs** — The workflow returns markdown_report, relation_graph, and all structured data
3. **Generate dashboard data** — Run `python src/extractors/generate_dashboard_data.py` with the workflow output
4. **Verify Dashboard** — Open `output/dashboard/index.html` in a browser
5. **Copy to examples** — Copy the generated report and dashboard to `output/examples/`
