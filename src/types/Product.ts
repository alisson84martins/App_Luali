export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  purchasePrice: number;
  salePrice: number;
  sizes: string[];
  colors: string[];
  description?: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  purchasePrice: string;
  salePrice: string;
  sizes: string;
  colors: string;
  description: string;
  quantity: string;
}
