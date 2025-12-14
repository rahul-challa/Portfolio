#!/usr/bin/env python3
"""
Manual script to fetch and update API data for the portfolio
"""
import requests
import json
import datetime
import time
import os

def fetch_with_retry(url, max_retries=3, base_delay=5):
    """Fetch data with retry logic for rate limiting"""
    for attempt in range(max_retries):
        try:
            print(f'  Attempt {attempt + 1}/{max_retries} for {url}')
            response = requests.get(url, timeout=30)
            
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
            
            print('✅ GitHub profile data updated successfully')
            return True
        else:
            print(f'❌ Failed to fetch GitHub data: {status}')
            return False
    except Exception as e:
        print(f'❌ Error fetching GitHub data: {str(e)}')
        return False

def update_leetcode_calendar():
    """Update LeetCode calendar data"""
    print('\n=== Updating LeetCode Calendar Data ===')
    username = 'Rahul_Challa'
    api_endpoints = [
        f'https://alfa-leetcode-api.onrender.com/{username}/calendar',
        f'https://leetcode-api.cyclic.app/{username}/calendar'
    ]
    
    data = None
    api_url = None
    response_status = None
    response_headers = None
    
    time.sleep(2)
    
    for endpoint in api_endpoints:
        result_data, status, headers = fetch_with_retry(endpoint)
        if result_data:
            data = result_data
            api_url = endpoint
            response_status = status
            response_headers = headers
            print(f'✅ Successfully fetched calendar data from: {endpoint}')
            break
        else:
            print(f'❌ Failed to fetch from {endpoint}')
            if endpoint != api_endpoints[-1]:
                print('Waiting 3 seconds before trying next endpoint...')
                time.sleep(3)
    
    if data:
        final_data = {
            'lastUpdated': datetime.datetime.now().isoformat(),
            'data': data,
            'apiSource': api_url,
            'responseHeaders': dict(response_headers) if response_headers else None,
            'responseStatus': response_status,
            'requestUrl': api_url
        }
        
        os.makedirs('data', exist_ok=True)
        with open('data/leetcode-calendar.json', 'w') as f:
            json.dump(final_data, f, indent=2)
        
        print('✅ LeetCode calendar data updated successfully')
        return True
    else:
        print('❌ Failed to fetch LeetCode calendar data from all endpoints')
        return False

def update_leetcode_contest():
    """Update LeetCode contest data"""
    print('\n=== Updating LeetCode Contest Data ===')
    username = 'Rahul_Challa'
    api_endpoints = [
        f'https://alfa-leetcode-api.onrender.com/{username}/contest',
        f'https://leetcode-api.cyclic.app/{username}/contest',
        f'https://leetcode-stats-api.herokuapp.com/{username}'
    ]
    
    data = None
    api_url = None
    response_status = None
    response_headers = None
    
    time.sleep(3)
    
    for endpoint in api_endpoints:
        result_data, status, headers = fetch_with_retry(endpoint)
        if result_data:
            data = result_data
            api_url = endpoint
            response_status = status
            response_headers = headers
            print(f'✅ Successfully fetched contest data from: {endpoint}')
            break
        else:
            print(f'❌ Failed to fetch from {endpoint}')
            if endpoint != api_endpoints[-1]:
                print('Waiting 3 seconds before trying next endpoint...')
                time.sleep(3)
    
    if data:
        final_data = {
            'lastUpdated': datetime.datetime.now().isoformat(),
            'data': data,
            'apiSource': api_url,
            'responseHeaders': dict(response_headers) if response_headers else None,
            'responseStatus': response_status,
            'requestUrl': api_url
        }
        
        os.makedirs('data', exist_ok=True)
        with open('data/leetcode-contest.json', 'w') as f:
            json.dump(final_data, f, indent=2)
        
        print('✅ LeetCode contest data updated successfully')
        return True
    else:
        print('❌ Failed to fetch LeetCode contest data from all endpoints')
        return False

