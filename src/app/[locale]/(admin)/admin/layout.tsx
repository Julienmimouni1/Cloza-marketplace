import { auth, signOut } from "@/lib/auth";
import { redirect } from "@/navigation";
import { getLocale } from "next-intl/server";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Settings, 
  FileText, 
  AlertCircle,
  LogOut,
  Home,
  Banknote,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const locale = await getLocale();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect({ href: "/dashboard", locale });
  }

  const t = await getTranslations("Admin.sidebar");

  return (
    <div className="flex min-h-screen bg-zinc-50/50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white sticky top-0 h-screen hidden md:flex flex-col">
        <div className="p-6 border-b border-zinc-100 flex items-center gap-2">
          <div className="h-8 w-8 bg-black flex items-center justify-center">
            <span className="text-white font-serif font-bold text-xl">C</span>
          </div>
          <span className="font-serif font-bold text-xl tracking-tight">CLOZA <span className="text-xs font-sans text-cloza-gold ml-1">ADMIN</span></span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <AdminNavLink href="/admin" icon={<LayoutDashboard className="h-4 w-4" />} label={t("dashboard")} />
          <AdminNavLink href="/admin/crm" icon={<TrendingUp className="h-4 w-4" />} label={t("crm")} />
          <AdminNavLink href="/admin/users" icon={<Users className="h-4 w-4" />} label={t("users")} />
          <AdminNavLink href="/admin/kyb" icon={<ShieldCheck className="h-4 w-4" />} label={t("kyb")} />
          <AdminNavLink href="/admin/cms" icon={<FileText className="h-4 w-4" />} label={t("cms")} />
          <AdminNavLink href="/admin/finance" icon={<Banknote className="h-4 w-4" />} label={t("finance")} />
          <AdminNavLink href="/admin/disputes" icon={<AlertCircle className="h-4 w-4" />} label={t("disputes")} />
          <AdminNavLink href="/admin/settings" icon={<Settings className="h-4 w-4" />} label={t("settings")} />
        </nav>

        <div className="p-4 border-t border-zinc-100 space-y-2">
          <Button asChild variant="ghost" className="w-full justify-start text-zinc-700 hover:text-black font-bold py-6">
            <Link href="/">
              <Home className="mr-3 h-5 w-5" />
              {t("storefront")}
            </Link>
          </Button>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button type="submit" variant="ghost" className="w-full justify-start text-zinc-700 hover:text-red-700 hover:bg-red-50 font-bold py-6">
              <LogOut className="mr-3 h-5 w-5" />
              {t("signOut")}
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="h-20 border-b border-zinc-200 bg-white flex items-center justify-between px-10 sticky top-0 z-10 shadow-sm">
          <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-zinc-600">{t("controlCenter")}</h2>
          <div className="flex items-center gap-6">
             <div className="text-right mr-2 hidden sm:block">
                <p className="text-sm font-extrabold leading-none mb-1 text-black">{session.user.name}</p>
                <p className="text-[11px] text-cloza-gold font-sans uppercase font-black tracking-wider">{t("superAdmin")}</p>
             </div>
             <div className="h-10 w-10 rounded-full bg-zinc-100 border border-zinc-300 flex items-center justify-center">
                <Users className="h-5 w-5 text-zinc-800" />
             </div>
          </div>
        </header>
        <div className="p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

function AdminNavLink({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-none text-base font-bold transition-colors ${
        active 
          ? "bg-zinc-100 text-black border-l-2 border-black" 
          : "text-zinc-700 hover:text-black hover:bg-zinc-100"
      }`}
    >
      <div className="flex-shrink-0">{icon}</div>
      {label}
    </Link>
  );
}
