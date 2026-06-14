'use client';

import { useEffect, useRef } from 'react';

interface KPICardProps {
  number: number;
  suffix: string;
  label: string;
  dataTarget: number;
  inline?: boolean;
  stagger?: number;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function KPICard({ number, suffix, label, dataTarget, inline = false, stagger = 0 }: KPICardProps) {
  const numRef = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = numRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 2000;
          const start = performance.now();
          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);
            el.textContent = String(Math.round(eased * dataTarget));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [dataTarget]);

  return (
    <div
      className={`kpi-card slide-up${inline ? ' kpi-card-inline' : ''}`}
      style={{ transitionDelay: `${stagger * 100}ms` }}
    >
      <span className="kpi-number" ref={numRef}>{number}</span>
      <span className="kpi-suffix">{suffix}</span>
      <span className="kpi-label">{label}</span>
    </div>
  );
}
