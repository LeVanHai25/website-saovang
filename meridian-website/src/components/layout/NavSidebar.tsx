'use client';

import { useEffect, useRef, useState } from 'react';

const NAV_ITEMS = [
  { page: 1,  href: '#page-01', label: 'Cover' },
  { page: 2,  href: '#page-02', label: 'Summary' },
  { page: 3,  href: '#page-03', label: 'About' },
  { page: 4,  href: '#page-04', label: 'Journey' },
  { page: 6,  href: '#page-06', label: 'Vision' },
  { page: 7,  href: '#page-07', label: 'Organization' },
  { page: 9,  href: '#page-09', label: 'Capabilities' },
  { page: 14, href: '#page-14', label: 'Services' },
  { page: 19, href: '#page-19', label: 'Projects' },
  { page: 27, href: '#page-27', label: 'Clients' },
  { page: 29, href: '#page-29', label: 'Credentials' },
  { page: 30, href: '#page-30', label: 'Why Us' },
  { page: 31, href: '#page-31', label: 'Contact' },
];

interface NavSidebarProps {
  currentPage: number;
  onPrint: () => void;
}

export default function NavSidebar({ currentPage, onPrint }: NavSidebarProps) {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastScrollY.current && y > 200);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getActiveItem = () => {
    let closest = NAV_ITEMS[0];
    let minDiff = Infinity;
    for (const item of NAV_ITEMS) {
      const diff = currentPage - item.page;
      if (diff >= 0 && diff < minDiff) {
        minDiff = diff;
        closest = item;
      }
    }
    return closest;
  };

  const activeItem = getActiveItem();

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      className="nav-sidebar"
      style={{ opacity: hidden ? 0 : 1, pointerEvents: hidden ? 'none' : 'auto',
               transform: hidden ? 'translateX(-8px)' : 'translateX(0)',
               transition: 'opacity 400ms, transform 400ms' }}
    >
      {/* Logo mark */}
      <div className="nav-logo">
        <svg viewBox="0 0 40 40" width="32" height="32">
          <polygon points="20,2 38,20 20,38 2,20" fill="none" stroke="currentColor" strokeWidth="2"/>
          <polygon points="20,10 30,20 20,30 10,20" fill="currentColor" opacity="0.3"/>
          <line x1="20" y1="2" x2="20" y2="38" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
          <line x1="2" y1="20" x2="38" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
        </svg>
      </div>

      {/* Nav items */}
      <div className="nav-items">
        {NAV_ITEMS.map((item) => {
          const isActive = item.page === activeItem.page;
          return (
            <button
              key={item.page}
              className={`nav-item${isActive ? ' active' : ''}`}
              onClick={() => scrollTo(item.href)}
              title={item.label}
            >
              <span className="nav-dot" />
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Print button */}
      <div className="nav-footer">
        <button className="nav-btn" onClick={onPrint} title="Export PDF">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
        </button>
      </div>
    </nav>
  );
}
