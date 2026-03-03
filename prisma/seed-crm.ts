
import 'dotenv/config'
import { PrismaClient, LeadStatus, LeadType } from '../src/generated/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding CRM data...')

  // 1. Create a "Hot" Lead (Retailer)
  const leadSophie = await prisma.lead.upsert({
    where: { email: 'sophie.martin@chic-boutique.fr' },
    update: {},
    create: {
      type: LeadType.RETAILER,
      status: LeadStatus.QUALIFIED,
      companyName: 'Chic Boutique Paris',
      contactName: 'Sophie Martin',
      email: 'sophie.martin@chic-boutique.fr',
      phoneNumber: '+33612345678',
      website: 'https://chic-boutique.fr',
      source: "Salon Who's Next",
      priority: 3,
      tags: ['Luxe', 'Paris', 'Femme'],
      activities: {
        create: [
          {
            type: 'MEETING_NOTE',
            content: 'Rencontrée au salon. Très intéressée par la collection soie.',
            performedBy: 'system-admin'
          },
          {
            type: 'EMAIL',
            content: 'Catalogue envoyé le 20/02.',
            performedBy: 'system-admin'
          }
        ]
      }
    }
  })
  console.log(`Created Lead: ${leadSophie.companyName}`)

  // 2. Create a "Cold" Lead (Vendor)
  const leadMarc = await prisma.lead.upsert({
    where: { email: 'marc@leather-goods.it' },
    update: {},
    create: {
      type: LeadType.VENDOR,
      status: LeadStatus.NEW,
      companyName: 'Leather Goods Italia',
      contactName: 'Marc Rossi',
      email: 'marc@leather-goods.it',
      source: 'LinkedIn',
      priority: 1,
      tags: ['Maroquinerie', 'Italie'],
      activities: {
        create: [
          {
            type: 'NOTE',
            content: 'Profil LinkedIn identifié. À contacter.',
            performedBy: 'system-admin'
          }
        ]
      }
    }
  })
  console.log(`Created Lead: ${leadMarc.companyName}`)

   // 3. Create a "Converted" Lead (Vendor)
   // Note: In a real scenario, this would link to an existing User/Vendor. 
   // For seeding, we just create the record to show the status.
   const leadConverted = await prisma.lead.upsert({
    where: { email: 'contact@already-onboarded.com' },
    update: {},
    create: {
      type: LeadType.VENDOR,
      status: LeadStatus.CONVERTED,
      companyName: 'Already Onboarded Inc.',
      contactName: 'Jean Dupont',
      email: 'contact@already-onboarded.com',
      source: 'Referral',
      priority: 2,
      tags: ['Textile', 'Bio'],
      activities: {
        create: [
          {
            type: 'STATUS_CHANGE',
            content: 'Lead converti en Vendeur actif.',
            performedBy: 'system-admin'
          }
        ]
      }
    }
  })
  console.log(`Created Lead: ${leadConverted.companyName}`)

  console.log('✅ CRM Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
