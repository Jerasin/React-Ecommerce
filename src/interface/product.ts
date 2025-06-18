export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  amount: number;
  imgUrl?: string;
  saleOpenDate?: string;
  saleCloseDate?: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  description: string;
}

export interface CreateProduct {
  name: string;
  description?: string;
  price: number;
  amount: number;
  imgUrl?: string;
  saleOpenDate?: string;
  saleCloseDate?: string;
}
