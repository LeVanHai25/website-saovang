'use client';

import { useEffect, useState } from 'react';
import NavSidebar from '@/components/layout/NavSidebar';
import PageIndicator from '@/components/layout/PageIndicator';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

const TOTAL_PAGES = 32;

interface DocumentShellProps {
  children: React.ReactNode;
}

export default function DocumentShell({ children }: DocumentShellProps) {
  const [currentPage, setCurrentPage] = useState(1);

  useKeyboardNavigation();

  // Track current page via IntersectionObserver
  useEffect(() => {
    const pages = document.querySelectorAll<HTMLElement>('.page[data-page]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const num = parseInt((entry.target as HTMLElement).dataset.page ?? '1', 10);
            setCurrentPage(num);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-10% 0px -10% 0px' }
    );
    pages.forEach((p) => observer.observe(p));
    return () => observer.disconnect();
  }, []);

  const handlePrint = () => {
    // Make all animation elements visible before printing
    document.querySelectorAll<HTMLElement>('.fade-in, .slide-up').forEach((el) => {
      el.classList.add('is-visible');
    });
    document.querySelectorAll<HTMLElement>('.metric-fill').forEach((el) => {
      el.classList.add('animated');
    });
    setTimeout(() => window.print(), 300);
  };

  return (
    <>
      <NavSidebar currentPage={currentPage} onPrint={handlePrint} />
      <PageIndicator currentPage={currentPage} totalPages={TOTAL_PAGES} />
      <main className="document" id="document">
        {children}
      </main>
    </>
  );
}
