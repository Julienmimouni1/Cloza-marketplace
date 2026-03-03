
import 'dotenv/config'
import { PrismaClient, Category, ProductStatus } from '../src/generated/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = 'testboutique@junaid.com'
  const vendorName = 'Test Boutique'
  const csvPath = path.join(process.cwd(), 'docs/product-export-abs.csv')

  console.log(`🧹 Nettoyage des données de test...`)
  await prisma.product.deleteMany()
  await prisma.vendor.deleteMany()

  console.log(`👤 Création du compte utilisateur et vendeur pour ${email}...`)
  const hashedPassword = await bcrypt.hash('Test123!@#$', 12)
  
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN' }, // Garder admin pour que Julien puisse tout gérer
    create: {
      email,
      name: 'Test Boutique Admin',
      password: hashedPassword,
      role: 'ADMIN',
      kybStatus: 'APPROVED'
    }
  })

  const vendor = await prisma.vendor.create({
    data: {
      name: vendorName,
      slug: 'test-boutique',
      description: 'Votre boutique de test restaurée avec import Shopify.',
      userId: user.id,
      isFeatured: true
    }
  })

  console.log(`📦 Lecture du CSV Shopify : ${csvPath}`)
  const fileContent = fs.readFileSync(csvPath, 'utf-8')
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  })

  console.log(`🚀 Importation de ${records.length} produits...`)
  let count = 0

  for (const record of records) {
    if (!record.Title || !record.Handle) continue

    // Conversion des données Shopify vers notre schéma
    const price = Math.round(parseFloat(record['Variant Price'] || '0') * 100) // conversion en cents
    const sku = record['Variant SKU'] || `SKU-${record.Handle}-${count}`
    
    // Mapping des catégories
    let category: Category = Category.Beauty // Par défaut pour ces produits de soin
    if (record['Product Category']?.toLowerCase().includes('food')) category = Category.Food

    try {
      await prisma.product.create({
        data: {
          name: record.Title,
          slug: record.Handle + '-' + Math.random().toString(36).substring(7),
          description: record['Body (HTML)'] || '',
          priceHt: price || 1000,
          stock: parseInt(record['Variant Inventory Qty'] || '100'),
          sku: sku,
          category: category,
          subCategory: record.Type || 'Uncategorized',
          image: record['Image Src'] || 'https://placehold.co/600x400',
          status: ProductStatus.ACTIVE,
          vendorId: vendor.id,
          source: 'SHOPIFY',
          externalId: record.Handle
        }
      })
      count++
      if (count % 20 === 0) process.stdout.write('.')
    } catch (err) {
      // Ignorer les doublons de SKU si le CSV en contient
    }
  }

  console.log(`
✅ Restauration terminée !`)
  console.log(`   - Compte : ${email}`)
  console.log(`   - Vendeur : ${vendorName}`)
  console.log(`   - Produits importés : ${count}`)
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
