import ScrollReveal from '@/components/ui/ScrollReveal';
import type { CertificationsData } from '@/types/content';

interface CertificationsSectionProps { data: CertificationsData; }

export default function CertificationsSection({ data }: CertificationsSectionProps) {
  return (
    <section className="page" id="page-29" data-page="29">
      <div className="page-inner flex flex-col h-full">
        <div className="page-header">
          <span className="overline">11</span>
          <span className="overline" style={{ color: 'var(--neutral-400)' }}>Certifications &amp; Awards</span>
        </div>
        <div style={{ marginTop: 24 }}>
          <ScrollReveal><h2 className="heading-xl mb-2">Credentials That Matter</h2></ScrollReveal>
          <ScrollReveal stagger={1}>
            <p className="body-md" style={{ color: 'var(--neutral-400)', maxWidth: 500 }}>
              Internationally recognized certifications and industry awards that validate our commitment to excellence.
            </p>
          </ScrollReveal>
        </div>
        <div className="page-grid" style={{ marginTop: 40 }}>
          {/* Certifications */}
          <div className="col-6">
            <ScrollReveal stagger={2}>
              <h3 className="heading-md mb-3" style={{ color: 'var(--neutral-700)' }}>Certifications</h3>
            </ScrollReveal>
            <div className="cert-list">
              {data.certifications.map((cert, i) => (
                <ScrollReveal key={cert.title} stagger={i + 2}>
                  <div className="cert-item">
                    <span className="cert-badge">{cert.badge}</span>
                    <div>
                      <p className="heading-sm">{cert.title}</p>
                      <p className="body-sm" style={{ color: 'var(--neutral-400)' }}>{cert.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
          {/* Awards */}
          <div className="col-6">
            <ScrollReveal stagger={2}>
              <h3 className="heading-md mb-3" style={{ color: 'var(--neutral-700)' }}>Awards &amp; Recognition</h3>
            </ScrollReveal>
            <div className="cert-list">
              {data.awards.map((award, i) => (
                <ScrollReveal key={award.title} stagger={i + 3}>
                  <div className="cert-item">
                    <span className="cert-badge cert-badge-accent">★</span>
                    <div>
                      <p className="heading-sm">{award.title}</p>
                      <p className="body-sm" style={{ color: 'var(--neutral-400)' }}>{award.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
