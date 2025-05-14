
// Data provider configuration
export enum DataProvider {
  FIREBASE = 'Firebase',
  SUPABASE = 'Supabase'
}

// Default data provider
const dataProvider: DataProvider = DataProvider.FIREBASE;

// Function to get the current data provider
export function getDataProvider(): DataProvider {
  return dataProvider;
}

// Function to set the data provider
export function setDataProvider(provider: DataProvider): void {
  (window as any).dataProvider = provider;
}
