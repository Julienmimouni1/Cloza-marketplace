"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { MENU_DATA, type MenuItem } from "@/lib/menu-data";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function MegaMenu() {
  const pathname = usePathname();
  const t = useTranslations('Categories');

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {MENU_DATA.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          
          return (
            <NavigationMenuItem key={item.title}>
              {item.children ? (
                <>
                  <NavigationMenuTrigger 
                    className={cn(
                      "bg-transparent text-sm font-medium hover:text-cloza-gold focus:text-cloza-gold data-[state=open]:text-cloza-gold",
                      isActive && "text-cloza-gold font-semibold"
                    )}
                  >
                    {t(item.title as any)}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[90vw] max-w-[1200px] gap-3 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {/* "All [Category]" Link */}
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="flex h-full w-full select-none flex-col justify-start rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md group"
                          >
                            <div className="mb-2 mt-0 text-lg font-medium text-cloza-gold">
                              {t('ViewAll')} {t(item.title as any)}
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              {t('Explore')} {t(item.title as any)}
                            </p>
                            <div className="mt-4 flex items-center text-sm font-semibold text-foreground">
                              {t('Explore')} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>

                      {item.children.map((child) => (
                        <ListItem
                          key={child.title}
                          title={t(child.title as any)}
                          href={child.href}
                          hasSubmenu={!!child.children}
                        >
                          {child.children && (
                            <div className="mt-2 flex flex-col gap-1">
                              {child.children.map((subChild) => (
                                <Link
                                  key={subChild.title}
                                  href={subChild.href}
                                  className="text-xs text-muted-foreground hover:text-cloza-gold block py-0.5 cursor-pointer transition-colors"
                                >
                                  {t(subChild.title as any)}
                                </Link>
                              ))}
                            </div>
                          )}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:text-cloza-gold focus:text-cloza-gold",
                      isActive && "text-cloza-gold font-semibold"
                    )}
                  >
                    {t(item.title as any)}
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string; hasSubmenu?: boolean }
>(({ className, title, children, hasSubmenu, href, ...props }, ref) => {
  return (
    <li className={cn(hasSubmenu ? "row-span-3" : "")}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none mb-2">{title}</div>
          {children}
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

