/**
 * Interface que define a estrutura de um produto no sistema
 * Representa todos os dados de um produto armazenado
 */
export interface Product {
  /** Identificador único do produto (UUID) */
  id: string;
  
  /** Nome do produto */
  name: string;
  
  /** Código SKU único gerado automaticamente */
  sku: string;
  
  /** Código de barras EAN-13 */
  barcode: string;
  
  /** Preço de compra do produto em reais */
  purchasePrice: number;
  
  /** Preço de venda do produto em reais */
  salePrice: number;
  
  /** Array com os tamanhos disponíveis (ex: ["P", "M", "G"]) */
  sizes: string[];
  
  /** Array com as cores disponíveis (ex: ["Preto", "Branco"]) */
  colors: string[];
  
  /** Descrição detalhada do produto (opcional) */
  description?: string;
  
  /** Quantidade em estoque */
  quantity: number;
  
  /** Data e hora de criação do produto (ISO 8601) */
  createdAt: string;
  
  /** Data e hora da última atualização (ISO 8601) */
  updatedAt: string;
}

/**
 * Interface que define os dados do formulário de produto
 * Usado para capturar entrada do usuário antes de converter para Product
 * Todos os campos são strings para facilitar a entrada de texto
 */
export interface ProductFormData {
  /** Nome do produto */
  name: string;
  
  /** Preço de compra como string (ex: "10.50") */
  purchasePrice: string;
  
  /** Preço de venda como string (ex: "15.00") */
  salePrice: string;
  
  /** Tamanhos separados por vírgula (ex: "P, M, G") */
  sizes: string;
  
  /** Cores separadas por vírgula (ex: "Preto, Branco") */
  colors: string;
  
  /** Descrição do produto */
  description: string;
  
  /** Quantidade como string (ex: "10") */
  quantity: string;
}
