'use client';

import { useEffect, useRef } from 'react';

interface MetricBarProps {
  label: string;
  value: string;
  percentage: number;
  stagger?: number;
}

export default function MetricBar({ label, value, percentage, stagger = 0 }: MetricBarProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          el.style.width = '0%';
          requestAnimationFrame(() => {
            el.style.width = `${percentage}%`;
            el.classList.add('animated');
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [percentage]);

  return (
    <div className="metric-row slide-up" style={{ transitionDelay: `${stagger * 100}ms` }}>
      <span className="body-sm">{label}</span>
      <div className="metric-bar">
        <div className="metric-fill" ref={fillRef} style={{ width: '0%' }} />
      </div>
      <span className="heading-sm" style={{ color: 'var(--accent)' }}>{value}</span>
    </div>
  );
}
