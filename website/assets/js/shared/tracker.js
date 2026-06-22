/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — B2B Lead Scoring & Event Tracker
   ════════════════════════════════════════════════════════════════ */

import { appState } from '../core/app.state.js';
import { appConfig } from '../core/app.config.js';

export const tracker = {
  init() {
    this.bindStaticClickTrackers();
  },

  trackEvent(category, action, label = '', scoreValue = 0) {
    console.log(`[B2B-TRACKER] Event: ${category} | Action: ${action} | Label: ${label} | Score Added: ${scoreValue}`);
    
    // Update local state scores
    appState.incrementLeadScore(scoreValue);
    
    // Check if score crosses Hot Lead trigger threshold
    const currentScore = appState.getLeadScore();
    if (currentScore >= appConfig.leadScoringThresholds.hotLead && appState.getUserPersona() !== 'hot-lead') {
      appState.setUserPersona('hot-lead');
      this.triggerLeadPromotion();
    }
  },

  triggerLeadPromotion() {
    console.log('[B2B-TRACKER] Lead promoted to HOT. Displaying prioritized Quote Engine modal.');
    const modal = document.querySelector('#b2bQuoteModal');
    if (modal) {
      modal.classList.add('active');
    }
  },

  bindStaticClickTrackers() {
    // 1. Zalo tracking
    document.querySelectorAll('[href*="zalo.me"]').forEach(el => {
      el.addEventListener('click', () => {
        this.trackEvent('Conversion', 'Click Zalo Chat', 'Support Chat', 10);
      });
    });

    // 2. Direct Call tracking
    document.querySelectorAll('[href^="tel:"]').forEach(el => {
      el.addEventListener('click', () => {
        this.trackEvent('Conversion', 'Direct Call', 'Hotline Phone', 10);
      });
    });

    // 3. Document / Profile downloads
    document.querySelectorAll('.download-profile-btn').forEach(el => {
      el.addEventListener('click', () => {
        this.trackEvent('Engagement', 'Download Profile', 'B2B Capacity Deck', 15);
      });
    });
  }
};
