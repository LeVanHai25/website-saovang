import ScrollReveal from '@/components/ui/ScrollReveal';
import type { Capability } from '@/types/content';

interface CapabilitiesSectionProps { capabilities: Capability[]; }

export default function CapabilitiesSection({ capabilities }: CapabilitiesSectionProps) {
  return (
    <>
      {capabilities.map((cap, idx) => {
        const pageNum = 9 + idx;
        const pageId  = `page-${String(pageNum).padStart(2, '0')}`;
        return (
          <section
            key={cap.number}
            className={`page${cap.isDark ? ' page-dark' : ''}`}
            id={pageId}
            data-page={pageNum}
          >
            <div className="page-inner flex flex-col h-full">
              <div className="page-header">
                <span className="overline" style={cap.isDark ? { color: 'var(--neutral-500)' } : undefined}>06</span>
                <span className="overline" style={{ color: cap.isDark ? 'var(--neutral-500)' : 'var(--neutral-400)' }}>
                  Core Capabilities
                </span>
              </div>
              <div className="capability-section" style={{ marginTop: 24 }}>
                <div className="page-grid">
                  <div className="col-5">
                    <span className="label" style={{ color: 'var(--accent)' }}>Capability {cap.number}</span>
                    <ScrollReveal>
                      <h2
                        className="heading-xl"
                        style={{ color: cap.isDark ? 'var(--white)' : undefined, marginTop: 16 }}
                      >
                        {cap.title}
                      </h2>
                    </ScrollReveal>
                    <ScrollReveal stagger={1}>
                      <p
                        className="body-md"
                        style={{ color: cap.isDark ? 'var(--neutral-300)' : 'var(--neutral-500)', marginTop: 20 }}
                      >
                        {cap.description}
                      </p>
                    </ScrollReveal>
                  </div>
                  <div className="col-1" />
                  <div className="col-6">
                    <div className="capability-flow">
                      {cap.steps.map((step, si) => (
                        <div key={step.label}>
                          <ScrollReveal stagger={si + 1}>
                            <div className="cap-step">
                              <span className="cap-step-label">{step.label}</span>
                              <p className="body-sm" style={{ color: cap.isDark ? 'var(--neutral-300)' : 'var(--neutral-500)' }}>
                                {step.text}
                              </p>
                            </div>
                          </ScrollReveal>
                          {si < cap.steps.length - 1 && (
                            <div className="cap-arrow" style={cap.isDark ? undefined : { color: 'var(--neutral-300)' }}>↓</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
