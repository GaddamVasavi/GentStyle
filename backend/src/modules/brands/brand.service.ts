import { prisma } from '../../database/prisma';
import { NotFoundError, ConflictError } from '../../utils/errors';

export interface CreateBrandInput {
  name: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  website?: string;
  isFeatured?: boolean;
}

export class BrandService {
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async getAllBrands() {
    return prisma.brand.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getBrandBySlug(slug: string) {
    const brand = await prisma.brand.findUnique({
      where: { slug },
      include: {
        products: {
          where: { status: 'ACTIVE', deletedAt: null },
          include: {
            category: true,
            images: { where: { isPrimary: true } },
            variants: { include: { inventory: true } },
          },
          take: 24,
        },
      },
    });

    if (!brand) {
      throw new NotFoundError('Brand not found');
    }

    return brand;
  }

  async createBrand(input: CreateBrandInput) {
    const slug = this.generateSlug(input.name);
    const existing = await prisma.brand.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictError('A brand with this name already exists');
    }

    return prisma.brand.create({
      data: {
        name: input.name,
        slug,
        description: input.description,
        logoUrl: input.logoUrl,
        bannerUrl: input.bannerUrl,
        website: input.website,
        isFeatured: input.isFeatured || false,
      },
    });
  }
}

export const brandService = new BrandService();
