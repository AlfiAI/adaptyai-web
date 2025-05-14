
import { FirebaseBlogRepository } from '../repositories/blogRepository';
import { SupabaseBlogRepository } from '../repositories/supabase/blogSBRepository';
import { BaseRepositoryFactory } from './baseRepositoryFactory';
import { DataProvider, getDataProvider } from '../config';

/**
 * Factory for creating blog repositories
 */
export class BlogRepositoryFactory extends BaseRepositoryFactory {
  /**
   * Create repository instance for blog data
   */
  static createBlogRepository() {
    return BlogRepositoryFactory.currentProvider === DataProvider.SUPABASE
      ? new SupabaseBlogRepository()
      : new FirebaseBlogRepository();
  }
}

/**
 * Get repository instance for blog data
 */
export function getBlogRepository() {
  const provider = getDataProvider();
  
  if (provider === DataProvider.SUPABASE) {
    return new SupabaseBlogRepository();
  }
  
  return new FirebaseBlogRepository();
}
