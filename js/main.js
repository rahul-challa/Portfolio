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
});
