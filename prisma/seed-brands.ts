import 'dotenv/config';
import { PrismaClient, Category } from '../src/generated/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const BRANDS = [
  {
    name: "L'Atelier de Soie",
    slug: "atelier-soie",
    description: "Maison lyonnaise spécialisée dans le textile haut de gamme et les accessoires en soie naturelle.",
    category: Category.Textile,
    logoUrl: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=1935&auto=format&fit=crop",
    email: "contact@ateliersoie.com"
  },
  {
    name: "Pureté Boréale",
    slug: "purete-boreale",
    description: "Soins cosmétiques naturels inspirés des rituels scandinaves. Ingrédients bio et éco-responsables.",
    category: Category.Beauty,
    logoUrl: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2070&auto=format&fit=crop",
    email: "hello@pureteboreale.com"
  },
  {
    name: "Le Comptoir d'Orée",
    slug: "comptoir-oree",
    description: "Épicerie fine méditerranéenne : huiles d'olive d'exception, épices rares et confiseries artisanales.",
    category: Category.Food,
    logoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop",
    email: "sales@comptoiroree.com"
  },
  {
    name: "Maison Cachemire",
    slug: "maison-cachemire",
    description: "Le luxe du cachemire accessible. Maille intemporelle et coupes modernes pour homme et femme.",
    category: Category.Textile,
    logoUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop",
    email: "pro@maisoncachemire.com"
  },
  {
    name: "Essence Marine",
    slug: "essence-marine",
    description: "Parfumerie de niche utilisant des extraits marins et des algues bretonnes pour des fragrances uniques.",
    category: Category.Beauty,
    logoUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop",
    email: "info@essencemarine.com"
  },
  {
    name: "Artisans du Goût",
    slug: "artisans-gout",
    description: "Chocolaterie artisanale et biscuits traditionnels fabriqués à partir de matières premières locales.",
    category: Category.Food,
    logoUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1978&auto=format&fit=crop",
    email: "contact@artisansgout.com"
  }
];

export async function seedBrands() {
  console.log('🌱 Début du seeding des marques...');

  const password = await bcrypt.hash('Cloza2026!', 10);

  for (const brand of BRANDS) {
    // 1. Créer ou mettre à jour l'utilisateur
    const user = await prisma.user.upsert({
      where: { email: brand.email },
      update: {
        role: "VENDOR",
        companyName: brand.name,
        kybStatus: "APPROVED",
        image: brand.logoUrl
      },
      create: {
        email: brand.email,
        name: brand.name,
        password,
        role: "VENDOR",
        companyName: brand.name,
        kybStatus: "APPROVED",
        image: brand.logoUrl
      },
    });

    // 2. Créer ou mettre à jour le profil Vendeur
    await prisma.vendor.upsert({
      where: { slug: brand.slug },
      update: {
        name: brand.name,
        description: brand.description,
        logoUrl: brand.logoUrl,
        isFeatured: true,
        userId: user.id
      },
      create: {
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        logoUrl: brand.logoUrl,
        isFeatured: true,
        userId: user.id
      },
    });

    console.log(`✅ Marque ajoutée : ${brand.name} (${brand.slug})`);
  }

  console.log('✨ Seeding des marques terminé !');
}

seedBrands()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
