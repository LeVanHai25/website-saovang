/**
 * Supabase Adapter Stub
 * Install: npm install @supabase/supabase-js
 * Configure: DATA_ADAPTER=supabase NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_KEY=...
 */

import type { ContentRepository } from '@/data/repository';

// TODO: Implement with @supabase/supabase-js
// import { createClient } from '@supabase/supabase-js';

export const supabaseAdapter: ContentRepository = {
  getCompany: async () => {
    throw new Error('Supabase adapter not yet implemented. Set DATA_ADAPTER=local or configure SUPABASE credentials.');
  },
  getKPIs:           async () => { throw new Error('Supabase adapter stub'); },
  getTimeline:       async () => { throw new Error('Supabase adapter stub'); },
  getVision:         async () => { throw new Error('Supabase adapter stub'); },
  getTeam:           async () => { throw new Error('Supabase adapter stub'); },
  getDepartments:    async () => { throw new Error('Supabase adapter stub'); },
  getCapabilities:   async () => { throw new Error('Supabase adapter stub'); },
  getServices:       async () => { throw new Error('Supabase adapter stub'); },
  getCaseStudies:    async () => { throw new Error('Supabase adapter stub'); },
  getClients:        async () => { throw new Error('Supabase adapter stub'); },
  getPartners:       async () => { throw new Error('Supabase adapter stub'); },
  getCertifications: async () => { throw new Error('Supabase adapter stub'); },
  getWhyUs:          async () => { throw new Error('Supabase adapter stub'); },
};
