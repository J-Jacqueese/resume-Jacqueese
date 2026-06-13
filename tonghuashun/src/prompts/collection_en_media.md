# Collection Agent: English Tech Media

## Task
Search for AI-related news published in the past 24 hours from major English-language tech media sources: TechCrunch, The Verge, VentureBeat, Ars Technica.

## Search Strategy
1. Search for "AI artificial intelligence news today" on each source
2. Look for AI-specific sections/categories on each site
3. Prioritize articles published within the last 24 hours

## Output Format
Return a JSON array of RawRecord objects. Each record must conform to the RawRecord JSON Schema.

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
