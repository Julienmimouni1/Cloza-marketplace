
import 'dotenv/config'
import { PrismaClient } from '../src/generated/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('👥 Seeding test users...')
  const defaultPassword = process.env.DEFAULT_USER_PASSWORD
  if (!defaultPassword) {
    throw new Error('DEFAULT_USER_PASSWORD environment variable is not set')
  }
  const hashedPassword = await bcrypt.hash(defaultPassword, 12)

  const users = [
    { name: 'Admin User', email: 'admin@example.com', role: 'ADMIN' },
    { name: 'Marc Retailer', email: 'retailer1@example.com', role: 'RETAILER', companyName: 'Marc Digital Store' },
    { name: 'Alice Retailer', email: 'retailer2@example.com', role: 'RETAILER', companyName: 'Alice Modes' },
    { name: 'Bob Retailer', email: 'retailer3@example.com', role: 'RETAILER', companyName: 'Bob Goods' },
    { name: 'Claire Luxury', email: 'retailer4@example.com', role: 'RETAILER', companyName: 'Claire HighEnd' },
  ]

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        ...u,
        password: hashedPassword,
        kybStatus: 'APPROVED'
      }
    })
  }

  console.log('✅ 5 test users created successfully')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
