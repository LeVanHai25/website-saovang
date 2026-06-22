/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — Application State Manager
   ════════════════════════════════════════════════════════════════ */

import { appConfig } from './app.config.js';

class AppStateManager {
  constructor() {
    this.state = {
      lang: this.detectLanguage(),
      persona: localStorage.getItem('sv_user_persona') || 'unknown',
      leadScore: parseInt(localStorage.getItem('sv_lead_score') || '0', 10),
      currentCategory: 'mechanical'
    };
    this.listeners = [];
  }

  detectLanguage() {
    const savedLang = localStorage.getItem('sv_lang');
    if (savedLang && appConfig.supportedLocales.includes(savedLang)) {
      return savedLang;
    }
    const browserLang = navigator.language.slice(0, 2);
    if (appConfig.supportedLocales.includes(browserLang)) {
      return browserLang;
    }
    return appConfig.defaultLocale;
  }

  getCurrentLanguage() {
    return this.state.lang;
  }

  setLanguage(lang) {
    if (appConfig.supportedLocales.includes(lang)) {
      this.state.lang = lang;
      localStorage.setItem('sv_lang', lang);
      this.notifyListeners('lang', lang);
    }
  }

  getUserPersona() {
    return this.state.persona;
  }

  setUserPersona(persona) {
    this.state.persona = persona;
    localStorage.setItem('sv_user_persona', persona);
    this.notifyListeners('persona', persona);
  }

  getLeadScore() {
    return this.state.leadScore;
  }

  incrementLeadScore(value) {
    this.state.leadScore += value;
    localStorage.setItem('sv_lead_score', this.state.leadScore);
    this.notifyListeners('leadScore', this.state.leadScore);
  }

  getCurrentCategory() {
    return this.state.currentCategory;
  }

  setCurrentCategory(category) {
    this.state.currentCategory = category;
    this.notifyListeners('category', category);
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyListeners(key, value) {
    this.listeners.forEach(listener => listener(key, value));
  }
}

export const appState = new AppStateManager();
