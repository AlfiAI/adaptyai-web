
import { BaseSBRepository } from './baseSBRepository';
import { UserProfile } from '../../types';
import { DataRepository } from '../../types';

/**
 * Repository for user profiles using Supabase
 */
export class SupabaseUserRepository extends BaseSBRepository<UserProfile> implements DataRepository<UserProfile> {
  constructor() {
    super('profiles');
  }

  async getAll(): Promise<UserProfile[]> {
    try {
      const { data, error } = await this.getTable()
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        console.log(`No ${this.tableName} found in Supabase`);
        return [];
      }
      
      return data.map(item => ({
        id: item.id,
        email: item.email || '',
        displayName: item.display_name || '',
        role: item.role || 'viewer',
        createdAt: this.formatTimestamp(item.created_at),
        avatarUrl: item.avatar_url
      }));
    } catch (error) {
      return this.handleError(error, `get ${this.tableName}`);
    }
  }

  async getById(id: string): Promise<UserProfile | null> {
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
        email: data.email || '',
        displayName: data.display_name || '',
        role: data.role || 'viewer',
        createdAt: this.formatTimestamp(data.created_at),
        avatarUrl: data.avatar_url
      };
    } catch (error) {
      return this.handleError(error, `get ${this.tableName} by id`);
    }
  }

  async getByEmail(email: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.getTable()
        .select('*')
        .eq('email', email)
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
        email: data.email || '',
        displayName: data.display_name || '',
        role: data.role || 'viewer',
        createdAt: this.formatTimestamp(data.created_at),
        avatarUrl: data.avatar_url
      };
    } catch (error) {
      return this.handleError(error, `get ${this.tableName} by email`);
    }
  }

  async create(userData: Omit<UserProfile, 'id'>): Promise<string> {
    try {
      const { data, error } = await this.getTable()
        .insert({
          email: userData.email,
          display_name: userData.displayName || '',
          role: userData.role || 'viewer',
          avatar_url: userData.avatarUrl || null,
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

  async update(id: string, userData: Partial<UserProfile>): Promise<boolean> {
    try {
      // Convert from camelCase to snake_case for Supabase
      const updates: any = {};
      
      if (userData.displayName !== undefined) updates.display_name = userData.displayName;
      if (userData.email !== undefined) updates.email = userData.email;
      if (userData.role !== undefined) updates.role = userData.role;
      if (userData.avatarUrl !== undefined) updates.avatar_url = userData.avatarUrl;
      
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
