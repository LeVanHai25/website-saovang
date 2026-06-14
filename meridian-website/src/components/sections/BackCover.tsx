import LogoMark from '@/components/ui/LogoMark';
import type { Company } from '@/types/content';

interface BackCoverProps { company: Company; }

export default function BackCover({ company }: BackCoverProps) {
  return (
    <section className="page page-dark back-cover" id="page-32" data-page="32">
      <div className="page-inner flex flex-col items-center justify-center h-full">
        <div className="back-cover-content">
          <LogoMark size={72} color="var(--accent)" />
          <h2 className="heading-xl fade-in" style={{ color: 'var(--white)', marginTop: 32, letterSpacing: '0.1em' }}>
            {company.name}
          </h2>
          <p className="body-md fade-in stagger-1" style={{ color: 'var(--neutral-400)', marginTop: 8, letterSpacing: '0.15em' }}>
            {company.groupSuffix}
          </p>
          <div className="divider-accent fade-in stagger-2" style={{ margin: '32px auto', width: 40 }} />
          <p className="body-md fade-in stagger-2" style={{ color: 'var(--neutral-300)' }}>{company.website}</p>

          {/* SVG QR code placeholder — exact from original */}
          <div className="qr-placeholder fade-in stagger-3" style={{ marginTop: 32 }}>
            <svg viewBox="0 0 100 100" width="80" height="80" aria-label="QR code placeholder">
              <rect x="0" y="0" width="100" height="100" fill="#1A2744" rx="4"/>
              <rect x="8"  y="8"  width="28" height="28" fill="none" stroke="#C9A96E" strokeWidth="3" rx="2"/>
              <rect x="14" y="14" width="16" height="16" fill="#C9A96E" rx="1"/>
              <rect x="64" y="8"  width="28" height="28" fill="none" stroke="#C9A96E" strokeWidth="3" rx="2"/>
              <rect x="70" y="14" width="16" height="16" fill="#C9A96E" rx="1"/>
              <rect x="8"  y="64" width="28" height="28" fill="none" stroke="#C9A96E" strokeWidth="3" rx="2"/>
              <rect x="14" y="70" width="16" height="16" fill="#C9A96E" rx="1"/>
              <rect x="42" y="8"  width="6" height="6" fill="#C9A96E" opacity="0.6"/>
              <rect x="42" y="20" width="6" height="6" fill="#C9A96E" opacity="0.4"/>
              <rect x="42" y="42" width="6" height="6" fill="#C9A96E" opacity="0.8"/>
              <rect x="54" y="42" width="6" height="6" fill="#C9A96E" opacity="0.5"/>
              <rect x="42" y="54" width="6" height="6" fill="#C9A96E" opacity="0.6"/>
              <rect x="66" y="54" width="6" height="6" fill="#C9A96E" opacity="0.4"/>
              <rect x="78" y="54" width="6" height="6" fill="#C9A96E" opacity="0.7"/>
              <rect x="66" y="66" width="6" height="6" fill="#C9A96E" opacity="0.5"/>
              <rect x="78" y="66" width="6" height="6" fill="#C9A96E" opacity="0.6"/>
              <rect x="54" y="78" width="6" height="6" fill="#C9A96E" opacity="0.4"/>
              <rect x="66" y="78" width="6" height="6" fill="#C9A96E" opacity="0.7"/>
              <rect x="78" y="78" width="6" height="6" fill="#C9A96E" opacity="0.5"/>
              <rect x="42" y="78" width="6" height="6" fill="#C9A96E" opacity="0.6"/>
              <rect x="54" y="66" width="6" height="6" fill="#C9A96E" opacity="0.3"/>
            </svg>
          </div>
          <p className="caption fade-in stagger-4" style={{ color: 'var(--neutral-500)', marginTop: 24 }}>
            {company.copyright}
          </p>
          <p className="caption fade-in stagger-4" style={{ color: 'var(--neutral-600)', marginTop: 4 }}>
            {company.confidentiality}
          </p>
        </div>
      </div>
    </section>
  );
}
