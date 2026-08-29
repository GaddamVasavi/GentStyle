import { prisma } from '../../database/prisma';
import { NotFoundError, ConflictError } from '../../utils/errors';

export interface CreateCollectionInput {
  title: string;
  description?: string;
  bannerUrl?: string;
  season?: string;
  isFeatured?: boolean;
}

export class CollectionService {
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async getAllCollections() {
    return prisma.collection.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCollectionBySlug(slug: string) {
    const collection = await prisma.collection.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            product: {
              include: {
                brand: true,
                category: true,
                images: { where: { isPrimary: true } },
                variants: { include: { inventory: true } },
              },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!collection) {
      throw new NotFoundError('Curated Lookbook Collection not found');
    }

    return collection;
  }

  async createCollection(input: CreateCollectionInput) {
    const slug = this.generateSlug(input.title);
    const existing = await prisma.collection.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictError('A collection with this title already exists');
    }

    return prisma.collection.create({
      data: {
        title: input.title,
        slug,
        description: input.description,
        bannerUrl: input.bannerUrl,
        season: input.season,
        isFeatured: input.isFeatured || false,
      },
    });
  }
}

export const collectionService = new CollectionService();
