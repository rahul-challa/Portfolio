#!/usr/bin/env python3
"""
Manual script to fetch and update API data for the portfolio
"""
import requests
import json
import datetime
import time
import os

def fetch_with_retry(url, max_retries=3, base_delay=5, timeout=30):
    """Fetch data with retry logic for rate limiting"""
    for attempt in range(max_retries):
        try:
            print(f'  Attempt {attempt + 1}/{max_retries} for {url}')
            response = requests.get(url, timeout=timeout)
            
            if response.status_code == 200:
                return response.json(), response.status_code, response.headers
            elif response.status_code == 429:
                # Rate limited - wait and retry
                wait_time = base_delay * (2 ** attempt)  # Exponential backoff
                print(f'  Rate limited (429). Waiting {wait_time} seconds before retry...')
                if attempt < max_retries - 1:
                    time.sleep(wait_time)
                    continue
                else:
                    print(f'  Max retries reached for {url}')
                    return None, response.status_code, None
            else:
                print(f'  Failed with status {response.status_code} from {url}')
                return None, response.status_code, None
        except Exception as e:
            print(f'  Error with endpoint {url}: {str(e)}')
            if attempt < max_retries - 1:
                time.sleep(base_delay * (2 ** attempt))
            continue
    return None, None, None

def update_github_data():
    """Update GitHub profile data"""
    print('\n=== Updating GitHub Profile Data ===')
    username = 'rahul-challa'
    api_url = f'https://api.github.com/users/{username}'
    
    try:
        time.sleep(1)
        print(f'Fetching GitHub profile data for: {username}')
        user_data, status, _ = fetch_with_retry(api_url, base_delay=2)
        
        if user_data:
            print(f'User data keys: {list(user_data.keys())}')
            
            # Get repositories
            time.sleep(1)
            print('Fetching repositories...')
            repos_data, repos_status, _ = fetch_with_retry(f'{api_url}/repos?per_page=100&sort=updated', base_delay=2)
            if repos_data:
                user_data['repositories'] = repos_data
                print(f'Found {len(user_data["repositories"])} repositories')
            else:
                print(f'Failed to fetch repositories: {repos_status}')
            
            # Get followers
            time.sleep(1)
            print('Fetching followers...')
            followers_data, followers_status, _ = fetch_with_retry(f'{api_url}/followers?per_page=100', base_delay=2)
            if followers_data:
                user_data['followers_list'] = followers_data
                print(f'Found {len(user_data["followers_list"])} followers')
            else:
                print(f'Failed to fetch followers: {followers_status}')
            
            # Create final data structure
            final_data = {
                'lastUpdated': datetime.datetime.now().isoformat(),
                'data': user_data
            }
            
            # Write to file
            os.makedirs('data', exist_ok=True)
            with open('data/github-profile.json', 'w') as f:
                json.dump(final_data, f, indent=2)
            
            print('[SUCCESS] GitHub profile data updated successfully')
            return True
        else:
            print(f'[FAILED] Failed to fetch GitHub data: {status}')
            return False
    except Exception as e:
        print(f'[ERROR] Error fetching GitHub data: {str(e)}')
        return False

def update_github_heatmap():
    """Fetch the GitHub contribution heatmap SVG and recolor it for the dark
    theme server-side.

    ghchart.rshah.org doesn't send CORS headers, so the browser can't
    `fetch()` its SVG text to recolor it client-side (only `<img>` works
    cross-origin without CORS, and CSS can never reach inside an
    externally-referenced <img>). Fetching and recoloring it here, then
    serving it same-origin as a static file, sidesteps both problems.
    """
    print('\n=== Updating GitHub Contribution Heatmap ===')
    username = 'rahul-challa'
    api_url = f'https://ghchart.rshah.org/26a641/{username}'

    try:
        response = requests.get(api_url, timeout=30)
        if response.status_code == 200:
            svg_text = response.text
            svg_text = svg_text.replace('fill:#EEEEEE', 'fill:#161b22')
            svg_text = svg_text.replace('fill:#767676', 'fill:#6e7180')

            os.makedirs('data', exist_ok=True)
            with open('data/github-heatmap.svg', 'w', encoding='utf-8') as f:
                f.write(svg_text)

            print('[SUCCESS] GitHub heatmap updated successfully')
            return True
        else:
            print(f'[FAILED] Failed to fetch GitHub heatmap: {response.status_code}')
            return False
    except Exception as e:
        print(f'[ERROR] Error fetching GitHub heatmap: {str(e)}')
        return False

