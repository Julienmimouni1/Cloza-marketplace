import 'dotenv/config';
import { PrismaClient, Category } from '../src/generated/client';
import { faker } from '@faker-js/faker';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';
import bcryptjs from 'bcryptjs';


const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Image IDs (Unsplash)
const TEXTILE_IMAGES = [
  "1515886657613-9f3515b0c78f", "1529139574466-a302327435a3", "1434389677669-e08b4cac3105",
  "1483985988355-763728e1935b", "1550614000-4b9519e0904b", "1485968579580-f60388910f41",
  "1492707892479-7bc8d5a4ee93", "1539109136881-3be0616acf4b", "1512436991641-6745cdb1723f",
  "1523381210434-271e8be1f52b", "1541339907198-e08756def63f", "1606103836293-0a063ee20566"
];

const BEAUTY_IMAGES = [
  "1571781926291-c477ebfd024b", "1596462502278-27bfdd403cc2", "1612817204324-7301e05ce8c0",
  "1556228852-6d35a585d566", "1620916566398-39f1143ab7be", "1608248597279-f99d160bfbc8",
  "1512496015851-a90fb38ba796", "1596755389378-c31d21fd1273", "1616683693504-3ea7e9ad6fec",
  "1570172619644-dfdac4ddf9ec"
];

const FOOD_IMAGES = [
  "1511018556341-d16986a1c194", "1504674900247-0877df9cc836", "1567620905732-2d1ec7ab7445",
  "1482049016688-2d3e1b311543", "1484723091739-30a097e8f929", "1476224203421-9ac39bcb3327",
  "1499028344343-cd56876358a3", "1455619452474-d2be8b1e70cd", "1565299624946-b28f40a0ae38",
  "1493770348161-369560ae357d"
];

function parseCsvLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuote = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result.map(c => c.replace(/^"|"$/g, '').trim());
}

