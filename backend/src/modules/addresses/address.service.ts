import { prisma } from '../../database/prisma';
import { NotFoundError, ForbiddenError } from '../../utils/errors';
import { CreateAddressInput, UpdateAddressInput } from './address.types';
import { logger } from '../../config/logger';

export class AddressService {
  /**
   * Get all addresses for a user
   */
  async getUserAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefaultShipping: 'desc' }, { createdAt: 'desc' }],
    });
  }

  /**
   * Get single address by ID with ownership verification
   */
  async getAddressById(addressId: string, userId: string) {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundError('Address not found');
    }

    if (address.userId !== userId) {
      throw new ForbiddenError('You do not have permission to access this address');
    }

    return address;
  }

  /**
   * Create a new address for user
   */
  async createAddress(userId: string, input: CreateAddressInput) {
    return prisma.$transaction(async (tx) => {
      // Check if this is the user's first address, make default
      const count = await tx.address.count({ where: { userId } });
      const makeDefaultShipping = input.isDefaultShipping || count === 0;
      const makeDefaultBilling = input.isDefaultBilling || count === 0;

      if (makeDefaultShipping) {
        await tx.address.updateMany({
          where: { userId, isDefaultShipping: true },
          data: { isDefaultShipping: false },
        });
      }

      if (makeDefaultBilling) {
        await tx.address.updateMany({
          where: { userId, isDefaultBilling: true },
          data: { isDefaultBilling: false },
        });
      }

      const address = await tx.address.create({
        data: {
          userId,
          fullName: input.fullName,
          phone: input.phone,
          streetAddress1: input.streetAddress1,
          streetAddress2: input.streetAddress2,
          city: input.city,
          state: input.state,
          postalCode: input.postalCode,
          country: input.country || 'United States',
          isDefaultShipping: makeDefaultShipping,
          isDefaultBilling: makeDefaultBilling,
        },
      });

      logger.info(`Address created for user ${userId}: ${address.id}`);
      return address;
    });
  }

  /**
   * Update existing address
   */
  async updateAddress(addressId: string, userId: string, input: UpdateAddressInput) {
    const existing = await this.getAddressById(addressId, userId);

    return prisma.$transaction(async (tx) => {
      if (input.isDefaultShipping && !existing.isDefaultShipping) {
        await tx.address.updateMany({
          where: { userId, isDefaultShipping: true },
          data: { isDefaultShipping: false },
        });
      }

      if (input.isDefaultBilling && !existing.isDefaultBilling) {
        await tx.address.updateMany({
          where: { userId, isDefaultBilling: true },
          data: { isDefaultBilling: false },
        });
      }

      const updated = await tx.address.update({
        where: { id: addressId },
        data: input,
      });

      logger.info(`Address updated: ${addressId}`);
      return updated;
    });
  }

  /**
   * Set address as default shipping
   */
  async setDefaultShipping(addressId: string, userId: string) {
    await this.getAddressById(addressId, userId);

    return prisma.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { userId, isDefaultShipping: true },
        data: { isDefaultShipping: false },
      });

      return tx.address.update({
        where: { id: addressId },
        data: { isDefaultShipping: true },
      });
    });
  }

  /**
   * Set address as default billing
   */
  async setDefaultBilling(addressId: string, userId: string) {
    await this.getAddressById(addressId, userId);

    return prisma.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { userId, isDefaultBilling: true },
        data: { isDefaultBilling: false },
      });

      return tx.address.update({
        where: { id: addressId },
        data: { isDefaultBilling: true },
      });
    });
  }

  /**
   * Delete address
   */
  async deleteAddress(addressId: string, userId: string) {
    await this.getAddressById(addressId, userId);

    await prisma.address.delete({
      where: { id: addressId },
    });

    logger.info(`Address deleted: ${addressId}`);
    return { success: true, message: 'Address deleted' };
  }
}

export const addressService = new AddressService();
