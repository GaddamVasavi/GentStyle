export interface CreateCategoryInput {
  name: string;
  description?: string;
  imageUrl?: string;
  isFeatured?: boolean;
}

export interface CreateSubCategoryInput {
  categoryId: string;
  name: string;
  description?: string;
  imageUrl?: string;
}
