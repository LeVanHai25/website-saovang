// ─── Company ───────────────────────────────────────────────────────────────

export interface Office {
  city: string;
  label: string;
  address: string;
  postcode: string;
}

export interface Company {
  name: string;
  groupSuffix: string;
  fullName: string;
  tagline: string;
  shortTagline: string;
  description: string;
  longDescription: string;
  clientTypes: string;
  type: string;
  founded: string;
  headquarters: string;
  revenue: string;
  website: string;
  email: string;
  phone: string;
  copyright: string;
  confidentiality: string;
  documentTitle: string;
  profileYear: string;
  sectors: string[];
  offices: Office[];
}

// ─── KPIs ──────────────────────────────────────────────────────────────────

export interface KPIItem {
  number: number;
  suffix: string;
  label: string;
  dataTarget: number;
}

export interface JourneyKPI {
  value: string;
  label: string;
}

export interface KPIs {
  summary: KPIItem[];
  journey: JourneyKPI[];
}

// ─── Timeline ──────────────────────────────────────────────────────────────

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

// ─── Vision / Mission / Values ─────────────────────────────────────────────

export interface VMVItem {
  title: string;
  description: string;
}

export interface Value {
  name: string;
  description: string;
}

export interface VisionData {
  vision: VMVItem;
  mission: VMVItem;
  values: Value[];
}

// ─── Team ──────────────────────────────────────────────────────────────────

export type ExecutiveTier = 'ceo' | 'csuite';

export interface Executive {
  name: string;
  title: string;
  experience: string;
  tier: ExecutiveTier;
}

export interface TeamData {
  executives: Executive[];
}

// ─── Departments ───────────────────────────────────────────────────────────

export interface Department {
  number: string;
  name: string;
  description: string;
  professionals: string;
}

export interface OperatingLayer {
  name: string;
  description: string;
}

export interface DepartmentsData {
  departments: Department[];
  operatingModel: OperatingLayer[];
}

// ─── Capabilities ──────────────────────────────────────────────────────────

export interface CapabilityStep {
  label: string;
  text: string;
}

export interface Capability {
  number: string;
  title: string;
  description: string;
  isDark: boolean;
  steps: CapabilityStep[];
}

// ─── Services ──────────────────────────────────────────────────────────────

export interface Service {
  number: string;
  title: string;
  description: string;
  process: string;
  deliverables: string;
  impactMetric: string;
}

// ─── Case Studies ──────────────────────────────────────────────────────────

export interface CaseMetric {
  label: string;
  value: string;
  percentage: number;
}

export interface CaseStudy {
  number: string;
  title: string;
  description: string;
  client: string;
  duration: string;
  sector: string;
  image: string;
  imageAlt: string;
  isDark: boolean;
  challenge: string;
  approach: string;
  outcome: string;
  metrics: CaseMetric[];
}

// ─── Partners ──────────────────────────────────────────────────────────────

export interface Partner {
  name: string;
  tier: string;
  description: string;
}

// ─── Certifications ────────────────────────────────────────────────────────

export interface Certification {
  badge: string;
  title: string;
  description: string;
}

export interface Award {
  title: string;
  description: string;
}

export interface CertificationsData {
  certifications: Certification[];
  awards: Award[];
}

// ─── Why Us ────────────────────────────────────────────────────────────────

export interface WhyUsItem {
  number: string;
  title: string;
  description: string;
}
