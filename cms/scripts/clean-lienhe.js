/**
 * Clean-rewrite <style> block in lien-he.html
 * Removes all duplicate/old CSS, keeps only the correct version
 */
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../../website/lien-he.html');
let html = fs.readFileSync(filePath, 'utf8');

// Extract everything before <style> and after </style>
const styleStart = html.indexOf('<style>');
const styleEnd   = html.indexOf('</style>') + '</style>'.length;
const before = html.slice(0, styleStart);
const after  = html.slice(styleEnd);

const CLEAN_STYLE = `<style>
  /* ══ RESPONSE STRIP ══════════════════════════════════════════ */
  .response-strip {
    background: var(--red); color: var(--white);
    display: flex; align-items: center; justify-content: center;
    gap: clamp(16px, 4vw, 48px); flex-wrap: wrap;
    padding: clamp(12px, 2.5vw, 18px) clamp(16px, 4vw, 40px);
  }
  .response-item {
    display: flex; align-items: center; gap: 8px;
    font-family: var(--ff-head); font-size: clamp(11px, 1.5vw, 13px);
    font-weight: 600; letter-spacing: .04em; white-space: nowrap;
  }

  /* ══ CONTACT LAYOUT ══════════════════════════════════════════ */
  .contact-layout {
    display: grid; grid-template-columns: 1fr;
    gap: clamp(32px, 5vw, 64px); align-items: start;
  }

  /* Info block */
  .contact-info-block h2 {
    font-family: var(--ff-head); font-size: var(--fs-h2);
    font-weight: 900; color: var(--dark); line-height: 1.2;
    margin-bottom: var(--sp-4); margin-top: var(--sp-3);
  }
  .contact-info-block > p {
    font-size: var(--fs-body-lg); color: var(--gray-500);
    line-height: 1.8; font-weight: 300; margin-bottom: var(--sp-6);
  }
  .info-card {
    display: flex; align-items: flex-start;
    gap: var(--sp-4); padding: clamp(14px, 2.5vw, 20px);
    border: 1px solid var(--gray-200); border-radius: var(--radius-md);
    margin-bottom: var(--sp-3); background: var(--white);
    transition: box-shadow .2s;
  }
  .info-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.07); }
  .info-icon {
    width: 46px; height: 46px; min-width: 46px;
    border-radius: var(--radius); background: rgba(139,0,0,.07);
    display: flex; align-items: center; justify-content: center;
    color: var(--red);
  }
  .info-icon.gold-icon { background: rgba(200,134,10,.1); color: var(--gold-a11y); }
  .info-text strong {
    display: block; font-family: var(--ff-head); font-size: 11px;
    font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
    color: var(--gray-500); margin-bottom: 4px;
  }
  .info-text a, .info-text span {
    font-size: var(--fs-body-lg); color: var(--dark);
    font-weight: 600; line-height: 1.5;
  }
  .info-text a:hover { color: var(--gold-a11y); }

  /* Working hours */
  .working-hours {
    background: var(--dark); border-radius: var(--radius-md);
    padding: clamp(16px, 3vw, 24px); margin-top: var(--sp-5);
  }
  .working-hours h4 {
    font-family: var(--ff-head); font-size: 11px; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase;
    color: var(--gold-light); margin-bottom: var(--sp-4);
  }
  .hour-row {
    display: flex; align-items: center; gap: var(--sp-3);
    padding: var(--sp-2) 0; border-bottom: 1px solid rgba(255,255,255,.07);
    font-size: var(--fs-sm); color: rgba(255,255,255,.8);
  }
  .hour-row .day  { flex: 1; }
  .hour-row .time { font-weight: 600; color: var(--white); }
  .hour-row .open {
    font-family: var(--ff-head); font-size: 10px; font-weight: 700;
    letter-spacing: .06em; color: #4ade80;
    background: rgba(74,222,128,.12); padding: 2px 8px; border-radius: 20px;
  }

  /* Form block */
  .contact-form-block {
    background: var(--white); border: 1px solid var(--gray-200);
    border-radius: var(--radius-md);
    padding: clamp(24px, 4vw, 44px) clamp(20px, 4vw, 40px);
    box-shadow: 0 4px 32px rgba(0,0,0,.05);
  }
  .contact-form-block h3 {
    font-family: var(--ff-head); font-size: var(--fs-h3);
    font-weight: 800; color: var(--dark); margin-bottom: var(--sp-2);
  }
  .contact-form-block > p {
    font-size: var(--fs-body); color: var(--gray-500); margin-bottom: var(--sp-6);
  }
  .form-row {
    display: grid; grid-template-columns: 1fr;
    gap: var(--sp-4); margin-bottom: var(--sp-4);
  }
  .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: var(--sp-4); }
  .form-group:last-child { margin-bottom: 0; }
  .form-group label {
    font-family: var(--ff-head); font-size: 11px; font-weight: 700;
    letter-spacing: .06em; text-transform: uppercase; color: var(--gray-600);
  }
  .form-group.required label::after { content: ' *'; color: var(--red); }
  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 12px 16px;
    border: 1.5px solid var(--gray-200); border-radius: var(--radius);
    font-family: var(--ff-body); font-size: var(--fs-body);
    color: var(--dark); background: var(--gray-50);
    transition: border-color .2s, box-shadow .2s;
    min-height: 44px; width: 100%;
    -webkit-appearance: none; appearance: none;
  }
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none; border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(200,134,10,.1); background: var(--white);
  }
  .form-group textarea { min-height: 130px; resize: vertical; }
  .form-group select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center;
    background-size: 16px; padding-right: 40px;
  }

  /* Map */
  .map-section {
    height: clamp(240px, 40vw, 480px); overflow: hidden;
    background: var(--gray-100);
  }
  .map-section iframe { width: 100%; height: 100%; border: 0; display: block; }

  /* ══ RESPONSIVE ══════════════════════════════════════════════ */
  @media (min-width: 640px)  { .form-row { grid-template-columns: 1fr 1fr; } }
  @media (min-width: 1024px) { .contact-layout { grid-template-columns: 1fr 1.1fr; } }
  @media (min-width: 1280px) { .contact-layout { grid-template-columns: 420px 1fr; } }

  /* ── sticky-cta-bar ─────────────────────────────────────── */
  .sticky-cta-bar {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 890;
    display: flex; gap: 8px; align-items: center;
    background: #111; border-top: 1px solid rgba(255,255,255,.1);
    padding: 10px 16px;
    padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
    box-shadow: 0 -4px 24px rgba(0,0,0,.4);
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  .sticky-cta-bar .btn { flex: 1; justify-content: center; min-height: 40px; font-size: 12px; padding: 9px 12px; }
  @media (min-width: 1024px) { .sticky-cta-bar { display: none !important; } }

  /* ── prefers-reduced-motion ─────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
    [data-reveal] { opacity: 1 !important; transform: none !important; }
  }
</style>`;

html = before + CLEAN_STYLE + after;
fs.writeFileSync(filePath, html, 'utf8');
console.log('✓  lien-he.html style block cleaned. Lines:', html.split('\n').length);
