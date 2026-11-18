# Site roadmap

What's left to take rahulchalla.com from "finished portfolio" to a fully polished website, plus notes for maintaining it. This file is not published to the site (see `_config.yml`).

Last updated: 2026-11-15

## Setup still pending (accounts only Rahul can access)

These are built into the site and switch on as soon as the key or account exists.

- [ ] **Email routing for `mail@rahulchalla.com`**: Cloudflare dashboard → rahulchalla.com → Email → Email Routing. Enable it, add a custom address `mail` → forward to your Gmail, verify the Gmail. Cloudflare adds the MX records itself. Until this is on, mail sent to `mail@rahulchalla.com` bounces.
- [ ] **Contact form key**: get a free access key at https://web3forms.com using `mail@rahulchalla.com`. Paste it into `index.html` in place of `YOUR_WEB3FORMS_ACCESS_KEY`. Until then, "Send" opens the visitor's email app instead.
- [ ] **Analytics token**: Cloudflare dashboard → Analytics & Logs → Web Analytics → Add a site → `rahulchalla.com` → copy the token from the snippet. Replace `YOUR_CF_ANALYTICS_TOKEN` in both `index.html` and `404.html`.
- [ ] **Search engines**: submit `sitemap.xml` in Google Search Console, request indexing for the homepage, and import the site into Bing Webmaster Tools (powers ChatGPT search and Copilot).
- [ ] **Profile links**: put `https://rahulchalla.com` in the website field on LinkedIn, GitHub (profile and README), LeetCode and the VS Code Marketplace publisher page.

## Quality pass

- [ ] **Accessibility**
  - Add a "skip to content" link.
  - Add visible keyboard focus styles across links and buttons.
  - Trap focus inside the full-screen menu while it's open, and return focus to the menu button on close.
  - Check colour contrast: some small grey (`--muted`) text on the dark panels likely fails WCAG AA.
- [ ] **Performance**
  - Shorten the preloader, or show it only on the first visit (sessionStorage). It currently delays the main content (LCP) by about 1.5s.
  - Self-host the Geist fonts and the GSAP and Lenis scripts instead of loading them from Google Fonts, cdnjs and unpkg.
  - Serve photos as WebP or AVIF, with `<picture>` fallbacks.
  - Run Lighthouse and PageSpeed Insights and fix anything below 90.
- [ ] **Real-device testing** on iPhone Safari and Android Chrome: Lenis smooth scroll, the sticky stacked service cards, the hero pin, and the clip-path reveals. Automated checks so far ran in Chromium only.
- [ ] **Repo cleanup**
  - Delete images the site no longer uses: `assets/images/Profile.png` (1.3 MB), `Graduation.jpg` (replaced by `graduation-web.jpg`), `About.jpeg`, `Main.jpg`, `code.svg`, and `assets/images/logos/` (no longer referenced).
  - Delete the stray file named `are in the file. Please try these steps to see the updated heatmap:"`.
  - Delete or merge the old notes: `COMMIT-MESSAGE.md`, `DEPLOYMENT-CHECKLIST.md`, `DEPLOYMENT-STATUS.md`, `GITHUB-ACTIONS-TROUBLESHOOTING.md`, `PAT-SETUP-GUIDE.md`, `PRODUCTION-STATUS.md`.
  - Rewrite `README.md`: the GitHub repo is part of the portfolio too.

## Growth

- [ ] **Project case-study pages** (`/projects/wildfire-twin`, `/projects/texmex`, ...): the problem, the architecture (a diagram), key decisions, results and what I'd do next. This is the biggest SEO lever left, because more indexable pages target more searches. Add each page to `sitemap.xml` and `llms.txt`.
- [ ] **Writing / blog**: 3–4 technical posts to start, for example "Cutting P95 latency 91% with Apache Sedona" or "Building a zero-dependency VS Code extension".
- [ ] **Social proof**: one or two short quotes from a manager, professor or TexMex user.

## Optional / later

- [ ] **Accent colour**: revisit the terracotta (`--clay` in `css/styles.css`). Shortlist: periwinkle `#9aa7e0` (deeper `#7f8fe0` for text on dark) or dusty rose `#d4a59a` (deeper `#d08b7c`). Build a side-by-side preview before switching.
- [ ] **Cloudflare proxy (orange cloud)**: adds security headers (HSTS, CSP), edge caching and bot protection. It needs care with GitHub Pages HTTPS: set SSL/TLS to "Full", and keep AI crawlers allowed (turn off "Block AI bots").
- [ ] **Uptime monitoring**: UptimeRobot (free) on the homepage and `data/projects.json`, so a broken nightly sync shows up.
- [ ] **Alternate name in structured data**: if people search a longer form of the name (for example including "Viswanadh"), add it as `alternateName` on the Person in `index.html`.

## Maintenance notes

- **Cache busting**: after changing `css/styles.css` or a JS file, bump its `?v=` number in `index.html` (and the stylesheet's in `404.html`), or returning visitors may get the old file.
- **Featured projects**: edit `data/project-overrides.json` (order, copy, tech tags, `image`). The nightly GitHub Action rebuilds `data/projects.json` from it.
- **Static project cards**: `index.html` has a hard-coded copy of the featured cards so crawlers that don't run JavaScript still see them; `main.js` replaces it on load. After changing the overrides, regenerate that block so it doesn't drift.
- **Project illustrations**: `python tools/make_project_art.py` (run from the repo root) rewrites `assets/images/projects/*.svg`.
- **Share image and icons**: `python tools/make_seo_images.py` rewrites `og-image.jpg`, the icons and `favicon.ico`. It uses Windows system fonts.
- **Resume or content changes**: update `index.html`, the Person data in its JSON-LD block, and `llms.txt` together so search and AI see consistent facts. Bump `dateModified` in the JSON-LD and `lastmod` in `sitemap.xml`. `dateModified` must be a full date-time with timezone (e.g. `2026-11-18T00:00:00-08:00`); a bare date triggers a Search Console "Invalid datetime" warning.
- **TexMex rating in the JSON-LD** (`aggregateRating`, currently 5.0 from 3 ratings) is hard-coded. Update it occasionally from `data/texmex-badges.json` so it matches the Marketplace.
- **After any structured-data change**, paste the page into https://validator.schema.org and Google's Rich Results Test (https://search.google.com/test/rich-results) before pushing.
