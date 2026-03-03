import { prisma } from "../src/lib/prisma";

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true } });
  const vendors = await prisma.vendor.findMany({ select: { id: true, name: true, userId: true } });

  console.log("--- USERS ---");
  console.table(users);

  console.log("\n--- VENDORS ---");
  console.table(vendors);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

