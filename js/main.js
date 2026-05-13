/**
 * main.js
 * Core application logic: Nav, Mobile Menu, Transitions, Filter/Search
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initPageTransitions();
    initCopyCitation();
    initPublicationFilter();
});

// 1. Navbar Scroll Behavior
function initNavbar() {
    const nav = document.querySelector('.navbar');
    const links = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;

    function checkScroll() {
        if (window.scrollY > 50 || document.body.classList.contains('print-mode') === false && !window.location.pathname.endsWith('index.html')) {
            nav.classList.add('scrolled');
        } else {
            // Only remove on index.html at top
            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                 if (window.scrollY <= 50) nav.classList.remove('scrolled');
            }
        }
    }

    window.addEventListener('scroll', checkScroll);
    checkScroll();

    // Set active link
    links.forEach(link => {
        const href = link.getAttribute('href');
        const isIndex = currentPath.endsWith('index.html') || currentPath.endsWith('/');
        
        if (isIndex && (href === 'index.html' || href === '../index.html')) {
            link.classList.add('active');
        } else if (!isIndex && currentPath.includes(href.replace('../', ''))) {
            link.classList.add('active');
        }
    });
}

// 2. Mobile Menu
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (!toggle) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        mobileNav.classList.toggle('open');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            mobileNav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// 3. Page Transitions
function initPageTransitions() {
    const transitionOverlay = document.createElement('div');
    transitionOverlay.id = 'page-transition';
    document.body.appendChild(transitionOverlay);

    const links = document.querySelectorAll('a[href$=".html"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Ignore external links or anchor links
            if (href.startsWith('http') || href.startsWith('#')) return;

            e.preventDefault();
            transitionOverlay.classList.add('active');
            
            setTimeout(() => {
                window.location.href = href;
            }, 250);
        });
    });

    // Handle back/forward cache
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            transitionOverlay.classList.remove('active');
        }
    });
}

// 4. Citation Copy to Clipboard
function initCopyCitation() {
    const citeButtons = document.querySelectorAll('.pub-btn-cite');
    
    citeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.closest('.pub-card').querySelector('.pub-title').innerText;
            const journal = btn.closest('.pub-card').querySelector('.pub-journal').innerText;
            const dummyBib = `@article{aejaz${Math.floor(Math.random()*1000)},\n  title={${title}},\n  author={Bashir, Aejaz Ul and others},\n  journal={${journal}},\n  year={2023}\n}`;
            
            navigator.clipboard.writeText(dummyBib).then(() => {
                showToast('Citation copied to clipboard!');
            });
        });
    });
}

// 5. Publication Filter & Search
function initPublicationFilter() {
    const searchInput = document.getElementById('pub-search');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const pubCards = document.querySelectorAll('.pub-card');
    const countBadge = document.getElementById('pub-count');

    if (!searchInput) return;

    function filter() {
        const query = searchInput.value.toLowerCase();
        const activeYear = document.querySelector('.filter-btn.active').getAttribute('data-year');
        let visibleCount = 0;

        pubCards.forEach(card => {
            const title = card.querySelector('.pub-title').innerText.toLowerCase();
            const journal = card.querySelector('.pub-journal').innerText.toLowerCase();
            const year = card.getAttribute('data-year');
            
            const matchesQuery = title.includes(query) || journal.includes(query);
            const matchesYear = activeYear === 'all' || year === activeYear;

            if (matchesQuery && matchesYear) {
                card.style.display = 'grid';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (countBadge) countBadge.textContent = visibleCount;
    }

    searchInput.addEventListener('input', filter);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filter();
        });
    });
}

// Toast Notification System
function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