def update_leetcode_history():
    """Update LeetCode history data"""
    print('\n=== Updating LeetCode History Data ===')
    username = 'Rahul_Challa'
    api_endpoints = [
        f'https://alfa-leetcode-api.onrender.com/{username}/contest',
        f'https://leetcode-api.cyclic.app/{username}/contest'
    ]
    
    contest_data = None
    api_url = None
    response_status = None
    response_headers = None
    
    time.sleep(4)
    
    for endpoint in api_endpoints:
        result_data, status, headers = fetch_with_retry(endpoint)
        if result_data:
            contest_data = result_data
            api_url = endpoint
            response_status = status
            response_headers = headers
            print(f'✅ Successfully fetched history data from: {endpoint}')
            break
        else:
            print(f'❌ Failed to fetch from {endpoint}')
            if endpoint != api_endpoints[-1]:
                print('Waiting 3 seconds before trying next endpoint...')
                time.sleep(3)
    
    if contest_data:
        # Extract contest participation data
        if isinstance(contest_data, dict):
            if 'data' in contest_data and isinstance(contest_data['data'], dict):
                contest_history = contest_data['data'].get('userContestRankingHistory', [])
            else:
                contest_history = contest_data.get('contestParticipation', []) or contest_data.get('userContestRankingHistory', [])
        else:
            contest_history = []
        
        history_data = {
            'count': len(contest_history),
            'contestHistory': contest_history
        }
        
        final_data = {
            'lastUpdated': datetime.datetime.now().isoformat(),
            'data': history_data,
            'apiSource': api_url,
            'responseHeaders': dict(response_headers) if response_headers else None,
            'responseStatus': response_status,
            'requestUrl': api_url,
            'note': 'Data extracted from contest endpoint as history endpoint is not available'
        }
        
        os.makedirs('data', exist_ok=True)
        with open('data/leetcode-history.json', 'w') as f:
            json.dump(final_data, f, indent=2)
        
        print('✅ LeetCode history data updated successfully')
        return True
    else:
        print('❌ Failed to fetch LeetCode history data from all endpoints')
        return False

def update_texmex_data():
    """Update TexMex package data"""
    print('\n=== Updating TexMex Package Data ===')
    package_name = 'texmex'
    api_url = f'https://registry.npmjs.org/{package_name}'
    
    try:
        response = requests.get(api_url, timeout=30)
        if response.status_code == 200:
            data = response.json()
            
            latest_version = data.get('dist-tags', {}).get('latest')
            latest_data = data.get('versions', {}).get(latest_version, {})
            
            final_data = {
                'lastUpdated': datetime.datetime.now().isoformat(),
                'data': {
                    'installs': None,
                    'version': latest_version,
                    'rating': None,
                    'ratingCount': None,
                    'publisher': latest_data.get('publisher', {}).get('name'),
                    'displayName': latest_data.get('displayName'),
                    'description': latest_data.get('description'),
                    'categories': latest_data.get('categories', []),
                    'tags': latest_data.get('keywords', []),
                    'repository': latest_data.get('repository', {}).get('url'),
                    'homepage': latest_data.get('homepage'),
                    'bugs': latest_data.get('bugs', {}).get('url'),
                    'license': latest_data.get('license'),
                    'engines': latest_data.get('engines', {}),
                    'icon': latest_data.get('icon'),
                    'galleryBanner': latest_data.get('galleryBanner', {}),
                    'preview': latest_data.get('preview', False),
                    'public': True
                },
                'apiSource': api_url,
                'responseHeaders': dict(response.headers),
                'responseStatus': response.status_code
            }
            
            os.makedirs('data', exist_ok=True)
            with open('data/texmex-badges.json', 'w') as f:
                json.dump(final_data, f, indent=2)
            
            print('✅ TexMex package data updated successfully')
            return True
        else:
            print(f'❌ Failed to fetch TexMex package data: {response.status_code}')
            return False
    except Exception as e:
        print(f'❌ Error fetching TexMex package data: {str(e)}')
        return False

def main():
    """Main function to update all data"""
    print('=' * 50)
    print('Portfolio Data Update Script')
    print('=' * 50)
    
    results = {
        'GitHub': update_github_data(),
        'LeetCode Calendar': update_leetcode_calendar(),
        'LeetCode Contest': update_leetcode_contest(),
        'LeetCode History': update_leetcode_history(),
        'TexMex': update_texmex_data()
    }
    
    print('\n' + '=' * 50)
    print('Update Summary:')
    print('=' * 50)
    for service, success in results.items():
        status = '✅ Success' if success else '❌ Failed'
        print(f'{service}: {status}')
    
    successful = sum(results.values())
    total = len(results)
    print(f'\nTotal: {successful}/{total} updates successful')
    print('=' * 50)

if __name__ == '__main__':
    main()

