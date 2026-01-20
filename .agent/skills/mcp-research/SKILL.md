---
description: Use Firecrawl and Context7 MCPs for research and documentation lookup
---

# Research with MCP Tools

When you encounter questions, uncertainties, or need to look up documentation:

## Use Context7 for

- **Library documentation** - API references, usage examples, best practices
- **Framework guides** - React, Next.js, Express, Firebase, etc.
- **Package lookup** - npm packages, their APIs and patterns

### How to use Context7

1. First call `mcp_context7_resolve-library-id` to find the correct library ID
2. Then call `mcp_context7_query-docs` with the library ID and your question

## Use Firecrawl for

- **Web search** - Current information, tutorials, Stack Overflow solutions
- **Scraping specific pages** - When you need content from a specific URL
- **Research tasks** - Finding best practices, comparing approaches

### How to use Firecrawl

- `mcp_firecrawl_firecrawl_search` - For general web searches
- `mcp_firecrawl_firecrawl_scrape` - For extracting content from specific URLs
- `mcp_firecrawl_firecrawl_agent` - For complex research tasks

## When to use these tools

- Before implementing unfamiliar APIs or patterns
- When debugging errors you're not sure about
- When the user asks about best practices
- When documentation in the codebase is unclear or missing
- When working with third-party libraries or services
