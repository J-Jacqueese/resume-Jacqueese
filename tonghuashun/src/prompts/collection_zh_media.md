# Collection Agent: Chinese Tech Media

## Task
Search for AI-related news published in the past 24 hours from major Chinese-language tech media: 机器之心 (jiqizhixin), 量子位 (QbitAI), 36氪 AI section.

## Search Strategy
1. Search "AI 人工智能 最新新闻 今天" on each source
2. Check each site's AI-specific sections
3. Prioritize articles published within the last 24 hours

## Output Format
Return a JSON array of RawRecord objects.

## Quality Requirements
- Minimum 5 articles, target 8
- Body must contain substantial content (>150 chars)
- Published within the past 24 hours
- Must be AI/ML related
- Retain original Chinese text (do not translate)
