'use client';

import { useEffect } from 'react';

const TOTAL_PAGES = 32;

function getCurrentPage(): number {
  let current = 1;
  for (let i = 1; i <= TOTAL_PAGES; i++) {
    const el = document.querySelector(`[data-page="${i}"]`);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.4) current = i;
  }
  return current;
}

function scrollToPage(num: number) {
  const el = document.querySelector(`[data-page="${num}"]`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function useKeyboardNavigation() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const current = getCurrentPage();
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToPage(Math.min(current + 1, TOTAL_PAGES));
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToPage(Math.max(current - 1, 1));
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToPage(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollToPage(TOTAL_PAGES);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);
}
