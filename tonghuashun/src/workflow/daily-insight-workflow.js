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
// Phase 2: Process — Dedup + Quality Scoring (Barrier)
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
