/* ═══════════════════════════════════════════════════════════════
   faq-accordion.js  — Shared FAQ Accordion Module v1.0

   Kiến trúc:
   - Progressive Enhancement: hoạt động không cần JS cho accessibility
   - Accordion Pattern: chỉ 1 item mở cùng lúc
   - Smooth height animation bằng CSS max-height transition
   - Keyboard navigation (Enter, Space, Arrow keys) theo WCAG 2.2
   - Auto-init với selector [data-faq-group]
═══════════════════════════════════════════════════════════════ */

(function FAQAccordion() {
  'use strict';

  const SELECTORS = {
    group    : '[data-faq-group]',
    item     : '.faq-item',
    trigger  : '.faq-question',
    answer   : '.faq-answer',
    iconOpen : 'ri-add-circle-line',
    iconClose: 'ri-subtract-line',
  };

  /* ── Mở một item ─────────────────────────────────────────── */
  function openItem(item) {
    const trigger = item.querySelector(SELECTORS.trigger);
    const answer  = item.querySelector(SELECTORS.answer);
    if (!trigger || !answer) return;

    item.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');

    // Smooth height animation
    answer.style.maxHeight = answer.scrollHeight + 'px';

    // Đổi icon
    const icon = trigger.querySelector('i');
    if (icon) {
      icon.classList.remove(SELECTORS.iconOpen);
      icon.classList.add(SELECTORS.iconClose);
    }
  }

  /* ── Đóng một item ───────────────────────────────────────── */
  function closeItem(item) {
    const trigger = item.querySelector(SELECTORS.trigger);
    const answer  = item.querySelector(SELECTORS.answer);
    if (!trigger || !answer) return;

    item.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    answer.style.maxHeight = '0';

    // Restore icon
    const icon = trigger.querySelector('i');
    if (icon) {
      icon.classList.remove(SELECTORS.iconClose);
      icon.classList.add(SELECTORS.iconOpen);
    }
  }

  /* ── Toggle item ─────────────────────────────────────────── */
  function toggleItem(item, group) {
    const isOpen = item.classList.contains('is-open');

    // Đóng tất cả items trong cùng group
    group.querySelectorAll(SELECTORS.item).forEach(other => {
      if (other !== item) closeItem(other);
    });

    // Toggle item hiện tại
    if (isOpen) {
      closeItem(item);
    } else {
      openItem(item);
    }
  }

  /* ── Keyboard navigation ─────────────────────────────────── */
  function handleKeydown(e, item, group) {
    const items = [...group.querySelectorAll(SELECTORS.item)];
    const idx   = items.indexOf(item);

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        toggleItem(item, group);
        break;
      case 'ArrowDown':
        e.preventDefault();
        const next = items[idx + 1];
        if (next) next.querySelector(SELECTORS.trigger)?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prev = items[idx - 1];
        if (prev) prev.querySelector(SELECTORS.trigger)?.focus();
        break;
      case 'Home':
        e.preventDefault();
        items[0]?.querySelector(SELECTORS.trigger)?.focus();
        break;
      case 'End':
        e.preventDefault();
        items[items.length - 1]?.querySelector(SELECTORS.trigger)?.focus();
        break;
    }
  }

  /* ── Khởi tạo một group ──────────────────────────────────── */
  function initGroup(group) {
    if (group._faqBound) return; // Idempotent
    group._faqBound = true;

    const items = group.querySelectorAll(SELECTORS.item);

    items.forEach((item, idx) => {
      const trigger = item.querySelector(SELECTORS.trigger);
      const answer  = item.querySelector(SELECTORS.answer);
      if (!trigger || !answer) return;

      // ARIA attributes
      const answerId   = `faq-answer-${group.dataset.faqGroup || 'g'}-${idx}`;
      answer.id        = answerId;
      answer.setAttribute('role', 'region');
      trigger.setAttribute('aria-controls', answerId);
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('tabindex', '0');

      // Khởi tạo trạng thái đóng
      answer.style.maxHeight    = '0';
      answer.style.overflow     = 'hidden';
      answer.style.transition   = 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)';

      // Click event
      trigger.addEventListener('click', () => toggleItem(item, group));

      // Keyboard event
      trigger.addEventListener('keydown', (e) => handleKeydown(e, item, group));
    });

    // Mở item đầu tiên nếu có thuộc tính data-faq-open-first
    if (group.hasAttribute('data-faq-open-first') && items.length > 0) {
      openItem(items[0]);
    }
  }

  /* ── Khởi tạo tất cả groups ──────────────────────────────── */
  function init() {
    document.querySelectorAll(SELECTORS.group).forEach(initGroup);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  window.SV = window.SV || {};
  window.SV.FAQAccordion = { init, openItem, closeItem };

})();
