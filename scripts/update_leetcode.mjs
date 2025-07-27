import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multiple API endpoints as fallbacks
const API_ENDPOINTS = [
  'https://alfa-leetcode-api.onrender.com',
  'https://leetcode-stats-api.herokuapp.com',
  'https://leetcode-api.cyclic.app'
];

const USERNAME = 'Rahul_Challa';
const OUTPUT_PATH = path.join(__dirname, '../assets/data/Rahul_Challa.json');

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000 // 10 second timeout
      });
      
      if (res.status === 429) {
        console.log(`Rate limited (429) for ${url}, retrying in ${RETRY_DELAY}ms...`);
        await sleep(RETRY_DELAY * (i + 1)); // Exponential backoff
        continue;
      }
      
      if (!res.ok) {
        throw new Error(`Failed to fetch ${url}: ${res.status}`);
      }
      
      return res.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Attempt ${i + 1} failed for ${url}, retrying...`);
      await sleep(RETRY_DELAY);
    }
  }
}

async function tryMultipleEndpoints(endpointType, username) {
  for (const baseUrl of API_ENDPOINTS) {
    try {
      let url;
      switch (endpointType) {
        case 'info':
          url = `${baseUrl}/userContestRankingInfo/${username}`;
          break;
        case 'history':
          url = `${baseUrl}/${username}/contest/history`;
          break;
        case 'calendar':
          url = `${baseUrl}/${username}/calendar`;
          break;
        default:
          throw new Error(`Unknown endpoint type: ${endpointType}`);
      }
      
      console.log(`Trying ${url}...`);
      const data = await fetchWithRetry(url);
      console.log(`Successfully fetched ${endpointType} from ${baseUrl}`);
      return data;
    } catch (error) {
      console.log(`Failed to fetch ${endpointType} from ${baseUrl}: ${error.message}`);
      continue;
    }
  }
  throw new Error(`All endpoints failed for ${endpointType}`);
}

async function getLeetCodeData() {
  try {
    // Try to fetch contest ranking info
    let info;
    try {
      info = await tryMultipleEndpoints('info', USERNAME);
      console.log('Info response:', JSON.stringify(info, null, 2));
    } catch (error) {
      console.log('Failed to fetch contest ranking info');
      return null; // Don't create dummy data
    }

    // Try to fetch contest history
    let history;
    try {
      history = await tryMultipleEndpoints('history', USERNAME);
      console.log('History response:', JSON.stringify(history, null, 2));
    } catch (error) {
      console.log('Failed to fetch contest history');
      return null; // Don't create dummy data
    }

    // Try to fetch submission calendar
    let submissionCalendar = {};
    try {
      const calendarData = await tryMultipleEndpoints('calendar', USERNAME);
      if (calendarData && calendarData.submissionCalendar) {
        submissionCalendar = JSON.parse(calendarData.submissionCalendar);
      }
    } catch (error) {
      console.log('Failed to fetch submission calendar, using empty data');
    }

    // Process history data
    const historyArray = Array.isArray(history)
      ? history
      : (history && typeof history === 'object')
        ? (history.history || history.userContestRankingHistory || [])
        : [];

    // Only proceed if we have real contest data
    if (historyArray.length === 0) {
      console.log('No contest history data available');
      return null;
    }

    // Handle different info response formats
    let userContestRanking;
    if (info && info.userContestRanking) {
      userContestRanking = info.userContestRanking;
    } else if (info && info.attendedContestsCount) {
      userContestRanking = info;
    } else {
      console.log('No valid contest ranking data available');
      return null;
    }

    const output = {
      userContestRanking: userContestRanking,
      userContestRankingHistory: historyArray,
      submissionCalendar: submissionCalendar
    };

    return output;
  } catch (error) {
    console.error('Failed to fetch any LeetCode data:', error);
    return null; // Don't create dummy data
  }
}

(async () => {
  try {
    console.log('Starting LeetCode data update...');
    const output = await getLeetCodeData();
    
    if (output) {
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
      console.log('Successfully updated', OUTPUT_PATH);
    } else {
      console.log('No valid LeetCode data to save.');
      // If no data, we don't need to try backup or keep existing data
      process.exit(0);
    }
  } catch (err) {
    console.error('Failed to update LeetCode data:', err);
    
    // Try backup approach if primary fails
    console.log('Trying backup approach...');
    try {
      const { execSync } = await import('child_process');
      execSync('npm run update-leetcode-backup', { stdio: 'inherit' });
      console.log('Backup approach completed successfully');
    } catch (backupError) {
      console.error('Backup approach also failed:', backupError);
      
      // If we have existing data, keep it instead of failing completely
      if (fs.existsSync(OUTPUT_PATH)) {
        console.log('Keeping existing data due to API failures');
        process.exit(0);
      } else {
        console.error('No existing data found, exiting with error');
        process.exit(1);
      }
    }
  }
})(); 