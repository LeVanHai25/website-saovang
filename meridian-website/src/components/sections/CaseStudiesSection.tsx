import Image from 'next/image';
import ScrollReveal from '@/components/ui/ScrollReveal';
import MetricBar from '@/components/ui/MetricBar';
import type { CaseStudy } from '@/types/content';

interface CaseStudiesSectionProps { caseStudies: CaseStudy[]; }

export default function CaseStudiesSection({ caseStudies }: CaseStudiesSectionProps) {
  // Each case study spans 2 pages: hero + detail
  // Pages 19-26
  return (
    <>
      {caseStudies.map((cs, idx) => {
        const heroPage   = 19 + idx * 2;
        const detailPage = heroPage + 1;
        const heroId     = `page-${String(heroPage).padStart(2, '0')}`;
        const detailId   = `page-${String(detailPage).padStart(2, '0')}`;

        return (
          <div key={cs.number}>
            {/* Hero page */}
            <section className="page page-dark" id={heroId} data-page={heroPage}>
              <div className="hero-image hero-image-half">
                <Image src={cs.image} alt={cs.imageAlt} fill className="image-cover" sizes="100vw" />
                <div className="overlay-dark" style={{ opacity: 0.5 }} />
              </div>
              <div className="page-inner flex flex-col h-full" style={{ position: 'relative', zIndex: 2 }}>
                <div className="page-header">
                  <span className="overline" style={{ color: 'var(--neutral-400)' }}>08</span>
                  <span className="overline" style={{ color: 'var(--neutral-400)' }}>Case Studies</span>
                </div>
                <div className="page-grid h-full" style={{ marginTop: 24, alignItems: 'end' }}>
                  <div className="col-6">
                    <span className="label" style={{ color: 'var(--accent)' }}>Case Study {cs.number}</span>
                    <ScrollReveal>
                      <h2 className="heading-xl" style={{ color: 'var(--white)', marginTop: 12 }}>{cs.title}</h2>
                    </ScrollReveal>
                    <ScrollReveal stagger={1}>
                      <p className="body-md" style={{ color: 'var(--neutral-300)', marginTop: 16 }}>{cs.description}</p>
                    </ScrollReveal>
                    <ScrollReveal stagger={2}>
                      <div className="case-meta" style={{ marginTop: 24 }}>
                        {[
                          { label: 'Client',   value: cs.client   },
                          { label: 'Duration', value: cs.duration },
                          { label: 'Sector',   value: cs.sector   },
                        ].map(m => (
                          <div className="case-meta-item" key={m.label}>
                            <span className="caption" style={{ color: 'var(--neutral-400)' }}>{m.label}</span>
                            <span className="body-sm" style={{ color: 'var(--white)' }}>{m.value}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollReveal>
                  </div>
                </div>
              </div>
            </section>

            {/* Detail page */}
            <section className="page" id={detailId} data-page={detailPage}>
              <div className="page-inner flex flex-col h-full">
                <div className="page-header">
                  <span className="overline">08</span>
                  <span className="overline" style={{ color: 'var(--neutral-400)' }}>Case Study {cs.number} — Details</span>
                </div>
                <div className="page-grid" style={{ marginTop: 32 }}>
                  <div className="col-5">
                    <ScrollReveal stagger={1}>
                      <div className="case-section">
                        <span className="label" style={{ color: 'var(--accent)' }}>Challenge</span>
                        <p className="body-md" style={{ color: 'var(--neutral-500)', marginTop: 8 }}>{cs.challenge}</p>
                      </div>
                    </ScrollReveal>
                    <ScrollReveal stagger={2}>
                      <div className="case-section" style={{ marginTop: 32 }}>
                        <span className="label" style={{ color: 'var(--accent)' }}>Approach</span>
                        <p className="body-md" style={{ color: 'var(--neutral-500)', marginTop: 8 }}>{cs.approach}</p>
                      </div>
                    </ScrollReveal>
                  </div>
                  <div className="col-1" />
                  <div className="col-6">
                    <ScrollReveal stagger={2}>
                      <div className="case-section">
                        <span className="label" style={{ color: 'var(--accent)' }}>Outcome</span>
                        <p className="body-md" style={{ color: 'var(--neutral-500)', marginTop: 8 }}>{cs.outcome}</p>
                      </div>
                    </ScrollReveal>
                    <div className="case-metrics" style={{ marginTop: 32 }}>
                      <span className="label" style={{ color: 'var(--accent)', marginBottom: 16, display: 'block' }}>Key Metrics</span>
                      {cs.metrics.map((m, mi) => (
                        <MetricBar key={m.label} {...m} stagger={mi + 3} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
      })}
    </>
  );
}
