/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — Dynamic Project Tab Rendering Controller
   ════════════════════════════════════════════════════════════════ */

import { appState } from '../core/app.state.js';

export const projectTabs = {
  projectsData: [],
  container: null,

  async init(containerSelector = '#projectsGrid') {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    try {
      const response = await fetch('./data/projects.json');
      const data = await response.json();
      this.projectsData = data.projects;
      
      // Initial render based on default state category
      this.render(appState.getCurrentCategory());
    } catch (e) {
      console.error('Failed to load or parse projects.json', e);
      this.container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--red-brand);">Lỗi tải danh sách dự án.</p>`;
    }

    // Bind event listeners to tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const category = e.currentTarget.getAttribute('data-target');
        
        // Update UI active class
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        appState.setCurrentCategory(category);
        this.render(category);
      });
    });
  },

  render(category) {
    if (!this.container) return;
    
    // Add fade-out transition
    this.container.classList.add('fade-out');
    this.container.classList.remove('fade-in');

    setTimeout(() => {
      const filtered = this.projectsData.filter(p => p.sector === category);
      const activeLang = appState.getCurrentLanguage();

      if (filtered.length === 0) {
        this.container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--gray-500);">Chưa có dự án nào được cập nhật.</p>`;
      } else {
        this.container.innerHTML = filtered.map(proj => {
          const trans = proj.translations[activeLang] || proj.translations['vi'];
          return `
            <article class="card-project" data-reveal>
              <img src="${proj.image}" alt="${trans.title}" loading="lazy">
              <div class="card-project-overlay">
                <span class="card-project-tag">${proj.system.replace('-', ' ')}</span>
                <h3 class="card-project-title">${trans.title}</h3>
                <p class="card-project-desc">${trans.description}</p>
                <div class="card-project-metadata">
                  <span>📍 ${trans.location}</span>
                  <span>📏 ${trans.scale}</span>
                  <span style="color: var(--gold-metallic); font-weight: 700;">💰 ${trans.value}</span>
                </div>
              </div>
            </article>
          `;
        }).join('');
      }

      // Add fade-in transition
      this.container.classList.remove('fade-out');
      this.container.classList.add('fade-in');
      
      // Rescan scroll reveal items for newly rendered cards
      const observerModule = window.scrollRevealObserver;
      if (observerModule && typeof observerModule.scan === 'function') {
        observerModule.scan();
      }
    }, 300);
  }
};
