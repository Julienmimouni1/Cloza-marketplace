import React from 'react';
import { notFound } from 'next/navigation';
import { getPolicyContent } from '@/lib/markdown';
import { PolicyRenderer } from '@/features/legal/components/PolicyRenderer';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function RefundPolicyPage({ params }: Props) {
  const { locale } = await params;
  const policyData = await getPolicyContent(locale, 'refund');

  if (!policyData) {
    notFound();
  }

  return <PolicyRenderer data={policyData} />;
}
