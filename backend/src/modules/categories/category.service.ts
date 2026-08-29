import { prisma } from '../../database/prisma';
import { NotFoundError, ConflictError } from '../../utils/errors';
import { CreateCategoryInput, CreateSubCategoryInput } from './category.types';

export class CategoryService {
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async getAllCategories() {
    return prisma.category.findMany({
      include: {
        subcategories: {
          include: {
            _count: { select: { products: true } },
          },
        },
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        subcategories: true,
        products: {
          where: { status: 'ACTIVE', deletedAt: null },
          include: {
            brand: true,
            images: { where: { isPrimary: true } },
            variants: { include: { inventory: true } },
          },
          take: 24,
        },
      },
    });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return category;
  }

  async createCategory(input: CreateCategoryInput) {
    const slug = this.generateSlug(input.name);
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictError('A category with this name already exists');
    }

    return prisma.category.create({
      data: {
        name: input.name,
        slug,
        description: input.description,
        imageUrl: input.imageUrl,
        isFeatured: input.isFeatured || false,
      },
    });
  }

  async createSubCategory(input: CreateSubCategoryInput) {
    const slug = this.generateSlug(input.name);
    const existing = await prisma.subCategory.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictError('A subcategory with this name already exists');
    }

    return prisma.subCategory.create({
      data: {
        categoryId: input.categoryId,
        name: input.name,
        slug,
        description: input.description,
        imageUrl: input.imageUrl,
      },
    });
  }
}

export const categoryService = new CategoryService();
