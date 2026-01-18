import requests
import sys
import json
import argparse

def scrape_top_posts(subreddit_name, limit=3):
    """
    Scrapes the top posts from a specified subreddit.
    """
    url = f"https://www.reddit.com/r/{subreddit_name}/top.json?limit={limit}&t=day"
    
    # Reddit requires a unique User-Agent to avoid 429 Too Many Requests
    headers = {
        'User-Agent': 'python:reddit_scraper:v1.0 (by /u/antigravity_agent)'
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        posts = data.get('data', {}).get('children', [])
        
        results = []
        for post in posts:
            post_data = post['data']
            results.append({
                'title': post_data.get('title'),
                'author': post_data.get('author'),
                'score': post_data.get('score'),
                'url': post_data.get('url'),
                'permalink': f"https://www.reddit.com{post_data.get('permalink')}"
            })
            
        return results

    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 429:
            print("Error: Too many requests. Reddit is rate-limiting us.", file=sys.stderr)
        elif e.response.status_code == 404:
            print(f"Error: Subreddit 'r/{subreddit_name}' not found.", file=sys.stderr)
        else:
            print(f"HTTP Error: {e}", file=sys.stderr)
        return []
    except Exception as e:
        print(f"An unexpected error occurred: {e}", file=sys.stderr)
        return []

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Scrape top posts from a subreddit.")
    parser.add_argument("subreddit", help="Name of the subreddit to scrape")
    parser.add_argument("--limit", type=int, default=3, help="Number of posts to retrieve")
    parser.add_argument("--json", action="store_true", help="Output raw JSON")
    
    args = parser.parse_args()
        
    posts = scrape_top_posts(args.subreddit, args.limit)
    
    if args.json:
        print(json.dumps(posts, indent=2))
    else:
        if not posts:
            print("No posts found or an error occurred.")
            sys.exit(1)

        print(f"Fetching top {args.limit} posts from r/{args.subreddit}...\n")
        for i, post in enumerate(posts, 1):
            print(f"--- Post #{i} ---")
            print(f"Title: {post['title']}")
            print(f"Author: u/{post['author']}")
            print(f"Score: {post['score']}")
            print(f"Link: {post['url']}")
            print(f"Comments: {post['permalink']}")
            print("")
