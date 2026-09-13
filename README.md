# Rahul Challa - Portfolio

A modern, responsive portfolio website showcasing my projects, skills, and experience as a software developer.

## Live Demo
[View Portfolio](https://rahulchalla.com/)

## Features

- **Responsive Design**: Mobile-first approach with modern CSS Grid and Flexbox
- **Dynamic Content**: Projects, GitHub stats, and LeetCode stats are all pulled live from GitHub/LeetCode's own APIs and cached locally - nothing is hand-maintained except the curated project descriptions
- **Interactive Elements**: Scroll-reveal animations, animated stat counters, an SVG contribution heatmap
- **Performance Optimized**: Local data caching (no live API calls from the browser), pre-normalized image assets, optimized fonts
- **Accessibility**: Semantic HTML, ARIA labels, and keyboard navigation support

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables, Grid, Flexbox
- **Icons**: Feather Icons
- **Fonts**: Google Fonts (Fraunces, Poppins, Roboto Mono)
- **APIs**: GitHub REST API, LeetCode GraphQL API, VS Code Marketplace Gallery API

## Project Structure

```
Portfolio/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Stylesheet (includes responsive rules)
├── js/
│   ├── main.js            # Main JavaScript functionality
│   └── animations.js      # Animation and interaction logic
├── assets/
│   ├── images/            # Project images, personal photos, institution/company logos
│   └── Resume/            # Resume PDF file
├── data/                  # Cached API data (JSON files, auto-updated nightly)
│   ├── projects.json          # Auto-generated from GitHub repos + project-overrides.json
│   ├── project-overrides.json # Hand-curated copy for specific repos (git-tracked, edited directly)
│   ├── github-profile.json    # GitHub profile stats
│   ├── github-heatmap.svg     # Pre-recolored contribution heatmap (see caching notes below)
│   ├── leetcode-profile.json  # LeetCode stats, contest ranking, badges, submission calendar
│   └── texmex-badges.json     # VS Code Marketplace stats for the TexMex extension
├── .github/
│   └── workflows/         # GitHub Actions for data updates
├── update_data.py         # Manual data update script
└── README.md              # This file
```

## API Data Caching System

The portfolio uses a sophisticated caching system to avoid API rate limits:

### How It Works:
1. **Daily Updates**: `.github/workflows/update-api-data.yml` runs `update_data.py` daily to fetch fresh data
2. **Local Storage**: All API responses are cached in JSON (or SVG, for the heatmap) files under `data/`
3. **Fallback Data**: The frontend falls back to sane static values if a fetch fails
4. **No Direct API Calls**: The frontend only loads local files - it never calls GitHub/LeetCode/VS Code Marketplace directly

### Data Sources:
- **GitHub**: profile stats, and the Projects section's repo list (via `update_projects_data()` in `update_data.py`, merged with `data/project-overrides.json` for hand-written descriptions on specific repos)
- **GitHub contribution heatmap**: fetched from `ghchart.rshah.org` and recolored for the dark theme server-side, since that service sends no CORS headers (so it can't be fetched and recolored client-side) and only serves a light-background SVG by default
- **LeetCode**: queried directly against `leetcode.com/graphql` (the same endpoint leetcode.com's own frontend uses) rather than a third-party mirror API, which is both more reliable and returns richer data (full badge list, precise question-count percentages)
- **VS Code Marketplace**: TexMex extension stats via the Marketplace Gallery API

### Keeping Projects up to date:
- New GitHub repos show up automatically on the next nightly sync - no action needed
- To give a specific repo a polished description/tech list instead of its raw GitHub description, add an entry for it in `data/project-overrides.json` (keyed by repo name)
- To hide a repo from the Projects section entirely (coursework, forks, etc.), add its name to `PROJECT_EXCLUDED_REPOS` in `update_data.py`
- Deleting or renaming a repo on GitHub removes it from the site automatically, since the list is rebuilt from the live GitHub API on every run

### Benefits:
- **No Rate Limits**: Always works regardless of API restrictions
- **Fast Loading**: Local data loads instantly
- **Reliable**: Fallback data ensures site functionality
- **Up-to-Date**: Daily automated updates keep data fresh

## GitHub Pages Deployment

### Prerequisites:
- GitHub repository with your portfolio code
- GitHub Actions enabled for automated data updates

### Deployment Steps:

1. **Fork/Clone Repository**
   ```bash
   git clone https://github.com/your-username/Portfolio.git
   cd Portfolio
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` (or your default branch)
   - Folder: `/ (root)`
   - Click Save

3. **Verify Data Files**
   - Ensure `data/` folder contains all JSON files
   - Check that GitHub Actions workflow is properly configured

4. **Customize for Your Profile**
   - Update `index.html` with your information
   - Modify API endpoints in `.github/workflows/update-api-data.yml`
   - Update usernames and profile links

5. **Deploy**
   - Push changes to main branch
   - GitHub Pages will automatically deploy
   - Your portfolio will be available at `https://your-username.github.io/Portfolio/`

### Post-Deployment:
- **Monitor GitHub Actions**: Check that daily data updates are working
- **Test Functionality**: Verify all sections load correctly
- **Performance Check**: Use Lighthouse to ensure optimal performance
- **Mobile Testing**: Test responsiveness on various devices

## Local Development

### Setup:
1. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/Portfolio.git
   cd Portfolio
   ```

2. **Start Local Server**
   ```bash
   # Using Python (recommended)
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open Browser**
   - Navigate to `http://localhost:8000`
   - The portfolio should load with all functionality

### Development Notes:
- **Data Files**: Local development uses cached JSON data
- **API Updates**: Use `update_data.py` to manually update data
- **CSS Changes**: Refresh browser to see style updates (hard refresh: Ctrl+Shift+R)
- **JavaScript Debug**: Check browser console for any errors

## Performance & Optimization

### Current Metrics:
- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Load Time**: < 2 seconds on 3G
- **Bundle Size**: Optimized CSS and JavaScript
- **Image Optimization**: Compressed and properly sized images

### Optimization Features:
- **Lazy Loading**: Images and heavy content load on demand
- **CSS Variables**: Efficient theming and customization
- **Minified Assets**: Production-ready code
- **Responsive Images**: Different sizes for different devices

## Troubleshooting

### Common Issues:

1. **Data Not Loading**
   - Check browser console for errors
   - Verify JSON files exist in `data/` folder
   - Ensure GitHub Actions are running successfully

2. **Styling Issues**
   - Clear browser cache
   - Check CSS file paths
   - Verify CSS variables are defined

3. **GitHub Pages Not Working**
   - Check repository settings
   - Verify branch and folder configuration
   - Check GitHub Actions workflow status

4. **API Rate Limits**
   - The caching system should prevent this
   - Check GitHub Actions logs for API errors
   - Verify fallback data is working

### Debug Mode:
Enable debug logging by opening browser console and checking for:
- Data loading messages
- Error logs
- Performance metrics

## Contributing

While this is a personal portfolio, contributions are welcome:

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **GitHub**: For hosting and GitHub Actions
- **LeetCode**: For competitive programming platform
- **VS Code Marketplace**: For extension statistics
- **Open Source Community**: For various libraries and tools

## Contact

- **Portfolio**: [rahulchalla.com](https://rahulchalla.com/)
- **GitHub**: [github.com/rahul-challa](https://github.com/rahul-challa)
- **LinkedIn**: [linkedin.com/in/rahulchalla13](https://linkedin.com/in/rahulchalla13)

---

**Status**: Production Ready 