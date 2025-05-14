
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
   * Create a new FAQ for an agent
   */
  async createFaq(agentId: string, faq: Omit<AgentFaq, 'id' | 'agentId'>): Promise<string> {
    try {
      const { data, error } = await this.getTable()
        .insert({
          agent_id: agentId,
          question: faq.question,
          answer: faq.answer,
          display_order: faq.displayOrder
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      if (!data || !data.id) {
        throw new Error('Failed to create FAQ');
      }
      
      return data.id;
    } catch (error) {
      return this.handleError(error, 'create agent FAQ');
    }
  }

  /**
   * Update an existing FAQ
   */
  async updateFaq(faqId: string, faq: Partial<Omit<AgentFaq, 'id' | 'agentId'>>): Promise<boolean> {
    try {
      const updateData: any = {};
      
      if (faq.question) updateData.question = faq.question;
      if (faq.answer) updateData.answer = faq.answer;
      if (faq.displayOrder !== undefined) updateData.display_order = faq.displayOrder;
      
      const { error } = await this.getTable()
        .update(updateData)
        .eq('id', faqId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      return this.handleError(error, 'update agent FAQ');
    }
  }

  /**
   * Delete a FAQ
   */
  async deleteFaq(faqId: string): Promise<boolean> {
    try {
      const { error } = await this.getTable()
        .delete()
        .eq('id', faqId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      return this.handleError(error, 'delete agent FAQ');
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
}
