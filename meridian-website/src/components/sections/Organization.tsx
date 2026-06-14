import ScrollReveal from '@/components/ui/ScrollReveal';
import type { TeamData, DepartmentsData } from '@/types/content';

interface OrganizationProps {
  team: TeamData;
  departments: DepartmentsData;
}

export default function Organization({ team, departments }: OrganizationProps) {
  const ceo    = team.executives.filter(e => e.tier === 'ceo');
  const csuite = team.executives.filter(e => e.tier === 'csuite');

  return (
    <>
      {/* PAGE 07 — Executive Leadership */}
      <section className="page" id="page-07" data-page="7">
        <div className="page-inner flex flex-col h-full">
          <div className="page-header">
            <span className="overline">05</span>
            <span className="overline" style={{ color: 'var(--neutral-400)' }}>Organization</span>
          </div>
          <div style={{ marginTop: 24 }}>
            <ScrollReveal><h2 className="heading-xl mb-2">Executive Leadership</h2></ScrollReveal>
            <ScrollReveal stagger={1}>
              <p className="body-md" style={{ color: 'var(--neutral-400)', maxWidth: 500 }}>
                A proven leadership team with deep industry expertise and a shared commitment to excellence.
              </p>
            </ScrollReveal>
          </div>
          <div className="org-chart" style={{ marginTop: 40 }}>
            {/* CEO */}
            <div className="org-level org-level-ceo">
              {ceo.map((exec, i) => (
                <ScrollReveal key={exec.name} stagger={i + 2}>
                  <div className="org-card org-card-primary">
                    <p className="heading-sm">{exec.name}</p>
                    <p className="caption" style={{ color: 'var(--accent)' }}>{exec.title}</p>
                    <p className="body-sm" style={{ color: 'var(--neutral-400)', marginTop: 4 }}>{exec.experience}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <div className="org-connector" />
            {/* C-Suite */}
            <div className="org-level org-level-c-suite">
              {csuite.map((exec, i) => (
                <ScrollReveal key={exec.name} stagger={i + 3}>
                  <div className="org-card">
                    <p className="heading-sm">{exec.name}</p>
                    <p className="caption" style={{ color: 'var(--accent)' }}>{exec.title}</p>
                    <p className="body-sm" style={{ color: 'var(--neutral-400)', marginTop: 4 }}>{exec.experience}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PAGE 08 — Departments & Operating Model */}
      <section className="page" id="page-08" data-page="8">
        <div className="page-inner flex flex-col h-full">
          <div className="page-header">
            <span className="overline">05</span>
            <span className="overline" style={{ color: 'var(--neutral-400)' }}>Departments &amp; Operating Model</span>
          </div>
          <div className="page-grid" style={{ marginTop: 32, alignItems: 'start' }}>
            {/* Departments */}
            <div className="col-7">
              <ScrollReveal><h3 className="heading-lg mb-4">Practice Areas</h3></ScrollReveal>
              <div className="dept-grid">
                {departments.departments.map((dept, i) => (
                  <ScrollReveal key={dept.number} stagger={i + 1}>
                    <div className="dept-card">
                      <span className="dept-number">{dept.number}</span>
                      <p className="heading-sm">{dept.name}</p>
                      <p className="body-sm" style={{ color: 'var(--neutral-400)' }}>{dept.description}</p>
                      <span className="caption" style={{ color: 'var(--accent)', marginTop: 8, display: 'block' }}>{dept.professionals}</span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
            <div className="col-1" />
            {/* Operating Model */}
            <div className="col-4">
              <ScrollReveal><h3 className="heading-lg mb-4">Operating Model</h3></ScrollReveal>
              <ScrollReveal stagger={2}>
                <div className="operating-model">
                  {departments.operatingModel.map((layer, i) => (
                    <div key={layer.name}>
                      <div className="model-layer">
                        <span className="label" style={{ color: 'var(--accent)' }}>{layer.name}</span>
                        <p className="body-sm" style={{ color: 'var(--neutral-500)' }}>{layer.description}</p>
                      </div>
                      {i < departments.operatingModel.length - 1 && (
                        <div className="model-arrow">↓</div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
