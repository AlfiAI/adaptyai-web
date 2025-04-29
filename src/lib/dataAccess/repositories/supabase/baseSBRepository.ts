
import { supabase } from '@/integrations/supabase/client';

/**
 * Base repository class for Supabase implementations
 */
export abstract class BaseSBRepository<T extends { id?: string }> {
  constructor(protected tableName: string) {
    console.log(`Initializing Supabase repository for table ${tableName}`);
  }

  protected handleError(error: unknown, operation: string): never {
    console.error(`Supabase error in ${operation}:`, error);
    throw new Error(`${operation} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  protected formatTimestamp(timestamp: any): Date | string {
    if (timestamp instanceof Date) {
      return timestamp;
    }
    
    if (typeof timestamp === 'string') {
      return timestamp;
    }
    
    // Try to parse PostgreSQL timestamp
    try {
      return new Date(timestamp);
    } catch (e) {
      return String(timestamp);
    }
  }
}
