
// Import the DataProvider enum directly
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
    users: DataProvider.FIREBASE,
    agents: DataProvider.FIREBASE
  },
  
  // Set to true to enable debug logging
  debug: false
};

export default dataConfig;

// Helper functions to update configuration at runtime
export const updateDataProvider = (provider: DataProvider): void => {
  dataConfig.provider = provider;
  console.log(`Global data provider updated to: ${provider}`);
};

export const updateFeatureFlag = (feature: keyof typeof dataConfig.features, provider: DataProvider): void => {
  dataConfig.features[feature] = provider;
  console.log(`Feature flag '${feature}' updated to: ${provider}`);
};

export const setDebugMode = (debug: boolean): void => {
  dataConfig.debug = debug;
  console.log(`Debug mode ${debug ? 'enabled' : 'disabled'}`);
};
