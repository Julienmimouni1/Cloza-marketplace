import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CompanyInfoForm } from "@/features/identity/components/CompanyInfoForm";

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <div className="w-full max-w-2xl bg-white p-8 border border-zinc-100 shadow-sm">
        <CompanyInfoForm />
      </div>
    </div>
  );
}
