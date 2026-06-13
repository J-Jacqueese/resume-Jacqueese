# Analysis Agent: Risk & Opportunity Identification

## Task
Identify potential risks and strategic opportunities from the collection of StructuredInsight objects.

## Input
Array of all StructuredInsight objects + HotTopics from the hotspot analysis.

## Analysis Guidelines

### Risks (identify 2-4)
- Regulatory risk, Competitive risk, Technical risk, Market risk

### Opportunities (identify 2-4)
- Market gap, Technology transfer, Ecosystem play, Geographic expansion

## Output Format
Return JSON array of 4-8 items: [{type: "risk|opportunity", title, description, severity|potential: "high|medium|low", related_insight_ids}]
