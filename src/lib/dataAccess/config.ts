
import { DataProvider } from './factory';

// Configuration for the data access layer
const dataConfig = {
  // Default provider - using Firebase until Supabase integration is fully developed
  provider: DataProvider.FIREBASE,
  
  // Feature flags for specific functionality
  features: {
    blogs: DataProvider.FIREBASE,
    podcasts: DataProvider.FIREBASE, 
    conversations: DataProvider.FIREBASE,
  },
  
  // Set to true to enable debug logging
  debug: false
};

export default dataConfig;
