/**
 * animations.js
 * Scroll-triggered reveal animations using IntersectionObserver
 */

function initScrollAnimations() {
    const animationTargets = document.querySelectorAll('.anim-fade-up, .anim-fade-left, .anim-fade-right, .anim-scale-in, .anim-fade-in');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelinePath = document.querySelector('.timeline-path');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('anim-active');
                
                // If it's a timeline item, also trigger the path growth
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.classList.add('active');
                }
            }
        });
    }, observerOptions);

    animationTargets.forEach(target => revealObserver.observe(target));
    timelineItems.forEach(item => revealObserver.observe(item));

    // Timeline Path Growth Logic
    if (timelinePath) {
        window.addEventListener('scroll', () => {
            const timeline = document.querySelector('.timeline');
            if (!timeline) return;

            const rect = timeline.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            
            if (rect.top < viewHeight && rect.bottom > 0) {
                const progress = Math.max(0, Math.min(1, (viewHeight - rect.top) / (rect.height + viewHeight * 0.5)));
                timelinePath.style.height = `${progress * 100}%`;
            }
        });
    }

    // Stagger child animations
    const staggeredParents = document.querySelectorAll('.anim-stagger');
    staggeredParents.forEach(parent => {
        const children = parent.children;
        Array.from(children).forEach((child, index) => {
            child.style.transitionDelay = `${index * 80}ms`;
            // If parent enters view, ensure children also get the active class if they have anim- classes
            // Or we just observe them normally which we already do
        });
    });
}

document.addEventListener('DOMContentLoaded', initScrollAnimations);
