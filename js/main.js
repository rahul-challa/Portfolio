/*=============== MAIN JAVASCRIPT ===============*/

document.addEventListener('DOMContentLoaded', function () {
    /*=============== MENU SHOW/HIDE ===============*/
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('show-menu');
            hamburger.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show-menu');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /*=============== SCROLL SECTIONS ACTIVE LINK + PROGRESS BAR ===============*/
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    const scrollProgress = document.getElementById('scroll-progress');

    function onScroll() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 80;
            const sectionId = current.getAttribute('id');
            const link = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
            if (!link) return;

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });

        if (scrollProgress) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
            scrollProgress.style.width = `${Math.min(progress, 100)}%`;
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /*=============== SCROLL UP BUTTON ===============*/
    const scrollUpBtn = document.getElementById('scroll-up');
    if (scrollUpBtn) {
        window.addEventListener('scroll', () => {
            scrollUpBtn.classList.toggle('show-scroll', window.scrollY >= 480);
        }, { passive: true });

        scrollUpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /*=============== SCROLL REVEAL ===============*/
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    function observeReveal(root = document) {
        root.querySelectorAll(
            '.section-header, .github-strip, .project-card, .experience-row, .education-row, .contact-card, .about-stat-card, .repo-row'
        ).forEach(el => {
            if (!el.classList.contains('fade-in')) revealObserver.observe(el);
        });
    }
    observeReveal();

    /*=============== NUMBER COUNTERS ===============*/
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        });
    }, { threshold: 0.6 });

    document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

    function animateCounter(el) {
        const target = parseFloat(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        const isDecimal = String(el.dataset.counter).includes('.');
        const duration = 1200;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = target * eased;
            el.textContent = (isDecimal ? value.toFixed(1) : Math.round(value).toLocaleString()) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    /*=============== CODE RAIN (hero avatar) ===============*/
    initCodeRain();

    /*=============== PROJECTS + PROFILES ===============*/
    const leetcodeProfileContainer = document.querySelector('.leetcode-profile');
    if (leetcodeProfileContainer) {
        leetcodeProfileContainer.innerHTML = `<div class="profile-loading">Loading LeetCode stats&hellip;</div>`;
    }

    // loadTexMexBadges() targets #texmex-installs/version/rating elements
    // that only exist once loadProjects() has rendered the TexMex card, so
    // it's chained after that render rather than fired independently.
    loadProjects();
    loadGitHubData();
    loadLeetCodeData();

    // expose for the reveal observer once dynamic content lands
    window.__observeReveal = observeReveal;
});

