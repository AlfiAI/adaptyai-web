
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
  // Use more aggressive type assertion to bypass TypeScript's strict type checking
  protected getTable() {
    return supabase.from(this.tableName) as any;
  }
  
  // Helper method to access the messages table with proper type assertion
  protected getMessagesTable() {
    return supabase.from('messages') as any;
  }
}
