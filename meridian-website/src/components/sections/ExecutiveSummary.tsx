import ScrollReveal from '@/components/ui/ScrollReveal';
import KPICard from '@/components/ui/KPICard';
import type { Company, KPIs } from '@/types/content';

interface ExecutiveSummaryProps { company: Company; kpis: KPIs; }

export default function ExecutiveSummary({ company, kpis }: ExecutiveSummaryProps) {
  return (
    <section className="page" id="page-02" data-page="2">
      <div className="page-inner">
        <div className="page-header">
          <span className="overline">01</span>
          <span className="overline" style={{ color: 'var(--neutral-400)' }}>Executive Summary</span>
        </div>
        <div className="page-grid page-grid-aligned" style={{ marginTop: 32 }}>
          <div className="col-7">
            <ScrollReveal>
              <h2 className="display-md mb-4">Defining the Future of Enterprise Transformation</h2>
            </ScrollReveal>
            <ScrollReveal stagger={1}>
              <p className="body-lg" style={{ color: 'var(--neutral-500)', marginBottom: 24 }}>
                {company.description}
              </p>
            </ScrollReveal>
            <ScrollReveal stagger={2}>
              <p className="body-md" style={{ color: 'var(--neutral-400)', maxWidth: 520 }}>
                {company.longDescription}
              </p>
            </ScrollReveal>
            <ScrollReveal stagger={3}>
              <p className="body-md" style={{ color: 'var(--neutral-400)', maxWidth: 520, marginTop: 16 }}>
                {company.clientTypes}
              </p>
            </ScrollReveal>
          </div>
          <div className="col-1" />
          <div className="col-4">
            <div className="kpi-grid">
              {kpis.summary.map((kpi, i) => (
                <KPICard key={kpi.label} {...kpi} stagger={i + 1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
