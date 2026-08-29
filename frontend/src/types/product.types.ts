export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  website?: string | null;
  isFeatured: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  isFeatured: boolean;
  subcategories?: SubCategory[];
  _count?: { products: number };
}

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  altText?: string | null;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Inventory {
  id: string;
  variantId: string;
  quantity: number;
  reservedQuantity: number;
  lowStockThreshold: number;
  warehouseLocation?: string | null;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string;
  priceAdjustment: number | string;
  inventory?: Inventory | null;
}

export interface ProductAttribute {
  id: string;
  productId: string;
  name: string;
  value: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string | null;
  comment: string;
  isVerified: boolean;
  likesCount: number;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    avatar?: string | null;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  summary?: string | null;
  brandId: string;
  brand: Brand;
  categoryId: string;
  category: Category;
  subCategoryId?: string | null;
  subCategory?: SubCategory | null;
  basePrice: number | string;
  discountPrice?: number | string | null;
  taxRate: number | string;
  gender: 'MEN' | 'UNISEX';
  material?: string | null;
  fabric?: string | null;
  pattern?: string | null;
  fit?: string | null;
  style?: string | null;
  careInstructions?: string | null;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'OUT_OF_STOCK';
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  averageRating: number | string;
  reviewCount: number;
  viewCount: number;
  images: ProductImage[];
  variants: ProductVariant[];
  attributes?: ProductAttribute[];
  reviews?: Review[];
  relatedProducts?: Product[];
  createdAt: string;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  bannerUrl?: string | null;
  season?: string | null;
  isFeatured: boolean;
  products?: Array<{
    id: string;
    product: Product;
  }>;
}
