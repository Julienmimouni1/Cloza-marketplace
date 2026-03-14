import { Link } from "@/navigation";
import { User } from "lucide-react";
import { CartIndicator } from "@/features/cart/components/CartIndicator";
import { auth } from "@/lib/auth";
import { MegaMenu } from "@/components/shared/MegaMenu";
import { MobileNav } from "@/components/shared/MobileNav";
import { SearchInput } from "@/components/shared/SearchInput";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getTranslations, getLocale } from "next-intl/server";

const Header = async () => {
  const session = await auth();
  const userPath = session ? "/dashboard" : "/login";
  const t = await getTranslations('Header');
  const locale = await getLocale();

  return (
    <header className="w-full border-b bg-background shadow-sm relative z-50">
      <div className="flex flex-col">
        {/* Top Row: Logo, Search, Actions */}
        <div className="container px-4 lg:px-6 grid grid-cols-[1fr_auto_1fr] h-20 items-center py-4">
          {/* Logo Area */}
          <div className="flex justify-start items-center">
            <Link href="/" className="flex items-center space-x-2 shrink-0">
              <span className="font-serif text-2xl lg:text-3xl font-bold tracking-tighter text-cloza-black whitespace-nowrap">
                CLOZA
              </span>
            </Link>
          </div>

          {/* Centered Search Bar - Width matched to categories */}
          <div className="hidden md:flex justify-center items-center px-4">
            <div className="w-[500px] lg:w-[400px] xl:w-[550px] max-w-[50vw]">
              <SearchInput />
            </div>
          </div>

          {/* Actions Area - Shifted to the far right */}
          <div className="flex items-center justify-end gap-1.5 lg:gap-2 xl:gap-4">
            {!session ? (
              <div className="flex items-center gap-1.5 xl:gap-3">
                <Link
                  href="/login"
                  className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 px-2 transition-colors"
                >
                  {t('signIn')}
                </Link>
                <Link
                  href="/register?role=retailer"
                  className="hidden xl:flex items-center text-xs font-bold uppercase tracking-wider text-zinc-700 hover:text-zinc-900 border border-zinc-200 bg-white hover:bg-zinc-50 px-4 py-2 rounded-full transition-all whitespace-nowrap"
                >
                  {t('buyerSpace')}
                </Link>
                <Link
                  href="/register?role=vendor"
                  className="hidden lg:flex items-center text-[10px] xl:text-xs font-bold uppercase tracking-wider text-white bg-zinc-900 hover:bg-zinc-800 px-3 xl:px-4 py-2 rounded-full transition-all whitespace-nowrap"
                >
                  {t('vendorSpace')}
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 xl:gap-3">
                {((session.user as { role?: string }).role === "ADMIN") && (
                  <Link
                    href="/admin"
                    className="hidden lg:flex items-center text-[10px] xl:text-xs font-bold uppercase tracking-wider text-amber-700 hover:text-amber-800 border border-amber-200 bg-amber-50 hover:bg-amber-100 px-3 xl:px-4 py-2 rounded-full transition-colors whitespace-nowrap"
                  >
                    Admin Panel
                  </Link>
                )}
                {((session.user as { role?: string }).role === "VENDOR") && (
                  <Link
                    href="/vendor"
                    className="hidden lg:flex items-center text-[10px] xl:text-xs font-bold uppercase tracking-wider text-zinc-700 hover:text-zinc-800 border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 px-3 xl:px-4 py-2 rounded-full transition-colors whitespace-nowrap"
                  >
                    {t('vendorSpace')}
                  </Link>
                )}
                <Link href={userPath} className="p-1.5 xl:p-2 hover:bg-muted rounded-full text-foreground flex items-center gap-1.5 xl:gap-2 transition-colors whitespace-nowrap">
                  <User className="h-5 w-5" />
                  <span className="hidden xl:inline text-xs font-semibold uppercase tracking-wider">
                    {t('account')}
                  </span>
                </Link>
              </div>
            )}

            <LanguageSwitcher initialLocale={locale} />
            <CartIndicator />
            <MobileNav session={session} />
          </div>
        </div>

        {/* Bottom Row: Categories (MegaMenu) */}
        <div className="hidden md:block border-t border-zinc-100">
          <div className="container flex justify-center py-2">
            <MegaMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

