/*=============== MAIN JAVASCRIPT ===============*/

document.addEventListener('DOMContentLoaded', function() {
    /*=============== MENU SHOW/HIDE ===============*/
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Toggle menu when clicking hamburger
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('show-menu');
    });
    
    // Close menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('show-menu');
        });
    });
    
    /*=============== SKILL ACCORDIONS ===============*/
    const skillHeaders = document.querySelectorAll('.skill-header');
    
    skillHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const skillList = header.parentNode.querySelector('.skill-list');
            const skillArrow = header.querySelector('.skill-arrow');
            
            // Toggle skill list visibility
            if (skillList.style.display === 'none' || skillList.style.display === '') {
                skillList.style.display = 'block';
                skillArrow.style.transform = 'rotate(180deg)';
            } else {
                skillList.style.display = 'none';
                skillArrow.style.transform = 'rotate(0deg)';
            }
        });
    });
    
    /*=============== PROJECT CARDS ANIMATION ===============*/
    // Initialize all project cards with fade-in animation
    document.querySelectorAll('.project-card').forEach(card => {
        card.classList.add('fade-in');
    });
    
    /*=============== CONTACT FORM ===============*/
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Basic validation
            if (name === '' || email === '' || message === '') {
                alert('Please fill in all fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Form submission would normally go here
            // For this example, we'll just show a success message
            alert('Your message has been sent successfully!');
            
            // Reset form
            contactForm.reset();
        });
    }
    
    /*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
    function scrollActive() {
        const scrollY = window.pageYOffset;
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 50;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.add('active');
            } else {
                document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.remove('active');
            }
        });
    }
    
    // Activate scroll event listener
    window.addEventListener('scroll', scrollActive);
    
    /*=============== CHANGE HEADER BACKGROUND ===============*/
    function scrollHeader() {
        const header = document.getElementById('header');
        
        // When the scroll is greater than 80 viewport height, add the scroll-header class
        if (this.scrollY >= 80) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        }
    }
    
    window.addEventListener('scroll', scrollHeader);
    
    /*=============== SHOW SCROLL UP BUTTON ===============*/
    function scrollUp() {
        const scrollUp = document.getElementById('scroll-up');
        
        // When the scroll is higher than 560 viewport height, add the show-scroll class
        if (this.scrollY >= 560) {
            scrollUp.classList.add('show-scroll');
        } else {
            scrollUp.classList.remove('show-scroll');
        }
    }
    
    window.addEventListener('scroll', scrollUp);
    
    // Scroll to top when clicking the scroll-up button
    document.getElementById('scroll-up').addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    /*=============== SCROLL REVEAL ANIMATION ===============*/
    // Initialize sections for animation when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe all section headers, about info items, skill boxes, and project cards
    document.querySelectorAll('.section-header, .info-item, .skill-box, .project-card, .contact-card').forEach(el => {
        observer.observe(el);
    });

    // Code Rain Animation for Profile Image
    const canvas = document.getElementById('codeRainCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    // Set canvas size
    function resizeCanvas() {
        const style = getComputedStyle(canvas);
        canvas.width = parseInt(style.width);
        canvas.height = parseInt(style.height);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Code rain settings
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);
    const codeChars = '01<>/={}[]();$#@&%';
    const yellow = '#FFB81C';

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = fontSize + 'px monospace';
        ctx.fillStyle = yellow;
        ctx.globalAlpha = 0.85;
        for (let i = 0; i < drops.length; i++) {
            const text = codeChars[Math.floor(Math.random() * codeChars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            // Only draw if inside the circle
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const r = canvas.width / 2;
            if (Math.pow(x - cx, 2) + Math.pow(y - cy, 2) < Math.pow(r, 2)) {
                ctx.fillText(text, x, y);
            }
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        ctx.globalAlpha = 1.0;
    }
    setInterval(draw, 60);

    // ========== PROFILES SECTION: GITHUB & LEETCODE ========== //
    // LeetCode loading state
    const leetcodeProfileContainer = document.querySelector('.leetcode-profile');
    if (leetcodeProfileContainer) {
      leetcodeProfileContainer.innerHTML = `<div style="width:100%;text-align:center;padding:2.5rem 0;color:#FFB81C;font-size:1.3rem;">Loading LeetCode stats...</div>`;
    }
    // GitHub
    const githubLogoImg = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
    fetch('https://api.github.com/users/rahul-challa')
      .then(res => res.json())
      .then(data => {
        document.querySelector('.github-profile').innerHTML = `
          <div class=\"profile-info\">\n            <img src=\"${githubLogoImg}\" alt=\"GitHub Logo\" class=\"profile-avatar\" style=\"background:#fff;padding:10px;\"/>\n            <h3>${data.login}</h3>\n            <p>Repos: ${data.public_repos} | Followers: ${data.followers}</p>\n            <a href=\"${data.html_url}\" target=\"_blank\" class=\"btn primary-btn\">View GitHub</a>\n          </div>\n          <div class=\"profile-heatmap\">\n            <img src=\"https://ghchart.rshah.org/26a641/rahul-challa\" alt=\"GitHub Contribution Heatmap\" class=\"github-heatmap\"/>\n            <img src=\"https://github-readme-stats.vercel.app/api?username=rahul-challa&show_icons=true&theme=dark&hide_title=true&icon_color=FFB81C&title_color=FFB81C&text_color=eeeeee\" alt=\"GitHub Stats\" class=\"github-heatmap\"/>\n          </div>\n        `;
      });

    // Add retry mechanism with exponential backoff
    async function fetchWithRetry(url, maxRetries = 3, initialDelay = 1000) {
      let retries = 0;
      let delay = initialDelay;

      while (retries < maxRetries) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            return await response.json();
          }
          if (response.status === 429) {
            console.log(`Rate limited, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
            retries++;
            continue;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        } catch (error) {
          if (retries === maxRetries - 1) throw error;
          console.log(`Error fetching ${url}, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
          retries++;
        }
      }
    }

    // LeetCode (using leetcode-stats-api.herokuapp.com)
    const leetcodeUsername = 'Rahul_Challa';
    const leetcodeDisplayName = 'Rahul Challa';
    const leetcodeLogoImg = 'https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png';
    
    // Add a function to fetch fallback stats from the local JSON file
    async function getFallbackLeetCodeStats() {
      try {
        const res = await fetch('assets/data/Rahul_Challa.json');
        if (res.ok) {
          const data = await res.json();
          return data.userContestRanking || {};
        }
      } catch (e) {
        // Ignore errors
      }
      return {};
    }

    // Modify renderLeetCodeProfile to use fallback stats if API data is missing
    async function renderLeetCodeProfile(data, contestData, contestHistory, isCached = false) {
      let stats = contestData && contestData.data ? contestData.data.userContestRanking : null;
      if (!stats || Object.keys(stats).length === 0) {
        stats = await getFallbackLeetCodeStats();
      }
      // Create the new LeetCode profile HTML (2x2 grid of 4 cards, improved layout)
      const leetcodeProfileHTML = `
        <div class="leetcode-grid">
          <!-- Card 1: Info Card -->
          <div class="leetcode-card card-info card-info-twocol">
            <div class="info-cols">
              <div class="info-col-left">
                <img src="${leetcodeLogoImg}" alt="LeetCode Logo" class="leetcode-logo-large twocol-logo"/>
              </div>
              <div class="center-bar"></div>
              <div class="info-col-right">
                <div class="leetcode-username-main twocol-username">${leetcodeDisplayName}</div>
                <div class="leetcode-rating-block twocol-rating-block">
                  <div class="rating-label">Contest Rating</div>
                  <div class="rating-value">${stats && stats.rating ? Math.round(stats.rating) : '--'}</div>
                  <div class="rank-label">Global Rank</div>
                  <div class="rank-value">${stats && stats.globalRanking ? stats.globalRanking.toLocaleString() : '--'}</div>
                </div>
              </div>
            </div>
            <a href="https://leetcode.com/${leetcodeUsername}" target="_blank" class="btn primary-btn leetcode-btn info-btn long-btn">View LeetCode</a>
            ${isCached ? '<div style="color:#ffb800;font-size:0.95rem;margin-top:0.7rem;">(Showing cached data)</div>' : ''}
          </div>
          <!-- Card 3: Problem Pie Chart, Stats (moved up) -->
          <div class="leetcode-card card-pie-chart">
            <div class="pie-and-stats">
              <div class="pie-chart-container">
                <canvas id="problemStatsChart" width="110" height="110"></canvas>
              </div>
              <div class="center-bar"></div>
              <div class="problem-stats-list">
                <div class="stat-row easy"><span>Easy:</span> <span>${data.easySolved}/${data.totalEasy}</span></div>
                <div class="stat-row medium"><span>Medium:</span> <span>${data.mediumSolved}/${data.totalMedium}</span></div>
                <div class="stat-row hard"><span>Hard:</span> <span>${data.hardSolved}/${data.totalHard}</span></div>
              </div>
            </div>
          </div>
          <!-- Card 2: Contest Rating Over Time Chart (Minimal, moved down) -->
          <div class="leetcode-card card-line-chart">
            <div class="contest-stats-row" style="display: flex; justify-content: flex-start; align-items: flex-end; gap: 1.2rem; margin-bottom: 0.2rem; width: 100%;">
              <div style="display: flex; flex-direction: column; align-items: flex-start; min-width: 0;">
                <span style="color: #b3b3b3; font-size: 0.92rem; font-weight: 500; line-height: 1.1;">Contest Rating</span>
                <span style="color: #fff; font-size: 1.13rem; font-weight: 700; letter-spacing: 0.01em; line-height: 1.1;">${stats && stats.rating ? Math.round(stats.rating) : '--'}</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: flex-start; min-width: 0;">
                <span style="color: #b3b3b3; font-size: 0.92rem; font-weight: 500; line-height: 1.1;">Global Ranking</span>
                <span style="color: #fff; font-size: 1.02rem; font-weight: 700; letter-spacing: 0.01em; line-height: 1.1;">
                  ${stats && stats.globalRanking ? stats.globalRanking.toLocaleString() : '--'}
                  <span style="color: #666; font-size: 0.92rem; font-weight: 500;">/${stats && stats.totalParticipants ? stats.totalParticipants.toLocaleString() : '--'}</span>
                </span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: flex-start; min-width: 0;">
                <span style="color: #b3b3b3; font-size: 0.92rem; font-weight: 500; line-height: 1.1;">Attended</span>
                <span style="color: #fff; font-size: 1.02rem; font-weight: 700; letter-spacing: 0.01em; line-height: 1.1;">${stats && stats.attendedContestsCount ? stats.attendedContestsCount : '--'}</span>
              </div>
            </div>
            <canvas id="contestRatingChart" width="320" height="180"></canvas>
          </div>
          <!-- Card 4: LeetCode Activity Heatmap -->
          <div class="leetcode-card card-bar-chart">
            <div class="leetcode-heatmap-svg">
              <!-- LeetCode Activity Heatmap SVG will be dynamically inserted here -->
            </div>
          </div>
        </div>
      `;
      document.querySelector('.leetcode-profile').innerHTML = leetcodeProfileHTML;

      // Initialize Problem Stats Chart (LeetCode-style: Easy, Medium, Hard)
      const totalSolved = data.easySolved + data.mediumSolved + data.hardSolved;
      const problemStatsCtx = document.getElementById('problemStatsChart').getContext('2d');
      new Chart(problemStatsCtx, {
        type: 'doughnut',
        data: {
          labels: ['Easy', 'Medium', 'Hard'],
          datasets: [{
            data: [data.easySolved, data.mediumSolved, data.hardSolved],
            backgroundColor: ['#00af9b', '#ffb800', '#ff2d55'],
            borderWidth: 0,
            borderRadius: 18,
            cutout: '88%',
            hoverOffset: 0,
            spacing: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          layout: { padding: 0 },
          animation: false
        }
      });
      // Overlay center text for total solved
      const pieChartContainer = document.querySelector('.pie-chart-container');
      if (pieChartContainer) {
        const centerTextDiv = document.createElement('div');
        centerTextDiv.className = 'chart-center-text';
        centerTextDiv.innerHTML = `
          <div class="acceptance-main">${totalSolved}</div>
          <div class="acceptance-label">Solved</div>
        `;
        pieChartContainer.appendChild(centerTextDiv);
      }
      // Contest Rating Chart
      let rankingHistory = [];
      if (contestHistory && Array.isArray(contestHistory)) {
        rankingHistory = contestHistory;
      } else if (contestHistory && Array.isArray(contestHistory.userContestRankingHistory)) {
        rankingHistory = contestHistory.userContestRankingHistory;
      }
      // Only use attended contests
      let attendedContests = rankingHistory.filter(c => c.attended);
      // Sort by contest start time (oldest to newest)
      attendedContests.sort((a, b) => a.contest.startTime - b.contest.startTime);
      if (attendedContests.length > 0) {
        // Only show first and last year labels
        const years = attendedContests.map(contest => {
          const date = new Date(contest.contest.startTime * 1000);
          return `${date.getFullYear()}`;
        });
        const labels = years.map((year, idx, arr) => {
          if (idx === 0 || idx === arr.length - 1) return year;
          return '';
        });
        const ratings = attendedContests.map(contest => contest.rating);
        const contestRatingCanvas = document.getElementById('contestRatingChart');
        const contestRatingCtx = contestRatingCanvas?.getContext('2d');
        if (typeof Chart !== 'undefined' && contestRatingCtx) {
          new Chart(contestRatingCtx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                data: ratings,
                borderColor: '#ffb800',
                borderWidth: 2,
                fill: false,
                tension: 0, // Make it a straight line graph
                pointRadius: 0, // No points
                pointHoverRadius: 0, // No hover points
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: { enabled: false }, // No tooltips
                title: { display: false }
              },
              layout: { padding: { top: 20, bottom: 20, left: 10, right: 10 } },
              scales: {
                y: { display: false }, // Hide y-axis
                x: {
                  grid: { display: false },
                  ticks: {
                    color: '#e0e0e0',
                    font: { size: 14 },
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0,
                    padding: 10
                  },
                  border: { display: false },
                }
              },
              interaction: { intersect: false, mode: 'index' },
              elements: { line: { tension: 0 } },
              backgroundColor: 'transparent',
            }
          });
        } else {
          console.error('Chart.js not loaded or contestRatingChart canvas missing');
        }
      } else {
        console.warn('No attended contests found for chart rendering:', rankingHistory);
        const contestChartContainer = document.querySelector('.leetcode-card.card-line-chart');
        if (contestChartContainer) {
          // Do not display any message if there is no contest history
        }
      }
      // Always attempt to render the contest chart (fallback)
      if (typeof renderContestChart === 'function') {
        setTimeout(renderContestChart, 0);
      }
      // LeetCode Activity Heatmap (SVG, using API, true LeetCode chronological style, last n days from today)
      renderLeetCodeHeatmap();
    }

    // Try to load cache from a local file (for development/testing)
    async function loadLeetCodeCacheFromFile() {
      try {
        const response = await fetch('assets/data/Rahul_Challa.json');
        if (response.ok) {
          const cache = await response.json();
          // The file contains userContestRanking and userContestRankingHistory
          // We'll use userContestRanking as contestData, userContestRankingHistory as contestHistory
          // For leetcodeStats, we can create a minimal object or leave as null if not needed
          return {
            leetcodeStats: {}, // Optionally fill with more data if needed
            leetcodeContestHistory: cache.userContestRankingHistory,
            leetcodeContestData: cache.userContestRanking
          };
        }
      } catch (e) { console.warn('Could not load local cache file:', e); }
      return null;
    }

    fetchWithRetry('https://leetcode-stats-api.herokuapp.com/' + leetcodeUsername)
      .then(data => {
        console.log('Initial LeetCode stats:', data); // Debug log
        if (!data || !data.totalSolved) {
          throw new Error('Invalid LeetCode stats data');
        }
        // Fetch contest data
        return Promise.all([
          data,
          fetchWithRetry('https://alfa-leetcode-api.onrender.com/userContestRankingInfo/' + leetcodeUsername)
            .catch(() => null),
          fetchWithRetry('https://alfa-leetcode-api.onrender.com/' + leetcodeUsername + '/contest/history')
            .catch(error => {
              console.error('Error fetching contest history:', error);
              return null;
            })
        ]);
      })
      .then(([data, contestData, contestHistory]) => {
        // Cache the latest successful stats and contest history
        try {
          localStorage.setItem('leetcodeStats', JSON.stringify(data));
          localStorage.setItem('leetcodeContestHistory', JSON.stringify(contestHistory));
        } catch (e) { console.warn('Could not cache LeetCode data:', e); }
        renderLeetCodeProfile(data, contestData, contestHistory, false);
      })
      .catch(async error => {
        console.error('Error fetching LeetCode stats:', error);
        // Try to use cached data if available
        let cachedStats = null, cachedContestHistory = null;
        try {
          cachedStats = localStorage.getItem('leetcodeStats');
          cachedContestHistory = localStorage.getItem('leetcodeContestHistory');
        } catch (e) { console.warn('Could not access localStorage:', e); }
        if (cachedStats && cachedContestHistory) {
          const data = JSON.parse(cachedStats);
          const contestHistory = JSON.parse(cachedContestHistory);
          renderLeetCodeProfile(data, null, contestHistory, true);
        } else {
          // Try to load from local file (for dev/testing)
          const fileCache = await loadLeetCodeCacheFromFile();
          console.log('DEBUG: fileCache', fileCache);
          if (fileCache && fileCache.leetcodeContestHistory) {
            // Use the fallback contest data and history, and provide dummy stats for the pie chart
            renderLeetCodeProfile({
              easySolved: 0,
              mediumSolved: 0,
              hardSolved: 0,
              totalEasy: 0,
              totalMedium: 0,
              totalHard: 0
            }, { data: { userContestRanking: fileCache.leetcodeContestData } }, { userContestRankingHistory: fileCache.leetcodeContestHistory }, true);
          } else if (leetcodeProfileContainer) {
            // Do not display any API failure message in the card UI
          }
        }
      });

    // ========== NEW LEETCODE CONTEST RATING CHART LOGIC ========== //
    async function fetchContestHistory() {
      console.log('LeetCode contest chart logic running');
      // Try API first
      try {
        console.log('Attempting to fetch from API...');
        const apiRes = await fetch('https://alfa-leetcode-api.onrender.com/Rahul_Challa/contest/history');
        if (apiRes.ok) {
          const apiData = await apiRes.json();
          console.log('API contest history data:', apiData); // Debug log
          let contestArray = null;
          if (Array.isArray(apiData)) {
            contestArray = apiData;
          } else if (apiData && typeof apiData === 'object') {
            // Try to find the first array property in the object
            for (const key in apiData) {
              if (Array.isArray(apiData[key])) {
                contestArray = apiData[key];
                break;
              }
            }
          }
          if (Array.isArray(contestArray)) {
            const attended = contestArray.filter(c => c.attended);
            if (attended.length > 0) return attended;
          }
          // If API returns empty, fall through to fallback
          console.warn('API returned no attended contests, trying fallback...');
        }
      } catch (e) {
        console.warn('API failed, will try fallback:', e);
      }
      // Fallback to local JSON
      try {
        console.log('Attempting to fetch from local JSON...');
        const fallbackRes = await fetch('assets/data/Rahul_Challa.json');
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          if (Array.isArray(fallbackData.userContestRankingHistory)) {
            const attended = fallbackData.userContestRankingHistory.filter(c => c.attended);
            if (attended.length > 0) return attended;
          }
        }
      } catch (e) {
        console.error('Both API and fallback failed:', e);
      }
      return [];
    }

    async function renderContestChart() {
      const contests = await fetchContestHistory();
      // Sort by contest start time (oldest to newest)
      contests.sort((a, b) => a.contest.startTime - b.contest.startTime);
      const canvas = document.getElementById('contestRatingChart');
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;
      if (canvas._chartInstance) canvas._chartInstance.destroy();
      if (!contests || contests.length === 0) return;
      const years = contests.map(c => {
        const date = new Date(c.contest.startTime * 1000);
        return `${date.getFullYear()}`;
      });
      const labels = years.map((year, idx, arr) => {
        if (idx === 0 || idx === arr.length - 1) return year;
        return '';
      });
      const ratings = contests.map(c => c.rating);
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            data: ratings,
            borderColor: '#ffb800',
            borderWidth: 2,
            fill: false,
            tension: 0, // Make it a straight line graph
            pointRadius: 0,
            pointHoverRadius: 0,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
            title: { display: false }
          },
          layout: { padding: { top: 20, bottom: 20, left: 10, right: 10 } },
          scales: {
            y: { display: false },
            x: {
              grid: { display: false },
              ticks: {
                color: '#e0e0e0',
                font: { size: 14 },
                autoSkip: false,
                maxRotation: 0,
                minRotation: 0,
                padding: 10
              },
              border: { display: false },
            }
          },
          interaction: { intersect: false, mode: 'index' },
          elements: { line: { tension: 0 } },
          backgroundColor: 'transparent',
        }
      });
      canvas._chartInstance = chart;
    }

    // LeetCode Activity Heatmap (SVG, using API, true LeetCode chronological style, last n days from today)
    async function renderLeetCodeHeatmap() {
      const heatmapCard = document.querySelector('.leetcode-card.card-bar-chart');
      if (!heatmapCard) return;
      // Fetch calendar data from API
      let calendarData = {};
      try {
        const res = await fetch('https://alfa-leetcode-api.onrender.com/Rahul_Challa/calendar');
        if (res.ok) {
          const apiData = await res.json();
          if (apiData.submissionCalendar) {
            calendarData = JSON.parse(apiData.submissionCalendar);
          }
        }
      } catch (e) { /* ignore */ }
      // Fallback to local JSON if API fails or is empty
      if (!calendarData || Object.keys(calendarData).length === 0) {
        try {
          const fallbackRes = await fetch('assets/data/Rahul_Challa.json');
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            if (fallbackData.submissionCalendar) {
              calendarData = fallbackData.submissionCalendar;
            }
          }
        } catch (e) { /* ignore */ }
      }
      // Grid size: weeks x rows
      const rows = 7;
      const weeks = 30; // e.g., 30 weeks (210 days)
      const days = weeks * rows;
      const today = new Date();
      let activity = Array(days).fill(0);
      let totalSubmissions = 0;
      for (const ts in calendarData) {
        const day = new Date(parseInt(ts, 10) * 1000);
        const diff = Math.floor((today - day) / (1000 * 60 * 60 * 24));
        if (diff >= 0 && diff < days) {
          activity[days - diff - 1] = calendarData[ts];
          totalSubmissions += calendarData[ts];
        }
      }
      // No padding: rightmost column is today
      // SVG grid: weeks x 7 days, small cells, minimal gap
      const cell = 11, gap = 2;
      const svgWidth = weeks * (cell + gap);
      const svgHeight = rows * (cell + gap) + 18;
      // Month labels
      let monthLabels = [];
      let lastMonth = null;
      for (let w = 0; w < weeks; w++) {
        // Find the date for the first cell in this week
        const idx = days - (weeks - w) * rows;
        const date = new Date(today.getTime() - (days - (w + 1) * rows) * 24 * 60 * 60 * 1000);
        const month = date.toLocaleString('default', { month: 'short' });
        if (month !== lastMonth) {
          monthLabels.push({ x: w * (cell + gap), label: month });
          lastMonth = month;
        }
      }
      // SVG
      let svg = `<svg width="${svgWidth}" height="${svgHeight}">`;
      // Draw cells
      for (let w = 0; w < weeks; w++) {
        for (let d = 0; d < rows; d++) {
          const idx = w * rows + d;
          if (idx >= activity.length) continue;
          const x = w * (cell + gap);
          const y = d * (cell + gap) + 12;
          const count = activity[idx];
          // LeetCode green color scale
          let color = '#222';
          if (count > 0) color = '#9be9a8';
          if (count > 1) color = '#40c463';
          if (count > 2) color = '#30a14e';
          if (count > 4) color = '#216e39';
          svg += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" fill="${color}"/>`;
        }
      }
      // Draw month labels
      svg += monthLabels.map(m => `<text x="${m.x + 2}" y="10" font-size="9" fill="#bbb">${m.label}</text>`).join('');
      svg += '</svg>';
      heatmapCard.innerHTML = `<div style=\"color:#bbb;font-size:1.05rem;margin-bottom:0.2rem;\"><span style=\"color:#fff;font-size:1.2rem;font-weight:700;\">${totalSubmissions}</span> submissions in the last ${days} days</div><div class=\"leetcode-heatmap-svg\" style=\"display:flex;justify-content:center;align-items:center;width:100%;height:100%;\">${svg}</div>`;
    }
});
