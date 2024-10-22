export interface Product {
  product_id: number;
  product_name: string;
  category_id: number;
  productCategories: ProductCategory;
  isDeleted: boolean;
}

export interface ProductCategory {
  category_id: number;
  category_name: string;
  isDeleted: boolean;
}
