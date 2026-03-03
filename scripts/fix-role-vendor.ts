import { prisma } from "../src/lib/prisma";

async function main() {
  const email = "sophie@example.com"; 

  console.log(`Updating role for ${email} to VENDOR...`);

  await prisma.user.update({
    where: { email },
    data: { role: 'VENDOR' }, // Use standardized role
  });

  console.log("✅ Role updated! Login redirection should now work.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
