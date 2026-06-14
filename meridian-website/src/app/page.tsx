import { db } from '@/data';
import DocumentShell from '@/components/layout/DocumentShell';
import CoverPage from '@/components/sections/CoverPage';
import ExecutiveSummary from '@/components/sections/ExecutiveSummary';
import WhoWeAre from '@/components/sections/WhoWeAre';
import TimelineSection from '@/components/sections/TimelineSection';
import VMVSection from '@/components/sections/VMVSection';
import Organization from '@/components/sections/Organization';
import CapabilitiesSection from '@/components/sections/CapabilitiesSection';
import ServicesSection from '@/components/sections/ServicesSection';
import CaseStudiesSection from '@/components/sections/CaseStudiesSection';
import ClientsPartners from '@/components/sections/ClientsPartners';
import CertificationsSection from '@/components/sections/CertificationsSection';
import WhyUsSection from '@/components/sections/WhyUsSection';
import ContactSection from '@/components/sections/ContactSection';
import BackCover from '@/components/sections/BackCover';

export const dynamic = 'force-static';

export default async function HomePage() {
  // Fetch all content via adapter (local JSON by default)
  const [
    company, kpis, timeline, vision, team,
    departments, capabilities, services,
    caseStudies, clients, partners, certifications, whyUs,
  ] = await Promise.all([
    db.getCompany(),
    db.getKPIs(),
    db.getTimeline(),
    db.getVision(),
    db.getTeam(),
    db.getDepartments(),
    db.getCapabilities(),
    db.getServices(),
    db.getCaseStudies(),
    db.getClients(),
    db.getPartners(),
    db.getCertifications(),
    db.getWhyUs(),
  ]);

  return (
    <DocumentShell>
      {/* Page 01 */}
      <CoverPage company={company} />

      {/* Page 02 */}
      <ExecutiveSummary company={company} kpis={kpis} />

      {/* Page 03 */}
      <WhoWeAre company={company} />

      {/* Pages 04–05 */}
      <TimelineSection events={timeline} journeyKPIs={kpis.journey} />

      {/* Page 06 */}
      <VMVSection data={vision} />

      {/* Pages 07–08 */}
      <Organization team={team} departments={departments} />

      {/* Pages 09–13 */}
      <CapabilitiesSection capabilities={capabilities} />

      {/* Pages 14–18 */}
      <ServicesSection services={services} />

      {/* Pages 19–26 */}
      <CaseStudiesSection caseStudies={caseStudies} />

      {/* Pages 27–28 */}
      <ClientsPartners clients={clients} partners={partners} />

      {/* Page 29 */}
      <CertificationsSection data={certifications} />

      {/* Page 30 */}
      <WhyUsSection items={whyUs} />

      {/* Page 31 */}
      <ContactSection company={company} />

      {/* Page 32 */}
      <BackCover company={company} />
    </DocumentShell>
  );
}
