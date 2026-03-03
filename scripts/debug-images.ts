import { prisma } from '../src/lib/prisma';

async function checkProducts() {
  const slugs = [
    'vasu-huile-de-nigelle-125ml-default-title-1769265208443-1',
    'taliah-waajid-kinky-wavy-natural-herbal-style-shine-for-natural-hair-6oz-default-title-1769265209391-130'
  ];

  for (const slug of slugs) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { images: true }
    });

    console.log(`--- Product: ${slug} ---`);
    if (!product) {
      console.log('Product not found');
      continue;
    }
    console.log('Main image (field):', product.image);
    console.log('Images relation:', JSON.stringify(product.images, null, 2));
  }
}

checkProducts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
