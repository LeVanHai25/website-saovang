/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — Client-side Localization & i18n Dictionary Engine
   ════════════════════════════════════════════════════════════════ */

import { appState } from '../core/app.state.js';

export const i18n = {
  dictionaries: {},

  async init() {
    // Load initial active language dictionary
    const currentLang = appState.getCurrentLanguage();
    await this.loadLanguage(currentLang);
    this.translatePage();

    // Bind event listeners to language switcher buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      // Set active visual state initially
      const targetLang = btn.getAttribute('data-lang');
      if (targetLang === currentLang) {
        btn.classList.add('active');
      }

      btn.addEventListener('click', async (e) => {
        const lang = e.currentTarget.getAttribute('data-lang');
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        appState.setLanguage(lang);
        await this.loadLanguage(lang);
        this.translatePage();
        
        // Re-render project tabs if present to pick up translation changes
        const projectsModule = window.projectTabRenderer;
        if (projectsModule && typeof projectsModule.render === 'function') {
          projectsModule.render(appState.getCurrentCategory());
        }
      });
    });
  },

  async loadLanguage(lang) {
    if (this.dictionaries[lang]) return this.dictionaries[lang];
    try {
      const response = await fetch(`./data/locales/${lang}.json`);
      this.dictionaries[lang] = await response.json();
      return this.dictionaries[lang];
    } catch (e) {
      console.error(`Failed to load translation dictionary: ${lang}`, e);
      return null;
    }
  },

  translatePage() {
    const lang = appState.getCurrentLanguage();
    const dict = this.dictionaries[lang];
    if (!dict) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = dict[key];
        } else {
          el.innerHTML = dict[key];
        }
      }
    });

    // Update document lang attribute for accessibility / SEO
    document.documentElement.setAttribute('lang', lang);
  }
};
