/*=============== ANIMATIONS ===============*/

document.addEventListener('DOMContentLoaded', function () {
    /*=============== HERO ENTRANCE ===============*/
    setTimeout(() => {
        const homeText = document.querySelector('.home-text');
        if (homeText) homeText.classList.add('fade-in');
        setTimeout(() => {
            const homeImg = document.querySelector('.home-img');
            if (homeImg) homeImg.classList.add('fade-in');
        }, 250);
    }, 100);

    /*=============== TYPING ANIMATION FOR PROFESSION ===============*/
    const typingElement = document.querySelector('.profession');
    if (typingElement) {
        const originalText = typingElement.textContent.trim();
        typingElement.textContent = '';
        let charIndex = 0;
        const typingSpeed = 90;

        function typeText() {
            if (charIndex < originalText.length) {
                typingElement.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeText, typingSpeed);
            }
        }
        setTimeout(typeText, 900);
    }
});
