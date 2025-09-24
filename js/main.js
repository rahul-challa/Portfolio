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
    
    // GitHub - Load from local data file
    const githubLogoImg = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
    
    async function loadGitHubData() {
      try {
        console.log('Loading GitHub data from ./data/github-profile.json');
        const response = await fetch('./data/github-profile.json');
        if (!response.ok) {
          throw new Error('Failed to load GitHub data');
        }
        const githubData = await response.json();
        console.log('GitHub data loaded:', githubData);
        const data = githubData.data;
        
        document.querySelector('.github-profile').innerHTML = `
          <div class="profile-info">
            <img src="${githubLogoImg}" alt="GitHub Logo" class="profile-avatar" style="background:#fff;padding:10px;"/>
            <h3>${data.login}</h3>
            <p>Repos: ${data.public_repos} | Followers: ${data.followers}</p>
            <a href="${data.html_url}" target="_blank" class="btn primary-btn">View GitHub</a>
          </div>
          <div class="profile-heatmap">
            <img src="https://ghchart.rshah.org/26a641/rahul-challa" alt="GitHub Contribution Heatmap" class="github-heatmap"/>
            <img src="https://github-readme-stats.vercel.app/api?username=rahul-challa&show_icons=true&theme=dark&hide_title=true&icon_color=FFB81C&title_color=FFB81C&text_color=eeeeee" alt="GitHub Stats" class="github-heatmap"/>
          </div>
        `;
        
        // Show last updated timestamp
        const lastUpdated = new Date(githubData.lastUpdated).toLocaleDateString();
        console.log(`GitHub data loaded (last updated: ${lastUpdated})`);
      } catch (error) {
        console.error('Error loading GitHub data:', error);
        // Fallback to static data
        document.querySelector('.github-profile').innerHTML = `
          <div class="profile-info">
            <img src="${githubLogoImg}" alt="GitHub Logo" class="profile-avatar" style="background:#fff;padding:10px;"/>
            <h3>rahul-challa</h3>
            <p>Repos: 25 | Followers: 15</p>
            <a href="https://github.com/rahul-challa" target="_blank" class="btn primary-btn">View GitHub</a>
          </div>
          <div class="profile-heatmap">
            <img src="https://ghchart.rshah.org/26a641/rahul-challa" alt="GitHub Contribution Heatmap" class="github-heatmap"/>
            <img src="https://github-readme-stats.vercel.app/api?username=rahul-challa&show_icons=true&theme=dark&hide_title=true&icon_color=FFB81C&title_color=FFB81C&text_color=eeeeee" alt="GitHub Stats" class="github-heatmap"/>
          </div>
        `;
      }
    }
    
    // Load GitHub data
    loadGitHubData();

    // LeetCode configuration
    const leetcodeUsername = 'Rahul_Challa';
    const leetcodeDisplayName = 'Rahul Challa';
    const leetcodeLogoImg = 'https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png';
    
    // LeetCode API endpoints
    const leetcodeAPIs = [
      'https://alfa-leetcode-api.onrender.com',
      'https://leetcode-stats-api.herokuapp.com',
      'https://leetcode-api.cyclic.app'
    ];
    
    // Function to load LeetCode data from local files
    async function loadLeetCodeData() {
      try {
        console.log('Loading LeetCode data from local files...');
        
        // Load contest data
        console.log('Loading contest data from ./data/leetcode-contest.json');
        const contestResponse = await fetch('./data/leetcode-contest.json');
        if (!contestResponse.ok) throw new Error('Failed to load contest data');
        const contestData = await contestResponse.json();
        console.log('Contest data loaded:', contestData);
        
        // Load history data
        console.log('Loading history data from ./data/leetcode-history.json');
        const historyResponse = await fetch('./data/leetcode-history.json');
        if (!historyResponse.ok) throw new Error('Failed to load history data');
        const historyData = await historyResponse.json();
        console.log('History data loaded:', historyData);
        
        // Load calendar data
        console.log('Loading calendar data from ./data/leetcode-calendar.json');
        const calendarResponse = await fetch('./data/leetcode-calendar.json');
        if (!calendarResponse.ok) throw new Error('Failed to load calendar data');
        const calendarData = await calendarResponse.json();
        console.log('Calendar data loaded:', calendarData);
        
        console.log('LeetCode data loaded successfully from local files');
        return {
          contestData,
          historyData,
          calendarData
        };
      } catch (error) {
        console.error('Failed to load LeetCode data from local files:', error.message);
        // Return fallback data structure instead of null
        return {
          contestData: { data: { data: { userContestRanking: null } } },
          historyData: { data: { contestHistory: [] } },
          calendarData: { data: { submissionCalendar: "{}" } }
        };
      }
    }
    
    // Render LeetCode profile with fetched data
    async function renderLeetCodeProfile(contestData, contestHistory, submissionCalendar) {
      // Handle nested data structure from the API
      let stats = null;
      if (contestData && contestData.data) {
        // Check if data is nested (data.data.userContestRanking)
        if (contestData.data.data && contestData.data.data.userContestRanking) {
          stats = contestData.data.data.userContestRanking;
        } else if (contestData.data.userContestRanking) {
          stats = contestData.data.userContestRanking;
        }
      }
      
      // Check if we have contest history data - look in the correct location
      let hasHistoryData = false;
      if (contestHistory && contestHistory.data) {
        // Check if data is nested (data.data.userContestRankingHistory)
        if (contestHistory.data.data && contestHistory.data.data.userContestRankingHistory) {
          hasHistoryData = contestHistory.data.data.userContestRankingHistory.length > 0;
        } else if (contestHistory.data.userContestRankingHistory) {
          hasHistoryData = contestHistory.data.userContestRankingHistory.length > 0;
        } else if (contestHistory.data.contestHistory) {
          hasHistoryData = contestHistory.data.contestHistory.length > 0;
        }
      }
      
      if (!hasHistoryData) {
        if (leetcodeProfileContainer) {
          leetcodeProfileContainer.innerHTML = `<div style="width:100%;text-align:center;padding:2.5rem 0;color:#FFB81C;font-size:1.3rem;">Unable to load LeetCode data at the moment. Please try again later.</div>`;
        }
        return;
      }
      
      // Create the new LeetCode profile HTML (2x2 grid of 4 cards, improved layout)
      const leetcodeProfileHTML = `
        <div class="leetcode-grid">
          <!-- Card 1: LeetCode Profile Info -->
          <div class="leetcode-card card-info card-info-twocol">
            <div class="leetcode-profile-header">
              <img src="${leetcodeLogoImg}" alt="LeetCode Logo" class="leetcode-logo-large twocol-logo"/>
              <div class="leetcode-profile-info">
                <div class="leetcode-username-main twocol-username">${leetcodeDisplayName}</div>
                <div class="leetcode-rating-block twocol-rating-block">
                  <span class="leetcode-rating-label">Rating:</span>
                  <span class="leetcode-rating-value">${stats ? stats.rating.toFixed(0) : 'N/A'}</span>
                </div>
              </div>
            </div>
            <a href="https://leetcode.com/${leetcodeUsername}" target="_blank" class="btn primary-btn leetcode-btn info-btn long-btn">View LeetCode</a>
          </div>

          <!-- Card 2: Contest Stats -->
          <div class="leetcode-card card-pie-chart">
            <div class="leetcode-card-header">
              <h3>Contest Performance</h3>
            </div>
            <div class="leetcode-stats-grid">
              <div class="leetcode-stat-item">
                <div class="stat-number">${stats ? stats.attendedContestsCount : 'N/A'}</div>
                <div class="stat-label">Contests</div>
              </div>
              <div class="leetcode-stat-item">
                <div class="stat-number">${stats ? stats.globalRanking.toLocaleString() : 'N/A'}</div>
                <div class="stat-label">Global Rank</div>
              </div>
              <div class="leetcode-stat-item">
                <div class="stat-number">${stats ? stats.topPercentage.toFixed(1) + '%' : 'N/A'}</div>
                <div class="stat-label">Top %</div>
              </div>
            </div>
          </div>

          <!-- Card 3: Interactive Problem Solving Stats -->
          <div class="leetcode-card card-interactive-stats">
            <div class="leetcode-card-header">
              <h3>Problem Solving Stats</h3>
            </div>
            <div class="interactive-stats-container">
              <div class="stat-bars">
                <div class="stat-bar-item">
                  <div class="stat-bar-label">Easy</div>
                  <div class="stat-bar">
                    <div class="stat-bar-fill easy-fill" style="width: 75%"></div>
                  </div>
                  <div class="stat-bar-value easy-value">75%</div>
                </div>
                <div class="stat-bar-item">
                  <div class="stat-bar-label">Medium</div>
                  <div class="stat-bar">
                    <div class="stat-bar-fill medium-fill" style="width: 60%"></div>
                  </div>
                  <div class="stat-bar-value medium-value">60%</div>
                </div>
                <div class="stat-bar-item">
                  <div class="stat-bar-label">Hard</div>
                  <div class="stat-bar">
                    <div class="stat-bar-fill hard-fill" style="width: 40%"></div>
                  </div>
                  <div class="stat-bar-value hard-value">40%</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 4: LeetCode Activity Heatmap -->
          <div class="leetcode-card card-bar-chart">
            <div class="leetcode-card-header">
              <h3>Activity</h3>
            </div>
            <div class="leetcode-heatmap-svg">
              <!-- LeetCode Activity Heatmap SVG will be dynamically inserted here -->
            </div>
          </div>
        </div>
      `;
      
      document.querySelector('.leetcode-profile').innerHTML = leetcodeProfileHTML;
      
      // Initialize Interactive Stats (no chart needed)
      // LeetCode Activity Heatmap
      renderLeetCodeHeatmap(submissionCalendar);
    }

    // Load LeetCode data from local files
    async function loadLeetCodeDataFromFiles() {
      try {
        console.log('Loading LeetCode data from local files...');
        const leetcodeData = await loadLeetCodeData();
        
        if (leetcodeData) {
          console.log('LeetCode data loaded successfully from local files');
          renderLeetCodeProfile(
            leetcodeData.contestData,
            leetcodeData.historyData,
            leetcodeData.calendarData
          );
          
          // Show last updated timestamp
          const lastUpdated = new Date(leetcodeData.contestData.lastUpdated).toLocaleDateString();
          console.log(`LeetCode data loaded (last updated: ${lastUpdated})`);
        } else {
          // If local files fail, show a message
          if (leetcodeProfileContainer) {
            leetcodeProfileContainer.innerHTML = `<div style="width:100%;text-align:center;padding:2.5rem 0;color:#FFB81C;font-size:1.3rem;">Unable to load LeetCode data at the moment. Please try again later.</div>`;
          }
          console.warn('LeetCode data loading failed - no data returned');
        }
      } catch (error) {
        console.error('Error loading LeetCode data:', error);
        if (leetcodeProfileContainer) {
          leetcodeProfileContainer.innerHTML = `<div style="width:100%;text-align:center;padding:2.5rem 0;color:#FFB81C;font-size:1.3rem;">Error loading LeetCode data. Please try again later.</div>`;
        }
      }
    }

    // Call the new loading function
    loadLeetCodeDataFromFiles();

    // ========== NEW LEETCODE CONTEST RATING CHART LOGIC ========== //
    async function fetchContestHistory() {
      console.log('LeetCode contest chart logic running');
      // This function is now called with contest history data from the API
      // The data is passed directly from renderLeetCodeProfile
      return [];
    }

    async function renderContestChart(contestHistory) {
      let contestHistoryData = null;
      
      if (contestHistory && contestHistory.data) {
        // Check if data is nested (data.data.userContestRankingHistory)
        if (contestHistory.data.data && contestHistory.data.data.userContestRankingHistory) {
          contestHistoryData = contestHistory.data.data.userContestRankingHistory;
        } else if (contestHistory.data.userContestRankingHistory) {
          contestHistoryData = contestHistory.data.userContestRankingHistory;
        } else if (contestHistory.data.contestHistory) {
          contestHistoryData = contestHistory.data.contestHistory;
        }
      }
      
      if (!contestHistoryData) {
        console.log('No contest history data available');
        return;
      }
      
      const contests = contestHistoryData.filter(c => c.attended);
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

    // LeetCode Activity Heatmap (SVG)
    async function renderLeetCodeHeatmap(submissionCalendar) {
      try {
        const heatmapCard = document.querySelector('.leetcode-card.card-bar-chart');
        if (!heatmapCard) {
          console.warn('Heatmap card not found');
          return;
        }
      
      // Use the submission calendar data passed from the API
      let calendarData = submissionCalendar || {};
      
      // Handle both old and new data structures
      if (calendarData.data && calendarData.data.submissionCalendar) {
        // Check if submissionCalendar is a JSON string that needs parsing
        if (typeof calendarData.data.submissionCalendar === 'string') {
          try {
            calendarData = JSON.parse(calendarData.data.submissionCalendar);
          } catch (e) {
            console.warn('Failed to parse submission calendar JSON:', e);
            calendarData = {};
          }
        } else {
          calendarData = calendarData.data.submissionCalendar;
        }
      } else if (calendarData.submissionCalendar) {
        // Check if submissionCalendar is a JSON string that needs parsing
        if (typeof calendarData.submissionCalendar === 'string') {
          try {
            calendarData = JSON.parse(calendarData.submissionCalendar);
          } catch (e) {
            console.warn('Failed to parse submission calendar JSON:', e);
            calendarData = {};
          }
        } else {
          calendarData = calendarData.submissionCalendar;
        }
      }
      
      // Grid size: weeks x rows - Show full year (365 days)
      const rows = 7;
      const weeks = 52; // 52 weeks = 364 days (full year)
      const days = weeks * rows; // 364 days
      const today = new Date();
      let activity = Array(days).fill(0);
      let totalSubmissions = 0;
      
      console.log('Processing heatmap data for', days, 'days');
      console.log('Calendar data entries:', Object.keys(calendarData).length);
      
      for (const ts in calendarData) {
        const day = new Date(parseInt(ts, 10) * 1000);
        const diff = Math.floor((today - day) / (1000 * 60 * 60 * 24));
        if (diff >= 0 && diff < days) {
          activity[days - diff - 1] = calendarData[ts];
          totalSubmissions += calendarData[ts];
        }
      }
      
      console.log('Total submissions in heatmap range:', totalSubmissions);
      console.log('Active days in heatmap range:', activity.filter(d => d > 0).length);
      
      // If we're missing submissions, calculate total from all calendar data
      let totalCalendarSubmissions = 0;
      for (const ts in calendarData) {
        totalCalendarSubmissions += calendarData[ts];
      }
      console.log('Total submissions in calendar data:', totalCalendarSubmissions);
      
      // Use the higher count for display
      const displaySubmissions = Math.max(totalSubmissions, totalCalendarSubmissions);
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
      heatmapCard.innerHTML = `<div style=\"color:#bbb;font-size:1.05rem;margin-bottom:0.2rem;\"><span style=\"color:#fff;font-size:1.2rem;font-weight:700;\">${displaySubmissions}</span> submissions in the last year</div><div class=\"leetcode-heatmap-svg\" style=\"display:flex;justify-content:center;align-items:center;width:100%;height:100%;\">${svg}</div>`;
      } catch (error) {
        console.error('Error rendering LeetCode heatmap:', error);
        const heatmapCard = document.querySelector('.leetcode-card.card-bar-chart');
        if (heatmapCard) {
          heatmapCard.innerHTML = '<div style="color:#bbb;text-align:center;padding:1rem;">Unable to load activity data</div>';
        }
      }
    }
});

