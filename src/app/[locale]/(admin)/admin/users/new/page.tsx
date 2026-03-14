import { CreateUserForm } from "@/features/admin/components/users/CreateUserForm";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function CreateUserPage() {
  const t = await getTranslations("Admin.users");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin/users" 
          className="flex items-center text-zinc-500 hover:text-black font-bold text-sm uppercase tracking-widest transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Retour à la liste
        </Link>
        <div>
          <h1 className="font-serif text-4xl font-black mb-2 text-black">Créer un utilisateur</h1>
          <p className="text-zinc-700 font-bold text-lg italic">
            Ajoutez un nouveau Retailer, Brand ou Administrateur à la plateforme.
          </p>
        </div>
      </div>

      <div className="bg-white border-4 border-zinc-200 p-6 md:p-10 shadow-2xl">
        <CreateUserForm />
      </div>
    </div>
  );
}
