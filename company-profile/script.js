/**
 * MERIDIAN Group — Company Profile 2026
 * Interactive Navigation, Animations & PDF Export
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initPageIndicator();
    initPrintButton();
    initKPIAnimations();
    initMetricBars();
    initSmoothScroll();
});

/* ═══════════════════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════════════════ */

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    // Intersection Observer for active nav state
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const pageNum = entry.target.dataset.page;
                updateActiveNav(pageNum);
                updatePageIndicator(pageNum);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-10% 0px -10% 0px'
    });

    pages.forEach(page => observer.observe(page));

    // Click navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function updateActiveNav(pageNum) {
    const navItems = document.querySelectorAll('.nav-item');
    let closestItem = null;
    let closestDiff = Infinity;

    navItems.forEach(item => {
        item.classList.remove('active');
        const itemPage = parseInt(item.dataset.page);
        const currentPage = parseInt(pageNum);
        if (itemPage <= currentPage && (currentPage - itemPage) < closestDiff) {
            closestDiff = currentPage - itemPage;
            closestItem = item;
        }
    });

    if (closestItem) {
        closestItem.classList.add('active');
    }
}

/* ═══════════════════════════════════════════════════════════════
   PAGE INDICATOR
   ═══════════════════════════════════════════════════════════════ */

function initPageIndicator() {
    // Already handled by navigation intersection observer
}

function updatePageIndicator(pageNum) {
    const indicator = document.getElementById('page-indicator');
    if (indicator) {
        const currentEl = indicator.querySelector('.page-current');
        if (currentEl) {
            currentEl.textContent = String(pageNum).padStart(2, '0');
        }
    }
}

/* ═══════════════════════════════════════════════════════════════
   SCROLL ANIMATIONS
   ═══════════════════════════════════════════════════════════════ */

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Don't unobserve — allow re-triggering feels better for this type of doc
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════════════
   KPI COUNTER ANIMATIONS
   ═══════════════════════════════════════════════════════════════ */

function initKPIAnimations() {
    const kpiNumbers = document.querySelectorAll('.kpi-number[data-target]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                animateCounter(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    kpiNumbers.forEach(el => observer.observe(el));
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/* ═══════════════════════════════════════════════════════════════
   METRIC BARS ANIMATION
   ═══════════════════════════════════════════════════════════════ */

function initMetricBars() {
    const metricFills = document.querySelectorAll('.metric-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const targetWidth = el.style.width;
                el.style.width = '0%';
                // Trigger reflow
                el.offsetHeight;
                requestAnimationFrame(() => {
                    el.style.width = targetWidth;
                    el.classList.add('animated');
                });
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.3 });

    metricFills.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════════════
   SMOOTH SCROLL
   ═══════════════════════════════════════════════════════════════ */

function initSmoothScroll() {
    // Enable smooth scrolling on the document
    document.documentElement.style.scrollBehavior = 'smooth';
}

/* ═══════════════════════════════════════════════════════════════
   PRINT / PDF EXPORT
   ═══════════════════════════════════════════════════════════════ */

function initPrintButton() {
    const btn = document.getElementById('btn-print');
    if (btn) {
        btn.addEventListener('click', () => {
            // Make all animations visible before printing
            document.querySelectorAll('.fade-in, .slide-up').forEach(el => {
                el.classList.add('is-visible');
            });

            // Set all metric bars to their target widths
            document.querySelectorAll('.metric-fill').forEach(el => {
                el.classList.add('animated');
            });

            // Short delay to ensure styles are applied
            setTimeout(() => {
                window.print();
            }, 300);
        });
    }
}

/* ═══════════════════════════════════════════════════════════════
   KEYBOARD NAVIGATION
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('keydown', (e) => {
    const pages = document.querySelectorAll('.page');
    const currentPage = getCurrentPage();

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const nextPage = document.querySelector(`[data-page="${currentPage + 1}"]`);
        if (nextPage) {
            nextPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prevPage = document.querySelector(`[data-page="${currentPage - 1}"]`);
        if (prevPage) {
            prevPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    if (e.key === 'Home') {
        e.preventDefault();
        document.querySelector('#page-01').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (e.key === 'End') {
        e.preventDefault();
        document.querySelector('#page-32').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

function getCurrentPage() {
    const pages = document.querySelectorAll('.page');
    let current = 1;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;

    pages.forEach(page => {
        const rect = page.getBoundingClientRect();
        if (rect.top <= windowHeight * 0.4) {
            current = parseInt(page.dataset.page);
        }
    });

    return current;
}

/* ═══════════════════════════════════════════════════════════════
   NAV SIDEBAR TOGGLE (Mobile)
   ═══════════════════════════════════════════════════════════════ */

// Auto-hide nav on scroll down, show on scroll up
let lastScrollY = 0;
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const nav = document.getElementById('nav-sidebar');
            const indicator = document.getElementById('page-indicator');
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                // Scrolling down
                if (nav) nav.classList.add('nav-hidden');
                if (indicator) indicator.classList.add('indicator-hidden');
            } else {
                // Scrolling up
                if (nav) nav.classList.remove('nav-hidden');
                if (indicator) indicator.classList.remove('indicator-hidden');
            }

            lastScrollY = currentScrollY;
            ticking = false;
        });
        ticking = true;
    }
});
