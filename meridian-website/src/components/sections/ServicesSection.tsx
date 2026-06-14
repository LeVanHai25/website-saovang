import ScrollReveal from '@/components/ui/ScrollReveal';
import type { Service } from '@/types/content';

interface ServicesSectionProps { services: Service[]; }

export default function ServicesSection({ services }: ServicesSectionProps) {
  // Pair services into pages of 2
  const pages: Service[][] = [];
  for (let i = 0; i < services.length; i += 2) {
    pages.push(services.slice(i, i + 2));
  }

  return (
    <>
      {pages.map((pair, pageIdx) => {
        const pageNum = 14 + pageIdx;
        const pageId  = `page-${String(pageNum).padStart(2, '0')}`;
        const isFirst = pageIdx === 0;

        return (
          <section className="page" id={pageId} data-page={pageNum} key={pageNum}>
            <div className="page-inner flex flex-col h-full">
              <div className="page-header">
                <span className="overline">07</span>
                <span className="overline" style={{ color: 'var(--neutral-400)' }}>
                  {isFirst ? 'Services' : 'Services — Continued'}
                </span>
              </div>
              {isFirst && (
                <div style={{ marginTop: 24 }}>
                  <ScrollReveal>
                    <h2 className="heading-xl mb-2">Our Service Portfolio</h2>
                  </ScrollReveal>
                  <ScrollReveal stagger={1}>
                    <p className="body-md" style={{ color: 'var(--neutral-400)', maxWidth: 560 }}>
                      Integrated services designed to address the full spectrum of enterprise challenges — from strategic vision to technical execution.
                    </p>
                  </ScrollReveal>
                </div>
              )}
              <div className="page-grid" style={{ marginTop: isFirst ? 32 : 40 }}>
                {pair.map((svc, si) => (
                  <div className="col-6" key={svc.number}>
                    <ScrollReveal stagger={si + (isFirst ? 2 : 1)}>
                      <div className="service-card">
                        <span className="label" style={{ color: 'var(--accent)' }}>Service {svc.number}</span>
                        <h3 className="heading-lg" style={{ marginTop: 12 }}>{svc.title}</h3>
                        <p className="body-sm" style={{ color: 'var(--neutral-500)', marginTop: 12 }}>{svc.description}</p>
                        <div className="service-details">
                          <div className="service-detail-group">
                            <span className="caption" style={{ color: 'var(--neutral-400)' }}>Process</span>
                            <p className="body-sm">{svc.process}</p>
                          </div>
                          <div className="service-detail-group">
                            <span className="caption" style={{ color: 'var(--neutral-400)' }}>Key Deliverables</span>
                            <p className="body-sm">{svc.deliverables}</p>
                          </div>
                          <div className="service-detail-group">
                            <span className="caption" style={{ color: 'var(--neutral-400)' }}>Impact Metric</span>
                            <p className="body-sm" style={{ color: 'var(--accent)' }}>{svc.impactMetric}</p>
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
