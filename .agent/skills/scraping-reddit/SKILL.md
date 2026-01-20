---
name: scraping-reddit
description: Extracts top posts from specific subreddits using the Reddit JSON API. Use when the user wants to monitor Reddit trends, gather community sentiment, or extract post data.
---

# Scraping Reddit

This skill allows the agent to retrieve top posts from any public subreddit without needing a complex API key setup, by utilizing Reddit's public JSON endpoints.

## When to use this skill

- User wants to see "top posts" from a subreddit
- User needs to analyze Reddit content
- User asks to "scrape" or "read" a subreddit

## Workflow

1. **Identify Subreddit**: Determine which subreddit(s) the user is interested in.
2. **Execute Script**: Run the provided Python script to fetch the data.
3. **Process Output**: Parse the JSON or text output to answer the user's specific question.

## Instructions

Run the helper script located in `scripts/reddit_scraper.py`.

### Basic Usage

```bash
python scripts/reddit_scraper.py [subreddit_name]
```

### Example

To get the top 3 posts from `r/n8n`:

```bash
python scripts/reddit_scraper.py n8n
```

## Dependencies

The script requires `requests`. If not installed:

```bash
pip install requests
```
