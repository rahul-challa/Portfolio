import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INFO_URL = 'https://alfa-leetcode-api.onrender.com/userContestRankingInfo/Rahul_Challa';
const HISTORY_URL = 'https://alfa-leetcode-api.onrender.com/Rahul_Challa/contest/history';
const CALENDAR_URL = 'https://alfa-leetcode-api.onrender.com/Rahul_Challa/calendar';
const OUTPUT_PATH = path.join(__dirname, '../assets/data/Rahul_Challa.json');

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

(async () => {
  try {
    const info = await fetchJson(INFO_URL);
    const history = await fetchJson(HISTORY_URL);
    let submissionCalendar = {};
    try {
      const calendarRes = await fetch(CALENDAR_URL);
      if (calendarRes.ok) {
        const calendarData = await calendarRes.json();
        if (calendarData.submissionCalendar) {
          submissionCalendar = JSON.parse(calendarData.submissionCalendar);
        }
      }
    } catch (e) { /* ignore */ }
    const historyArray = Array.isArray(history)
      ? history
      : (history && typeof history === 'object')
        ? (history.history || history.userContestRankingHistory || [])
        : [];
    const output = {
      userContestRanking: info.userContestRanking || info,
      userContestRankingHistory: historyArray,
      submissionCalendar: submissionCalendar
    };
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
    console.log('Updated', OUTPUT_PATH);
  } catch (err) {
    console.error('Failed to update LeetCode data:', err);
    process.exit(1);
  }
})(); 