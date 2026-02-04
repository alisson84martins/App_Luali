import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/Product';

/**
 * Chave usada para armazenar produtos no AsyncStorage
 * O prefixo @ é uma convenção do AsyncStorage
 */
const PRODUCTS_KEY = '@luali_products';

/**
 * Serviço responsável pelo armazenamento local de produtos
 * Usa AsyncStorage para persistir dados no dispositivo
 * 
 * Funções disponíveis:
 * - saveProducts: Salva lista completa de produtos
 * - getProducts: Recupera todos os produtos
 * - addProduct: Adiciona novo produto
 * - updateProduct: Atualiza produto existente
 * - deleteProduct: Remove produto
 * - clearAll: Limpa todos os produtos
 */
export const StorageService = {
  /**
   * Salva a lista completa de produtos no armazenamento local
   * Substitui todos os dados existentes
   * 
   * @param products - Array de produtos a serem salvos
   * @throws Erro se a operação de salvamento falhar
   */
  async saveProducts(products: Product[]): Promise<void> {
    try {
      // Converte o array de produtos para JSON
      const jsonValue = JSON.stringify(products);
      // Salva no AsyncStorage
      await AsyncStorage.setItem(PRODUCTS_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving products:', e);
      throw e;
    }
  },

  /**
   * Recupera todos os produtos do armazenamento local
   * 
   * @returns Array de produtos ou array vazio se não houver produtos
   */
  async getProducts(): Promise<Product[]> {
    try {
      // Busca dados do AsyncStorage
      const jsonValue = await AsyncStorage.getItem(PRODUCTS_KEY);
      // Se existir dados, converte de JSON para array, senão retorna array vazio
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error reading products:', e);
      return [];
    }
  },

  /**
   * Adiciona um novo produto à lista existente
   * 
   * @param product - Produto a ser adicionado
   * @throws Erro se a operação falhar
   */
  async addProduct(product: Product): Promise<void> {
    try {
      // Carrega produtos existentes
      const products = await this.getProducts();
      // Adiciona novo produto ao final do array
      products.push(product);
      // Salva a lista atualizada
      await this.saveProducts(products);
    } catch (e) {
      console.error('Error adding product:', e);
      throw e;
    }
  },

  /**
   * Atualiza um produto existente
   * Busca pelo ID e substitui os dados
   * 
   * @param updatedProduct - Produto com dados atualizados
   * @throws Erro se a operação falhar
   */
  async updateProduct(updatedProduct: Product): Promise<void> {
    try {
      // Carrega produtos existentes
      const products = await this.getProducts();
      // Encontra o índice do produto a ser atualizado
      const index = products.findIndex(p => p.id === updatedProduct.id);
      // Se encontrou, substitui o produto
      if (index !== -1) {
        products[index] = updatedProduct;
        // Salva a lista atualizada
        await this.saveProducts(products);
      }
    } catch (e) {
      console.error('Error updating product:', e);
      throw e;
    }
  },

  /**
   * Remove um produto da lista
   * 
   * @param productId - ID do produto a ser removido
   * @throws Erro se a operação falhar
   */
  async deleteProduct(productId: string): Promise<void> {
    try {
      // Carrega produtos existentes
      const products = await this.getProducts();
      // Filtra removendo o produto com o ID especificado
      const filteredProducts = products.filter(p => p.id !== productId);
      // Salva a lista sem o produto removido
      await this.saveProducts(filteredProducts);
    } catch (e) {
      console.error('Error deleting product:', e);
      throw e;
    }
  },

  /**
   * Remove todos os produtos do armazenamento
   * Útil para limpar dados de teste ou resetar o app
   * 
   * @throws Erro se a operação falhar
   */
  async clearAll(): Promise<void> {
    try {
      // Remove a chave completa do AsyncStorage
      await AsyncStorage.removeItem(PRODUCTS_KEY);
    } catch (e) {
      console.error('Error clearing products:', e);
      throw e;
    }
  }
};
