import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./_components/SettingsForm";

export default async function SettingsPage() {
  const session = await auth();
  const t = await getTranslations("Dashboard");

  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      phoneNumber: true,
      companyName: true,
      siret: true,
      vatNumber: true,
      address: true,
      city: true,
      zipCode: true,
      kybStatus: true,
      createdAt: true,
      creditLimit: true,
    }
  });

  if (!user) return null;

  return (
    <div className="container py-8 max-w-7xl px-4 md:px-8">
      <div className="mb-8">
        <h2 className="font-serif text-2xl font-bold text-zinc-900">
          {t("menu.settings")}
        </h2>
        <p className="text-zinc-500 font-sans mt-1">Gérez vos informations de compte et vos préférences de sécurité.</p>
      </div>

      <SettingsForm user={user} />
    </div>
  );
}
