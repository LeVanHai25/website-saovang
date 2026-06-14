/**
 * MERIDIAN Data Repository — Adapter Architecture
 *
 * Default: Local JSON (no database needed)
 * Selectable via: DATA_ADAPTER env variable
 *   - "local"    → src/data/adapters/local (default)
 *   - "sqlite"   → src/data/adapters/sqlite
 *   - "supabase" → src/data/adapters/supabase
 */

export interface ContentRepository {
  getCompany(): Promise<import('@/types/content').Company>;
  getKPIs(): Promise<import('@/types/content').KPIs>;
  getTimeline(): Promise<import('@/types/content').TimelineEvent[]>;
  getVision(): Promise<import('@/types/content').VisionData>;
  getTeam(): Promise<import('@/types/content').TeamData>;
  getDepartments(): Promise<import('@/types/content').DepartmentsData>;
  getCapabilities(): Promise<import('@/types/content').Capability[]>;
  getServices(): Promise<import('@/types/content').Service[]>;
  getCaseStudies(): Promise<import('@/types/content').CaseStudy[]>;
  getClients(): Promise<string[]>;
  getPartners(): Promise<import('@/types/content').Partner[]>;
  getCertifications(): Promise<import('@/types/content').CertificationsData>;
  getWhyUs(): Promise<import('@/types/content').WhyUsItem[]>;
}
