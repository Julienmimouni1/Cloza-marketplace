import 'dotenv/config';
import { PrismaClient } from '../src/generated/client/client';
import { faker } from '@faker-js/faker';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('📦 Starting Orders Seeding...');

  // 1. Get existing data
  const vendors = await prisma.vendor.findMany();
  const products = await prisma.product.findMany();
  
  if (vendors.length === 0 || products.length === 0) {
    console.error('❌ No vendors or products found. Run npm run seed first.');
    return;
  }

  // 2. Create some Buyers
  console.log('👥 Creating Buyers...');
  const buyers = [];
  for (let i = 0; i < 10; i++) {
    const buyer = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        role: 'RETAILER',
        companyName: faker.company.name(),
        siret: faker.string.numeric(14),
        kybStatus: 'APPROVED',
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        zipCode: faker.location.zipCode(),
      },
    });
    buyers.push(buyer);
  }

  // 3. Create Orders
  console.log('🛒 Generating 50 Orders...');
  for (let i = 0; i < 50; i++) {
    const buyer = faker.helpers.arrayElement(buyers);
    const numItems = faker.number.int({ min: 1, max: 5 });
    const selectedProducts = faker.helpers.arrayElements(products, numItems);

    // Group by vendor for SubOrders
    const vendorGroups: Record<string, { items: any[]; total: number }> = {};
    let grandTotal = 0;

    for (const prod of selectedProducts) {
      const qty = faker.number.int({ min: 1, max: 3 });
      const itemTotal = prod.priceHt * qty;
      grandTotal += itemTotal;

      if (!vendorGroups[prod.vendorId]) {
        vendorGroups[prod.vendorId] = { items: [], total: 0 };
      }
      vendorGroups[prod.vendorId].items.push({ prod, qty, itemTotal });
      vendorGroups[prod.vendorId].total += itemTotal;
    }

    const orderDate = faker.date.recent({ days: 30 });

    // Create Order and SubOrders
    await prisma.order.create({
      data: {
        buyerId: buyer.id,
        totalAmount: grandTotal,
        paymentIntentId: `pi_${faker.string.alphanumeric(24)}`,
        paymentMethod: faker.helpers.arrayElement(['CARD', 'KLARNA_BNPL']),
        status: 'PAID',
        createdAt: orderDate,
        subOrders: {
          create: Object.entries(vendorGroups).map(([vendorId, group]) => ({
            vendorId: vendorId,
            totalAmount: group.total,
            commissionAmount: Math.floor(group.total * 0.15),
            status: faker.helpers.arrayElement(['PENDING_CONFIRMATION', 'CONFIRMED', 'SHIPPED', 'DELIVERED']),
            items: {
              create: group.items.map(item => ({
                productId: item.prod.id,
                quantity: item.qty,
                priceAtPurchase: item.prod.priceHt,
              })),
            },
          })),
        },
      },
    });

    if (i % 10 === 0) process.stdout.write('.');
  }

  console.log('\n✅ 50 Orders created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
