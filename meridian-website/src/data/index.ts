/**
 * Data Layer Entry Point
 * Selects adapter based on DATA_ADAPTER environment variable.
 * Default: local (JSON files — no config required)
 *
 * Options:
 *   DATA_ADAPTER=local     → reads from src/content/*.json (default)
 *   DATA_ADAPTER=sqlite    → reads from SQLite via better-sqlite3
 *   DATA_ADAPTER=supabase  → reads from Supabase via @supabase/supabase-js
 */

import type { ContentRepository } from './repository';
import { localAdapter } from './adapters/local';
import { sqliteAdapter } from './adapters/sqlite';
import { supabaseAdapter } from './adapters/supabase';

function createRepository(): ContentRepository {
  const adapter = process.env.DATA_ADAPTER ?? 'local';

  switch (adapter) {
    case 'sqlite':
      return sqliteAdapter;
    case 'supabase':
      return supabaseAdapter;
    case 'local':
    default:
      return localAdapter;
  }
}

export const db: ContentRepository = createRepository();