LEETCODE_USERNAME = 'Rahul_Challa'
LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql'

def leetcode_graphql(query, variables=None, max_retries=3):
    """Query LeetCode's own public GraphQL API directly - the same endpoint
    leetcode.com's own frontend uses to render profile pages.

    This replaces a set of third-party mirror APIs (alfa-leetcode-api on
    Render's free tier, leetcode-stats-api on Heroku/Render, etc.) that were
    the actual source of "unreliable" data: free-tier hosts sleep and take
    30-60s to cold-start, occasionally time out entirely, and return
    inconsistently-shaped JSON across mirrors. Querying LeetCode directly
    needs no auth and removes that middleman.
    """
    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Referer': f'https://leetcode.com/{LEETCODE_USERNAME}/',
    }
    payload = {'query': query, 'variables': variables or {}}

    for attempt in range(max_retries):
        try:
            response = requests.post(LEETCODE_GRAPHQL_URL, json=payload, headers=headers, timeout=30)
            if response.status_code == 200:
                body = response.json()
                if 'errors' in body:
                    print(f'  GraphQL errors: {body["errors"]}')
                    return None
                return body.get('data')
            elif response.status_code == 429:
                wait_time = 5 * (2 ** attempt)
                print(f'  Rate limited (429). Waiting {wait_time}s before retry...')
                if attempt < max_retries - 1:
                    time.sleep(wait_time)
                    continue
                return None
            else:
                print(f'  Failed with status {response.status_code}')
                return None
        except Exception as e:
            print(f'  Error querying LeetCode GraphQL: {str(e)}')
            if attempt < max_retries - 1:
                time.sleep(5 * (2 ** attempt))
            continue
    return None

def update_leetcode_data():
    """Fetch profile stats, contest ranking, badges, and the submission
    calendar in a single request and write one consolidated file.

    Replaces the old 4-file setup (leetcode-calendar.json, -contest.json,
    -history.json, -stats.json), each independently fetched from a
    different unreliable third-party mirror with its own response shape -
    which is also why main.js used to carry so much defensive "which API
    format is this" branching.
    """
    print('\n=== Updating LeetCode Data ===')

    query = """
    query userProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile { ranking }
        submitStats { acSubmissionNum { difficulty count } }
        userCalendar { submissionCalendar }
        badges { displayName }
      }
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        topPercentage
        badge { name }
      }
      allQuestionsCount { difficulty count }
    }
    """

    data = leetcode_graphql(query, {'username': LEETCODE_USERNAME})

    if not data or not data.get('matchedUser'):
        print(f'[FAILED] LeetCode user "{LEETCODE_USERNAME}" not found or API unreachable')
        return False

    matched_user = data['matchedUser']
    contest = data.get('userContestRanking') or {}
    totals = {q['difficulty']: q['count'] for q in data.get('allQuestionsCount', [])}
    solved = {s['difficulty']: s['count'] for s in matched_user['submitStats']['acSubmissionNum']}

    def pct(solved_count, total_count):
        return round((solved_count / total_count) * 100, 1) if total_count else 0

    easy_solved = solved.get('Easy', 0)
    medium_solved = solved.get('Medium', 0)
    hard_solved = solved.get('Hard', 0)

    final_data = {
        'lastUpdated': datetime.datetime.now().isoformat(),
        'username': LEETCODE_USERNAME,
        'ranking': matched_user['profile']['ranking'],
        'totalSolved': solved.get('All', 0),
        'totalQuestions': totals.get('All', 0),
        'easySolved': easy_solved,
        'easyTotal': totals.get('Easy', 0),
        'easyPercentage': pct(easy_solved, totals.get('Easy', 0)),
        'mediumSolved': medium_solved,
        'mediumTotal': totals.get('Medium', 0),
        'mediumPercentage': pct(medium_solved, totals.get('Medium', 0)),
        'hardSolved': hard_solved,
        'hardTotal': totals.get('Hard', 0),
        'hardPercentage': pct(hard_solved, totals.get('Hard', 0)),
        'contest': {
            'attendedContestsCount': contest.get('attendedContestsCount'),
            'rating': round(contest['rating']) if contest.get('rating') is not None else None,
            'globalRanking': contest.get('globalRanking'),
            'topPercentage': contest.get('topPercentage'),
            'badge': (contest.get('badge') or {}).get('name'),
        },
        'badges': [b['displayName'] for b in matched_user.get('badges', [])],
        'submissionCalendar': json.loads(matched_user['userCalendar']['submissionCalendar'] or '{}'),
        'apiSource': LEETCODE_GRAPHQL_URL,
    }

    os.makedirs('data', exist_ok=True)
    with open('data/leetcode-profile.json', 'w') as f:
        json.dump(final_data, f, indent=2)

    print('[SUCCESS] LeetCode data updated successfully')
    return True

