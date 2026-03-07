'use client';

import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import { LayoutDashboard, ShoppingBag, CreditCard, Settings } from "lucide-react";

export function DashboardNav() {
  const t = useTranslations("Dashboard.menu");
  const pathname = usePathname();

  const routes = [
    {
      href: "/dashboard",
      label: t("home"),
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/orders",
      label: t("orders"),
      icon: ShoppingBag,
      active: pathname === "/dashboard/orders",
    },
    {
      href: "/dashboard/payments",
      label: t("payments"),
      icon: CreditCard,
      active: pathname === "/dashboard/payments",
    },
    {
      href: "/dashboard/settings",
      label: t("settings"),
      icon: Settings,
      active: pathname === "/dashboard/settings",
    },
  ];

  return (
    <nav className="flex items-center gap-1 border-b border-zinc-100 bg-white px-4 md:px-8 overflow-x-auto no-scrollbar">
      <div className="container flex h-14 max-w-7xl items-center gap-8">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-cloza-gold relative h-full px-1",
              route.active ? "text-cloza-gold" : "text-zinc-500"
            )}
          >
            <route.icon className="h-4 w-4" />
            {route.label}
            {route.active && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-cloza-gold rounded-full" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
