
// Data provider configuration
export enum DataProvider {
  FIREBASE = 'Firebase',
  SUPABASE = 'Supabase'
}

// Default data provider - changed from FIREBASE to SUPABASE
let dataProvider: DataProvider = DataProvider.SUPABASE;

// Feature flag configuration - updated all to use Supabase by default
const featureFlags: Record<string, DataProvider> = {
  blogs: DataProvider.SUPABASE,
  podcasts: DataProvider.SUPABASE,
  conversations: DataProvider.SUPABASE,
};

// Function to get the current data provider
export function getDataProvider(): DataProvider {
  return dataProvider;
}

// Function to set the data provider
export function setDataProvider(provider: DataProvider): void {
  dataProvider = provider;
}

// Update data provider globally
export function updateDataProvider(provider: DataProvider): void {
  setDataProvider(provider);
  
  // Update all feature flags
  Object.keys(featureFlags).forEach(feature => {
    featureFlags[feature] = provider;
  });
}

// Function to get feature flag provider
export function getFeatureProvider(feature: string): DataProvider {
  return featureFlags[feature] || dataProvider;
}

// Function to update feature flag provider
export function updateFeatureFlag(feature: string, provider: DataProvider): void {
  featureFlags[feature] = provider;
}
