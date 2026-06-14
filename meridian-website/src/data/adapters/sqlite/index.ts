/**
 * SQLite Adapter Stub
 * Install: npm install better-sqlite3 @types/better-sqlite3
 * Configure: DATA_ADAPTER=sqlite DATABASE_URL=./meridian.db
 */

import type { ContentRepository } from '@/data/repository';

// TODO: Implement with better-sqlite3 when DATABASE_URL is configured
// import Database from 'better-sqlite3';

export const sqliteAdapter: ContentRepository = {
  getCompany: async () => {
    throw new Error('SQLite adapter not yet implemented. Set DATA_ADAPTER=local or configure better-sqlite3.');
  },
  getKPIs:           async () => { throw new Error('SQLite adapter stub'); },
  getTimeline:       async () => { throw new Error('SQLite adapter stub'); },
  getVision:         async () => { throw new Error('SQLite adapter stub'); },
  getTeam:           async () => { throw new Error('SQLite adapter stub'); },
  getDepartments:    async () => { throw new Error('SQLite adapter stub'); },
  getCapabilities:   async () => { throw new Error('SQLite adapter stub'); },
  getServices:       async () => { throw new Error('SQLite adapter stub'); },
  getCaseStudies:    async () => { throw new Error('SQLite adapter stub'); },
  getClients:        async () => { throw new Error('SQLite adapter stub'); },
  getPartners:       async () => { throw new Error('SQLite adapter stub'); },
  getCertifications: async () => { throw new Error('SQLite adapter stub'); },
  getWhyUs:          async () => { throw new Error('SQLite adapter stub'); },
};
