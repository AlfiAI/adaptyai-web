
import { FirebasePodcastRepository } from '../repositories/podcastRepository';
import { SupabasePodcastRepository } from '../repositories/supabase/podcastSBRepository';
import { BaseRepositoryFactory } from './baseRepositoryFactory';
import { DataProvider, getDataProvider } from '../config';

/**
 * Factory for creating podcast repositories
 */
export class PodcastRepositoryFactory extends BaseRepositoryFactory {
  /**
   * Create repository instance for podcast data
   */
  static createPodcastRepository() {
    return PodcastRepositoryFactory.currentProvider === DataProvider.SUPABASE
      ? new SupabasePodcastRepository()
      : new FirebasePodcastRepository();
  }
}

/**
 * Get repository instance for podcast data
 */
export function getPodcastRepository() {
  const provider = getDataProvider();
  
  if (provider === DataProvider.SUPABASE) {
    return new SupabasePodcastRepository();
  }
  
  return new FirebasePodcastRepository();
}
