import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding GentStyle Database...');

  // 1. Seed Roles & Users
  const passwordHash = await bcrypt.hash('AdminSecurePassword123!', 10);
  const customerPasswordHash = await bcrypt.hash('Customer123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gentstyle.com' },
    update: {},
    create: {
      email: 'admin@gentstyle.com',
      passwordHash,
      firstName: 'Alexander',
      lastName: 'Sterling',
      role: 'ADMIN',
      status: 'ACTIVE',
      isEmailVerified: true,
      phone: '+1 (555) 019-2834',
    },
  });

  const customer1 = await prisma.user.upsert({
    where: { email: 'james.bond@gentstyle.com' },
    update: {},
    create: {
      email: 'james.bond@gentstyle.com',
      passwordHash: customerPasswordHash,
      firstName: 'James',
      lastName: 'Bond',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      isEmailVerified: true,
      phone: '+1 (555) 007-0007',
    },
  });

  // Ensure cart & wishlist exist
  await prisma.cart.upsert({
    where: { userId: customer1.id },
    update: {},
    create: { userId: customer1.id },
  });

  await prisma.wishlist.upsert({
    where: { userId: customer1.id },
    update: {},
    create: { userId: customer1.id },
  });

  // 2. Seed Addresses for demo customer
  await prisma.address.createMany({
    data: [
      {
        userId: customer1.id,
        fullName: 'James Bond',
        phone: '+1 (555) 007-0007',
        streetAddress1: '100 Mayfair Luxury Boulevard',
        streetAddress2: 'Penthouse 7B',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States',
        isDefaultShipping: true,
        isDefaultBilling: true,
      },
    ],
    skipDuplicates: true,
  });

  // 3. Seed Luxury Men's Fashion Brands
  const brandsData = [
    { name: 'Savile Row Bespoke', slug: 'savile-row-bespoke', description: 'Timeless British tailoring crafted with world-renowned heritage precision.' },
    { name: 'Milano Sartoria', slug: 'milano-sartoria', description: 'Contemporary Italian elegance and effortless sartorial drape.' },
    { name: 'Aurelius Heritage', slug: 'aurelius-heritage', description: 'Ultra-refined cashmere, wool blazers, and artisanal gentlemen outerwear.' },
    { name: 'Kurogane Denim', slug: 'kurogane-denim', description: 'Japanese selvedge denim woven on vintage shuttle looms.' },
    { name: 'Vanguard Chrono', slug: 'vanguard-chrono', description: 'Swiss-movement luxury timepieces for the discerning connoisseur.' },
    { name: 'Monaco Footwear', slug: 'monaco-footwear', description: 'Handcrafted Goodyear-welted leather oxfords, loafers, and Chelsea boots.' },
  ];

  for (const b of brandsData) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    });
  }

  // 4. Seed Product Categories & Subcategories
  const categoriesData = [
    {
      name: 'Suits & Blazers',
      slug: 'suits-blazers',
      description: 'Hand-tailored tuxedoes, two-piece suits, and structured Italian blazers.',
      subcategories: [
        { name: 'Two-Piece Suits', slug: 'two-piece-suits' },
        { name: 'Tuxedos', slug: 'tuxedos' },
        { name: 'Sport Coats & Blazers', slug: 'sport-coats-blazers' },
        { name: 'Waistcoats & Vests', slug: 'waistcoats-vests' },
      ],
    },
    {
      name: 'Shirts',
      slug: 'shirts',
      description: 'Crisp Egyptian cotton dress shirts, oxford button-downs, and linen summer shirts.',
      subcategories: [
        { name: 'Dress Shirts', slug: 'dress-shirts' },
        { name: 'Casual Oxford Shirts', slug: 'casual-oxford-shirts' },
        { name: 'Linen Shirts', slug: 'linen-shirts' },
      ],
    },
    {
      name: 'Trousers & Jeans',
      slug: 'trousers-jeans',
      description: 'Pleated wool trousers, tailored chinos, and premium selvedge denim.',
      subcategories: [
        { name: 'Tailored Trousers', slug: 'tailored-trousers' },
        { name: 'Chinos', slug: 'chinos' },
        { name: 'Selvedge Jeans', slug: 'selvedge-jeans' },
      ],
    },
    {
      name: 'Jackets & Coats',
      slug: 'jackets-coats',
      description: 'Leather biker jackets, cashmere overcoats, trench coats, and field jackets.',
      subcategories: [
        { name: 'Overcoats & Trench', slug: 'overcoats-trench' },
        { name: 'Leather Jackets', slug: 'leather-jackets' },
        { name: 'Bomber & Field Jackets', slug: 'bomber-field-jackets' },
      ],
    },
    {
      name: 'Shoes',
      slug: 'shoes',
      description: 'Handmade Oxfords, Derbies, Loafers, Chelsea Boots, and Minimalist Sneakers.',
      subcategories: [
        { name: 'Oxford & Derby Shoes', slug: 'oxford-derby-shoes' },
        { name: 'Loafers & Monks', slug: 'loafers-monks' },
        { name: 'Chelsea Boots', slug: 'chelsea-boots' },
        { name: 'Luxury Sneakers', slug: 'luxury-sneakers' },
      ],
    },
    {
      name: 'Watches & Accessories',
      slug: 'watches-accessories',
      description: 'Mechanical timepieces, full-grain leather belts, silk ties, and cufflinks.',
      subcategories: [
        { name: 'Automatic Watches', slug: 'automatic-watches' },
        { name: 'Leather Belts & Wallets', slug: 'leather-belts-wallets' },
        { name: 'Silk Ties & Pocket Squares', slug: 'silk-ties-pocket-squares' },
        { name: 'Sunglasses & Cufflinks', slug: 'sunglasses-cufflinks' },
      ],
    },
  ];

  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        isFeatured: true,
      },
    });

    for (const sub of cat.subcategories) {
      await prisma.subCategory.upsert({
        where: { slug: sub.slug },
        update: {},
        create: {
          categoryId: category.id,
          name: sub.name,
          slug: sub.slug,
        },
      });
    }
  }

  // 5. Seed Curated Collections
  const collectionsData = [
    { title: 'Office Wear', slug: 'office-wear', description: 'Sharp boardroom silhouettes and commanding business attire.', season: 'All Season' },
    { title: 'Weekend Casual', slug: 'weekend-casual', description: 'Relaxed knitwear, selvedge denim, and effortless suede loafers.', season: 'Spring/Summer' },
    { title: 'Party & Black Tie', slug: 'party-wear', description: 'Velvet dinner jackets, peak-lapel tuxedos, and silk bowtie sets.', season: 'Evening' },
    { title: 'Summer Riviera', slug: 'summer-collection', description: 'Breathable linen shirts, lightweight pleated trousers, and driving loafers.', season: 'Summer' },
    { title: 'Winter Cashmere', slug: 'winter-collection', description: 'Double-breasted wool overcoats, merino turtlenecks, and leather gloves.', season: 'Winter' },
    { title: 'Wedding & Ceremonial', slug: 'wedding-collection', description: 'Bespoke three-piece suits for grooms and distinguished guests.', season: 'Ceremonial' },
    { title: 'Modern Streetwear', slug: 'streetwear', description: 'Elevated oversized tailoring, Japanese denim, and luxury sneakers.', season: 'Urban' },
    { title: 'The Royal Sovereign Collection', slug: 'premium-collection', description: 'Limited-run bespoke garments in Super 180s wool and mulberry silk.', season: 'Signature' },
  ];

  for (const col of collectionsData) {
    await prisma.collection.upsert({
      where: { slug: col.slug },
      update: {},
      create: {
        title: col.title,
        slug: col.slug,
        description: col.description,
        season: col.season,
        isFeatured: true,
      },
    });
  }

  // 6. Seed Coupons
  await prisma.coupon.upsert({
    where: { code: 'GENTLEMAN15' },
    update: {},
    create: {
      code: 'GENTLEMAN15',
      description: '15% Off Your Entire Luxury Order',
      type: 'PERCENTAGE',
      value: 15,
      minOrderAmount: 100,
      maxDiscount: 200,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2027-12-31'),
      isActive: true,
      usageLimit: 1000,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'WELCOME50' },
    update: {},
    create: {
      code: 'WELCOME50',
      description: 'Flat $50 Off On Orders Above $250',
      type: 'FIXED_AMOUNT',
      value: 50,
      minOrderAmount: 250,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2027-12-31'),
      isActive: true,
      usageLimit: 500,
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('Admin Email: admin@gentstyle.com');
  console.log('Customer Email: james.bond@gentstyle.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
