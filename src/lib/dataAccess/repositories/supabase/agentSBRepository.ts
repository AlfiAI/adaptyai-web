
import { BaseSBRepository } from './baseSBRepository';
import { AgentInfo } from '../../types';
import { DataRepository } from '../../types';

/**
 * Repository for AI agent information using Supabase
 */
export class SupabaseAgentRepository extends BaseSBRepository<AgentInfo> implements DataRepository<AgentInfo> {
  constructor() {
    super('agents');
  }

  async getAll(): Promise<AgentInfo[]> {
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
        name: item.name || 'Unnamed Agent',
        description: item.description || '',
        capabilities: item.capabilities || [],
        avatarUrl: item.avatar_url,
        createdAt: this.formatTimestamp(item.created_at),
        updatedAt: item.updated_at ? this.formatTimestamp(item.updated_at) : undefined
      }));
    } catch (error) {
      return this.handleError(error, `get ${this.tableName}`);
    }
  }

  async getById(id: string): Promise<AgentInfo | null> {
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
        name: data.name || 'Unnamed Agent',
        description: data.description || '',
        capabilities: data.capabilities || [],
        avatarUrl: data.avatar_url,
        createdAt: this.formatTimestamp(data.created_at),
        updatedAt: data.updated_at ? this.formatTimestamp(data.updated_at) : undefined
      };
    } catch (error) {
      return this.handleError(error, `get ${this.tableName} by id`);
    }
  }

  async create(agentData: Omit<AgentInfo, 'id'>): Promise<string> {
    try {
      const { data, error } = await this.getTable()
        .insert({
          name: agentData.name,
          description: agentData.description,
          capabilities: agentData.capabilities,
          avatar_url: agentData.avatarUrl,
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

  async update(id: string, agentData: Partial<AgentInfo>): Promise<boolean> {
    try {
      // Convert from camelCase to snake_case for Supabase
      const updates: any = {};
      
      if (agentData.name !== undefined) updates.name = agentData.name;
      if (agentData.description !== undefined) updates.description = agentData.description;
      if (agentData.capabilities !== undefined) updates.capabilities = agentData.capabilities;
      if (agentData.avatarUrl !== undefined) updates.avatar_url = agentData.avatarUrl;
      
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
