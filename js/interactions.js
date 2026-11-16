/*=============== INTERACTIONS ===============*/
// Preloader, smooth scroll, text reveals, menu, cursor bubble and scroll
// effects. GSAP / ScrollTrigger / Lenis are optional: nothing is hidden
// unless GSAP is present to reveal it again, so a CDN failure only costs
// the animation, never the content.

document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const animate = !!(window.gsap && window.ScrollTrigger) && !reduceMotion;

    if (animate) gsap.registerPlugin(ScrollTrigger);

    const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const escAttr = s => esc(s).replace(/"/g, '&quot;');

    /*=============== SPLIT TEXT ===============*/
    // chars: every word is a clipped box whose letters slide up
    function splitChars(el) {
        const words = el.textContent.trim().split(/\s+/);
        el.innerHTML = words.map(w =>
            `<span class="w">${[...w].map(c => `<span class="ch">${esc(c)}</span>`).join('')}</span>`
        ).join(' ');
    }

    // words: every word slides up out of its own clipped box
    function splitWords(el) {
        const words = el.textContent.trim().split(/\s+/);
        el.innerHTML = words.map(w => `<span class="w"><span class="wi">${esc(w)}</span></span>`).join(' ');
    }

    document.querySelectorAll('[data-split="chars"], [data-split="hero"], [data-split="roll"]').forEach(splitChars);
    document.querySelectorAll('[data-split="words"], [data-split="hero-words"]').forEach(splitWords);

    /*=============== LETTER ROLL (hero name + display headings) ===============*/
    // Each letter gets a stacked copy; hovering a letter rolls it over, so
    // sweeping across a heading ripples. Only real mouse movement triggers
    // it: when the page scrolls under a resting cursor, letters stay put.
    let lastMouseMove = 0;
    let lastScroll = 0;
    window.addEventListener('mousemove', () => { lastMouseMove = performance.now(); }, { passive: true });
    window.addEventListener('scroll', () => { lastScroll = performance.now(); }, { passive: true });

    function makeRollable(ch) {
        const c = ch.textContent;
        ch.classList.add('ch-roll');
        // The rolling copy is a CSS ::after (from data-c), so crawlers and
        // screen readers read each letter once and words stay intact.
        ch.dataset.c = c;
        ch.innerHTML = `<span class="ch-a">${esc(c)}</span>`;
        ch.addEventListener('animationend', e => {
            if (e.animationName === 'ch-roll-in') ch.classList.remove('is-rolling');
        });
    }

    const roll = ch => ch.classList.add('is-rolling');

    if (!reduceMotion) {
        const nameChars = [...document.querySelectorAll('.hero-name .ch')];
        const headingChars = [...document.querySelectorAll('[data-split="chars"] .ch, [data-split="roll"] .ch')];
        nameChars.forEach(makeRollable);
        headingChars.forEach(makeRollable);

        // Scroll wave: as a heading passes the middle of the screen, a roll
        // ripples through it once (after its slide-up entrance has finished).
        const wave = el => el.querySelectorAll('.ch-roll').forEach((ch, i) => setTimeout(() => roll(ch), i * 40));
        const onWaveEnter = entries => entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const now = performance.now();
            if (now - (el._lastWave || 0) < 2500) return;
            el._lastWave = now;
            const revealedAt = parseFloat(el.dataset.revealedAt || 0);
            setTimeout(() => wave(el), revealedAt ? Math.max(0, revealedAt + 1300 - now) : 0);
        });
        const waveIO = new IntersectionObserver(onWaveEnter, { rootMargin: '-40% 0px -40% 0px' });
        document.querySelectorAll('[data-split="chars"]').forEach(el => waveIO.observe(el));
        // The footer wordmark sits at the bottom of the screen, so it waves once mostly visible
        const footIO = new IntersectionObserver(onWaveEnter, { threshold: 0.9 });
        document.querySelectorAll('[data-split="roll"]').forEach(el => footIO.observe(el));

        if (finePointer) {
            [...nameChars, ...headingChars].forEach(ch => ch.addEventListener('mouseenter', () => {
                const now = performance.now();
                if (now - lastMouseMove < 80 && now - lastScroll > 150) roll(ch);
            }));
        } else {
            // Touch: tapping the name sends a wave through it
            const heroName = document.querySelector('.hero-name');
            if (heroName) heroName.addEventListener('click', () => {
                nameChars.forEach((ch, i) => setTimeout(() => roll(ch), i * 45));
            });
        }
    }

    // Duplicate the label so it can roll up on hover
    function applyRoll(scope) {
        scope.querySelectorAll('[data-roll]:not([data-rolled])').forEach(el => {
            el.dataset.rolled = '';
            // Copy is CSS-generated (see .roll in styles.css) so the text isn't duplicated in the DOM
            el.innerHTML = `<span class="roll"><span>${el.innerHTML}</span><span aria-hidden="true" data-t="${escAttr(el.textContent.trim())}"></span></span>`;
        });
    }
    applyRoll(document);

    /*=============== SMOOTH SCROLL ===============*/
    let lenis = null;
    if (window.Lenis && !reduceMotion) {
        lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
        if (animate) {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add(time => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        } else {
            const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
            requestAnimationFrame(raf);
        }
        lenis.stop();
    }

    function scrollToTarget(target) {
        if (lenis) lenis.scrollTo(target, { duration: 1.4 });
        else if (target === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
        else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }

    /*=============== MENU ===============*/
    const menuBtn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');

    function setMenu(open) {
        if (!menu || !menuBtn) return;
        menu.classList.toggle('is-open', open);
        menuBtn.classList.toggle('is-open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        menu.setAttribute('aria-hidden', String(!open));
        if (lenis) open ? lenis.stop() : lenis.start();
        document.body.style.overflow = open ? 'hidden' : '';
    }

    if (menuBtn) menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

    function updateMenuButton() {
        if (!menuBtn) return;
        menuBtn.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    }
    window.addEventListener('scroll', updateMenuButton, { passive: true });
    updateMenuButton();

    // All in-page links scroll smoothly (and close the menu first)
    document.addEventListener('click', e => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const hash = link.getAttribute('href');
        const target = hash === '#' || hash === '#home' ? 0 : document.querySelector(hash);
        if (target === null) return;
        e.preventDefault();
        if (menu && menu.classList.contains('is-open')) setMenu(false);
        scrollToTarget(target);
    });

    /*=============== LOCAL TIME ===============*/
    const timeEls = document.querySelectorAll('.js-time');
    const timeFmt = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
    const tickTime = () => timeEls.forEach(el => { el.textContent = timeFmt.format(new Date()); });
    tickTime();
    setInterval(tickTime, 1000);

    /*=============== CONTACT FORM -> mailto ===============*/
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const msg = form.elements.message.value.trim();
            const subject = encodeURIComponent('Hello from your portfolio');
            window.location.href = `mailto:challaviswanadhrahul@gmail.com?subject=${subject}&body=${encodeURIComponent(msg)}`;
        });
    }

    /*=============== CURSOR "VIEW" BUBBLE ===============*/
    const bubble = document.querySelector('.cursor-view');
    if (bubble && finePointer && !reduceMotion) {
        const label = bubble.querySelector('span');
        let mx = -200, my = -200, x = -200, y = -200, scale = 0, targetScale = 0;

        window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
        document.addEventListener('mouseover', e => {
            const area = e.target.closest('[data-cursor]');
            targetScale = area ? 1 : 0;
            if (area) label.textContent = area.dataset.cursor;
        });
        document.addEventListener('mouseleave', () => { targetScale = 0; });

        const loop = () => {
            x += (mx - x) * 0.18;
            y += (my - y) * 0.18;
            scale += (targetScale - scale) * 0.18;
            bubble.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale.toFixed(3)})`;
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    /*=============== MAGNETIC BUTTONS ===============*/
    function applyMagnetic(scope) {
        if (!finePointer || reduceMotion) return;
        scope.querySelectorAll('[data-magnetic]:not([data-magnetized])').forEach(el => {
            el.dataset.magnetized = '';
            el.addEventListener('mousemove', e => {
                const r = el.getBoundingClientRect();
                el.style.transition = 'transform 0.2s ease-out';
                el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                el.style.transform = '';
            });
        });
    }
    applyMagnetic(document);

    /*=============== WORKS COUNTER (0 1 / 0 2 / ...) ===============*/
    function bindWorksCounter() {
        const col = document.getElementById('works-digits');
        const cards = document.querySelectorAll('#featured-projects .work');
        if (!col || !cards.length) return;
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const i = [...cards].indexOf(entry.target);
                col.style.transform = `translateY(${-0.8 * i}em)`;
            });
        }, { rootMargin: '-45% 0px -45% 0px' });
        cards.forEach(card => io.observe(card));
    }

    /*=============== SCROLL REVEALS ===============*/
    function revealOnEnter(el, targets, vars, start = 'top 88%') {
        ScrollTrigger.create({
            trigger: el,
            start,
            once: true,
            onEnter: () => gsap.to(targets, { ...vars, overwrite: 'auto' })
        });
    }

    function applyReveals(scope) {
        if (!animate) return;

        scope.querySelectorAll('[data-split="chars"]:not([data-anim])').forEach(el => {
            el.dataset.anim = '';
            const chars = el.querySelectorAll('.ch');
            const weight = parseInt(getComputedStyle(el).fontWeight, 10) || 600;
            gsap.set(chars, { yPercent: 110, fontWeight: 200 });
            // Remember when the entrance started so the scroll wave waits for it
            ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => { el.dataset.revealedAt = performance.now(); } });
            revealOnEnter(el, chars, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.025 });
            // Weight settle: letters land thin and ink in to full weight
            revealOnEnter(el, chars, { fontWeight: weight, duration: 1.4, ease: 'power2.out', stagger: 0.025, delay: 0.15, clearProps: 'fontWeight' });
        });

        scope.querySelectorAll('[data-split="words"]:not([data-anim])').forEach(el => {
            el.dataset.anim = '';
            const words = el.querySelectorAll('.wi');
            gsap.set(words, { yPercent: 110 });
            revealOnEnter(el, words, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.012 });
        });

        scope.querySelectorAll('[data-reveal="img"]:not([data-anim])').forEach(el => {
            el.dataset.anim = '';
            const img = el.querySelector('img');
            gsap.set(el, { clipPath: 'inset(100% 0% 0% 0%)' });
            if (img) gsap.set(img, { scale: 1.3 });
            revealOnEnter(el, el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' }, 'top 85%');
            if (img) revealOnEnter(el, img, { scale: 1, duration: 1.6, ease: 'expo.out' }, 'top 85%');
        });

        scope.querySelectorAll('[data-reveal]:not([data-reveal="img"]):not([data-anim])').forEach(el => {
            el.dataset.anim = '';
            gsap.set(el, { y: 50, autoAlpha: 0 });
            revealOnEnter(el, el, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out' }, 'top 92%');
        });
    }

    // Projects, GitHub and LeetCode arrive after load
    document.addEventListener('content:rendered', e => {
        const scope = e.detail.root || document;
        applyRoll(scope);
        applyMagnetic(scope);
        applyReveals(scope);
        if (scope.id === 'works') bindWorksCounter();
        if (animate) ScrollTrigger.refresh();
    });

    /*=============== HERO INTRO (after the preloader) ===============*/
    const heroChars = document.querySelectorAll('.hero-name .ch');
    const heroWords = document.querySelectorAll('.hero-intro .wi');
    const heroFades = document.querySelectorAll('.hero-fade, .site-header > *');
    const heroMedia = document.querySelector('.hero-media');

    if (animate) {
        gsap.set(heroChars, { yPercent: 110, fontWeight: 200 });
        gsap.set(heroWords, { yPercent: 110 });
        gsap.set(heroFades, { autoAlpha: 0, y: 16 });
        if (heroMedia) gsap.set(heroMedia, { clipPath: 'inset(100% 0% 0% 0%)' });
    }

    function heroIntro() {
        if (!animate) return;
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl.to(heroChars, { yPercent: 0, duration: 1.4, stagger: 0.05 }, 0)
          .to(heroChars, { fontWeight: 600, duration: 1.6, ease: 'power2.out', stagger: 0.05, clearProps: 'fontWeight' }, 0.2)
          .to(heroMedia, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' }, 0.2)
          .to(heroWords, { yPercent: 0, duration: 1.1, stagger: 0.015 }, 0.5)
          .to(heroFades, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.06 }, 0.6);
    }

    /*=============== PRELOADER ===============*/
    const loader = document.getElementById('loader');
    const loaderCount = document.getElementById('loader-count');
    let finished = false;

    function finishLoading() {
        if (finished) return;
        finished = true;
        if (loader) loader.classList.add('is-done');
        if (lenis) lenis.start();
        setTimeout(heroIntro, 350);
        setTimeout(() => loader && loader.remove(), 1400);
    }

    if (loader && loaderCount && !reduceMotion) {
        const duration = 1500;
        const t0 = performance.now();
        const tick = now => {
            const p = Math.min((now - t0) / duration, 1);
            loaderCount.textContent = Math.round((1 - Math.pow(1 - p, 3)) * 100);
            if (p < 1) requestAnimationFrame(tick);
            else setTimeout(finishLoading, 150);
        };
        requestAnimationFrame(tick);
    } else {
        finishLoading();
    }
    setTimeout(finishLoading, 4000); // failsafe if rAF is throttled

    /*=============== SCROLL EFFECTS ===============*/
    applyReveals(document);
    if (!animate) return;

    // Hero shrinks and dims as the first panel slides over it
    gsap.to('.hero-inner', {
        scale: 0.9,
        autoAlpha: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: '.panels', start: 'top bottom', end: 'top top', scrub: true }
    });

    // About words drift sideways for a bit of depth (wide screens only,
    // where there's room to move without clipping)
    if (window.innerWidth > 900) gsap.utils.toArray('.about-words > span').forEach((el, i) => {
        gsap.fromTo(el, { xPercent: i === 1 ? 8 : -8 }, {
            xPercent: i === 1 ? -8 : 8,
            ease: 'none',
            scrollTrigger: { trigger: '.about-words', start: 'top bottom', end: 'bottom top', scrub: true }
        });
    });

    // Footer name rises as it's revealed
    gsap.from('.foot-name', {
        yPercent: 60,
        ease: 'none',
        scrollTrigger: { trigger: '.site-footer', start: 'top bottom', end: 'bottom bottom', scrub: true }
    });

    window.addEventListener('load', () => ScrollTrigger.refresh());
});
