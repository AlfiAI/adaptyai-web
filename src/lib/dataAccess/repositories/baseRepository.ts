
import type { DataRepository } from '../types';

/**
 * Base repository class implementing common functionality
 */
export abstract class BaseRepository<T extends { id?: string }> implements DataRepository<T> {
  constructor(protected storageProvider: string) {
    console.log(`Initializing repository with ${storageProvider} provider`);
  }

  abstract getAll(): Promise<T[]>;
  abstract getById(id: string): Promise<T | null>;
  abstract create(data: Omit<T, 'id'>): Promise<string>;
  abstract update(id: string, data: Partial<T>): Promise<boolean>;
  abstract delete(id: string): Promise<boolean>;

  protected handleError(error: unknown, operation: string): never {
    console.error(`${this.storageProvider} error in ${operation}:`, error);
    throw new Error(`${operation} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
