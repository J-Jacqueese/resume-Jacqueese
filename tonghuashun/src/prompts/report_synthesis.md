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
Rank by verified importance. 3-5 entries with impact, category, key players.

### Section 3: Deep Dive — Top Story (300-500 words)
Background context, what happened, why it matters, who is affected, what to watch next.

### Section 4: Trend Analysis
Technology | Application | Policy | Capital — each with evidence-backed insight.

### Section 5: Risk & Opportunity Radar
Table: Type | Title | Severity/Potential | Description

### Section 6: Looking Ahead
2-3 things to watch in the coming days based on today's signals.

## RelationGraph Construction
Also produce a RelationGraph (Layer 3) with nodes, edges (competes_with, enables, contradicts, extends, responds_to), and 1-3 thematic clusters.

## Output
Return JSON: {markdown_report: "<full string>", relation_graph: {nodes, edges, clusters}}
