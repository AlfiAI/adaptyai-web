
import { RepositoryFactory } from '../factory';
import { DataProvider } from '../config';
import type { BlogPostData, PodcastData, Conversation } from '../types';

/**
 * Utility to migrate data from Firebase to Supabase
 */
export class DataMigrationUtility {
  /**
   * Migrate blog posts from Firebase to Supabase
   */
  static async migrateBlogPosts(): Promise<{
    success: boolean;
    count: number;
    error?: string;
  }> {
    try {
      // Get Firebase repository
      RepositoryFactory.setProvider(DataProvider.FIREBASE);
      const firebaseBlogRepo = RepositoryFactory.createBlogRepository();
      
      // Fetch all blog posts from Firebase
      const blogPosts = await firebaseBlogRepo.getAll();
      
      // Switch to Supabase repository
      RepositoryFactory.setProvider(DataProvider.SUPABASE);
      const supabaseBlogRepo = RepositoryFactory.createBlogRepository();
      
      // Insert each blog post into Supabase
      let count = 0;
      for (const post of blogPosts) {
        const { id, ...postData } = post;
        await supabaseBlogRepo.create(postData);
        count++;
      }
      
      return { success: true, count };
    } catch (error) {
      console.error('Error migrating blog posts:', error);
      return { 
        success: false, 
        count: 0, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      // Reset to default provider
      RepositoryFactory.setProvider(DataProvider.FIREBASE);
    }
  }

  /**
   * Migrate podcasts from Firebase to Supabase
   */
  static async migratePodcasts(): Promise<{
    success: boolean;
    count: number;
    error?: string;
  }> {
    try {
      // Get Firebase repository
      RepositoryFactory.setProvider(DataProvider.FIREBASE);
      const firebasePodcastRepo = RepositoryFactory.createPodcastRepository();
      
      // Fetch all podcasts from Firebase
      const podcasts = await firebasePodcastRepo.getAll();
      
      // Switch to Supabase repository
      RepositoryFactory.setProvider(DataProvider.SUPABASE);
      const supabasePodcastRepo = RepositoryFactory.createPodcastRepository();
      
      // Insert each podcast into Supabase
      let count = 0;
      for (const podcast of podcasts) {
        const { id, ...podcastData } = podcast;
        await supabasePodcastRepo.create(podcastData);
        count++;
      }
      
      return { success: true, count };
    } catch (error) {
      console.error('Error migrating podcasts:', error);
      return { 
        success: false, 
        count: 0, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      // Reset to default provider
      RepositoryFactory.setProvider(DataProvider.FIREBASE);
    }
  }

  /**
   * Migrate conversations from Firebase to Supabase
   */
  static async migrateConversations(): Promise<{
    success: boolean;
    count: number;
    error?: string;
  }> {
    try {
      // Get Firebase repository
      RepositoryFactory.setProvider(DataProvider.FIREBASE);
      const firebaseConversationRepo = RepositoryFactory.createConversationRepository();
      
      // Fetch all conversations from Firebase
      const conversations = await firebaseConversationRepo.getAll();
      
      // Switch to Supabase repository
      RepositoryFactory.setProvider(DataProvider.SUPABASE);
      const supabaseConversationRepo = RepositoryFactory.createConversationRepository();
      
      // Insert each conversation into Supabase
      let count = 0;
      for (const conversation of conversations) {
        const { id, messages, ...conversationData } = conversation;
        
        // Create conversation without messages first
        const newId = await supabaseConversationRepo.create({
          ...conversationData,
          messages: [] // Empty array initially
        });
        
        // Add messages one by one
        if (messages && messages.length > 0) {
          for (const message of messages) {
            const { id: messageId, conversationId, ...messageData } = message;
            await supabaseConversationRepo.addMessage(newId, messageData);
          }
        }
        
        count++;
      }
      
      return { success: true, count };
    } catch (error) {
      console.error('Error migrating conversations:', error);
      return { 
        success: false, 
        count: 0, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      // Reset to default provider
      RepositoryFactory.setProvider(DataProvider.FIREBASE);
    }
  }
}
