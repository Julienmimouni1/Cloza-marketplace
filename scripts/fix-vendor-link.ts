import { prisma } from "../src/lib/prisma";

async function main() {
  const email = "sophie@example.com"; // Default demo user
  const vendorName = "L'Artisan Parisien";

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error(`User ${email} not found`);

  const vendor = await prisma.vendor.findFirst({ where: { name: vendorName } });
  if (!vendor) throw new Error(`Vendor ${vendorName} not found`);

  console.log(`Linking User ${user.name} (${user.id}) to Vendor ${vendor.name} (${vendor.id})...`);

  await prisma.vendor.update({
    where: { id: vendor.id },
    data: { userId: user.id },
  });
  
  // Also make sure user has correct role
  await prisma.user.update({
      where: { id: user.id },
      data: { role: 'RETAILER', companyName: vendorName } // Or VENDOR if we had that role separate
  });

  console.log("✅ Successfully linked! You can now access /vendor/integrations");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
