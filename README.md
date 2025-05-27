# Portfolio Website: Rahul Challa

A modern, responsive portfolio website featuring:
- Automated LeetCode stats, contest graph, and activity heatmap (with API fallback)
- GitHub profile and contribution heatmap
- Fully responsive dashboard UI
- Automated data updates via GitHub Actions

## Features
- **LeetCode Section:**
  - Contest rating, global ranking, attended count
  - Minimalist contest rating graph (auto-updating)
  - Activity heatmap (auto-updating, API fallback)
- **GitHub Section:**
  - Profile info, repo/follower stats
  - Contribution heatmap
- **Automation:**
  - GitHub Actions workflow updates LeetCode data daily and on push
  - Local fallback JSON ensures site always works, even if API is down

## Setup
1. Clone the repo
2. Run `npm install`
3. To update LeetCode data locally: `node scripts/update_leetcode.js`
4. Deploy to GitHub Pages or your preferred static host

## Automation
- `.github/workflows/update_leetcode.yml` runs daily and on push to update LeetCode data
- Data is stored in `assets/data/Rahul_Challa.json`

## Credits
- [alfa-leetcode-api](https://github.com/alfaarghya/alfa-leetcode-api) for LeetCode data
- [Chart.js](https://www.chartjs.org/) for charts
- [Feather Icons](https://feathericons.com/) for icons

---
MIT License

# Rahul Challa | Portfolio Website

[Live Site](https://rahul-challa.github.io/Portfolio/)  |  [Download Resume](assets/Resume/Rahul_Challa.pdf)

## Overview
A modern, responsive portfolio website to showcase my skills, projects, and professional background. Features a custom dashboard UI, animated code rain, dynamic coding profiles (GitHub, LeetCode), and modular project cards. Built for performance, accessibility, and easy future expansion.

## Features
- Responsive dashboard UI
- Animated code rain background
- Skills as interactive tags
- Dynamic GitHub & LeetCode profile integration
- Modular, filterable project cards
- Accessible, SEO-optimized, and fast
- Contact section with direct links

## Tech Stack
- HTML5, CSS3 (custom, responsive)
- JavaScript (vanilla)
- Feather Icons
- GitHub & LeetCode APIs
- [See full tech list in Skills section](#skills)

## Getting Started
1. **Clone the repo:**
   ```bash
   git clone https://github.com/rahul-challa/Portfolio.git
   cd Portfolio
   ```
2. **Open `index.html` in your browser**
   - Or use a local server (e.g. Python):
     ```bash
     python -m http.server
     ```
3. **Edit content:**
   - Update your info in `index.html`, `css/`, and `js/` as needed.

## Deployment
- Hosted on [GitHub Pages](https://rahul-challa.github.io/Portfolio/)
- To deploy your own fork:
  1. Push to your GitHub repo
  2. Enable GitHub Pages in repo settings (root or `/docs`)

## Folder Structure
```
/Portfolio
  |-- index.html
  |-- css/
  |-- js/
  |-- assets/
      |-- images/
      |-- Resume/
  |-- README.md
  |-- .gitignore
  |-- LICENSE
```

## Credits
- [Feather Icons](https://feathericons.com/)
- [Google Fonts](https://fonts.google.com/)
- [GitHub API](https://docs.github.com/en/rest)
- [LeetCode API (unofficial)](https://leetcode.com/api/)

## Contact
- **Email:** challaviswanadhrahul@gmail.com
- **LinkedIn:** [rahulchalla13](https://www.linkedin.com/in/rahulchalla13/)
- **GitHub:** [rahul-challa](https://github.com/rahul-challa)
- **Location:** Riverside, California

---

> Thanks for visiting my portfolio! 🚀 