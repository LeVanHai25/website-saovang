import type {
  Company, KPIs, TimelineEvent, VisionData, TeamData,
  DepartmentsData, Capability, Service, CaseStudy,
  Partner, CertificationsData, WhyUsItem,
} from '@/types/content';

import companyRaw from './company.json';
import kpisRaw from './kpis.json';
import timelineRaw from './timeline.json';
import visionRaw from './vision.json';
import teamRaw from './team.json';
import departmentsRaw from './departments.json';
import capabilitiesRaw from './capabilities.json';
import servicesRaw from './services.json';
import caseStudiesRaw from './case-studies.json';
import clientsRaw from './clients.json';
import partnersRaw from './partners.json';
import certificationsRaw from './certifications.json';
import whyUsRaw from './why-us.json';

export const company = companyRaw as Company;
export const kpis = kpisRaw as KPIs;
export const timeline = timelineRaw as TimelineEvent[];
export const vision = visionRaw as VisionData;
export const team = teamRaw as TeamData;
export const departments = departmentsRaw as DepartmentsData;
export const capabilities = capabilitiesRaw as Capability[];
export const services = servicesRaw as Service[];
export const caseStudies = caseStudiesRaw as CaseStudy[];
export const clients = clientsRaw as string[];
export const partners = partnersRaw as Partner[];
export const certifications = certificationsRaw as CertificationsData;
export const whyUs = whyUsRaw as WhyUsItem[];
