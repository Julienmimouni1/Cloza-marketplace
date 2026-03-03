
import { prisma } from '../src/lib/prisma';

async function check() {
  const vendor = await prisma.vendor.findUnique({
    where: { slug: "l-artisan-parisien" }
  });
  console.log("Vendor found:", vendor);
}

check();
