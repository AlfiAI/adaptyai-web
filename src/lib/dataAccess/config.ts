
export enum DataProvider {
  FIREBASE = 'Firebase',
  SUPABASE = 'Supabase'
}

interface DataConfig {
  provider: DataProvider;
  debug: boolean;
  features: {
    blogs: DataProvider;
    podcasts: DataProvider;
    conversations: DataProvider;
    users: DataProvider;
    agents: DataProvider;
  }
}

/**
 * Central configuration for data access throughout the app.
 * Set the default provider and feature-specific overrides here.
 */
const dataConfig: DataConfig = {
  // Global default provider
  provider: DataProvider.SUPABASE,
  
  // Enable debugging logs
  debug: true,
  
  // Feature-specific provider overrides
  features: {
    blogs: DataProvider.SUPABASE,
    podcasts: DataProvider.SUPABASE,
    conversations: DataProvider.SUPABASE,
    users: DataProvider.SUPABASE,
    agents: DataProvider.SUPABASE
  }
};

export default dataConfig;
