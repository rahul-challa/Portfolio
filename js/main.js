/*=============== MAIN JAVASCRIPT ===============*/
// Data-driven sections: projects (GitHub), GitHub strip, LeetCode, counters.
// Motion and interaction live in interactions.js.

document.addEventListener('DOMContentLoaded', function () {
    const year = document.getElementById('footer-year');
    if (year) year.textContent = new Date().getFullYear();

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
        const duration = 1400;
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

    const lc = document.getElementById('leetcode-profile');
    if (lc) lc.innerHTML = `<p class="lc-loading mono">Loading LeetCode stats&hellip;</p>`;

    // loadTexMexBadges() targets #texmex-* elements that only exist once
    // loadProjects() has rendered the TexMex card, so it's chained after it.
    loadProjects();
    loadGitHubData();
    loadLeetCodeData();
});

// Lets interactions.js animate content that arrives after page load.
function announceRender(root) {
    document.dispatchEvent(new CustomEvent('content:rendered', { detail: { root } }));
}

/*=============== TEXMEX BADGES ===============*/
function setBadgePill(id, label, value) {
    const badge = document.getElementById(id);
    if (badge) badge.textContent = `${label}: ${value}`;
}

function hideTexMexBadges() {
    const container = document.querySelector('.work-badges');
    if (container) container.style.display = 'none';
}

