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

def update_leetcode_calendar():
    """Update LeetCode calendar data"""
    print('\n=== Updating LeetCode Calendar Data ===')
    username = 'Rahul_Challa'
    # Prioritize alfa-leetcode-api as it's the most reliable
    # Prioritize alfa-leetcode-api as it's the most reliable
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
        result_data, status, headers = fetch_with_retry(endpoint, timeout=45)
        if result_data:
            data = result_data
            api_url = endpoint
            response_status = status
            response_headers = headers
            print(f'[SUCCESS] Successfully fetched calendar data from: {endpoint}')
            break
        else:
            print(f'[FAILED] Failed to fetch from {endpoint}')
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
        
        print('[SUCCESS] LeetCode calendar data updated successfully')
        return True
    else:
        print('[FAILED] Failed to fetch LeetCode calendar data from all endpoints')
        return False

def update_leetcode_contest():
    """Update LeetCode contest data"""
    print('\n=== Updating LeetCode Contest Data ===')
    username = 'Rahul_Challa'
    # Prioritize alfa-leetcode-api as it's the most reliable and returns correct format
    api_endpoints = [
        f'https://alfa-leetcode-api.onrender.com/{username}/contest',
        f'https://leetcode-api.cyclic.app/{username}/contest'
    ]
    
    data = None
    api_url = None
    response_status = None
    response_headers = None
    
    time.sleep(3)
    
    for endpoint in api_endpoints:
        result_data, status, headers = fetch_with_retry(endpoint, timeout=45)
        if result_data:
            data = result_data
            api_url = endpoint
            response_status = status
            response_headers = headers
            print(f'[SUCCESS] Successfully fetched contest data from: {endpoint}')
            break
        else:
            print(f'[FAILED] Failed to fetch from {endpoint}')
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
        
        print('[SUCCESS] LeetCode contest data updated successfully')
        return True
    else:
        print('[FAILED] Failed to fetch LeetCode contest data from all endpoints')
        return False

