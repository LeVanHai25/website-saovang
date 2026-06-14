import ScrollReveal from '@/components/ui/ScrollReveal';
import type { Company } from '@/types/content';

interface ContactSectionProps { company: Company; }

export default function ContactSection({ company }: ContactSectionProps) {
  return (
    <section className="page page-dark" id="page-31" data-page="31">
      <div className="page-inner flex flex-col h-full">
        <div className="page-header">
          <span className="overline" style={{ color: 'var(--neutral-500)' }}>13</span>
          <span className="overline" style={{ color: 'var(--neutral-500)' }}>Get in Touch</span>
        </div>
        <div className="page-grid h-full" style={{ marginTop: 24, alignItems: 'center' }}>
          {/* CTA */}
          <div className="col-6">
            <ScrollReveal>
              <h2 className="display-md" style={{ color: 'var(--white)', lineHeight: 1.15 }}>
                Let&apos;s shape the future — together.
              </h2>
            </ScrollReveal>
            <ScrollReveal stagger={1}>
              <p className="body-lg" style={{ color: 'var(--neutral-300)', marginTop: 24, maxWidth: 440 }}>
                Whether you&apos;re navigating a complex transformation or exploring new growth opportunities, we&apos;d welcome the conversation.
              </p>
            </ScrollReveal>
            <ScrollReveal stagger={2}>
              <a href={`mailto:${company.email}`} className="cta-button">
                Start a Conversation
              </a>
            </ScrollReveal>
          </div>
          <div className="col-1" />
          {/* Offices */}
          <div className="col-5">
            <div className="contact-grid">
              {/* General contact */}
              <ScrollReveal stagger={2}>
                <div className="contact-block">
                  <span className="label" style={{ color: 'var(--accent)' }}>General Inquiries</span>
                  <p className="body-md" style={{ color: 'var(--neutral-200)', marginTop: 8 }}>{company.email}</p>
                  <p className="body-md" style={{ color: 'var(--neutral-200)' }}>{company.phone}</p>
                </div>
              </ScrollReveal>
              {/* Offices */}
              {company.offices.map((office, i) => (
                <ScrollReveal key={office.city} stagger={i + 3}>
                  <div className="contact-block">
                    <span className="label" style={{ color: 'var(--accent)' }}>{office.label}</span>
                    <p className="body-sm" style={{ color: 'var(--neutral-300)', marginTop: 8 }}>
                      {office.address}<br />{office.postcode}
                    </p>
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
