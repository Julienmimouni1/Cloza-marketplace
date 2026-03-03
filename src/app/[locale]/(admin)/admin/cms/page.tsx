import { getCmsData } from "@/features/admin/actions/cms";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VendorCmsList } from "@/features/admin/components/cms/VendorCmsList";
import { PromotionCmsList } from "@/features/admin/components/cms/PromotionCmsList";
import { ProductCmsList } from "@/features/admin/components/cms/ProductCmsList";
import { Star, Tag, TrendingUp } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function AdminCmsPage() {
  const { vendors, promotions, vendorsWithProducts } = await getCmsData();
  const t = await getTranslations("Admin.cms");

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-5xl font-black mb-3 text-black tracking-tight">{t("title")}</h1>
        <p className="text-zinc-700 font-bold text-xl">{t("subtitle")}</p>
      </div>

      <Tabs defaultValue="vendors" className="w-full">
        <TabsList className="rounded-none bg-zinc-100 p-1 h-16 w-full md:w-auto flex justify-start border-2 border-zinc-200">
          <TabsTrigger value="vendors" className="rounded-none data-[state=active]:bg-white data-[state=active]:shadow-md px-10 h-12 font-black text-base uppercase tracking-widest border-b-2 border-transparent data-[state=active]:border-black transition-all">
            <Star className="mr-3 h-5 w-5" /> {t("vendors.title")}
          </TabsTrigger>
          <TabsTrigger value="trending" className="rounded-none data-[state=active]:bg-white data-[state=active]:shadow-md px-10 h-12 font-black text-base uppercase tracking-widest border-b-2 border-transparent data-[state=active]:border-black transition-all">
            <TrendingUp className="mr-3 h-5 w-5" /> {t("products.title")}
          </TabsTrigger>
          <TabsTrigger value="promotions" className="rounded-none data-[state=active]:bg-white data-[state=active]:shadow-md px-10 h-12 font-black text-base uppercase tracking-widest border-b-2 border-transparent data-[state=active]:border-black transition-all">
            <Tag className="mr-3 h-5 w-5" /> {t("promotions.title")}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="vendors" className="mt-10">
          <Card className="rounded-none border-2 border-zinc-200 shadow-xl bg-white">
            <CardHeader className="border-b-2 border-zinc-100 bg-zinc-50 p-8">
              <CardTitle className="font-serif text-3xl font-black text-black">{t("vendors.title")}</CardTitle>
              <CardDescription className="text-zinc-600 font-bold text-lg mt-1">{t("vendors.manage")}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               <VendorCmsList vendors={vendors} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trending" className="mt-10">
          <Card className="rounded-none border-2 border-zinc-200 shadow-xl bg-white">
            <CardHeader className="border-b-2 border-zinc-100 bg-zinc-50 p-8">
              <CardTitle className="font-serif text-3xl font-black text-black">{t("products.title")}</CardTitle>
              <CardDescription className="text-zinc-600 font-bold text-lg mt-1">{t("products.manage")}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               <ProductCmsList vendors={vendorsWithProducts} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="promotions" className="mt-10">
          <Card className="rounded-none border-2 border-zinc-200 shadow-xl bg-white">
            <CardHeader className="border-b-2 border-zinc-100 bg-zinc-50 flex flex-row items-center justify-between p-8">
              <div>
                <CardTitle className="font-serif text-3xl font-black text-black">{t("promotions.title")}</CardTitle>
                <CardDescription className="text-zinc-600 font-bold text-lg mt-1">{t("promotions.description")}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
               <PromotionCmsList promotions={promotions} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}