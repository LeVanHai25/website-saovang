import ScrollReveal from '@/components/ui/ScrollReveal';
import type { WhyUsItem } from '@/types/content';

interface WhyUsSectionProps { items: WhyUsItem[]; }

export default function WhyUsSection({ items }: WhyUsSectionProps) {
  return (
    <section className="page" id="page-30" data-page="30">
      <div className="page-inner flex flex-col h-full">
        <div className="page-header">
          <span className="overline">12</span>
          <span className="overline" style={{ color: 'var(--neutral-400)' }}>Why Choose Us</span>
        </div>
        <div style={{ marginTop: 24 }}>
          <ScrollReveal><h2 className="heading-xl mb-2">The MERIDIAN Difference</h2></ScrollReveal>
          <ScrollReveal stagger={1}>
            <p className="body-md" style={{ color: 'var(--neutral-400)', maxWidth: 500 }}>
              Six fundamental principles that set us apart and ensure exceptional outcomes for every client engagement.
            </p>
          </ScrollReveal>
        </div>
        <div className="value-grid" style={{ marginTop: 40 }}>
          {items.map((item, i) => (
            <ScrollReveal key={item.number} stagger={i + 1}>
              <div className="value-block">
                <span className="value-number">{item.number}</span>
                <h4 className="heading-md" style={{ marginTop: 12 }}>{item.title}</h4>
                <p className="body-sm" style={{ color: 'var(--neutral-400)', marginTop: 8 }}>{item.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
