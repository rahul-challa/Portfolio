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
    
    // Counter animation for about info items
    function animateCounter(element, target, duration) {
        let start = 0;
        const increment = target / (duration / 16); // 16ms is roughly one frame at 60fps
        
        function updateCount() {
            start += increment;
            if (start >= target) {
                element.textContent = target + '+';
            } else {
                element.textContent = Math.floor(start) + '+';
                requestAnimationFrame(updateCount);
            }
        }
        
        updateCount();
    }
    
    // Intersection observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counterElement = entry.target.querySelector('.info-title');
                const targetValue = parseInt(counterElement.textContent);
                
                // Reset the content temporarily for animation
                counterElement.textContent = '0+';
                
                // Start counter animation
                animateCounter(counterElement, targetValue, 1500);
                
                // Unobserve after animation
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.7
    });
    
    // Observe all info items for counter animation
    document.querySelectorAll('.info-item').forEach(item => {
        counterObserver.observe(item);
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
});
