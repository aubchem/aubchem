/**
 * hero.js
 * Parallax effects and count-up animations for the hero section
 */

function initHero() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image-wrap');
    const stats = document.querySelectorAll('.stat-value');
    
    if (!hero) return;

    // 1. Scroll Parallax
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
            const val = scrolled * 0.4;
            heroContent.style.transform = `translateY(${-val}px)`;
            heroImage.style.transform = `translateY(${-val * 0.6}px) scale(${1 - scrolled/2000})`;
            heroContent.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
        }
    });

    // 2. CountUp Animation
    const observerOptions = {
        threshold: 0.5
    };

    const countUpObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.getAttribute('data-target'));
                animateCount(target, endValue);
                countUpObserver.unobserve(target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => countUpObserver.observe(stat));

    function animateCount(el, endValue) {
        let startValue = 0;
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quad
            const easeProgress = progress * (2 - progress);
            const currentCount = Math.floor(easeProgress * endValue);
            
            el.textContent = currentCount + (el.textContent.includes('+') ? '+' : '');
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = endValue + (el.getAttribute('data-suffix') || '');
            }
        }
        requestAnimationFrame(update);
    }
}

document.addEventListener('DOMContentLoaded', initHero);
