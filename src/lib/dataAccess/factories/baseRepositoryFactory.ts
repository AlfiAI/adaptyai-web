
import { DataProvider, getDataProvider } from '../config';

/**
 * Base Repository Factory class with common functionality
 */
export abstract class BaseRepositoryFactory {
  protected static currentProvider: DataProvider = DataProvider.FIREBASE;

  /**
   * Set the data provider for all repositories
   */
  static setProvider(provider: DataProvider): void {
    BaseRepositoryFactory.currentProvider = provider;
  }

  /**
   * Get current data provider
   */
  static getProvider(): DataProvider {
    return BaseRepositoryFactory.currentProvider;
  }
}
