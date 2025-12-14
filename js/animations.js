/*=============== ANIMATIONS ===============*/

document.addEventListener('DOMContentLoaded', function() {
    // Initial load animations
    setTimeout(() => {
        document.querySelector('.home-text').classList.add('fade-in');
        
        setTimeout(() => {
            document.querySelector('.home-img').classList.add('fade-in');
        }, 300);
    }, 100);
    
    // Typing animation for the profession
    const typingElement = document.querySelector('.profession');
    const originalText = typingElement.textContent;
    typingElement.textContent = '';
    
    let charIndex = 0;
    const typingSpeed = 100; // milliseconds per character
    
    function typeText() {
        if (charIndex < originalText.length) {
            typingElement.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, typingSpeed);
        }
    }
    
    // Start typing animation after a delay
    setTimeout(typeText, 1000);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 60, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Parallax effect for the home section
    const homeSection = document.querySelector('.home');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        if (scrollPosition < window.innerHeight) {
            const parallaxOffset = scrollPosition * 0.4;
            homeSection.style.backgroundPositionY = `${parallaxOffset}px`;
        }
    });
    
    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Skill bar animation
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-percentage-bar');
                
                skillBars.forEach(bar => {
                    // Reset width first
                    bar.style.width = '0%';
                    
                    // Get target width from the style attribute
                    const targetWidth = bar.getAttribute('style').split('width:')[1].trim();
                    
                    // Animate after a short delay
                    setTimeout(() => {
                        bar.style.transition = 'width 1.5s ease-in-out';
                        bar.style.width = targetWidth;
                    }, 200);
                });
                
                // Unobserve after animation
                skillObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    // Observe skill boxes for bar animation
    document.querySelectorAll('.skill-box').forEach(box => {
        skillObserver.observe(box);
    });
    
    // Form input animation
    const formInputs = document.querySelectorAll('.form-input');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.querySelector('.form-label').style.color = 'var(--primary-color)';
            this.style.borderColor = 'var(--primary-color)';
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.querySelector('.form-label').style.color = '';
            
            if (!this.value) {
                this.style.borderColor = 'var(--border-color)';
            }
        });
    });
    
    // Experience cards scroll animation
    const experienceObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('scroll-in');
                }, index * 100);
                experienceObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all experience cards
    document.querySelectorAll('.experience-card').forEach(card => {
        experienceObserver.observe(card);
    });
    
    // Enhanced experience card hover effects
    const experienceCards = document.querySelectorAll('.experience-card');
    
    experienceCards.forEach((card) => {
        // Add parallax effect on hover
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `translateY(-8px) scale(1.01) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'translateY(0) scale(1) perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
});
