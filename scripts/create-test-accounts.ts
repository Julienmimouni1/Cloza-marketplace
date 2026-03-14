import 'dotenv/config';
import { PrismaClient } from '../src/generated/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Création des comptes de test...');

  const adminEmail = 'admin@cloza.com';
  const adminPassword = 'Admin123!@#$';
  
  const vendorEmail = 'junaid@cloza.com';
  const vendorPassword = 'Vendor123!@#$';

  const hashedAdminPassword = await bcrypt.hash(adminPassword, 12);
  const hashedVendorPassword = await bcrypt.hash(vendorPassword, 12);

  // 1. Création de l'Admin
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
      password: hashedAdminPassword,
      name: 'Super Admin',
      kybStatus: 'APPROVED'
    },
    create: {
      email: adminEmail,
      name: 'Super Admin',
      password: hashedAdminPassword,
      role: 'ADMIN',
      kybStatus: 'APPROVED'
    },
  });
  console.log(`✅ Compte Admin synchronisé : ${admin.email}`);

  // 2. Création de l'utilisateur Vendeur
  const vendorUser = await prisma.user.upsert({
    where: { email: vendorEmail },
    update: {
      role: 'VENDOR',
      password: hashedVendorPassword,
      name: 'Junaid Vendor',
      kybStatus: 'APPROVED'
    },
    create: {
      email: vendorEmail,
      name: 'Junaid Vendor',
      password: hashedVendorPassword,
      role: 'VENDOR',
      kybStatus: 'APPROVED'
    },
  });

  // 3. Création/Mise à jour du profil Vendor
  const vendorProfile = await prisma.vendor.upsert({
    where: { userId: vendorUser.id },
    update: {
      name: 'test boutique Junaid',
      slug: 'test-boutique-junaid',
    },
    create: {
      name: 'test boutique Junaid',
      slug: 'test-boutique-junaid',
      userId: vendorUser.id,
    },
  });

  console.log(`✅ Compte Vendeur synchronisé : ${vendorUser.email}`);
  console.log(`✅ Profil Boutique lié : ${vendorProfile.name} (${vendorProfile.slug})`);
  
  console.log('\n--- RÉCAPITULATIF ---');
  console.log(`Admin   : ${adminEmail} / ${adminPassword}`);
  console.log(`Vendeur : ${vendorEmail} / ${vendorPassword}`);
  console.log('----------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
