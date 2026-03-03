import { getTranslations } from 'next-intl/server';
import { PrismaClient } from '@/generated/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { KanbanBoard } from '@/features/crm/components/KanbanBoard';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function getLeads() {
  const leads = await prisma.lead.findMany({
    include: {
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  return leads;
}

export default async function CRMPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const leads = await getLeads();

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
      <KanbanBoard initialLeads={leads as any} locale={locale} />
    </div>
  );
}
