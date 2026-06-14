import ScrollReveal from '@/components/ui/ScrollReveal';
import type { TimelineEvent, JourneyKPI } from '@/types/content';

interface TimelineSectionProps {
  events: TimelineEvent[];
  journeyKPIs: JourneyKPI[];
}

export default function TimelineSection({ events, journeyKPIs }: TimelineSectionProps) {
  const part1 = events.slice(0, 5);
  const part2 = events.slice(5);

  return (
    <>
      {/* PAGE 04 — Journey Part 1 */}
      <section className="page" id="page-04" data-page="4">
        <div className="page-inner flex flex-col h-full">
          <div className="page-header">
            <span className="overline">03</span>
            <span className="overline" style={{ color: 'var(--neutral-400)' }}>Company Journey</span>
          </div>
          <div style={{ marginTop: 32 }}>
            <ScrollReveal>
              <h2 className="heading-xl mb-2">A Legacy of Purposeful Growth</h2>
            </ScrollReveal>
            <ScrollReveal stagger={1}>
              <p className="body-md" style={{ color: 'var(--neutral-400)', maxWidth: 600 }}>
                From a focused advisory practice to a global consultancy — our journey reflects our commitment to building lasting value.
              </p>
            </ScrollReveal>
          </div>
          <div className="timeline-container" style={{ marginTop: 'auto', marginBottom: 48 }}>
            <div className="timeline">
              <div className="timeline-line" />
              {part1.map((evt, i) => (
                <ScrollReveal key={evt.year} className="timeline-item" stagger={i + 1}>
                  <div className="timeline-dot" />
                  <div className="timeline-year">{evt.year}</div>
                  <div className="timeline-content">
                    <p className="heading-sm">{evt.title}</p>
                    <p className="body-sm" style={{ color: 'var(--neutral-400)' }}>{evt.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PAGE 05 — Journey Part 2 */}
      <section className="page" id="page-05" data-page="5">
        <div className="page-inner flex flex-col h-full">
          <div className="page-header">
            <span className="overline">03</span>
            <span className="overline" style={{ color: 'var(--neutral-400)' }}>Company Journey — Continued</span>
          </div>
          <div className="timeline-container" style={{ marginTop: 64, marginBottom: 48 }}>
            <div className="timeline">
              <div className="timeline-line" />
              {part2.map((evt, i) => (
                <ScrollReveal key={evt.year} className="timeline-item" stagger={i + 1}>
                  <div className="timeline-dot" />
                  <div className="timeline-year">{evt.year}</div>
                  <div className="timeline-content">
                    <p className="heading-sm">{evt.title}</p>
                    <p className="body-sm" style={{ color: 'var(--neutral-400)' }}>{evt.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
          <div className="page-grid" style={{ marginTop: 'auto' }}>
            {journeyKPIs.map((kpi, i) => (
              <div className="col-3" key={kpi.label}>
                <ScrollReveal stagger={i + 1}>
                  <div className="kpi-card kpi-card-inline">
                    <span className="kpi-number">{kpi.value}</span>
                    <span className="kpi-label">{kpi.label}</span>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
