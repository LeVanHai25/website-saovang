import ScrollReveal from '@/components/ui/ScrollReveal';
import type { VisionData } from '@/types/content';

interface VMVSectionProps { data: VisionData; }

export default function VMVSection({ data }: VMVSectionProps) {
  return (
    <section className="page" id="page-06" data-page="6">
      <div className="page-inner flex flex-col h-full">
        <div className="page-header">
          <span className="overline">04</span>
          <span className="overline" style={{ color: 'var(--neutral-400)' }}>Vision · Mission · Values</span>
        </div>
        <div className="page-grid h-full" style={{ marginTop: 32, alignItems: 'stretch' }}>
          {/* Vision */}
          <ScrollReveal className="col-4 vmv-section" stagger={1}>
            <span className="label" style={{ color: 'var(--accent)' }}>Vision</span>
            <h3 className="heading-lg" style={{ marginTop: 24, lineHeight: 1.3 }}>{data.vision.title}</h3>
            <p className="body-md" style={{ color: 'var(--neutral-400)', marginTop: 20 }}>{data.vision.description}</p>
          </ScrollReveal>

          {/* Mission */}
          <ScrollReveal className="col-4 vmv-section vmv-section-bordered" stagger={2}>
            <span className="label" style={{ color: 'var(--accent)' }}>Mission</span>
            <h3 className="heading-lg" style={{ marginTop: 24, lineHeight: 1.3 }}>{data.mission.title}</h3>
            <p className="body-md" style={{ color: 'var(--neutral-400)', marginTop: 20 }}>{data.mission.description}</p>
          </ScrollReveal>

          {/* Values */}
          <ScrollReveal className="col-4 vmv-section" stagger={3}>
            <span className="label" style={{ color: 'var(--accent)' }}>Values</span>
            <div className="values-list" style={{ marginTop: 24 }}>
              {data.values.map((v) => (
                <div key={v.name} className="value-item">
                  <p className="heading-sm">{v.name}</p>
                  <p className="body-sm" style={{ color: 'var(--neutral-400)' }}>{v.description}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
