
import { BaseSBRepository } from './baseSBRepository';
import { BlogPostData } from '../../types';
import { DataRepository } from '../../types';

/**
 * Repository for blog posts using Supabase
 */
export class SupabaseBlogRepository extends BaseSBRepository<BlogPostData> implements DataRepository<BlogPostData> {
  constructor() {
    super('posts');
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
        body: item.content || '',
        author: 'Admin', // Default author since we don't have an author field
        published_at: this.formatTimestamp(item.published_at),
        tags: item.tags || [],
        cover_image_url: item.cover_image_url || '/placeholder.svg',
        slug: item.slug,
        featured: item.featured || false
      }));
    } catch (error) {
      return this.handleError(error, `get ${this.tableName}`);
    }
  }

  async getBySlug(slug: string): Promise<BlogPostData | null> {
    try {
      const { data, error } = await this.getTable()
        .select('*')
        .eq('slug', slug)
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
        body: data.content || '',
        author: 'Admin', // Default author
        published_at: this.formatTimestamp(data.published_at),
        tags: data.tags || [],
        cover_image_url: data.cover_image_url || '/placeholder.svg',
        slug: data.slug,
        featured: data.featured || false
      };
    } catch (error) {
      return this.handleError(error, `get ${this.tableName} by slug`);
    }
  }

  async getFeatured(): Promise<BlogPostData | null> {
    try {
      const { data, error } = await this.getTable()
        .select('*')
        .eq('featured', true)
        .order('published_at', { ascending: false })
        .limit(1)
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
        body: data.content || '',
        author: 'Admin', // Default author
        published_at: this.formatTimestamp(data.published_at),
        tags: data.tags || [],
        cover_image_url: data.cover_image_url || '/placeholder.svg',
        slug: data.slug,
        featured: data.featured
      };
    } catch (error) {
      return this.handleError(error, `get featured ${this.tableName}`);
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
        body: data.content || '',
        author: 'Admin', // Default author
        published_at: this.formatTimestamp(data.published_at),
        tags: data.tags || [],
        cover_image_url: data.cover_image_url || '/placeholder.svg',
        slug: data.slug,
        featured: data.featured || false
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
          content: postData.body,
          slug: postData.slug,
          tags: postData.tags,
          cover_image_url: postData.cover_image_url,
          featured: postData.featured || false,
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
      
      // Map body to content for Supabase
      if (updates.body) {
        updates.content = updates.body;
        delete updates.body;
      }
      
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
