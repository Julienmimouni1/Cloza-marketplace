"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, User, LogIn, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MENU_DATA } from "@/lib/menu-data";
import { SearchInput } from "@/components/shared/SearchInput";
import { Separator } from "@/components/ui/separator";

export function MobileNav({ session }: { session: Session | null }) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] pr-0">
        <SheetHeader className="px-4 text-left">
          <SheetTitle className="font-serif text-2xl font-bold tracking-tighter text-cloza-black">
            CLOZA
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full pb-6">
          <div className="px-4 py-4">
            <SearchInput 
              placeholder="Search..." 
              onSearch={() => setOpen(false)} 
              className="w-full"
            />
          </div>

          <ScrollArea className="flex-1 px-4">
            <div className="flex flex-col gap-4 py-4">
              {!session ? (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-sm font-bold text-white bg-zinc-900 px-4 py-3 rounded-xl hover:bg-zinc-800 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  Se connecter
                </Link>
              ) : (
                <>
                  {((session.user as { role?: string }).role === "ADMIN") && (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200 px-4 py-3 rounded-xl hover:bg-amber-100 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Panel Admin
                    </Link>
                  )}
                  {((session.user as { role?: string }).role === "VENDOR") && (
                    <Link
                      href="/vendor"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 text-sm font-bold text-zinc-700 bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-xl hover:bg-zinc-100 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Espace Vendeur
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium hover:text-cloza-gold px-4 py-2",
                      pathname === "/dashboard" && "text-cloza-gold font-bold"
                    )}
                  >
                    <User className="h-4 w-4" />
                    Mon Compte
                  </Link>
                </>
              )}
            </div>
            
            <Separator className="my-2" />

            <Accordion type="single" collapsible className="w-full">
              {MENU_DATA.map((item, index) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                
                return (
                  <AccordionItem value={`item-${index}`} key={item.title}>
                    {item.children ? (
                      <>
                        <AccordionTrigger 
                          className={cn(
                            "text-sm font-medium hover:text-cloza-gold hover:no-underline",
                            isActive && "text-cloza-gold font-bold"
                          )}
                        >
                          {item.title}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col gap-2 pl-4 border-l-2 border-zinc-100 ml-1">
                            {item.children.map((child) => (
                              <div key={child.title} className="flex flex-col gap-2">
                                {child.children ? (
                                  <Accordion type="single" collapsible className="w-full border-none">
                                    <AccordionItem value={child.title} className="border-none">
                                      <AccordionTrigger className="py-2 text-sm text-zinc-600 hover:text-cloza-gold hover:no-underline font-normal">
                                        {child.title}
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <div className="flex flex-col gap-2 pl-4 border-l-2 border-zinc-100 ml-1">
                                          {child.children.map((subChild) => (
                                            <Link
                                              key={subChild.title}
                                              href={subChild.href}
                                              onClick={() => setOpen(false)}
                                              className={cn(
                                                "text-sm text-zinc-500 hover:text-cloza-gold py-1",
                                                pathname === subChild.href && "text-cloza-gold font-semibold"
                                              )}
                                            >
                                              {subChild.title}
                                            </Link>
                                          ))}
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                ) : (
                                  <Link
                                    href={child.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                      "text-sm text-zinc-600 hover:text-cloza-gold py-2 block",
                                      pathname === child.href && "text-cloza-gold font-semibold"
                                    )}
                                  >
                                    {child.title}
                                  </Link>
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:text-cloza-gold [&[data-state=open]>svg]:rotate-180 text-sm",
                          isActive && "text-cloza-gold font-bold"
                        )}
                      >
                        {item.title}
                      </Link>
                    )}
                  </AccordionItem>
                );
              })}
            </Accordion>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
