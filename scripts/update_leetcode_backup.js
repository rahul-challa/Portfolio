const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const OUTPUT_PATH = path.join(__dirname, '../assets/data/Rahul_Challa.json');

// Alternative API endpoints
const ALTERNATIVE_ENDPOINTS = [
  'https://leetcode.com/graphql',
  'https://leetcode-stats-api.herokuapp.com',
  'https://leetcode-api.cyclic.app'
];

// GraphQL query for LeetCode data
const GRAPHQL_QUERY = `
query userContestRankingInfo($username: String!) {
  userContestRanking(username: $username) {
    attendedContestsCount
    rating
    globalRanking
    totalParticipants
    topPercentage
    badge {
      name
    }
  }
  userContestRankingHistory(username: $username) {
    attended
    trendDirection
    problemsSolved
    totalProblems
    finishTimeInSeconds
    rating
    ranking
    contest {
      title
      startTime
    }
  }
}
`;

async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function tryGraphQLApproach() {
  try {
    console.log('Trying GraphQL approach...');
    const response = await fetchWithTimeout('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({
        query: GRAPHQL_QUERY,
        variables: { username: 'Rahul_Challa' }
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.data) {
        return {
          userContestRanking: data.data.userContestRanking,
          userContestRankingHistory: data.data.userContestRankingHistory || []
        };
      }
    }
  } catch (error) {
    console.log('GraphQL approach failed:', error.message);
  }
  return null;
}

async function tryAlternativeAPIs() {
  for (const baseUrl of ALTERNATIVE_ENDPOINTS) {
    try {
      console.log(`Trying alternative API: ${baseUrl}`);
      
      // Try different endpoint patterns
      const endpoints = [
        `${baseUrl}/userContestRankingInfo/Rahul_Challa`,
        `${baseUrl}/Rahul_Challa/contest/history`,
        `${baseUrl}/api/stats/Rahul_Challa`
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetchWithTimeout(endpoint, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          if (response.ok) {
            const data = await response.json();
            console.log(`Success with ${endpoint}`);
            return data;
          }
        } catch (error) {
          console.log(`Failed ${endpoint}: ${error.message}`);
        }
      }
    } catch (error) {
      console.log(`Alternative API ${baseUrl} failed: ${error.message}`);
    }
  }
  return null;
}

async function generateFallbackData() {
  console.log('No real data available from APIs');
  return null; // Don't generate dummy data
}

async function main() {
  try {
    console.log('Starting backup LeetCode data update...');
    
    let data = null;
    
    // Try GraphQL approach first
    data = await tryGraphQLApproach();
    
    // If GraphQL fails, try alternative APIs
    if (!data) {
      data = await tryAlternativeAPIs();
    }
    
    // If all APIs fail, don't generate dummy data
    if (!data) {
      console.log('No real data available from any API');
      process.exit(0);
    }
    
    // Ensure we have the required structure
    const output = {
      userContestRanking: data.userContestRanking || data,
      userContestRankingHistory: Array.isArray(data.userContestRankingHistory) 
        ? data.userContestRankingHistory 
        : (data.history || []),
      submissionCalendar: data.submissionCalendar || {}
    };
    
    // Only save if we have real contest data
    if (!output.userContestRankingHistory || output.userContestRankingHistory.length === 0) {
      console.log('No real contest data available');
      process.exit(0);
    }
    
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
    console.log('Successfully updated', OUTPUT_PATH);
    
  } catch (error) {
    console.error('Backup script failed:', error);
    process.exit(1);
  }
}

main(); 