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
    // GitHub
    const githubLogoImg = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
    fetch('https://api.github.com/users/rahul-challa')
      .then(res => res.json())
      .then(data => {
        document.querySelector('.github-profile').innerHTML = `
          <div class=\"profile-info\">\n            <img src=\"${githubLogoImg}\" alt=\"GitHub Logo\" class=\"profile-avatar\" style=\"background:#fff;padding:10px;\"/>\n            <h3>${data.login}</h3>\n            <p>Repos: ${data.public_repos} | Followers: ${data.followers}</p>\n            <a href=\"${data.html_url}\" target=\"_blank\" class=\"btn primary-btn\">View GitHub</a>\n          </div>\n          <div class=\"profile-heatmap\">\n            <img src=\"https://ghchart.rshah.org/26a641/rahul-challa\" alt=\"GitHub Contribution Heatmap\" class=\"github-heatmap\"/>\n            <img src=\"https://github-readme-stats.vercel.app/api?username=rahul-challa&show_icons=true&theme=dark&hide_title=true&icon_color=FFB81C&title_color=FFB81C&text_color=eeeeee\" alt=\"GitHub Stats\" class=\"github-heatmap\"/>\n          </div>\n        `;
      });

    // LeetCode (using leetcode-stats-api.herokuapp.com)
    const leetcodeUsername = 'Rahul_Challa';
    const leetcodeDisplayName = 'Rahul Challa';
    const leetcodeLogoImg = 'https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png';
    fetch('https://leetcode-stats-api.herokuapp.com/' + leetcodeUsername)
      .then(res => res.json())
      .then(data => {
        document.querySelector('.leetcode-profile').innerHTML = `
          <div class=\"profile-info\">\n            <img src=\"${leetcodeLogoImg}\" alt=\"LeetCode Logo\" class=\"profile-avatar\" style=\"background:#fff;padding:10px;\"/>\n            <h3>${leetcodeDisplayName}</h3>\n            <p>Total Solved: ${data.totalSolved} | Ranking: ${data.ranking}</p>\n            <a href=\"https://leetcode.com/${leetcodeUsername}/\" target=\"_blank\" class=\"btn primary-btn\">View LeetCode</a>\n          </div>\n          <div class=\"profile-heatmap\">\n            <img src=\"https://leetcard.jacoblin.cool/${leetcodeUsername}?theme=dark&font=baloo&ext=heatmap\" alt=\"LeetCode Stats\" class=\"leetcode-heatmap\"/>\n          </div>\n        `;
      });
});