# Repos that are not real showcase projects (the special GitHub
# profile-README repo, this Portfolio site's own source, and daily-problem
# trackers) and should never render as a Project card no matter what's on
# GitHub. Edit this set any time without touching GitHub itself - it's a
# purely local, git-tracked lever.
PROJECT_EXCLUDED_REPOS = {
    'rahul-challa',   # special GitHub profile README repo
    'Portfolio',      # this site's own source
    'CS-208',         # coursework
    'LEETCODE',       # solutions dump - already surfaced via the Profiles section
    'GFG-POTD',       # daily-problem tracker
}

def load_project_overrides():
    """Manually curated copy for specific repos (description, tech tags,
    extra links, icon/logo). A repo with no entry here still shows up
    automatically - just with GitHub's raw description and primary language
    as its only tag, until someone polishes it here."""
    try:
        with open('data/project-overrides.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def update_projects_data():
    """Auto-generate the Projects list from the user's live GitHub repos,
    merged with manual overrides for polished copy on specific repos.

    Because the output is rebuilt from scratch from the current GitHub repo
    list every run, a repo that's deleted or renamed on GitHub simply isn't
    in that list anymore and drops out of projects.json (and therefore off
    the site) on the next scheduled run - no separate cleanup step needed.
    """
    print('\n=== Updating Projects Data ===')
    username = 'rahul-challa'
    overrides = load_project_overrides()

    repos_data, status, _ = fetch_with_retry(
        f'https://api.github.com/users/{username}/repos?per_page=100&sort=pushed', base_delay=2
    )
    if not repos_data:
        print(f'[FAILED] Failed to fetch repos: {status}')
        return False

    projects = []
    for repo in repos_data:
        name = repo['name']
        if repo.get('fork') or repo.get('archived') or name in PROJECT_EXCLUDED_REPOS:
            continue

        override = overrides.get(name, {})
        projects.append({
            'name': name,
            'displayName': override.get('displayName') or name.replace('-', ' ').replace('_', ' '),
            'description': override.get('description') or repo.get('description') or 'No description yet.',
            'tech': override.get('tech') or ([repo['language']] if repo.get('language') else []),
            'githubUrl': repo['html_url'],
            'extraLinks': override.get('extraLinks', []),
            'logo': override.get('logo'),
            'icon': override.get('icon'),
            'stars': repo.get('stargazers_count', 0),
            'language': repo.get('language'),
            'updatedAt': repo.get('pushed_at'),
            'curated': name in overrides,
        })

    # Curated (manually polished) projects first, in the override file's
    # key order; everything else follows, most-recently-pushed first.
    curated_order = list(overrides.keys())
    curated = sorted(
        [p for p in projects if p['curated']],
        key=lambda p: curated_order.index(p['name'])
    )
    rest = sorted(
        [p for p in projects if not p['curated']],
        key=lambda p: p['updatedAt'] or '',
        reverse=True
    )

    final_data = {
        'lastUpdated': datetime.datetime.now().isoformat(),
        'projects': curated + rest,
    }

    os.makedirs('data', exist_ok=True)
    with open('data/projects.json', 'w') as f:
        json.dump(final_data, f, indent=2)

    print(f'[SUCCESS] Projects data updated successfully ({len(final_data["projects"])} projects, {len(curated)} curated)')
    return True

def update_texmex_data():
    """Update TexMex VS Code extension data from the VS Code Marketplace.

    Note: TexMex is a VS Code extension (publisher.extension id
    "RahulChalla.texmex"), not an npm package - a package that happens to
    also be named "texmex" exists on the npm registry (an unrelated
    security-holder placeholder) and was being queried by mistake, which
    always produced null installs/rating.
    """
    print('\n=== Updating TexMex Extension Data ===')
    extension_id = 'RahulChalla.texmex'
    api_url = 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery'

    payload = {
        'filters': [{'criteria': [{'filterType': 7, 'value': extension_id}]}],
        # Flags: IncludeVersions | IncludeStatistics | IncludeLatestVersionOnly
        'flags': 914
    }
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json;api-version=3.0-preview.1'
    }

    try:
        response = requests.post(api_url, json=payload, headers=headers, timeout=30)
        if response.status_code == 200:
            result = response.json()
            extensions = result.get('results', [{}])[0].get('extensions', [])

            if not extensions:
                print(f'[FAILED] Extension "{extension_id}" not found on the Marketplace')
                return False

            ext = extensions[0]
            stats = {s['statisticName']: s['value'] for s in ext.get('statistics', [])}
            latest = (ext.get('versions') or [{}])[0]

            final_data = {
                'lastUpdated': datetime.datetime.now().isoformat(),
                'data': {
                    'installs': int(stats.get('install', 0)) or None,
                    'version': latest.get('version'),
                    'rating': round(stats.get('averagerating', 0), 1) or None,
                    'ratingCount': int(stats.get('ratingcount', 0)) or None,
                    'publisher': ext.get('publisher', {}).get('publisherName'),
                    'displayName': ext.get('displayName'),
                    'description': ext.get('shortDescription'),
                    'extensionId': extension_id,
                    'public': True
                },
                'apiSource': api_url,
                'responseStatus': response.status_code
            }

            os.makedirs('data', exist_ok=True)
            with open('data/texmex-badges.json', 'w') as f:
                json.dump(final_data, f, indent=2)

            print('[SUCCESS] TexMex extension data updated successfully')
            return True
        else:
            print(f'[FAILED] Failed to fetch TexMex extension data: {response.status_code}')
            return False
    except Exception as e:
        print(f'[ERROR] Error fetching TexMex extension data: {str(e)}')
        return False

def main():
    """Main function to update all data"""
    print('=' * 50)
    print('Portfolio Data Update Script')
    print('=' * 50)
    
    results = {
        'GitHub': update_github_data(),
        'GitHub Heatmap': update_github_heatmap(),
        'Projects': update_projects_data(),
        'LeetCode': update_leetcode_data(),
        'TexMex': update_texmex_data()
    }
    
    print('\n' + '=' * 50)
    print('Update Summary:')
    print('=' * 50)
    for service, success in results.items():
        status = '[SUCCESS]' if success else '[FAILED]'
        print(f'{service}: {status}')
    
    successful = sum(results.values())
    total = len(results)
    print(f'\nTotal: {successful}/{total} updates successful')
    print('=' * 50)

if __name__ == '__main__':
    main()

