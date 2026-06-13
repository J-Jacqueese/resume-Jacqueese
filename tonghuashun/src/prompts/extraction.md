# Extraction Agent: Structured Insight Extraction

## Task
Extract structured information from a single news article. Produce a StructuredInsight object conforming to the provided JSON Schema.

## Input
You will receive a RawRecord object with the article's title, body, source, and metadata.

## Extraction Guidelines

### Classification
- category: Choose from product_launch, funding, research, policy, acquisition, partnership, other
- ai_domain: Identify AI subdomains (LLM, CV, Robotics, Speech, RL, AGI, AI_Safety, AI_Infra, AI_Application, AI_Policy, AI_Capital)
- confidence: How confident are you in this classification? (0.0-1.0)

### Entities
Extract named entities mentioned in the article:
- organizations: Companies, institutions, labs (name + role: developer|investor|regulator|user|competitor)
- people: Named individuals (name + optional title + org)
- technologies: Specific AI technologies/products (name + maturity + category)
- metrics: Quantifiable claims (name + value + unit)

### Sentiment
- overall: positive (breakthrough, growth) | neutral (factual) | negative (risk, concern)
- certainty: How clear is the sentiment? (0.0-1.0)
- signals: 1-3 key phrases supporting the sentiment assessment

### Impact Assessment
- scope: industry | regional | global
- timeframe: immediate | short_term | long_term
- magnitude: 1 (minor) to 5 (transformative)

## Output
Return a valid StructuredInsight JSON object matching the provided schema exactly.
