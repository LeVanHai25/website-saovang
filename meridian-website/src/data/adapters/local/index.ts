/**
 * Local JSON Adapter (default)
 * Reads directly from src/content/*.json — zero dependencies, zero config.
 */

import type { ContentRepository } from '@/data/repository';
import * as content from '@/content';

export const localAdapter: ContentRepository = {
  getCompany:        async () => content.company,
  getKPIs:           async () => content.kpis,
  getTimeline:       async () => content.timeline,
  getVision:         async () => content.vision,
  getTeam:           async () => content.team,
  getDepartments:    async () => content.departments,
  getCapabilities:   async () => content.capabilities,
  getServices:       async () => content.services,
  getCaseStudies:    async () => content.caseStudies,
  getClients:        async () => content.clients,
  getPartners:       async () => content.partners,
  getCertifications: async () => content.certifications,
  getWhyUs:          async () => content.whyUs,
};
