
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

  // Helper method to safely access Supabase tables
  // Use type assertion to bypass TypeScript's strict type checking for Supabase tables
  // This is necessary because our Database type definition doesn't include our custom tables
  protected getTable() {
    return supabase.from(this.tableName) as any;
  }
  
  // Helper method to access the messages table
  protected getMessagesTable() {
    return supabase.from('messages') as any;
  }
}
