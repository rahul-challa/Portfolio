# Rahul Challa - Portfolio Website

A modern, responsive portfolio website showcasing my projects, skills, and experience.

## Features

- **Responsive Design**: Works perfectly on all devices
- **Modern UI**: Clean, professional design with smooth animations
- **Dynamic Content**: Auto-updating GitHub and LeetCode statistics
- **Performance Optimized**: Fast loading with optimized assets

## LeetCode Integration

The website includes a dynamic LeetCode profile section that displays:
- Contest ranking and rating
- Contest history with rating trends
- Activity heatmap
- Problem-solving statistics

### Data Update System

- **Automatic Updates**: GitHub Actions runs daily at 2:00 AM UTC to fetch fresh LeetCode data
- **Local Data Storage**: All LeetCode data is stored in `assets/data/Rahul_Challa.json`
- **No API Calls**: The website only loads data from the local file, ensuring reliability
- **Rate Limit Safe**: Updates happen once per day to avoid API rate limiting

### How It Works

1. **Daily Update**: GitHub Actions automatically runs the update script
2. **Multiple APIs**: Script tries multiple LeetCode API endpoints with retry logic
3. **Local Storage**: Fresh data is saved to `assets/data/Rahul_Challa.json`
4. **Website Display**: Portfolio loads data from the local file only
5. **Fallback System**: If APIs fail, existing data is preserved

## Technologies Used

- HTML5, CSS3, JavaScript (ES6+)
- Chart.js for data visualization
- GitHub Actions for CI/CD
- Node.js for data processing

## Local Development

1. Clone the repository
2. Open `index.html` in your browser
3. The website will load LeetCode data from the local JSON file

## Deployment

The website is designed to be deployed on any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- Any web server

## File Structure

```
Portfolio/
├── index.html              # Main website
├── assets/
│   ├── data/
│   │   └── Rahul_Challa.json  # LeetCode data (auto-updated)
│   ├── images/             # Website images
│   └── css/               # Stylesheets
├── js/
│   └── main.js            # Main JavaScript
├── scripts/
│   ├── update_leetcode.mjs    # Daily data update script
│   └── update_leetcode_backup.js  # Backup update script
└── .github/workflows/
    └── update-leetcode.yml    # GitHub Actions workflow
```

## License

This project is open source and available under the [MIT License](LICENSE). 