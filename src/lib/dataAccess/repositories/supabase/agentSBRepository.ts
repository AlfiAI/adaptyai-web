
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
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        console.log(`No ${this.tableName} found in Supabase`);
        return [];
      }
      
      return data.map(item => ({
        id: item.id,
        name: item.name || 'Unnamed Agent',
        slug: item.slug,
        title: item.title,
        shortDescription: item.short_description,
        fullDescription: item.full_description,
        agentType: item.agent_type,
        description: item.full_description || '',
        capabilities: item.capabilities || [],
        avatarUrl: item.avatar_url,
        themeColor: item.theme_color,
        createdAt: this.formatTimestamp(item.created_at),
        updatedAt: item.updated_at ? this.formatTimestamp(item.updated_at) : undefined
      }));
    } catch (error) {
      return this.handleError(error, `get ${this.tableName}`);
    }
  }

  async getBySlug(slug: string): Promise<AgentInfo | null> {
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
        name: data.name,
        slug: data.slug,
        title: data.title,
        shortDescription: data.short_description,
        fullDescription: data.full_description,
        agentType: data.agent_type,
        description: data.full_description || '',
        capabilities: data.capabilities || [],
        avatarUrl: data.avatar_url,
        themeColor: data.theme_color,
        createdAt: this.formatTimestamp(data.created_at),
        updatedAt: data.updated_at ? this.formatTimestamp(data.updated_at) : undefined
      };
    } catch (error) {
      return this.handleError(error, `get ${this.tableName} by slug`);
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
        name: data.name,
        slug: data.slug,
        title: data.title,
        shortDescription: data.short_description,
        fullDescription: data.full_description,
        agentType: data.agent_type,
        description: data.full_description || '',
        capabilities: data.capabilities || [],
        avatarUrl: data.avatar_url,
        themeColor: data.theme_color,
        createdAt: this.formatTimestamp(data.created_at),
        updatedAt: data.updated_at ? this.formatTimestamp(data.updated_at) : undefined
      };
    } catch (error) {
      return this.handleError(error, `get ${this.tableName} by id`);
    }
  }

  async getAgentFeatures(agentId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('agent_features')
        .select('*')
        .eq('agent_id', agentId)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      return this.handleError(error, `get agent features`);
    }
  }

  async getAgentFaqs(agentId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('agent_faqs')
        .select('*')
        .eq('agent_id', agentId)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      return this.handleError(error, `get agent faqs`);
    }
  }

  async create(agentData: Omit<AgentInfo, 'id'>): Promise<string> {
    try {
      const { data, error } = await this.getTable()
        .insert({
          name: agentData.name,
          slug: agentData.slug,
          title: agentData.title,
          short_description: agentData.shortDescription,
          full_description: agentData.fullDescription,
          agent_type: agentData.agentType,
          capabilities: agentData.capabilities,
          avatar_url: agentData.avatarUrl,
          theme_color: agentData.themeColor,
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
      if (agentData.slug !== undefined) updates.slug = agentData.slug;
      if (agentData.title !== undefined) updates.title = agentData.title;
      if (agentData.shortDescription !== undefined) updates.short_description = agentData.shortDescription;
      if (agentData.fullDescription !== undefined) updates.full_description = agentData.fullDescription;
      if (agentData.agentType !== undefined) updates.agent_type = agentData.agentType;
      if (agentData.capabilities !== undefined) updates.capabilities = agentData.capabilities;
      if (agentData.avatarUrl !== undefined) updates.avatar_url = agentData.avatarUrl;
      if (agentData.themeColor !== undefined) updates.theme_color = agentData.themeColor;
      
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
