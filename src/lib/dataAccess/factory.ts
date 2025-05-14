
import { BaseRepositoryFactory } from './factories/baseRepositoryFactory';
import { AgentRepositoryFactory, getAgentRepository } from './factories/agentRepositoryFactory';
import { BlogRepositoryFactory, getBlogRepository } from './factories/blogRepositoryFactory';
import { PodcastRepositoryFactory, getPodcastRepository } from './factories/podcastRepositoryFactory';
import { ConversationRepositoryFactory, getConversationRepository } from './factories/conversationRepositoryFactory';
import { DataProvider } from './config';

/**
 * Repository Factory for creating and managing data repositories
 */
export class RepositoryFactory extends BaseRepositoryFactory {
  static setProvider(provider: DataProvider): void {
    BaseRepositoryFactory.setProvider(provider);
    AgentRepositoryFactory.setProvider(provider);
    BlogRepositoryFactory.setProvider(provider);
    PodcastRepositoryFactory.setProvider(provider);
    ConversationRepositoryFactory.setProvider(provider);
  }

  /**
   * Create repository instance for blog data
   */
  static createBlogRepository() {
    return BlogRepositoryFactory.createBlogRepository();
  }

  /**
   * Create repository instance for podcast data
   */
  static createPodcastRepository() {
    return PodcastRepositoryFactory.createPodcastRepository();
  }

  /**
   * Create repository instance for agent data
   */
  static createAgentRepository() {
    return AgentRepositoryFactory.createAgentRepository();
  }

  /**
   * Create repository instance for conversation data
   */
  static createConversationRepository() {
    return ConversationRepositoryFactory.createConversationRepository();
  }
}

// Re-export the individual repository factory functions
export {
  getAgentRepository,
  getBlogRepository,
  getPodcastRepository,
  getConversationRepository
};
