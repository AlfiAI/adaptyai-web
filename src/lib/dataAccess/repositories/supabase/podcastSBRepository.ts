
import { BaseSBRepository } from './baseSBRepository';
import { PodcastData } from '../../types';
import { DataRepository } from '../../types';

/**
 * Repository for podcast episodes using Supabase
 */
export class SupabasePodcastRepository extends BaseSBRepository<PodcastData> implements DataRepository<PodcastData> {
  constructor() {
    super('podcasts');
  }

  async getAll(): Promise<PodcastData[]> {
    try {
      const { data, error } = await this.getTable()
        .select('*')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        console.log(`No ${this.tableName} found in Supabase`);
        return [];
      }
      
      return data.map(item => ({
        id: item.id,
        title: item.title || 'Untitled Episode',
        description: item.description || 'No description available',
        audio_url: item.audio_url || '',
        guest_name: item.guest_name || '',
        duration: item.duration || '00:00',
        published_at: this.formatTimestamp(item.published_at),
        cover_image_url: item.cover_image_url || '/placeholder.svg'
      }));
    } catch (error) {
      return this.handleError(error, `get ${this.tableName}`);
    }
  }

  async getById(id: string): Promise<PodcastData | null> {
    try {
      const { data, error } = await this.getTable()
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Record not found
        }
        throw error;
      }
      
      if (!data) return null;
      
      return {
        id: data.id,
        title: data.title || 'Untitled Episode',
        description: data.description || 'No description available',
        audio_url: data.audio_url || '',
        guest_name: data.guest_name || '',
        duration: data.duration || '00:00',
        published_at: this.formatTimestamp(data.published_at),
        cover_image_url: data.cover_image_url || '/placeholder.svg'
      };
    } catch (error) {
      return this.handleError(error, `get ${this.tableName} by id`);
    }
  }

  async create(podcastData: Omit<PodcastData, 'id'>): Promise<string> {
    try {
      const { data, error } = await this.getTable()
        .insert({
          title: podcastData.title,
          description: podcastData.description,
          audio_url: podcastData.audio_url,
          guest_name: podcastData.guest_name || '',
          duration: podcastData.duration,
          cover_image_url: podcastData.cover_image_url,
          published_at: podcastData.published_at instanceof Date 
            ? podcastData.published_at.toISOString() 
            : podcastData.published_at
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      if (!data || !data.id) {
        throw new Error(`Failed to create ${this.tableName}`);
      }
      
      return data.id;
    } catch (error) {
      return this.handleError(error, `create ${this.tableName}`);
    }
  }

  async update(id: string, podcastData: Partial<PodcastData>): Promise<boolean> {
    try {
      const updates: any = { ...podcastData };
      
      // Convert Date objects to ISO strings for Supabase
      if (updates.published_at instanceof Date) {
        updates.published_at = updates.published_at.toISOString();
      }
      
      // Add updated_at timestamp
      updates.updated_at = new Date().toISOString();
      
      const { error } = await this.getTable()
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      return this.handleError(error, `update ${this.tableName}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await this.getTable()
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      return this.handleError(error, `delete ${this.tableName}`);
    }
  }
}
