import { getAllUsers } from "@/features/admin/actions/users";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Search, 
  UserCog, 
  UserPlus, 
  ShieldCheck, 
  Ban,
  MoreVertical,
  ExternalLink,
  Store,
  UserCircle
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImpersonateButton } from "@/features/admin/components/users/ImpersonateButton";
import { getTranslations } from "next-intl/server";

export default async function AdminUsersPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string; role?: string }> 
}) {
  const { q, role = "ALL" } = await searchParams;
  const { users, stats } = await getAllUsers(q, role);
  
  const t = await getTranslations("Admin.users");
  const tc = await getTranslations("Common");

  const roles = [
    { id: "ALL", label: tc("all"), count: stats.ALL, icon: Users },
    { id: "RETAILER", label: "Retailers", count: stats.RETAILER, icon: UserCircle },
    { id: "VENDOR", label: "Brands", count: stats.VENDOR, icon: Store },
    { id: "ADMIN", label: "Admins", count: stats.ADMIN, icon: ShieldCheck },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-serif text-4xl font-black mb-2 text-black">{t("title")}</h1>
          <p className="text-zinc-700 font-bold text-lg">{t("subtitle")}</p>
        </div>
        <Button className="rounded-none bg-black hover:bg-zinc-800 h-12 px-6 font-bold text-base">
          <UserPlus className="mr-2 h-5 w-5" /> {t("addUser")}
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <Tabs defaultValue={role} className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <TabsList className="h-auto p-0 bg-transparent border-b-2 border-zinc-200 rounded-none w-full md:w-auto justify-start">
              {roles.map((r) => (
                <TabsTrigger
                  key={r.id}
                  value={r.id}
                  className="rounded-none border-b-4 border-transparent px-6 py-4 font-serif text-lg font-bold data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black text-zinc-500"
                  asChild
                >
                  <Link href={`/admin/users?role=${r.id}${q ? `&q=${q}` : ""}`}>
                    <r.icon className="mr-3 h-5 w-5" />
                    {r.label}
                    <span className="ml-3 px-2 py-1 text-xs bg-zinc-100 text-zinc-900 font-sans font-black border border-zinc-200">
                      {r.count}
                    </span>
                  </Link>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-900" />
              <form action="/admin/users" method="GET">
                <Input 
                  name="q"
                  placeholder={t("directory.searchPlaceholder")}
                  className="pl-12 rounded-none border-zinc-300 focus-visible:ring-black h-14 text-base font-bold placeholder:text-zinc-400"
                  defaultValue={q}
                />
                <input type="hidden" name="role" value={role} />
              </form>
            </div>
          </div>

          <Card className="rounded-none border-2 border-zinc-200 shadow-xl">
            <CardContent className="p-0">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-base font-sans">
                  <thead>
                    <tr className="border-b-2 border-zinc-200 bg-zinc-100">
                      <th className="h-16 px-6 text-left align-middle font-black text-black uppercase text-xs tracking-widest">{t("directory.columns.userAccount")}</th>
                      <th className="h-16 px-6 text-left align-middle font-black text-black uppercase text-xs tracking-widest">{t("directory.columns.role")}</th>
                      <th className="h-16 px-6 text-left align-middle font-black text-black uppercase text-xs tracking-widest">{t("directory.columns.kybStatus")}</th>
                      <th className="h-16 px-6 text-left align-middle font-black text-black uppercase text-xs tracking-widest">{t("directory.columns.joined")}</th>
                      <th className="h-16 px-6 text-right align-middle font-black text-black uppercase text-xs tracking-widest">{t("directory.columns.actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="h-40 text-center align-middle text-zinc-600 font-bold text-lg italic font-serif">{t("directory.noUsers")}</td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors group">
                          <td className="p-6 align-middle">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-none bg-zinc-200 flex items-center justify-center text-sm font-black text-black border-2 border-zinc-300 shadow-sm">
                                {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                  <div className="font-black text-black text-lg flex items-center gap-2">
                                    {user.name || t("directory.anonymous")}
                                    {user.role === "ADMIN" && <ShieldCheck className="h-4 w-4 text-emerald-600 fill-emerald-50" />}
                                  </div>
                                  <div className="text-sm text-zinc-700 font-bold flex items-center gap-2 mt-1">
                                    {user.email} 
                                    {user.companyName && (
                                      <>
                                        <span className="text-zinc-400 mx-1">•</span>
                                        <span className="text-black font-black bg-zinc-100 px-2 py-0.5 border border-zinc-200">{user.companyName}</span>
                                      </>
                                    )}
                                  </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-6 align-middle">
                            <span className={`inline-flex items-center px-3 py-1 text-xs font-black uppercase rounded-none border-2 shadow-sm ${
                              user.role === "ADMIN" ? "border-emerald-600 bg-emerald-50 text-emerald-800" :
                              user.role === "VENDOR" ? "border-amber-600 bg-amber-50 text-amber-900" :
                              "border-zinc-400 bg-white text-zinc-900"
                            }`}>
                              {user.role === "VENDOR" ? "Brand" : user.role === "RETAILER" ? "Retailer" : user.role}
                            </span>
                          </td>
                          <td className="p-6 align-middle">
                            <div className="flex items-center gap-3">
                              <div className={`h-2.5 w-2.5 rounded-full ${
                                user.kybStatus === "APPROVED" ? "bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
                                user.kybStatus === "REJECTED" ? "bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]" :
                                user.kybStatus === "IN_REVIEW" ? "bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.5)]" : "bg-zinc-400"
                              }`} />
                              <span className={`text-xs font-black uppercase tracking-widest ${
                                user.kybStatus === "APPROVED" ? "text-emerald-800" :
                                user.kybStatus === "REJECTED" ? "text-red-800" :
                                user.kybStatus === "IN_REVIEW" ? "text-amber-800" : "text-zinc-700"
                              }`}>
                                {user.kybStatus}
                              </span>
                            </div>
                          </td>
                          <td className="p-6 align-middle text-zinc-900 font-black text-sm">
                            {new Date(user.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="p-6 align-middle text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-12 w-12 p-0 hover:bg-zinc-200 rounded-none border border-zinc-200">
                                  <MoreVertical className="h-5 w-5 text-black" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-none border-2 border-black w-64 p-2 shadow-2xl font-sans">
                                <DropdownMenuLabel className="text-xs font-black uppercase text-zinc-500 tracking-widest py-3 px-2 border-b border-zinc-100 mb-1">{t("directory.userActions")}</DropdownMenuLabel>
                                <DropdownMenuItem asChild className="cursor-pointer py-3 px-2 font-bold focus:bg-zinc-100">
                                  <Link href={`/admin/users/${user.id}`} className="flex items-center">
                                    <UserCog className="mr-3 h-5 w-5" /> {t("directory.viewDetails")}
                                  </Link>
                                </DropdownMenuItem>
                                <ImpersonateButton userId={user.id} userName={user.name || user.email} />
                                <DropdownMenuSeparator className="bg-zinc-200 h-0.5" />
                                <DropdownMenuItem className="text-red-700 cursor-pointer py-3 px-2 font-black focus:bg-red-50 focus:text-red-800">
                                  <Ban className="mr-3 h-5 w-5" /> {t("directory.banUser")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}
