import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function forceReset() {
  console.log("🛠️ Réinitialisation forcée des comptes de test...");

  const adminEmail = 'admin@cloza.com';
  const adminPassword = 'admin123';
  
  const vendorEmail = 'vendeur@cloza.com';
  const vendorPassword = 'vendeur123';

  const hashedAdmin = await bcrypt.hash(adminPassword, 10);
  const hashedVendor = await bcrypt.hash(vendorPassword, 10);

  // 1. Admin
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedAdmin,
      role: 'ADMIN',
      kybStatus: 'APPROVED',
      name: 'Super Admin'
    },
    create: {
      email: adminEmail,
      name: 'Super Admin',
      password: hashedAdmin,
      role: 'ADMIN',
      kybStatus: 'APPROVED'
    },
  });

  // 2. Vendeur
  const userVendor = await prisma.user.upsert({
    where: { email: vendorEmail },
    update: {
      password: hashedVendor,
      role: 'VENDOR',
      kybStatus: 'APPROVED',
      name: 'Test Vendeur'
    },
    create: {
      email: vendorEmail,
      name: 'Test Vendeur',
      password: hashedVendor,
      role: 'VENDOR',
      kybStatus: 'APPROVED'
    },
  });

  // 3. Boutique
  await prisma.vendor.upsert({
    where: { userId: userVendor.id },
    update: { name: "Ma boutique test", slug: "ma-boutique-test" },
    create: { name: "Ma boutique test", slug: "ma-boutique-test", userId: userVendor.id }
  });

  console.log("\n✅ Comptes réinitialisés avec succès !");
  console.log("-----------------------------------------");
  console.log(`ADMIN   : ${adminEmail} / ${adminPassword}`);
  console.log(`VENDEUR : ${vendorEmail} / ${vendorPassword}`);
  console.log("-----------------------------------------");
}

forceReset()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
