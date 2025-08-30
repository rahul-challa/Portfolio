# Rahul Challa - Portfolio

A modern, responsive portfolio website showcasing my projects, skills, and experience as a software developer.

## 🚀 **Live Demo**
[View Portfolio](https://rahul-challa.github.io/Portfolio/)

## ✨ **Features**

- **Responsive Design**: Mobile-first approach with modern CSS Grid and Flexbox
- **Dynamic Content**: Real-time data from GitHub, LeetCode, and VS Code Marketplace
- **Interactive Elements**: Smooth animations, hover effects, and dynamic charts
- **Performance Optimized**: Lazy loading, efficient data caching, and optimized assets
- **Accessibility**: Semantic HTML, ARIA labels, and keyboard navigation support

## 🛠️ **Technologies Used**

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables, Grid, Flexbox
- **Icons**: Feather Icons, FontAwesome
- **Fonts**: Google Fonts (Poppins, Roboto)
- **Data Visualization**: Chart.js for interactive charts
- **APIs**: GitHub API, LeetCode API, VS Code Marketplace API

## 📁 **Project Structure**

```
Portfolio/
├── index.html              # Main HTML file
├── css/
│   ├── styles.css          # Main stylesheet
│   └── responsive.css      # Responsive design rules
├── js/
│   ├── main.js            # Main JavaScript functionality
│   └── animations.js      # Animation and interaction logic
├── assets/
│   ├── images/            # Project images and icons
│   ├── css/               # Additional CSS libraries
│   └── js/                # Third-party JavaScript libraries
├── data/                  # Cached API data (JSON files)
├── .github/
│   └── workflows/         # GitHub Actions for data updates
└── README.md              # This file
```

## 🔄 **API Data Caching System**

The portfolio uses a sophisticated caching system to avoid API rate limits:

### **How It Works:**
1. **Daily Updates**: GitHub Actions run daily to fetch fresh data
2. **Local Storage**: All API responses are cached in JSON files
3. **Fallback Data**: Static fallback data ensures the site always works
4. **No Direct API Calls**: The frontend only loads local JSON files

### **Data Sources:**
- **GitHub Profile**: User info, repositories, followers
- **LeetCode Stats**: Contest rankings, problem solving history, activity heatmap
- **VS Code Marketplace**: TexMex extension statistics

### **Benefits:**
- ✅ **No Rate Limits**: Always works regardless of API restrictions
- ✅ **Fast Loading**: Local data loads instantly
- ✅ **Reliable**: Fallback data ensures site functionality
- ✅ **Up-to-Date**: Daily automated updates keep data fresh

## 🚀 **GitHub Pages Deployment**

### **Prerequisites:**
- GitHub repository with your portfolio code
- GitHub Actions enabled for automated data updates

### **Deployment Steps:**

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

### **Post-Deployment:**
- **Monitor GitHub Actions**: Check that daily data updates are working
- **Test Functionality**: Verify all sections load correctly
- **Performance Check**: Use Lighthouse to ensure optimal performance
- **Mobile Testing**: Test responsiveness on various devices

## 🔧 **Local Development**

### **Setup:**
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

### **Development Notes:**
- **Data Files**: Local development uses cached JSON data
- **API Updates**: Use `test-api-fetch.py` to manually update data
- **CSS Changes**: Refresh browser to see style updates
- **JavaScript Debug**: Check browser console for any errors

## 📊 **Performance & Optimization**

### **Current Metrics:**
- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Load Time**: < 2 seconds on 3G
- **Bundle Size**: Optimized CSS and JavaScript
- **Image Optimization**: Compressed and properly sized images

### **Optimization Features:**
- **Lazy Loading**: Images and heavy content load on demand
- **CSS Variables**: Efficient theming and customization
- **Minified Assets**: Production-ready code
- **Responsive Images**: Different sizes for different devices

## 🐛 **Troubleshooting**

### **Common Issues:**

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

### **Debug Mode:**
Enable debug logging by opening browser console and checking for:
- Data loading messages
- Error logs
- Performance metrics

## 🤝 **Contributing**

While this is a personal portfolio, contributions are welcome:

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **GitHub**: For hosting and GitHub Actions
- **LeetCode**: For competitive programming platform
- **VS Code Marketplace**: For extension statistics
- **Open Source Community**: For various libraries and tools

## 📞 **Contact**

- **Portfolio**: [rahul-challa.github.io/Portfolio](https://rahul-challa.github.io/Portfolio/)
- **GitHub**: [github.com/rahul-challa](https://github.com/rahul-challa)
- **LinkedIn**: [linkedin.com/in/rahul-challa](https://linkedin.com/in/rahul-challa)

---

**Last Updated**: August 2025  
**Version**: 2.0.0  
**Status**: Production Ready ✅ 