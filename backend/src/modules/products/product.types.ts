export interface ProductVariantInput {
  id?: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string;
  priceAdjustment?: number;
  stockQuantity?: number;
  lowStockThreshold?: number;
  warehouseLocation?: string;
}

export interface ProductAttributeInput {
  name: string;
  value: string;
}

export interface ProductImageInput {
  imageUrl: string;
  altText?: string;
  isPrimary?: boolean;
  displayOrder?: number;
}

export interface CreateProductInput {
  name: string;
  sku: string;
  description: string;
  summary?: string;
  brandId: string;
  categoryId: string;
  subCategoryId?: string;
  basePrice: number;
  discountPrice?: number;
  taxRate?: number;
  gender?: 'MEN' | 'UNISEX';
  material?: string;
  fabric?: string;
  pattern?: string;
  fit?: string;
  style?: string;
  careInstructions?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'OUT_OF_STOCK';
  images?: ProductImageInput[];
  variants?: ProductVariantInput[];
  attributes?: ProductAttributeInput[];
  collectionIds?: string[];
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

export interface ProductQueryFilter {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  subCategoryId?: string;
  subCategorySlug?: string;
  brandId?: string;
  brandSlug?: string;
  collectionSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  material?: string;
  fabric?: string;
  fit?: string;
  gender?: 'MEN' | 'UNISEX';
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'OUT_OF_STOCK';
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  minRating?: number;
  inStock?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating' | 'discount' | 'name_asc';
}
