import ScrollReveal from '@/components/ui/ScrollReveal';
import type { Company } from '@/types/content';

interface WhoWeAreProps { company: Company; }

export default function WhoWeAre({ company }: WhoWeAreProps) {
  return (
    <section className="page page-dark" id="page-03" data-page="3">
      <div className="page-inner flex flex-col justify-between h-full">
        <div className="page-header">
          <span className="overline" style={{ color: 'var(--neutral-400)' }}>02</span>
          <span className="overline" style={{ color: 'var(--neutral-500)' }}>Who We Are</span>
        </div>
        <div className="section-intro-content">
          <div className="page-grid">
            <div className="col-8">
              <ScrollReveal>
                <h2 className="display-lg" style={{ color: 'var(--white)', lineHeight: 1.15 }}>
                  We build enterprises that{' '}
                  <em style={{ color: 'var(--accent)', fontStyle: 'normal' }}>endure.</em>
                </h2>
              </ScrollReveal>
            </div>
          </div>
          <div className="page-grid" style={{ marginTop: 48 }}>
            <div className="col-5">
              <ScrollReveal stagger={1}>
                <p className="body-lg" style={{ color: 'var(--neutral-300)' }}>
                  MERIDIAN Group operates at the intersection of strategy, technology, and human capital. We believe that lasting transformation comes from aligning organizational purpose with operational excellence.
                </p>
              </ScrollReveal>
            </div>
            <div className="col-1" />
            <div className="col-5">
              <div className="company-info">
                {[
                  { label: 'Headquarters', value: company.headquarters },
                  { label: 'Founded',       value: company.founded },
                  { label: 'Offices',       value: 'Singapore · London · New York · Dubai · Sydney' },
                  { label: 'Sectors',       value: company.sectors.join(' · ') },
                  { label: 'Revenue',       value: company.revenue },
                ].map((row, i) => (
                  <ScrollReveal key={row.label} stagger={i + 2}>
                    <div className="info-row">
                      <span className="label" style={{ color: 'var(--neutral-400)' }}>{row.label}</span>
                      <span className="body-md" style={{ color: 'var(--neutral-200)' }}>{row.value}</span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="page-footer">
          <span className="caption" style={{ color: 'var(--neutral-500)' }}>MERIDIAN Group — Company Profile 2026</span>
        </div>
      </div>
    </section>
  );
}
