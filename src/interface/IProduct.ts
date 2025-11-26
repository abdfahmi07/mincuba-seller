export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  condition: string;
  unit: string;
  weight: string;
  min: number;
  stock: number;
  product_category_id: unknown;
  Category: unknown;
  store_id: number;
  active: boolean;
  Store: unknown;
  ProductImage: ProductImage[];
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  url: string;
  product_id: number;
  created_at: string;
  updated_at: string;
}

export interface ProductPayload {
  name?: string;
  description?: string;
  price?: number;
  condition?: string;
  unit?: string;
  weight?: number;
  min?: number;
  active?: boolean;
  stock?: number;
  images?: string[];
}
