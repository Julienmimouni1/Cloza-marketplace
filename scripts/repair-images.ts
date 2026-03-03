import { PrismaClient } from '../src/generated/client';

const prisma = new PrismaClient();

async function repairProductImages() {
  console.log('Starting product image repair...');
  
  const products = await prisma.product.findMany({
    include: { images: true }
  });

  let repairedCount = 0;

  for (const product of products) {
    const mainImageUrl = product.images.find((img: any) => img.isMain)?.url || product.images[0]?.url;
    
    // If we have a real image in the relation but the main field is a placeholder or different
    if (mainImageUrl && product.image !== mainImageUrl) {
      await prisma.product.update({
        where: { id: product.id },
        data: { image: mainImageUrl }
      });
      repairedCount++;
      console.log(`Repaired product: ${product.name} (${product.slug})`);
    }
  }

  console.log(`Repair complete. Total repaired products: ${repairedCount}`);
}

repairProductImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());