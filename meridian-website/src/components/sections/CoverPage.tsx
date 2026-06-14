import Image from 'next/image';
import LogoMark from '@/components/ui/LogoMark';
import type { Company } from '@/types/content';

interface CoverPageProps { company: Company; }

export default function CoverPage({ company }: CoverPageProps) {
  return (
    <section className="page cover-page" id="page-01" data-page="1">
      <div className="cover-content">
        {/* Left panel — alabaster */}
        <div className="cover-left">
          <div className="cover-logo">
            <LogoMark size={48} color="var(--accent)" />
          </div>
          <div>
            <h1 className="cover-title fade-in">{company.name}</h1>
            <p className="cover-subtitle fade-in stagger-1">{company.groupSuffix}</p>
          </div>
          <div className="cover-bottom">
            <div className="cover-bottom-left">
              <p className="cover-desc fade-in stagger-2">{company.tagline}</p>
            </div>
            <div className="cover-bottom-right">
              <p className="cover-meta-label fade-in stagger-3">Company Profile</p>
              <p className="cover-meta-value fade-in stagger-3">{company.profileYear}</p>
            </div>
          </div>
        </div>
        {/* Right panel — hero image */}
        <div className="cover-right">
          <Image
            src="/assets/images/hero-cover.png"
            alt="Architectural facade"
            fill
            className="image-cover"
            priority
            sizes="55vw"
          />
        </div>
      </div>
    </section>
  );
}
