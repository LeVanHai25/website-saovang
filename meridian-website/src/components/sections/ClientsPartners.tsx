import ScrollReveal from '@/components/ui/ScrollReveal';
import type { Partner } from '@/types/content';

interface ClientsPartnersProps {
  clients: string[];
  partners: Partner[];
}

export default function ClientsPartners({ clients, partners }: ClientsPartnersProps) {
  return (
    <>
      {/* PAGE 27 — Clients */}
      <section className="page" id="page-27" data-page="27">
        <div className="page-inner flex flex-col h-full">
          <div className="page-header">
            <span className="overline">09</span>
            <span className="overline" style={{ color: 'var(--neutral-400)' }}>Our Clients</span>
          </div>
          <div style={{ marginTop: 24 }}>
            <ScrollReveal><h2 className="heading-xl mb-2">Trusted by Industry Leaders</h2></ScrollReveal>
            <ScrollReveal stagger={1}>
              <p className="body-md" style={{ color: 'var(--neutral-400)', maxWidth: 500 }}>
                We are privileged to partner with some of the world&apos;s most respected organizations across diverse industries.
              </p>
            </ScrollReveal>
          </div>
          <div className="client-grid" style={{ marginTop: 48 }}>
            {clients.map((name, i) => (
              <ScrollReveal
                key={name}
                className="client-logo"
                stagger={Math.floor(i / 3) + 1}
              >
                <span className="client-name">{name}</span>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* PAGE 28 — Partners */}
      <section className="page page-dark" id="page-28" data-page="28">
        <div className="page-inner flex flex-col h-full">
          <div className="page-header">
            <span className="overline" style={{ color: 'var(--neutral-500)' }}>10</span>
            <span className="overline" style={{ color: 'var(--neutral-500)' }}>Strategic Partners</span>
          </div>
          <div style={{ marginTop: 24 }}>
            <ScrollReveal>
              <h2 className="heading-xl mb-2" style={{ color: 'var(--white)' }}>Our Partner Ecosystem</h2>
            </ScrollReveal>
            <ScrollReveal stagger={1}>
              <p className="body-md" style={{ color: 'var(--neutral-300)', maxWidth: 500 }}>
                Strategic alliances with leading technology providers and advisory firms that amplify our capabilities and client outcomes.
              </p>
            </ScrollReveal>
          </div>
          <div className="partner-grid" style={{ marginTop: 48 }}>
            {partners.map((p, i) => (
              <ScrollReveal key={p.name} stagger={i + 1}>
                <div className="partner-card">
                  <p className="heading-sm" style={{ color: 'var(--white)' }}>{p.name}</p>
                  <span className="tag">{p.tier}</span>
                  <p className="body-sm" style={{ color: 'var(--neutral-400)', marginTop: 8 }}>{p.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
