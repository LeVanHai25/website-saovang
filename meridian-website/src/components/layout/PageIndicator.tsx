'use client';

interface PageIndicatorProps {
  currentPage: number;
  totalPages: number;
}

export default function PageIndicator({ currentPage, totalPages }: PageIndicatorProps) {
  return (
    <div className="page-indicator" id="page-indicator">
      <span className="page-current">{String(currentPage).padStart(2, '0')}</span>
      <span className="page-divider">/</span>
      <span className="page-total">{String(totalPages).padStart(2, '0')}</span>
    </div>
  );
}