/*=============== CODE RAIN CANVAS ===============*/
function initCodeRain() {
    const canvas = document.getElementById('codeRainCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        const style = getComputedStyle(canvas);
        canvas.width = parseInt(style.width, 10);
        canvas.height = parseInt(style.height, 10);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const fontSize = 16;
    const codeChars = '01<>/={}[]();$#@&%';
    const yellow = '#ffb81c';
    let drops = Array(Math.max(1, Math.floor(canvas.width / fontSize))).fill(1);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = fontSize + 'px monospace';
        ctx.fillStyle = yellow;
        ctx.globalAlpha = 0.7;

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        // fillText's (x, y) is the glyph's baseline anchor, not its full
        // painted extent - a glyph anchored just inside the true edge can
        // still paint several pixels past it (ascenders, character width).
        // Shrinking the test radius by a full glyph size keeps every
        // painted pixel safely inside the circle, independent of whatever
        // CSS clipping is (or isn't) applied to the canvas itself.
        const r = canvas.width / 2 - fontSize;

        for (let i = 0; i < drops.length; i++) {
            const text = codeChars[Math.floor(Math.random() * codeChars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

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
}

/*=============== TEXMEX BADGES ===============*/
function setBadgePill(id, label, value) {
    const badge = document.getElementById(id);
    if (badge) badge.textContent = `${label}: ${value}`;
}

function hideTexMexBadges() {
    const container = document.querySelector('.project-badges');
    if (container) container.style.display = 'none';
}

async function loadTexMexBadges() {
    try {
        const cacheBuster = Date.now();
        const response = await fetch(`./data/texmex-badges.json?t=${cacheBuster}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load TexMex data');

        const texmexData = await response.json();
        const data = texmexData.data;

        if (data.installs && data.version && data.rating) {
            setBadgePill('texmex-installs', 'Installs', data.installs.toLocaleString());
            setBadgePill('texmex-version', 'Version', data.version);
            setBadgePill('texmex-rating', 'Rating', data.rating);
        } else {
            hideTexMexBadges();
        }
    } catch (error) {
        console.error('Error loading TexMex data:', error);
        hideTexMexBadges();
    }
}

/*=============== PROJECTS (auto-generated from GitHub, daily) ===============*/
function timeAgo(isoDate) {
    if (!isoDate) return '';
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const days = Math.floor(diffMs / 86400000);
    if (days < 1) return 'today';
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
}

function projectCardHTML(project, index) {
    const media = project.logo
        ? `<img src="${project.logo}" alt="${project.displayName} Logo" class="project-logo" />`
        : `<div class="project-icon"><i data-feather="${project.icon || 'code'}"></i></div>`;

    // shields.io retired its "visual-studio-marketplace" badge type (it now
    // returns a literal "retired badge" image for every extension), so these
    // are rendered from our own data/texmex-badges.json instead of an <img>.
    const isTexMex = project.name === 'TexMex';
    const badgesHTML = isTexMex ? `
        <div class="project-badges">
          <span class="badge-pill" id="texmex-installs">Installs: &hellip;</span>
          <span class="badge-pill" id="texmex-version">Version: &hellip;</span>
          <span class="badge-pill" id="texmex-rating">Rating: &hellip;</span>
        </div>` : '';

    const techHTML = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

    const extraLinksHTML = (project.extraLinks || []).map(l =>
        `<a href="${l.url}" class="project-link" target="_blank" rel="noopener noreferrer"><i data-feather="${l.icon || 'external-link'}"></i> ${l.label}</a>`
    ).join('');

    return `
      <div class="project-card">
        <span class="project-index">${String(index + 1).padStart(2, '0')}</span>
        <div class="project-info">
          <div class="project-header-flex">
            ${media}
            <h3 class="project-title">${project.displayName}</h3>
          </div>
          ${badgesHTML}
          <p class="project-description">${project.description}</p>
          <div class="project-tech">${techHTML}</div>
          <div class="project-links">
            <a href="${project.githubUrl}" class="project-link" target="_blank" rel="noopener noreferrer"><i data-feather="github"></i> Code</a>
            ${extraLinksHTML}
          </div>
        </div>
      </div>
    `;
}

function repoRowHTML(project) {
    return `
      <a class="repo-row" href="${project.githubUrl}" target="_blank" rel="noopener noreferrer">
        <span class="repo-row-lang" data-lang="${project.language || ''}"></span>
        <span class="repo-row-name">${project.displayName}</span>
        <span class="repo-row-desc">${project.description !== 'No description yet.' ? project.description : ''}</span>
        <span class="repo-row-meta">
          ${project.stars ? `<span class="repo-row-stars"><i data-feather="star"></i>${project.stars}</span>` : ''}
          <span class="repo-row-updated">${timeAgo(project.updatedAt)}</span>
          <i data-feather="arrow-up-right" class="repo-row-arrow"></i>
        </span>
      </a>
    `;
}

async function loadProjects() {
    const featuredContainer = document.getElementById('featured-projects');
    const moreContainer = document.getElementById('more-projects-list');
    const syncedLabel = document.getElementById('projects-synced');

    try {
        const cacheBuster = Date.now();
        const response = await fetch(`./data/projects.json?t=${cacheBuster}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load projects data');

        const data = await response.json();
        const projects = data.projects || [];
        const featured = projects.filter(p => p.curated);
        const more = projects.filter(p => !p.curated);

        if (featuredContainer) {
            featuredContainer.innerHTML = featured.map((p, i) => projectCardHTML(p, i)).join('');
        }
        if (moreContainer) {
            moreContainer.innerHTML = more.map(repoRowHTML).join('');
        }
        if (syncedLabel && data.lastUpdated) {
            syncedLabel.textContent = `Auto-synced from GitHub — last updated ${timeAgo(data.lastUpdated)}`;
        }

        feather.replace();
        if (window.__observeReveal) window.__observeReveal(document.getElementById('projects'));
        if (featured.some(p => p.name === 'TexMex')) loadTexMexBadges();
    } catch (error) {
        console.error('Error loading projects:', error);
        if (featuredContainer) {
            featuredContainer.innerHTML = `<div class="profile-loading">Unable to load projects right now.</div>`;
        }
    }
}

/*=============== GITHUB INTRO STRIP (top of Projects) ===============*/
// Lives at the top of the Projects section rather than as a separate
// "profile" card, since every project below - featured or auto-listed - is
// literally sourced from this same GitHub account.
function renderGitHubStrip(login, avatarUrl, repos, followers, htmlUrl) {
    const el = document.getElementById('github-strip');
    if (!el) return;
    // The heatmap SVG is fetched and recolored for the dark theme at build
    // time (see update_data.py -> data/github-heatmap.svg) because
    // ghchart.rshah.org sends no CORS headers, so it can't be fetched and
    // recolored client-side - only plain <img> loading works cross-origin.
    const cacheBuster = Date.now();
    el.innerHTML = `
      <div class="github-strip-identity">
        <img src="${avatarUrl}" alt="${login}" class="github-strip-avatar" />
        <div class="github-strip-meta">
          <div class="github-strip-name-row">
            <i data-feather="github"></i>
            <span class="github-strip-username">${login}</span>
          </div>
          <p class="github-strip-note">Everything below is sourced straight from GitHub&mdash;${repos} repositories, ${followers} followers, synced nightly.</p>
          <a href="${htmlUrl}" target="_blank" rel="noopener noreferrer" class="github-strip-link">
            View full profile <i data-feather="arrow-up-right"></i>
          </a>
        </div>
      </div>
      <div class="github-strip-heatmap">
        <img src="./data/github-heatmap.svg?t=${cacheBuster}" alt="GitHub contribution heatmap" class="github-heatmap"/>
      </div>
    `;
    feather.replace();
    if (window.__observeReveal) window.__observeReveal(document.getElementById('projects'));
}

async function loadGitHubData() {
    try {
        const cacheBuster = Date.now();
        const response = await fetch(`./data/github-profile.json?t=${cacheBuster}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load GitHub data');

        const githubData = await response.json();
        const data = githubData.data;
        renderGitHubStrip(data.login, data.avatar_url, data.public_repos, data.followers, data.html_url);
    } catch (error) {
        console.error('Error loading GitHub data:', error);
        renderGitHubStrip('rahul-challa', 'https://github.com/rahul-challa.png', 25, 15, 'https://github.com/rahul-challa');
    }
}

/*=============== LEETCODE PROFILE ===============*/
const LEETCODE_DISPLAY_NAME = 'Rahul Challa';
const LEETCODE_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png';

async function loadLeetCodeData() {
    const leetcodeProfileContainer = document.querySelector('.leetcode-profile');
    try {
        const cacheBuster = Date.now();
        const response = await fetch(`./data/leetcode-profile.json?t=${cacheBuster}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load LeetCode data');

        const data = await response.json();
        renderLeetCodeProfile(data);
    } catch (error) {
        console.error('Error loading LeetCode data:', error);
        if (leetcodeProfileContainer) {
            leetcodeProfileContainer.innerHTML = `<div class="profile-loading">Unable to load LeetCode data at the moment. Please try again later.</div>`;
        }
    }
}

function renderLeetCodeProfile(data) {
    const leetcodeProfileContainer = document.querySelector('.leetcode-profile');
    if (!leetcodeProfileContainer) return;

    const badge = data.contest && data.contest.badge;
    const badgeCount = (data.badges || []).length;

    const leetcodeProfileHTML = `
      <div class="leetcode-grid">
        <div class="leetcode-card card-info-redesigned">
          <div class="leetcode-profile-content">
            <div class="leetcode-profile-main">
              <div class="leetcode-avatar-wrapper">
                <img src="${LEETCODE_LOGO}" alt="LeetCode Logo" class="leetcode-avatar"/>
              </div>
              <div class="leetcode-info-section">
                <div class="leetcode-name-badge-row">
                  <h3 class="leetcode-username-new">${LEETCODE_DISPLAY_NAME}</h3>
                  ${badge ? `
                    <div class="leetcode-badge-container">
                      <img src="assets/images/Knight.gif" alt="${badge} Badge" class="leetcode-badge-gif" />
                      <span class="leetcode-badge-text">${badge}</span>
                    </div>
                  ` : ''}
                </div>
                <div class="leetcode-rating-display">
                  <span class="leetcode-rating-label-new">Rating</span>
                  <span class="leetcode-rating-value-new">${data.contest && data.contest.rating != null ? data.contest.rating : 'N/A'}</span>
                </div>
                ${badgeCount ? `<div class="leetcode-badge-count" title="${(data.badges || []).join(', ')}">${badgeCount} badges earned</div>` : ''}
              </div>
            </div>
            <a href="https://leetcode.com/${data.username}" target="_blank" rel="noopener noreferrer" class="leetcode-view-btn">
              <span>View LeetCode</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </div>

        <div class="leetcode-card card-pie-chart">
          <div class="leetcode-card-header"><h3>Contest Performance</h3></div>
          <div class="leetcode-stats-grid">
            <div class="leetcode-stat-item">
              <div class="stat-number">${data.contest && data.contest.attendedContestsCount != null ? data.contest.attendedContestsCount : 'N/A'}</div>
              <div class="stat-label">Contests</div>
            </div>
            <div class="leetcode-stat-item">
              <div class="stat-number">${data.contest && data.contest.globalRanking != null ? data.contest.globalRanking.toLocaleString() : 'N/A'}</div>
              <div class="stat-label">Global Rank</div>
            </div>
            <div class="leetcode-stat-item">
              <div class="stat-number">${data.contest && data.contest.topPercentage != null ? data.contest.topPercentage.toFixed(1) + '%' : 'N/A'}</div>
              <div class="stat-label">Top %</div>
            </div>
          </div>
        </div>

        <div class="leetcode-card card-interactive-stats">
          <div class="leetcode-card-header"><h3>Problem Solving Stats</h3></div>
          <div class="problem-stats-compact">
            <div class="total-problems-compact">
              <div class="total-problems-label-compact">Total Solved</div>
              <div class="total-problems-value-compact">${data.totalSolved.toLocaleString()}</div>
            </div>
            <div class="difficulty-compact-grid">
              <div class="difficulty-item-compact">
                <div class="difficulty-header-compact">
                  <span class="difficulty-label-compact">Easy</span>
                  <span class="difficulty-percentage-compact difficulty-easy-text">${data.easyPercentage}%</span>
                </div>
                <div class="difficulty-bar-compact-track">
                  <div class="difficulty-bar-compact-fill difficulty-easy" style="width: ${data.easyPercentage}%"></div>
                </div>
              </div>
              <div class="difficulty-item-compact">
                <div class="difficulty-header-compact">
                  <span class="difficulty-label-compact">Medium</span>
                  <span class="difficulty-percentage-compact difficulty-medium-text">${data.mediumPercentage}%</span>
                </div>
                <div class="difficulty-bar-compact-track">
                  <div class="difficulty-bar-compact-fill difficulty-medium" style="width: ${data.mediumPercentage}%"></div>
                </div>
              </div>
              <div class="difficulty-item-compact">
                <div class="difficulty-header-compact">
                  <span class="difficulty-label-compact">Hard</span>
                  <span class="difficulty-percentage-compact difficulty-hard-text">${data.hardPercentage}%</span>
                </div>
                <div class="difficulty-bar-compact-track">
                  <div class="difficulty-bar-compact-fill difficulty-hard" style="width: ${data.hardPercentage}%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="leetcode-card card-bar-chart">
          <div class="leetcode-card-header"><h3>Activity</h3></div>
          <div class="leetcode-heatmap-svg"></div>
        </div>
      </div>
    `;

    leetcodeProfileContainer.innerHTML = leetcodeProfileHTML;
    renderLeetCodeHeatmap(data.submissionCalendar || {});
}

/*=============== LEETCODE ACTIVITY HEATMAP (SVG) ===============*/
function renderLeetCodeHeatmap(calendarData) {
    const heatmapCard = document.querySelector('.leetcode-card.card-bar-chart');
    if (!heatmapCard) return;

    try {
        const rows = 7;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const oneYearAgo = new Date(today);
        oneYearAgo.setDate(oneYearAgo.getDate() - 364);
        oneYearAgo.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((today - oneYearAgo) / 86400000) + 1;
        const weeks = Math.ceil(daysDiff / 7);
        const days = weeks * rows;

        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        const cell = isMobile ? 8 : isTablet ? 9 : 11;
        const gap = isMobile ? 1.5 : 2;

        let activity = Array(days).fill(0);
        let totalSubmissions = 0;

        for (const ts in calendarData) {
            const day = new Date(parseInt(ts, 10) * 1000);
            day.setHours(0, 0, 0, 0);
            const diff = Math.floor((day - oneYearAgo) / 86400000);
            if (diff >= 0 && diff < days) {
                activity[diff] = calendarData[ts];
                totalSubmissions += calendarData[ts];
            }
        }

        const svgWidth = weeks * (cell + gap);
        const svgHeight = rows * (cell + gap) + (isMobile ? 16 : 18);

        let monthLabels = [];
        const monthPositions = new Map();
        let lastSeenMonth = null;

        for (let w = 0; w < weeks; w++) {
            const weekDate = new Date(oneYearAgo);
            weekDate.setDate(oneYearAgo.getDate() + w * rows);
            const month = weekDate.toLocaleString('default', { month: 'short' });
            if (month !== lastSeenMonth || w === 0) {
                monthPositions.set(month, w * (cell + gap));
                lastSeenMonth = month;
            }
        }

        monthLabels = Array.from(monthPositions.entries()).map(([label, x]) => ({ label, x })).sort((a, b) => a.x - b.x);

        const currentMonth = today.toLocaleString('default', { month: 'short' });
        const rightmostX = (weeks - 1) * (cell + gap);
        monthLabels = monthLabels.filter(m => Math.abs(m.x - rightmostX) > 10);
        monthLabels.push({ x: rightmostX, label: currentMonth });
        monthLabels.sort((a, b) => a.x - b.x);

        const monthMap = new Map();
        for (const label of monthLabels) {
            if (!monthMap.has(label.label) || label.x > monthMap.get(label.label).x) {
                monthMap.set(label.label, label);
            }
        }
        monthLabels = Array.from(monthMap.values()).sort((a, b) => a.x - b.x);

        let svg = `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet" style="max-width:100%;height:auto;">`;
        svg += `<defs><style>
          .heatmap-cell { transition: all 0.2s ease; cursor: pointer; }
          .heatmap-cell:hover { stroke: #fff; stroke-width: 1.5; filter: brightness(1.2); }
        </style></defs>`;

        for (let w = 0; w < weeks; w++) {
            for (let d = 0; d < rows; d++) {
                const idx = w * rows + d;
                if (idx >= activity.length) continue;

                const x = w * (cell + gap);
                const y = d * (cell + gap) + (isMobile ? 14 : 12);
                const count = activity[idx];

                const cellDate = new Date(oneYearAgo);
                cellDate.setDate(oneYearAgo.getDate() + idx);
                const dateStr = cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                let color = '#161b22';
                if (count > 0) color = '#9be9a8';
                if (count > 1) color = '#40c463';
                if (count > 2) color = '#30a14e';
                if (count > 4) color = '#216e39';

                svg += `<rect class="heatmap-cell" x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" fill="${color}"
                  data-count="${count}" data-date="${dateStr}"><title>${dateStr}: ${count} ${count === 1 ? 'submission' : 'submissions'}</title></rect>`;
            }
        }

        const fontSize = isMobile ? 8 : 9;
        monthLabels.forEach((label, idx) => {
            if (isMobile && idx > 0 && idx < monthLabels.length - 1 && idx % 2 !== 0) return;
            svg += `<text x="${label.x + 2}" y="10" font-size="${fontSize}" fill="#bbb">${label.label}</text>`;
        });
        svg += '</svg>';

        const displaySubmissions = totalSubmissions.toLocaleString();
        heatmapCard.querySelector('.leetcode-heatmap-svg').innerHTML = `
          <div style="color:#bbb;font-size:${isMobile ? '0.9rem' : '1.05rem'};margin-bottom:0.5rem;text-align:center;width:100%;">
            <span style="color:#fff;font-size:${isMobile ? '1.1rem' : '1.2rem'};font-weight:700;">${displaySubmissions}</span> submissions in the last year
          </div>
          <div style="display:flex;justify-content:center;width:100%;overflow-x:auto;">${svg}</div>
        `;
    } catch (error) {
        console.error('Error rendering LeetCode heatmap:', error);
        const target = heatmapCard.querySelector('.leetcode-heatmap-svg') || heatmapCard;
        target.innerHTML = '<div style="color:#bbb;text-align:center;padding:1rem;">Unable to load activity data</div>';
    }
}
