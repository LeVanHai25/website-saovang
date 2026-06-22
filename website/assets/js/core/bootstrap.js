/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — Enterprise Application Bootstrapper (ES6 Entry Point)
   ════════════════════════════════════════════════════════════════ */

import { appState } from './app.state.js';
import { i18n } from '../shared/i18n.js';
import { scrollObserver } from '../shared/observer.js';
import { statsCounter } from '../shared/counter.js';
import { projectTabs } from '../shared/tabs.js';
import { tracker } from '../shared/tracker.js';
import { quoteEngine } from '../shared/quote-engine.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Bootstrapping Sao Vang Enterprise Industrial Portal...');

  // 1. Initialize Localization Dictionary
  await i18n.init();

  // 2. Initialize dynamic projects rendering
  await projectTabs.init('#projectsGrid');
  // Share project tab instance globally for language translations to trigger re-renders
  window.projectTabRenderer = projectTabs;

  // 3. Register Scroll Reveal Callbacks & Trigger Observer
  scrollObserver.registerCallback('counterAnimation', (el) => {
    statsCounter.animate(el);
  });

  scrollObserver.registerCallback('timelineAnimation', () => {
    // Animate the progress line on timeline trigger
    const activeLine = document.querySelector('.process-line-active');
    if (activeLine) {
      if (window.innerWidth < 1024) {
        activeLine.style.height = '100%';
      } else {
        activeLine.style.width = '90%';
      }
    }
    
    // Highlight step nodes one by one
    const nodes = document.querySelectorAll('.process-step-node');
    nodes.forEach((node, index) => {
      setTimeout(() => {
        node.classList.add('active');
      }, index * 200);
    });
  });

  scrollObserver.init();
  // Share scroll reveal observer globally
  window.scrollRevealObserver = scrollObserver;

  // 4. Initialize B2B Tracker and Quote Engines
  tracker.init();
  quoteEngine.init('#homeQuoteForm');
  quoteEngine.init('#modalQuoteForm'); // For the B2B pop-up modal

  // 5. Header State & Mobile Sticky CTA visibility on scroll
  const header = document.querySelector('#header');
  const stickyCta = document.querySelector('#mobileStickyCta');
  
  const handleScroll = () => {
    const scrollY = window.scrollY;
    
    // Header scrolled state
    if (header) {
      header.classList.toggle('scrolled', scrollY > 50);
    }
    
    // Mobile sticky CTA visibility threshold
    if (stickyCta) {
      stickyCta.classList.toggle('visible', scrollY > 400);
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run immediately on load in case page was refreshed halfway down

  // 6. Hamburger Menu Drawer Navigation (Mobile)
  const hamburger = document.querySelector('#hamburger');
  const nav = document.querySelector('#navMenu');
  const backdrop = document.querySelector('#navBackdrop');

  const openNav = () => {
    nav?.classList.add('open');
    hamburger?.classList.add('open');
    backdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeNav = () => {
    nav?.classList.remove('open');
    hamburger?.classList.remove('open');
    backdrop?.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      nav?.classList.contains('open') ? closeNav() : openNav();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeNav);
  }

  // Close nav on click outside or links click
  document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', (e) => {
      const dropdownParent = link.closest('.nav-dropdown');
      if (dropdownParent && window.innerWidth < 1024) {
        // Mobile dropdown toggle logic
        if (!dropdownParent.classList.contains('active')) {
          e.preventDefault();
          // Close other dropdowns
          document.querySelectorAll('.nav-dropdown').forEach(d => {
            if (d !== dropdownParent) d.classList.remove('active');
          });
          dropdownParent.classList.add('active');
        } else {
          // If already open, let the click proceed to link.href
          closeNav();
        }
      } else {
        // Regular nav item click
        closeNav();
      }
    });
  });

  // Close nav on sub-link click
  document.querySelectorAll('.dropdown-item').forEach(subLink => {
    subLink.addEventListener('click', closeNav);
  });

  // Handle split hero click/hover redirection & persona alignment
  const heroMech = document.querySelector('#heroSideMech');
  const heroFac = document.querySelector('#heroSideFac');

  if (heroMech) {
    heroMech.addEventListener('click', (e) => {
      // Avoid firing redirect on button clicks if they contain links
      if (e.target.closest('a')) return;
      tracker.trackEvent('Navigation', 'Click Mechanical Hero Segment', 'Mechanical Segment', 5);
      appState.setUserPersona('mechanical-investor');
      window.location.href = 'linh-vuc-co-khi.html';
    });
  }

  if (heroFac) {
    heroFac.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      tracker.trackEvent('Navigation', 'Click Facade Hero Segment', 'Facade Segment', 5);
      appState.setUserPersona('facade-investor');
      window.location.href = 'linh-vuc-nhom-kinh.html';
    });
  }
});
