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
    
    // Observe all section headers, about info items, skill boxes, project cards, experience cards, and contact cards
    document.querySelectorAll('.section-header, .info-item, .skill-box, .project-card, .experience-card, .contact-card').forEach(el => {
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
        // Add cache-busting parameter to prevent browser caching
        const cacheBuster = new Date().getTime();
        const response = await fetch(`./data/github-profile.json?t=${cacheBuster}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
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
        const cacheBuster = new Date().getTime();
        const contestResponse = await fetch(`./data/leetcode-contest.json?t=${cacheBuster}`, {
          cache: 'no-store'
        });
        if (!contestResponse.ok) throw new Error('Failed to load contest data');
        const contestData = await contestResponse.json();
        console.log('Contest data loaded:', contestData);
        
        // Load history data
        console.log('Loading history data from ./data/leetcode-history.json');
        const historyResponse = await fetch(`./data/leetcode-history.json?t=${cacheBuster}`, {
          cache: 'no-store'
        });
        if (!historyResponse.ok) throw new Error('Failed to load history data');
        const historyData = await historyResponse.json();
        console.log('History data loaded:', historyData);
        
        // Load calendar data
        console.log('Loading calendar data from ./data/leetcode-calendar.json');
        const calendarResponse = await fetch(`./data/leetcode-calendar.json?t=${cacheBuster}`, {
          cache: 'no-store'
        });
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
      let badge = null;
      if (contestData && contestData.data) {
        // Check for alfa-leetcode-api format (contestAttend, contestRating, etc.)
        if (contestData.data.contestAttend !== undefined) {
          // Convert alfa-leetcode-api format to standard format
          stats = {
            attendedContestsCount: contestData.data.contestAttend,
            rating: contestData.data.contestRating,
            globalRanking: contestData.data.contestGlobalRanking,
            topPercentage: contestData.data.contestTopPercentage
          };
          // Extract badge information
          if (contestData.data.contestBadges && contestData.data.contestBadges.name) {
            badge = contestData.data.contestBadges.name;
          }
        }
        // Check if data is nested (data.data.userContestRanking)
        else if (contestData.data.data && contestData.data.data.userContestRanking) {
          stats = contestData.data.data.userContestRanking;
        } else if (contestData.data.userContestRanking) {
          stats = contestData.data.userContestRanking;
        }
        // Try to get badge from nested structure
        if (!badge && contestData.data.contestBadges && contestData.data.contestBadges.name) {
          badge = contestData.data.contestBadges.name;
        }
      }
      
      // Check if we have contest history data - look in the correct location
      let hasHistoryData = false;
      if (contestHistory && contestHistory.data) {
        // Check for alfa-leetcode-api format (contestParticipation array)
        if (contestHistory.data.contestParticipation && Array.isArray(contestHistory.data.contestParticipation)) {
          hasHistoryData = contestHistory.data.contestParticipation.length > 0;
        } else if (contestHistory.data.contestHistory && Array.isArray(contestHistory.data.contestHistory)) {
          hasHistoryData = contestHistory.data.contestHistory.length > 0;
        }
        // Check if data is nested (data.data.userContestRankingHistory)
        else if (contestHistory.data.data && contestHistory.data.data.userContestRankingHistory) {
          hasHistoryData = contestHistory.data.data.userContestRankingHistory.length > 0;
        } else if (contestHistory.data.userContestRankingHistory) {
          hasHistoryData = contestHistory.data.userContestRankingHistory.length > 0;
        }
      }
      
      if (!hasHistoryData) {
        if (leetcodeProfileContainer) {
          leetcodeProfileContainer.innerHTML = `<div style="width:100%;text-align:center;padding:2.5rem 0;color:#FFB81C;font-size:1.3rem;">Unable to load LeetCode data at the moment. Please try again later.</div>`;
        }
        return;
      }
      
      // Create badge SVG based on badge name - LeetCode style shield badge
      const getBadgeSVG = (badgeName) => {
        const badgeColors = {
          'Knight': { primary: '#4CAF50', secondary: '#2E7D32' },
          'Guardian': { primary: '#2196F3', secondary: '#1565C0' },
          'Master': { primary: '#9C27B0', secondary: '#6A1B9A' },
          'Grandmaster': { primary: '#F44336', secondary: '#C62828' }
        };
        const colors = badgeColors[badgeName] || { primary: '#FFB81C', secondary: '#e6a600' };
        // Create a proper shield shape with knight chess piece icon
        return `
          <svg class="leetcode-badge-svg" width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="badgeGrad-${badgeName}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
              </linearGradient>
            </defs>
            <!-- Shield shape -->
            <path d="M16 2 L26 6 L26 14 Q26 20 16 24 Q6 20 6 14 L6 6 Z" 
                  fill="url(#badgeGrad-${badgeName})" 
                  stroke="#1a1a1a" 
                  stroke-width="0.8"
                  stroke-linejoin="round"/>
            <!-- Knight chess piece icon (simplified) -->
            <g transform="translate(16, 16)">
              <!-- Knight head -->
              <circle cx="0" cy="-4" r="2.5" fill="white" opacity="0.95"/>
              <!-- Knight body/base -->
              <path d="M -3 -1 L -3 3 L 3 3 L 3 -1 L 1 -1 L 1 1 L -1 1 L -1 -1 Z" fill="white" opacity="0.95"/>
              <!-- Knight neck -->
              <rect x="-1.5" y="-3" width="3" height="2" fill="white" opacity="0.95"/>
              <!-- Knight mane/details -->
              <path d="M -2.5 -2 L -2.5 -1 L 2.5 -1 L 2.5 -2 Z" fill="white" opacity="0.9"/>
            </g>
          </svg>
        `;
      };

      // Create the new LeetCode profile HTML (2x2 grid of 4 cards, improved layout)
      const leetcodeProfileHTML = `
        <div class="leetcode-grid">
          <!-- Card 1: LeetCode Profile Info -->
          <div class="leetcode-card card-info card-info-redesigned">
            <div class="leetcode-profile-content">
              <div class="leetcode-profile-main">
                <div class="leetcode-avatar-section">
                  <div class="leetcode-avatar-wrapper">
                    <img src="${leetcodeLogoImg}" alt="LeetCode Logo" class="leetcode-avatar"/>
                  </div>
                </div>
                <div class="leetcode-info-section">
                  <div class="leetcode-name-badge-row">
                    <h3 class="leetcode-username-new">${leetcodeDisplayName}</h3>
                    ${badge ? `
                      <div class="leetcode-badge-container">
                        <img src="assets/images/Knight.gif" alt="${badge} Badge" class="leetcode-badge-gif" />
                        <span class="leetcode-badge-text">${badge}</span>
                      </div>
                    ` : ''}
                  </div>
                  <div class="leetcode-rating-display">
                    <span class="leetcode-rating-label-new">Rating</span>
                    <span class="leetcode-rating-value-new">${stats ? stats.rating.toFixed(0) : 'N/A'}</span>
                  </div>
                </div>
              </div>
              <a href="https://leetcode.com/${leetcodeUsername}" target="_blank" class="leetcode-view-btn">
                <span>View LeetCode</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>
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
            <div class="problem-stats-compact">
              <div class="stats-left-section">
                <div class="total-problems-compact">
                  <div class="total-problems-label-compact">Total Solved</div>
                  <div class="total-problems-value-compact">${(() => {
                    // Calculate total from calendar data if available
                    let total = 0;
                    if (submissionCalendar && submissionCalendar.data) {
                      const calendar = typeof submissionCalendar.data.submissionCalendar === 'string' 
                        ? JSON.parse(submissionCalendar.data.submissionCalendar) 
                        : submissionCalendar.data.submissionCalendar;
                      for (const ts in calendar) {
                        total += calendar[ts];
                      }
                    }
                    return total > 0 ? total.toLocaleString() : 'N/A';
                  })()}</div>
                </div>
              </div>
              <div class="stats-right-section">
                <div class="difficulty-compact-grid">
                  <div class="difficulty-item-compact">
                    <div class="difficulty-header-compact">
                      <span class="difficulty-label-compact">Easy</span>
                      <span class="difficulty-percentage-compact difficulty-easy-text">75%</span>
                    </div>
                    <div class="difficulty-bar-compact-track">
                      <div class="difficulty-bar-compact-fill difficulty-easy" style="width: 75%"></div>
                    </div>
                  </div>
                  <div class="difficulty-item-compact">
                    <div class="difficulty-header-compact">
                      <span class="difficulty-label-compact">Medium</span>
                      <span class="difficulty-percentage-compact difficulty-medium-text">60%</span>
                    </div>
                    <div class="difficulty-bar-compact-track">
                      <div class="difficulty-bar-compact-fill difficulty-medium" style="width: 60%"></div>
                    </div>
                  </div>
                  <div class="difficulty-item-compact">
                    <div class="difficulty-header-compact">
                      <span class="difficulty-label-compact">Hard</span>
                      <span class="difficulty-percentage-compact difficulty-hard-text">40%</span>
                    </div>
                    <div class="difficulty-bar-compact-track">
                      <div class="difficulty-bar-compact-fill difficulty-hard" style="width: 40%"></div>
                    </div>
                  </div>
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
      
      // Handle different data formats
      let contests = [];
      if (Array.isArray(contestHistoryData)) {
        // alfa-leetcode-api format: filter by attended and extract rating
        contests = contestHistoryData
          .filter(c => c.attended !== false)
          .map(c => ({
            rating: c.rating || 0,
            contest: {
              startTime: c.contest ? c.contest.startTime : 0
            }
          }));
      } else {
        contests = contestHistoryData.filter(c => c.attended);
      }
      
      // Sort by contest start time (oldest to newest)
      contests.sort((a, b) => {
        const timeA = a.contest ? a.contest.startTime : 0;
        const timeB = b.contest ? b.contest.startTime : 0;
        return timeA - timeB;
      });
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

    // LeetCode Activity Heatmap (SVG) - Responsive and Dynamic
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
      
      // Grid size: weeks x rows - Show full year (365 days) ending at current date
      const rows = 7;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Calculate one year ago from today (365 days back)
      const oneYearAgo = new Date(today);
      oneYearAgo.setDate(oneYearAgo.getDate() - 364);
      oneYearAgo.setHours(0, 0, 0, 0);
      
      // Calculate exact number of days
      const daysDiff = Math.floor((today - oneYearAgo) / (1000 * 60 * 60 * 24)) + 1;
      const weeks = Math.ceil(daysDiff / 7);
      const days = weeks * rows;
      
      // Responsive cell sizing based on viewport
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      const cell = isMobile ? 8 : isTablet ? 9 : 11;
      const gap = isMobile ? 1.5 : 2;
      
      let activity = Array(days).fill(0);
      let totalSubmissions = 0;
      const dateMap = new Map(); // Map index to date for tooltips
      
      // Fill activity array with submission data
      for (const ts in calendarData) {
        const day = new Date(parseInt(ts, 10) * 1000);
        day.setHours(0, 0, 0, 0);
        const diff = Math.floor((day - oneYearAgo) / (1000 * 60 * 60 * 24));
        if (diff >= 0 && diff < days) {
          activity[diff] = calendarData[ts];
          totalSubmissions += calendarData[ts];
          dateMap.set(diff, day);
        }
      }
      
      // Calculate total from all calendar data
      let totalCalendarSubmissions = 0;
      for (const ts in calendarData) {
        totalCalendarSubmissions += calendarData[ts];
      }
      const displaySubmissions = Math.max(totalSubmissions, totalCalendarSubmissions);
      
      // SVG dimensions - responsive
      const svgWidth = weeks * (cell + gap);
      const svgHeight = rows * (cell + gap) + (isMobile ? 16 : 18);
      
      // Month labels - calculate from left (oldest) to right (newest/today)
      let monthLabels = [];
      const monthPositions = new Map();
      let lastSeenMonth = null;
      
      for (let w = 0; w < weeks; w++) {
        const daysFromStart = w * rows;
        const weekDate = new Date(oneYearAgo);
        weekDate.setDate(oneYearAgo.getDate() + daysFromStart);
        const month = weekDate.toLocaleString('default', { month: 'short' });
        
        if (month !== lastSeenMonth || w === 0) {
          monthPositions.set(month, w * (cell + gap));
          lastSeenMonth = month;
        }
      }
      
      monthLabels = Array.from(monthPositions.entries())
        .map(([label, x]) => ({ label, x }))
        .sort((a, b) => a.x - b.x);
      
      // Ensure current month is shown on the rightmost position
      const currentMonth = today.toLocaleString('default', { month: 'short' });
      const rightmostX = (weeks - 1) * (cell + gap);
      
      // Remove labels near rightmost and add current month
      monthLabels = monthLabels.filter(m => Math.abs(m.x - rightmostX) > 10);
      monthLabels.push({ x: rightmostX, label: currentMonth });
      monthLabels.sort((a, b) => a.x - b.x);
      
      // Remove duplicate months, keeping rightmost occurrence
      const monthMap = new Map();
      for (const label of monthLabels) {
        if (!monthMap.has(label.label) || label.x > monthMap.get(label.label).x) {
          monthMap.set(label.label, label);
        }
      }
      monthLabels = Array.from(monthMap.values()).sort((a, b) => a.x - b.x);
      
      // Create SVG with tooltips and animations
      let svg = `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet" style="max-width: 100%; height: auto;">`;
      
      // Add CSS for animations
      svg += `<defs>
        <style>
          .heatmap-cell {
            transition: all 0.2s ease;
            cursor: pointer;
          }
          .heatmap-cell:hover {
            stroke: #fff;
            stroke-width: 1.5;
            filter: brightness(1.2);
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .heatmap-cell {
            animation: fadeIn 0.3s ease forwards;
          }
        </style>
      </defs>`;
      
      // Draw cells with tooltips
      for (let w = 0; w < weeks; w++) {
        for (let d = 0; d < rows; d++) {
          const idx = w * rows + d;
          if (idx >= activity.length) continue;
          
          const x = w * (cell + gap);
          const y = d * (cell + gap) + (isMobile ? 14 : 12);
          const count = activity[idx];
          
          // Calculate actual date for this cell
          const cellDate = new Date(oneYearAgo);
          cellDate.setDate(oneYearAgo.getDate() + idx);
          const dateStr = cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          
          // LeetCode green color scale
          let color = '#161b22';
          if (count > 0) color = '#9be9a8';
          if (count > 1) color = '#40c463';
          if (count > 2) color = '#30a14e';
          if (count > 4) color = '#216e39';
          
          // Add cell with tooltip
          const cellId = `cell-${w}-${d}`;
          svg += `<g class="heatmap-cell-group">
            <rect 
              id="${cellId}"
              class="heatmap-cell"
              x="${x}" 
              y="${y}" 
              width="${cell}" 
              height="${cell}" 
              rx="2" 
              fill="${color}"
              data-count="${count}"
              data-date="${dateStr}"
              style="animation-delay: ${(w * rows + d) * 0.01}s;"
            />
            <title>${dateStr}: ${count} ${count === 1 ? 'submission' : 'submissions'}</title>
          </g>`;
        }
      }
      
      // Draw month labels with responsive font size
      const fontSize = isMobile ? 8 : 9;
      monthLabels.forEach((label, idx) => {
        // Only show every other month on mobile to avoid crowding
        if (isMobile && idx > 0 && idx < monthLabels.length - 1 && idx % 2 !== 0) {
          return;
        }
        svg += `<text x="${label.x + 2}" y="10" font-size="${fontSize}" fill="#bbb" class="month-label">${label.label}</text>`;
      });
      
      svg += '</svg>';
      
      // Create container with responsive wrapper
      const containerHTML = `
        <div style="color:#bbb;font-size:${isMobile ? '0.9rem' : '1.05rem'};margin-bottom:0.5rem;text-align:center;">
          <span style="color:#fff;font-size:${isMobile ? '1.1rem' : '1.2rem'};font-weight:700;">${displaySubmissions}</span> submissions in the last year
        </div>
        <div class="leetcode-heatmap-svg" style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;overflow-x:auto;overflow-y:visible;">
          ${svg}
        </div>
      `;
      
      heatmapCard.innerHTML = containerHTML;
      
      // Add interactive tooltips on hover (enhanced)
      setTimeout(() => {
        const cells = heatmapCard.querySelectorAll('.heatmap-cell');
        cells.forEach(cell => {
          cell.addEventListener('mouseenter', function(e) {
            const count = this.getAttribute('data-count');
            const date = this.getAttribute('data-date');
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'heatmap-tooltip';
            tooltip.textContent = `${date}: ${count} ${count === '1' ? 'submission' : 'submissions'}`;
            tooltip.style.cssText = `
              position: absolute;
              background: rgba(0, 0, 0, 0.9);
              color: #fff;
              padding: 0.5rem 0.75rem;
              border-radius: 4px;
              font-size: 0.85rem;
              pointer-events: none;
              z-index: 1000;
              white-space: nowrap;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            `;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            tooltip.style.left = (rect.left + rect.width / 2 - tooltipRect.width / 2) + 'px';
            tooltip.style.top = (rect.top - tooltipRect.height - 8) + 'px';
            
            this._tooltip = tooltip;
          });
          
          cell.addEventListener('mouseleave', function() {
            if (this._tooltip) {
              this._tooltip.remove();
              this._tooltip = null;
            }
          });
        });
      }, 100);
      
      } catch (error) {
        console.error('Error rendering LeetCode heatmap:', error);
        const heatmapCard = document.querySelector('.leetcode-card.card-bar-chart');
        if (heatmapCard) {
          heatmapCard.innerHTML = '<div style="color:#bbb;text-align:center;padding:1rem;">Unable to load activity data</div>';
        }
      }
    }
});

