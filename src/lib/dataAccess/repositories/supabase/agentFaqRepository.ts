
import { BaseSBRepository } from './baseSBRepository';
import { AgentFaq } from '../../types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Repository for agent FAQs using Supabase
 */
export class AgentFaqRepository extends BaseSBRepository<AgentFaq> {
  constructor() {
    super('agent_faqs');
  }

  /**
   * Get all FAQs for a specific agent
   */
  async getByAgentId(agentId: string): Promise<AgentFaq[]> {
    try {
      const { data, error } = await supabase
        .from('agent_faqs')
        .select('*')
        .eq('agent_id', agentId)
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      
      return data.map(faq => this.mapToFaq(faq));
    } catch (error) {
      return this.handleError(error, 'get agent FAQs');
    }
  }
  
  /**
   * Map Supabase data to AgentFaq object
   */
  private mapToFaq(data: any): AgentFaq {
    return {
      id: data.id,
      agentId: data.agent_id,
      question: data.question,
      answer: data.answer,
      displayOrder: data.display_order,
      createdAt: data.created_at
    };
  }

  // Helper method to access the Supabase table
  protected getTable() {
    return supabase.from('agent_faqs');
  }

  protected tableName = 'agent_faqs';
}
