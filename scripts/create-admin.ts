import 'dotenv/config';
import { PrismaClient } from '../src/generated/client/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@cloza.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!@#$';
  const adminName = process.env.ADMIN_NAME || 'Super Admin';

  const users = [
    {
      email: adminEmail,
      name: adminName,
      password: adminPassword,
      role: 'ADMIN'
    }
  ];

  console.log('🚀 Syncing admin users...');

  for (const u of users) {
    const hashedPassword = await bcrypt.hash(u.password, 12);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        role: u.role,
        password: hashedPassword,
        name: u.name,
      },
      create: {
        email: u.email,
        name: u.name,
        password: hashedPassword,
        role: u.role,
      },
    });

    console.log(`✅ User sync: ${user.email} (Role: ${user.role}, Password: ${u.password})`);
  }
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
