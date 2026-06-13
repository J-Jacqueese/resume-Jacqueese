# AI Daily Insight Engine

> **AI舆情分析日报系统** — 从每日新闻信息中提取结构化洞察，生成可读的分析报告与交互式可视化结果。

## Project Overview

This system uses Claude Code Workflow's 6-phase multi-agent orchestration to automatically collect AI news from 3 parallel sources, extract structured insights via a 3-layer schema, perform multi-dimensional analysis with adversarial verification, and output a Markdown report + interactive HTML dashboard.

```
Phase 1: Multi-source Parallel Collection (3 Agents × 3 Channels)
   ↓
Phase 2: Dedup + Quality Scoring (Barrier Merge)
   ↓
Phase 3: Structured Extraction (Pipeline: each article → independent Agent)
   ↓
Phase 4: Multi-dimensional Analysis (Fan-out: Hotspots/Trends/Risks + Relation Graph)
   ↓
Phase 5: Adversarial Verification (each conclusion × 3 Skeptic Lenses)
   ↓
Phase 6: Report Synthesis + Interactive Dashboard
```

## Output

- **Markdown Daily Report**: Structured analysis with Executive Summary, Top Stories, Deep Dive, Trend Analysis, Risk/Opportunity Radar
- **Interactive HTML Dashboard**: 6 visualization components (ECharts + D3.js) with dark theme, responsive layout

## Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Orchestration | Claude Code Workflow (JS) | Multi-agent orchestration: Pipeline/Parallel/Barrier |
| Data Processing | Python 3.x | Dedup, quality scoring, schema validation, dashboard data generation |
| Visualization | HTML + ECharts + D3.js | Interactive dashboard with 6 chart components |
| Data Bridge | JSON | Standardized interface between Python and Web layers |

### Three-Layer Data Model (Schema)

| Layer | Name | Responsibility |
|-------|------|---------------|
| Layer 1 | RawRecord | Original facts: data provenance, source credibility, fetch metadata |
| Layer 2 | StructuredInsight | Structured attributes: classification, entity extraction, sentiment, impact |
| Layer 3 | RelationGraph | Relationship network: causal/competitive/sequential relations, thematic clusters |

### Model Strategy

| Phase | Model | Rationale |
|-------|-------|-----------|
| Phase 1 Data Collection | Haiku | Search + filtering, no deep reasoning needed |
| Phase 3 Structured Extraction | Sonnet | Accuracy needed, but large volume (~15 articles) |
| Phase 4 Multi-dimensional Analysis | Opus | Trend analysis and deep insights require strongest reasoning |
| Phase 5 Adversarial Verification | Sonnet × 3 | Independent perspectives in parallel = efficient |
| Phase 6 Report Synthesis | Opus | Final copy quality deserves strongest model |

## Project Structure

```
ai-daily-insight/
├── data/
│   ├── raw/              # Raw collected data (immutable)
│   ├── processed/         # Cleaned & deduped
│   └── structured/        # Schema-structured extraction results
├── output/
│   ├── reports/           # Markdown daily reports
│   ├── dashboard/         # HTML Dashboard
│   └── examples/          # Example outputs
├── src/
│   ├── workflow/          # Workflow orchestration script (JS)
│   ├── extractors/        # Python data processing scripts
│   ├── prompts/           # Prompt templates (centralized management)
│   └── schemas/           # JSON Schema definitions
├── tests/                 # Python unit tests
└── docs/superpowers/      # Design docs & implementation plans
```

## Data Sources

### Three-Channel Parallel Collection

| Channel | Sources | Language | Credibility |
|---------|---------|----------|-------------|
| English Tech Media | TechCrunch, The Verge, VentureBeat, Ars Technica | EN | 0.85–0.92 |
| Aggregator Platforms | Hacker News, Product Hunt, GitHub Trending | EN | 0.70–0.80 |
| Chinese Tech Media | 机器之心, 量子位, 36氪 AI | ZH | 0.82–0.85 |

### Selection Rationale

- **Diversity**: Chinese + English, covering media/community/official perspectives
- **Complementarity**: English sources provide first-hand reporting, Chinese sources add China market perspective
- **Accessibility**: All obtained via WebSearch/WebFetch, no API keys required
- **Credibility**: Prioritize established tech media, avoid content farms

## Engineering Quality

### Error Handling: 4-Level Classification

| Level | Scenario | Strategy |
|-------|----------|----------|
| L1 Fatal | All data sources fail, Schema completely mismatched | Terminate pipeline, generate error report |
| L2 Degrade | Single source fails, single article extraction fails | Skip problematic items, annotate in report |
| L3 Recoverable | StructuredOutput format error, single API timeout | Auto-retry (3x), exponential backoff |
| L4 Quality Warning | Confidence below threshold, article count < 10 | Continue execution, prominently note low confidence |

### AI Output Verification

Core principle: AI output MUST be verified by deterministic code.

- Schema validation: Python `jsonschema` library validates structure
- Logical validation: confidence ∈ [0,1], magnitude ∈ [1,5], date format ISO8601
- Consistency validation: Cross-dimensional data checks

### Adversarial Verification

Each AI-generated conclusion must survive scrutiny from 3 independent Skeptic Agents:
1. **Fact-check lens**: Does the original data actually support this claim?
2. **Logic lens**: Are there reasoning gaps or logical fallacies?
3. **Statistical lens**: Is the sample sufficient? Selection bias?

≥2/3 survive → keep; 1/3 → downgrade with caveat; 0/3 → discard.

## Key Architecture Decisions (ADR)

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-1 | Workflow orchestration over single script | Demonstrates multi-agent orchestration; adversarial verification requires independent perspectives |
| ADR-2 | Phase 2 Barrier, Phase 3 Pipeline | Barrier for data dependency (dedup needs all); Pipeline for independent extraction |
| ADR-3 | Three-layer Schema over flat model | Data provenance decoupled from information extraction; each layer has independent consumers |
| ADR-4 | HTML Dashboard over Python visualization | Interactive > static images; GitHub Pages zero-environment deployment |

## Quick Start

### Prerequisites

- Python 3.9+
- `pip install jsonschema`

### Run Tests

```bash
python -m pytest tests/ -v
```

### Run Pipeline

The full pipeline is orchestrated via Claude Code Workflow. Load `src/workflow/daily-insight-workflow.js` and execute.

### View Dashboard

Open `output/dashboard/index.html` in a browser after generating `dashboard_data.json`.

## Related Documentation

- [Design Spec](docs/superpowers/specs/2026-06-13-ai-daily-insight-engine-design.md)
- [Implementation Plan](docs/superpowers/plans/2026-06-13-ai-daily-insight-engine-plan.md)