def update_leetcode_history():
    """Update LeetCode history data"""
    print('\n=== Updating LeetCode History Data ===')
    username = 'Rahul_Challa'
    # Prioritize alfa-leetcode-api as it's the most reliable
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
        result_data, status, headers = fetch_with_retry(endpoint, timeout=45)
        if result_data:
            contest_data = result_data
            api_url = endpoint
            response_status = status
            response_headers = headers
            print(f'[SUCCESS] Successfully fetched history data from: {endpoint}')
            break
        else:
            print(f'[FAILED] Failed to fetch from {endpoint}')
            if endpoint != api_endpoints[-1]:
                print('Waiting 3 seconds before trying next endpoint...')
                time.sleep(3)
    
    if contest_data:
        # Extract contest participation data - handle alfa-leetcode-api format
        contest_history = []
        if isinstance(contest_data, dict):
            # alfa-leetcode-api returns contestParticipation directly in data
            if 'contestParticipation' in contest_data:
                contest_history = contest_data['contestParticipation']
            elif 'data' in contest_data and isinstance(contest_data['data'], dict):
                # Check nested data structure
                if 'contestParticipation' in contest_data['data']:
                    contest_history = contest_data['data']['contestParticipation']
                elif 'userContestRankingHistory' in contest_data['data']:
                    contest_history = contest_data['data']['userContestRankingHistory']
            else:
                contest_history = contest_data.get('contestParticipation', []) or contest_data.get('userContestRankingHistory', [])
        
        history_data = {
            'count': len(contest_history),
            'contestHistory': contest_history,
            'contestParticipation': contest_history  # Also include for alfa-leetcode-api format
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
        
        print('[SUCCESS] LeetCode history data updated successfully')
        return True
    else:
        print('[FAILED] Failed to fetch LeetCode history data from all endpoints')
        return False

def _normalize_leetcode_stats(data, api_url, response_status, response_headers):
    """Build stats_data dict from either leetcode-stats-api or alfa-leetcode-api format."""
    # leetcode-stats-api format: totalSolved, easySolved, totalEasy, etc.
    if 'totalSolved' in data or ('totalQuestions' in data and data.get('totalQuestions', 0) > 0):
        stats_data = {
            'totalSolved': data.get('totalSolved', 0),
            'totalQuestions': data.get('totalQuestions', 0),
            'easySolved': data.get('easySolved', 0),
            'totalEasy': data.get('totalEasy', 0),
            'mediumSolved': data.get('mediumSolved', 0),
            'totalMedium': data.get('totalMedium', 0),
            'hardSolved': data.get('hardSolved', 0),
            'totalHard': data.get('totalHard', 0),
            'acceptanceRate': data.get('acceptanceRate', 0)
        }
    else:
        # alfa-leetcode-api /solved format: solvedProblem, easySolved, mediumSolved, hardSolved
        total_solved = data.get('solvedProblem', 0)
        easy = data.get('easySolved', 0)
        medium = data.get('mediumSolved', 0)
        hard = data.get('hardSolved', 0)
        # Default LeetCode totals if not provided (approximate)
        total_easy = data.get('totalEasy', 921)
        total_medium = data.get('totalMedium', 1982)
        total_hard = data.get('totalHard', 899)
        stats_data = {
            'totalSolved': total_solved,
            'totalQuestions': total_easy + total_medium + total_hard,
            'easySolved': easy,
            'totalEasy': total_easy,
            'mediumSolved': medium,
            'totalMedium': total_medium,
            'hardSolved': hard,
            'totalHard': total_hard,
            'acceptanceRate': 0
        }
        if stats_data['totalQuestions'] > 0 and total_solved > 0:
            stats_data['acceptanceRate'] = round((total_solved / stats_data['totalQuestions']) * 100, 2)

    if stats_data['totalEasy'] > 0:
        stats_data['easyPercentage'] = round((stats_data['easySolved'] / stats_data['totalEasy']) * 100, 1)
    else:
        stats_data['easyPercentage'] = 0
    if stats_data['totalMedium'] > 0:
        stats_data['mediumPercentage'] = round((stats_data['mediumSolved'] / stats_data['totalMedium']) * 100, 1)
    else:
        stats_data['mediumPercentage'] = 0
    if stats_data['totalHard'] > 0:
        stats_data['hardPercentage'] = round((stats_data['hardSolved'] / stats_data['totalHard']) * 100, 1)
    else:
        stats_data['hardPercentage'] = 0

    return {
        'lastUpdated': datetime.datetime.now().isoformat(),
        'data': stats_data,
        'apiSource': api_url,
        'responseHeaders': dict(response_headers) if response_headers else None,
        'responseStatus': response_status,
        'requestUrl': api_url
    }


def update_leetcode_stats():
    """Update LeetCode problem-solving stats"""
    print('\n=== Updating LeetCode Problem-Solving Stats ===')
    username = 'Rahul_Challa'
    # Try leetcode-stats-api (Render mirror; Heroku one is often down), then alfa /solved
    api_endpoints = [
        (f'https://leetcode-stats-api.onrender.com/{username}', 50),
        (f'https://leetcode-stats-api.herokuapp.com/{username}', 30),
        (f'https://alfa-leetcode-api.onrender.com/{username}/solved', 45),
    ]
    
    data = None
    api_url = None
    response_status = None
    response_headers = None
    
    time.sleep(2)
    
    for endpoint_spec in api_endpoints:
        endpoint = endpoint_spec[0] if isinstance(endpoint_spec, tuple) else endpoint_spec
        timeout = endpoint_spec[1] if isinstance(endpoint_spec, tuple) and len(endpoint_spec) > 1 else 45
        result_data, status, headers = fetch_with_retry(endpoint, timeout=timeout)
        if result_data:
            if 'totalSolved' in result_data or 'easySolved' in result_data or 'solvedProblem' in result_data:
                data = result_data
                api_url = endpoint
                response_status = status
                response_headers = headers
                print(f'[SUCCESS] Successfully fetched stats data from: {endpoint}')
                break
        else:
            print(f'[FAILED] Failed to fetch from {endpoint}')
            if endpoint_spec != api_endpoints[-1]:
                print('Waiting 3 seconds before trying next endpoint...')
                time.sleep(3)
    
    if data:
        final_data = _normalize_leetcode_stats(data, api_url, response_status, response_headers)
        os.makedirs('data', exist_ok=True)
        with open('data/leetcode-stats.json', 'w') as f:
            json.dump(final_data, f, indent=2)
        print('[SUCCESS] LeetCode problem-solving stats updated successfully')
        return True
    else:
        # Fallback: try alfa /progress + /solved to build stats
        print('Trying alfa-leetcode-api /solved and /progress...')
        time.sleep(2)
        solved, s_status, s_headers = fetch_with_retry(
            f'https://alfa-leetcode-api.onrender.com/{username}/solved', timeout=45
        )
        if solved:
            progress, p_status, p_headers = fetch_with_retry(
                f'https://alfa-leetcode-api.onrender.com/{username}/progress', timeout=45
            )
            if progress:
                na = progress.get('numAcceptedQuestions', {})
                if isinstance(na, dict):
                    na = na.get('numAcceptedQuestions', [])
                else:
                    na = na if isinstance(na, list) else []
                nu = progress.get('numUntouchedQuestions', []) or []
                nf = progress.get('numFailedQuestions', []) or []

                def _count_for_difficulty(arr, diff):
                    for x in arr:
                        d = x.get('difficulty', '')
                        if d == diff or d == diff.upper() or d == diff.title():
                            return x.get('count', 0)
                    return 0

                total_easy = _count_for_difficulty(na, 'EASY') + _count_for_difficulty(nu, 'EASY') + _count_for_difficulty(nf, 'EASY')
                total_medium = _count_for_difficulty(na, 'MEDIUM') + _count_for_difficulty(nu, 'MEDIUM') + _count_for_difficulty(nf, 'MEDIUM')
                total_hard = _count_for_difficulty(na, 'HARD') + _count_for_difficulty(nu, 'HARD') + _count_for_difficulty(nf, 'HARD')
                if total_easy == 0:
                    total_easy = 921
                if total_medium == 0:
                    total_medium = 1982
                if total_hard == 0:
                    total_hard = 899
                solved['totalEasy'] = total_easy
                solved['totalMedium'] = total_medium
                solved['totalHard'] = total_hard
                final_data = _normalize_leetcode_stats(
                    solved,
                    f'https://alfa-leetcode-api.onrender.com/{username}/solved+progress',
                    s_status,
                    s_headers
                )
                os.makedirs('data', exist_ok=True)
                with open('data/leetcode-stats.json', 'w') as f:
                    json.dump(final_data, f, indent=2)
                print('[SUCCESS] LeetCode problem-solving stats updated from alfa /solved + /progress')
                return True
        print('[FAILED] Failed to fetch LeetCode problem-solving stats from all endpoints')
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
            
            print('[SUCCESS] TexMex package data updated successfully')
            return True
        else:
            print(f'[FAILED] Failed to fetch TexMex package data: {response.status_code}')
            return False
    except Exception as e:
        print(f'[ERROR] Error fetching TexMex package data: {str(e)}')
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
        'LeetCode Stats': update_leetcode_stats(),
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

