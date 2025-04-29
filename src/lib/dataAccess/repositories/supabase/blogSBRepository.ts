
import { BaseSBRepository } from './baseSBRepository';
import { BlogPostData } from '../../types';
import { DataRepository } from '../../types';

/**
 * Repository for blog posts using Supabase
 */
export class SupabaseBlogRepository extends BaseSBRepository<BlogPostData> implements DataRepository<BlogPostData> {
  constructor() {
    super('blogs');
  }

  async getAll(): Promise<BlogPostData[]> {
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
        title: item.title || 'Untitled Post',
        excerpt: item.excerpt || 'No description available',
        body: item.body || '',
        author: item.author || 'Anonymous',
        published_at: this.formatTimestamp(item.published_at),
        tags: item.tags || [],
        cover_image_url: item.cover_image_url || '/placeholder.svg'
      }));
    } catch (error) {
      return this.handleError(error, `get ${this.tableName}`);
    }
  }

  async getById(id: string): Promise<BlogPostData | null> {
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
        title: data.title || 'Untitled Post',
        excerpt: data.excerpt || 'No description available',
        body: data.body || '',
        author: data.author || 'Anonymous',
        published_at: this.formatTimestamp(data.published_at),
        tags: data.tags || [],
        cover_image_url: data.cover_image_url || '/placeholder.svg'
      };
    } catch (error) {
      return this.handleError(error, `get ${this.tableName} by id`);
    }
  }

  async create(postData: Omit<BlogPostData, 'id'>): Promise<string> {
    try {
      const { data, error } = await this.getTable()
        .insert({
          title: postData.title,
          excerpt: postData.excerpt,
          body: postData.body,
          author: postData.author,
          tags: postData.tags,
          cover_image_url: postData.cover_image_url,
          published_at: postData.published_at instanceof Date 
            ? postData.published_at.toISOString() 
            : postData.published_at
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

  async update(id: string, postData: Partial<BlogPostData>): Promise<boolean> {
    try {
      const updates: any = { ...postData };
      
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
