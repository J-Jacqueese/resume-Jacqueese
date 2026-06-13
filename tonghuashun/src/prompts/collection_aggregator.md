# Collection Agent: Aggregator Platforms

## Task
Search for AI-related news, discussions, and product launches from community-driven aggregator platforms: Hacker News, Product Hunt, GitHub Trending repositories.

## Search Strategy
1. Search Hacker News for AI-related posts with >50 points in past 24h
2. Check Product Hunt for AI product launches in past 24h
3. Check GitHub Trending for AI/ML repositories

## Output Format
Return a JSON array of RawRecord objects.

## Quality Requirements
- Minimum 5 articles, target 8
- For Hacker News: prioritize high-score, high-comment posts
- For Product Hunt: prioritize AI/ML products with significant upvotes
- For GitHub: prioritize repos with >100 stars gained in past day