async function loadTexMexBadges() {
    try {
        const response = await fetch(`./data/texmex-badges.json?t=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load TexMex data');

        const data = (await response.json()).data;
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
    const days = Math.floor((Date.now() - new Date(isoDate).getTime()) / 86400000);
    if (days < 1) return 'today';
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
}

// Generic placeholder until real screenshots are added. To use your own,
// add an "image" field to the project in data/projects.json.
function projectImage(project) {
    return project.image || `https://picsum.photos/seed/${encodeURIComponent(project.name)}/1200/900`;
}

function projectCardHTML(project) {
    // shields.io retired its "visual-studio-marketplace" badge type, so these
    // are rendered from our own data/texmex-badges.json instead of an <img>.
    const badgesHTML = project.name === 'TexMex' ? `
        <div class="work-badges">
          <span class="tag" id="texmex-installs">Installs: &hellip;</span>
          <span class="tag" id="texmex-version">Version: &hellip;</span>
          <span class="tag" id="texmex-rating">Rating: &hellip;</span>
        </div>` : '';

    const extraLinksHTML = (project.extraLinks || []).map(l =>
        `<a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.label} &#8599;</a>`
    ).join('');

    const year = project.updatedAt ? new Date(project.updatedAt).getFullYear() : '';

    return `
      <article class="work" data-reveal>
        <a class="work-frame" href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" data-cursor="View &#8599;" aria-label="${project.displayName} on GitHub">
          <div class="work-img"><img src="${projectImage(project)}" alt="" loading="lazy"></div>
        </a>
        <div class="work-meta">
          <div>
            <span class="work-sub mono">${project.tech.slice(0, 3).join(' &middot; ')}</span>
            <h3 class="work-title">${project.displayName}</h3>
          </div>
          <div class="work-tags">
            <span class="tag">${project.language || 'Development'}</span>
            ${year ? `<span class="tag tag-solid">${year}</span>` : ''}
          </div>
        </div>
        ${badgesHTML}
        <p class="work-desc">${project.description}</p>
        <div class="work-links">
          <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer">Code &#8599;</a>
          ${extraLinksHTML}
        </div>
      </article>
    `;
}

function repoRowHTML(project) {
    const desc = project.description !== 'No description yet.' ? project.description : '';
    return `
      <a class="repo-row" href="${project.githubUrl}" target="_blank" rel="noopener noreferrer">
        <span class="repo-name">${project.displayName}</span>
        <span class="repo-desc">${desc}</span>
        <span class="repo-meta mono">
          ${project.language ? `<span>${project.language}</span>` : ''}
          <span>${timeAgo(project.updatedAt)}</span>
          <span class="repo-arrow">&#8599;</span>
        </span>
      </a>
    `;
}

async function loadProjects() {
    const featuredContainer = document.getElementById('featured-projects');
    const moreContainer = document.getElementById('more-projects-list');
    const digits = document.getElementById('works-digits');
    const syncedLabel = document.getElementById('projects-synced');

    try {
        const response = await fetch(`./data/projects.json?t=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load projects data');

        const data = await response.json();
        const projects = data.projects || [];
        const featured = projects.filter(p => p.curated);
        const more = projects.filter(p => !p.curated);

        if (featuredContainer) featuredContainer.innerHTML = featured.map(projectCardHTML).join('');
        if (digits) digits.innerHTML = featured.map((_, i) => `<span>${i + 1}</span>`).join('');
        if (moreContainer) moreContainer.innerHTML = more.map(repoRowHTML).join('');
        if (syncedLabel && data.lastUpdated) {
            syncedLabel.textContent = `Auto-synced from GitHub · updated ${timeAgo(data.lastUpdated)}`;
        }

        announceRender(document.getElementById('works'));
        if (featured.some(p => p.name === 'TexMex')) loadTexMexBadges();
    } catch (error) {
        console.error('Error loading projects:', error);
        if (featuredContainer) featuredContainer.innerHTML = `<p class="lc-loading mono">Unable to load projects right now.</p>`;
    }
}

/*=============== GITHUB STRIP ===============*/
function renderGitHubStrip(login, avatarUrl, repos, followers, htmlUrl) {
    const el = document.getElementById('github-strip');
    if (!el) return;
    // The heatmap SVG is recolored for the dark theme at build time (see
    // update_data.py -> data/github-heatmap.svg) because ghchart.rshah.org
    // sends no CORS headers, so it can only be loaded as a plain <img>.
    el.innerHTML = `
      <a class="gh-id" href="${htmlUrl}" target="_blank" rel="noopener noreferrer">
        <img src="${avatarUrl}" alt="${login}">
        <span>
          <strong>@${login}</strong>
          <span class="mono">${repos} repos &middot; ${followers} followers &middot; synced nightly</span>
        </span>
      </a>
      <div class="gh-map">
        <img src="./data/github-heatmap.svg?t=${Date.now()}" alt="GitHub contribution heatmap">
      </div>
    `;
    announceRender(el);
}

async function loadGitHubData() {
    try {
        const response = await fetch(`./data/github-profile.json?t=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load GitHub data');

        const data = (await response.json()).data;
        renderGitHubStrip(data.login, data.avatar_url, data.public_repos, data.followers, data.html_url);
    } catch (error) {
        console.error('Error loading GitHub data:', error);
        renderGitHubStrip('rahul-challa', 'https://github.com/rahul-challa.png', 25, 15, 'https://github.com/rahul-challa');
    }
}

/*=============== LEETCODE ===============*/
const LEETCODE_DISPLAY_NAME = 'Rahul Challa';
const LEETCODE_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png';

async function loadLeetCodeData() {
    const container = document.getElementById('leetcode-profile');
    try {
        const response = await fetch(`./data/leetcode-profile.json?t=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load LeetCode data');
        renderLeetCodeProfile(await response.json());
    } catch (error) {
        console.error('Error loading LeetCode data:', error);
        if (container) container.innerHTML = `<p class="lc-loading mono">Unable to load LeetCode data at the moment.</p>`;
    }
}

function renderLeetCodeProfile(data) {
    const container = document.getElementById('leetcode-profile');
    if (!container) return;

    const contest = data.contest || {};
    const badge = contest.badge;
    const badgeCount = (data.badges || []).length;
    const rating = contest.rating != null ? contest.rating : 'N/A';
    const contests = contest.attendedContestsCount != null ? contest.attendedContestsCount : 'N/A';
    const globalRank = contest.globalRanking != null ? contest.globalRanking.toLocaleString() : 'N/A';
    const topPct = contest.topPercentage != null ? contest.topPercentage.toFixed(1) + '%' : 'N/A';

    const diff = (label, pct) => `
      <div>
        <div class="lc-diff-head"><span class="mono">${label}</span><span class="mono">${pct}%</span></div>
        <div class="lc-track"><div class="lc-fill" style="width:${pct}%"></div></div>
      </div>`;

    container.innerHTML = `
      <div class="lc-top">
        <div class="lc-id">
          <img src="${LEETCODE_LOGO}" alt="LeetCode logo">
          <div>
            <strong>${LEETCODE_DISPLAY_NAME}
              ${badge ? `<span class="tag lc-badge"><img src="assets/images/Knight.gif" alt=""> ${badge}</span>` : ''}
            </strong>
            <span class="mono">Rating ${rating} &middot; ${data.totalSolved.toLocaleString()} solved${badgeCount ? ` &middot; ${badgeCount} badges` : ''}</span>
          </div>
        </div>
        <a href="https://leetcode.com/${data.username}" target="_blank" rel="noopener noreferrer" class="pill-btn pill-clay">
          <span class="pill-fill"></span><span class="pill-text">View LeetCode &#8599;</span>
        </a>
      </div>

      <div class="lc-stats">
        <div class="stat" data-reveal><span class="stat-num">${data.totalSolved.toLocaleString()}</span><span class="stat-label mono">Problems solved</span></div>
        <div class="stat" data-reveal><span class="stat-num">${contests}</span><span class="stat-label mono">Contests</span></div>
        <div class="stat" data-reveal><span class="stat-num">${globalRank}</span><span class="stat-label mono">Global rank</span></div>
        <div class="stat" data-reveal><span class="stat-num">${topPct}</span><span class="stat-label mono">Top percentile</span></div>
      </div>

      <div class="lc-diff">
        ${diff('Easy', data.easyPercentage)}
        ${diff('Medium', data.mediumPercentage)}
        ${diff('Hard', data.hardPercentage)}
      </div>

      <div class="lc-heat" id="lc-heat"></div>
    `;

    const footerLeetCode = document.getElementById('footer-leetcode');
    if (footerLeetCode && data.username) footerLeetCode.href = `https://leetcode.com/${data.username}`;

    renderLeetCodeHeatmap(data.submissionCalendar || {});
    announceRender(container);
}

/*=============== LEETCODE ACTIVITY HEATMAP (SVG) ===============*/
function renderLeetCodeHeatmap(calendarData) {
    const target = document.getElementById('lc-heat');
    if (!target) return;

    try {
        const rows = 7;
        const cell = 11;
        const gap = 3;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const start = new Date(today);
        start.setDate(start.getDate() - 364);

        const weeks = Math.ceil(365 / rows);
        const days = weeks * rows;
        const activity = Array(days).fill(0);
        let total = 0;

        for (const ts in calendarData) {
            const day = new Date(parseInt(ts, 10) * 1000);
            day.setHours(0, 0, 0, 0);
            const idx = Math.floor((day - start) / 86400000);
            if (idx >= 0 && idx < days) {
                activity[idx] = calendarData[ts];
                total += calendarData[ts];
            }
        }

        // Terracotta ramp to match the site palette
        const shade = n => n === 0 ? '#1b1c22' : n === 1 ? '#5a3326' : n <= 2 ? '#8a4a33' : n <= 4 ? '#b85f40' : '#d97757';

        const top = 16;
        const width = weeks * (cell + gap);
        const height = rows * (cell + gap) + top;
        let svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="LeetCode submissions heatmap">`;

        let lastMonth = -1;
        for (let w = 0; w < weeks; w++) {
            const weekDate = new Date(start);
            weekDate.setDate(start.getDate() + w * rows);
            if (weekDate.getMonth() !== lastMonth && w < weeks - 2) {
                lastMonth = weekDate.getMonth();
                svg += `<text x="${w * (cell + gap)}" y="10" font-size="9" fill="#686b78" font-family="Geist Mono, monospace">${weekDate.toLocaleString('en-US', { month: 'short' })}</text>`;
            }
            for (let d = 0; d < rows; d++) {
                const idx = w * rows + d;
                const date = new Date(start);
                date.setDate(start.getDate() + idx);
                if (date > today) continue;
                const count = activity[idx];
                const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                svg += `<rect x="${w * (cell + gap)}" y="${top + d * (cell + gap)}" width="${cell}" height="${cell}" rx="2" fill="${shade(count)}"><title>${label}: ${count} ${count === 1 ? 'submission' : 'submissions'}</title></rect>`;
            }
        }
        svg += '</svg>';

        target.innerHTML = `<p class="lc-heat-total mono"><strong>${total.toLocaleString()}</strong> submissions in the last year</p>${svg}`;
    } catch (error) {
        console.error('Error rendering LeetCode heatmap:', error);
        target.innerHTML = '<p class="lc-loading mono">Unable to load activity data</p>';
    }
}