async function main() {
  console.log('🌱 Starting massive seed...');

  // Cleanup
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.product.deleteMany();
  await prisma.vendor.deleteMany();
  console.log('🧹 Cleaned up database');

  // Create Vendors
  const vendorData = [];
  for(let i=0; i<20; i++) {
     vendorData.push({
         name: faker.company.name(),
         slug: faker.helpers.slugify(faker.company.name().toLowerCase() + "-" + i),
         description: faker.company.catchPhrase(),
         isFeatured: faker.datatype.boolean(0.2),
         logoUrl: `https://images.unsplash.com/photo-${faker.helpers.arrayElement([...TEXTILE_IMAGES, ...BEAUTY_IMAGES, ...FOOD_IMAGES])}?auto=format&fit=crop&w=200&h=200&q=80`
     });
  }
  vendorData.push(
      { name: "L'Artisan Parisien", slug: "l-artisan-parisien", description: "Haute couture...", isFeatured: true, logoUrl: "https://images.unsplash.com/photo-1541339907198-e08756def63f?auto=format&fit=crop&w=200&h=200&q=80" },
      { name: "Maison de Soie", slug: "maison-de-soie", description: "Premium silk...", isFeatured: true, logoUrl: "https://images.unsplash.com/photo-1606103836293-0a063ee20566?auto=format&fit=crop&w=200&h=200&q=80" },
      { name: "Éclat d'Or", slug: "eclat-d-or", description: "Luxury organic cosmetics...", isFeatured: true, logoUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=200&h=200&q=80" },
      { name: "Terroir & Co", slug: "terroir-and-co", description: "Curated fine food...", isFeatured: false, logoUrl: "https://images.unsplash.com/photo-1511018556341-d16986a1c194?auto=format&fit=crop&w=200&h=200&q=80" }
  );

  const createdVendors = [];
  for (const v of vendorData) {
      const existing = await prisma.vendor.findUnique({ where: { slug: v.slug } });
      if(!existing) createdVendors.push(await prisma.vendor.create({ data: v }));
  }
  console.log(`✅ Created ${createdVendors.length} vendors`);

  // Promotions
  const promotions = [
    { title: "Flash Sale: Luxury Silks", description: "Get 20% off all silk products...", discount: "-20%", code: "SILK20" },
    { title: "New Vendor: Éclat d'Or", description: "10% Welcome Discount...", discount: "-10%", code: "ECLAT10" }
  ];
  for (const p of promotions) await prisma.promotion.create({ data: p });
  console.log(`✅ Created ${promotions.length} active promotions`);

  // Parse CSV
  const csvPath = path.join(__dirname, '../old_version_cloza/_legacy/Cloza - Menu Structure.csv');
  
  if (!fs.existsSync(csvPath)) {
      console.error(`❌ CSV not found at ${csvPath}`);
      return;
  }
  
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  console.log('📊 Lines found:', lines.length);

  let productCount = 0;
  const dataLines = lines.slice(1);

  for (const line of dataLines) {
      const cols = parseCsvLine(line);
      
      if (cols.length < 3) {
        // console.log('⚠️ Skipping short line:', line);
        continue;
      }

      const l1 = cols[0]; 
      const l2 = cols[1]; 
      const l3 = cols[2];

      if (!l1 || !l2 || !l3) continue;

      let category: Category = Category.Textile;
      let images: string[] = TEXTILE_IMAGES;

      if (l1.includes("Textile")) { category = Category.Textile; images = TEXTILE_IMAGES; }
      else if (l1.includes("Beauty")) { category = Category.Beauty; images = BEAUTY_IMAGES; }
      else if (l1.includes("Food")) { category = Category.Food; images = FOOD_IMAGES; }

      for (let i = 0; i < 10; i++) {
          const vendor = createdVendors[Math.floor(Math.random() * createdVendors.length)];
          const name = `Premium ${l3} - ${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()}`;
          const slug = faker.helpers.slugify(`${name}-${faker.string.alphanumeric(8)}`).toLowerCase();
          const imageId = images[Math.floor(Math.random() * images.length)];
          
          const imageUrl = `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=800&q=80`;
          
          await prisma.product.create({
              data: {
                  name,
                  slug,
                  description: `A premium quality ${l3} from our ${l2} collection. ${faker.commerce.productDescription()}`,
                  priceHt: faker.number.int({ min: 2000, max: 50000 }),
                  stock: faker.number.int({ min: 10, max: 500 }),
                  sku: faker.string.alphanumeric(12).toUpperCase(),
                  category,
                  subCategory: l2,
                  leafCategory: l3,
                  image: imageUrl,
                  vendorId: vendor.id,
                  status: 'ACTIVE',
                  isTrending: faker.datatype.boolean(0.1), // 10% chance to be trending
                  images: {
                    create: {
                      url: imageUrl,
                      isMain: true,
                      order: 0
                    }
                  }
              }
          });
          productCount++;
      }
      if (productCount % 50 === 0) process.stdout.write(".");
  }

  console.log(`\n✅ Created ${productCount} products from CSV structure.`);

  // --- SEED SOPHIE'S DATA (For Dashboard Demo) ---
  console.log('👤 Seeding Sophie (Retailer Persona)...');
  
  // 1. Create Sophie
  const sophieEmail = "sophie@example.com";
  const defaultSophiePassword = process.env.SOPHIE_PASSWORD || "sophie123";
  const hashedSophiePassword = await bcryptjs.hash(defaultSophiePassword, 12);
  
  // Cleanup old Sophie if exists
  await prisma.user.deleteMany({ where: { email: sophieEmail } });

  const sophie = await prisma.user.create({
    data: {
      name: "Sophie",
      email: sophieEmail,
      role: "RETAILER",
      companyName: "Sophie Boutique",
      password: hashedSophiePassword,
      kybStatus: "APPROVED",
      creditLimit: 500000, // €5,000
      outstandingBalance: 124000, // €1,240
    }
  });

  // 2. Create Orders
  const products = await prisma.product.findMany({ take: 10, include: { vendor: true } });
  
  if (products.length > 0) {
      // Order 1: Active Shipment (Lumière Paris)
      const vendor1 = products[0].vendor;
      const order1 = await prisma.order.create({
        data: {
            buyerId: sophie.id,
            totalAmount: 124000,
            status: "PARTIALLY_FULFILLED",
            paymentMethod: "KLARNA_BNPL",
            createdAt: new Date("2026-10-20"),
            subOrders: {
                create: {
                    vendorId: vendor1.id,
                    status: "SHIPPED",
                    totalAmount: 124000,
                    commissionAmount: 12400,
                    trackingNumber: "CLZ-TRK-8821",
                    carrier: "DHL Express",
                    estimatedDelivery: new Date("2026-10-24"),
                    items: {
                        create: {
                            productId: products[0].id,
                            quantity: 12,
                            priceAtPurchase: products[0].priceHt
                        }
                    }
                }
            }
        }
      });

      // Order 2: Delivered (Nórdic Minimal)
      const vendor2 = products[1].vendor;
      await prisma.order.create({
        data: {
            buyerId: sophie.id,
            totalAmount: 85000,
            status: "COMPLETED",
            paymentMethod: "CARD",
            createdAt: new Date("2026-10-12"),
            subOrders: {
                create: {
                    vendorId: vendor2.id,
                    status: "DELIVERED",
                    totalAmount: 85000,
                    commissionAmount: 8500,
                    trackingNumber: "CLZ-TRK-8815",
                    carrier: "FedEx",
                    estimatedDelivery: new Date("2026-10-15"),
                    items: {
                        create: {
                            productId: products[1].id,
                            quantity: 8,
                            priceAtPurchase: products[1].priceHt
                        }
                    }
                }
            }
        }
      });
      
      console.log('📦 Created demo orders for Sophie');
  }

  console.log('✨ Massive Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
