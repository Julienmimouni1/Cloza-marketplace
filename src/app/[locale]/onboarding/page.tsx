import { auth } from "@/lib/auth";
import { redirect } from "@/navigation";
import { getLocale } from "next-intl/server";
import { CompanyInfoForm } from "@/features/identity/components/CompanyInfoForm";

export default async function OnboardingPage() {
  const session = await auth();
  const locale = await getLocale();

  if (!session?.user) {
    redirect({ href: "/login", locale });
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <div className="w-full max-w-2xl bg-white p-8 border border-zinc-100 shadow-sm">
        <CompanyInfoForm />
      </div>
    </div>
  );
}
