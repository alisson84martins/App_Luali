import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/Product';

const PRODUCTS_KEY = '@luali_products';

export const StorageService = {
  async saveProducts(products: Product[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(products);
      await AsyncStorage.setItem(PRODUCTS_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving products:', e);
      throw e;
    }
  },

  async getProducts(): Promise<Product[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(PRODUCTS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error reading products:', e);
      return [];
    }
  },

  async addProduct(product: Product): Promise<void> {
    try {
      const products = await this.getProducts();
      products.push(product);
      await this.saveProducts(products);
    } catch (e) {
      console.error('Error adding product:', e);
      throw e;
    }
  },

  async updateProduct(updatedProduct: Product): Promise<void> {
    try {
      const products = await this.getProducts();
      const index = products.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        products[index] = updatedProduct;
        await this.saveProducts(products);
      }
    } catch (e) {
      console.error('Error updating product:', e);
      throw e;
    }
  },

  async deleteProduct(productId: string): Promise<void> {
    try {
      const products = await this.getProducts();
      const filteredProducts = products.filter(p => p.id !== productId);
      await this.saveProducts(filteredProducts);
    } catch (e) {
      console.error('Error deleting product:', e);
      throw e;
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PRODUCTS_KEY);
    } catch (e) {
      console.error('Error clearing products:', e);
      throw e;
    }
  }
};
