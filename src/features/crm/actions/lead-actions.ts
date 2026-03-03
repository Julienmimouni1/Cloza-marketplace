
'use server';

import { revalidatePath } from 'next/cache';
import { PrismaClient, LeadStatus, LeadType } from '@/generated/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function updateLeadStatus(leadId: string, newStatus: LeadStatus) {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { 
        status: newStatus,
        activities: {
          create: {
            type: 'STATUS_CHANGE',
            content: `Statut mis à jour vers : ${newStatus}`,
            performedBy: 'system-admin'
          }
        }
      },
    });
    revalidatePath('/admin/crm');
    return { success: true };
  } catch (error) {
    console.error('Failed to update lead status:', error);
    return { success: false, error: 'Failed to update' };
  }
}

export async function createLead(formData: {
  companyName: string;
  email: string;
  type: LeadType;
  source: string;
  priority: number;
  phoneNumber?: string;
  website?: string;
}) {
  try {
    const lead = await prisma.lead.create({
      data: {
        ...formData,
        status: LeadStatus.NEW,
        activities: {
          create: {
            type: 'NOTE',
            content: `Nouveau prospect ajouté manuellement via le CRM. Source : ${formData.source}`,
            performedBy: 'system-admin'
          }
        }
      },
    });
    revalidatePath('/admin/crm');
    return { success: true, lead };
  } catch (error) {
    console.error('Failed to create lead:', error);
    return { success: false, error: 'Email already exists or invalid data' };
  }
}
