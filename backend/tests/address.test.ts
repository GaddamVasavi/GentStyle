import { addressService } from '../src/modules/addresses/address.service';
import { prisma } from '../src/database/prisma';

jest.mock('../src/database/prisma', () => {
  const mockPrisma: any = {
    address: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  return { prisma: mockPrisma };
});

describe('AddressModule - Unit & Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.$transaction as jest.Mock).mockImplementation(async (cb: any) => await cb(prisma));
  });

  it('should create an address and set as default if first address', async () => {
    (prisma.address.count as jest.Mock).mockResolvedValue(0);
    (prisma.address.create as jest.Mock).mockResolvedValue({
      id: 'addr-1',
      userId: 'usr-1',
      fullName: 'James Bond',
      phone: '+1 555 007',
      streetAddress1: '100 Mayfair Blvd',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
      isDefaultShipping: true,
      isDefaultBilling: true,
    });
    (prisma.address.updateMany as jest.Mock).mockResolvedValue({ count: 0 });

    const result = await addressService.createAddress('usr-1', {
      fullName: 'James Bond',
      phone: '+1 555 007',
      streetAddress1: '100 Mayfair Blvd',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
    });

    expect(result.id).toBe('addr-1');
    expect(result.isDefaultShipping).toBe(true);
  });

  it('should prevent fetching address belonging to another user', async () => {
    (prisma.address.findUnique as jest.Mock).mockResolvedValue({
      id: 'addr-1',
      userId: 'other-user',
    });

    await expect(addressService.getAddressById('addr-1', 'my-user')).rejects.toThrow(
      'You do not have permission to access this address'
    );
  });
});
