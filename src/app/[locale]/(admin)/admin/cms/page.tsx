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
    <div className="space-y-6 md:space-y-10">
      <div>
        <h1 className="font-serif text-3xl md:text-5xl font-black mb-2 md:mb-3 text-black tracking-tight uppercase">{t("title")}</h1>
        <p className="text-zinc-700 font-bold text-base md:text-xl italic">{t("subtitle")}</p>
      </div>

      <Tabs defaultValue="vendors" className="w-full">
        {/* Navigation CMS: Verticale sur Mobile, Horizontale sur Desktop */}
        <TabsList className="flex flex-col md:flex-row h-auto md:h-16 bg-transparent md:bg-zinc-100 p-0 md:p-1 gap-3 md:gap-0 w-full md:w-auto justify-start border-0 md:border-2 border-zinc-200 shadow-none md:shadow-sm mb-6 md:mb-0">
          <TabsTrigger 
            value="vendors" 
            className="w-full md:w-auto justify-start md:justify-center rounded-none bg-white md:bg-transparent data-[state=active]:bg-black md:data-[state=active]:bg-white data-[state=active]:text-white md:data-[state=active]:text-black border-2 border-zinc-200 md:border-0 md:border-b-2 border-transparent md:data-[state=active]:border-black px-6 md:px-10 h-16 md:h-12 font-black text-sm md:text-base uppercase tracking-widest transition-all shadow-md md:shadow-none"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Star className="mr-3 h-5 w-5" /> {t("vendors.title")}
              </div>
              <div className="md:hidden opacity-50 font-sans text-lg">→</div>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="trending" 
            className="w-full md:w-auto justify-start md:justify-center rounded-none bg-white md:bg-transparent data-[state=active]:bg-black md:data-[state=active]:bg-white data-[state=active]:text-white md:data-[state=active]:text-black border-2 border-zinc-200 md:border-0 md:border-b-2 border-transparent md:data-[state=active]:border-black px-6 md:px-10 h-16 md:h-12 font-black text-sm md:text-base uppercase tracking-widest transition-all shadow-md md:shadow-none"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <TrendingUp className="mr-3 h-5 w-5" /> {t("products.title")}
              </div>
              <div className="md:hidden opacity-50 font-sans text-lg">→</div>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="promotions" 
            className="w-full md:w-auto justify-start md:justify-center rounded-none bg-white md:bg-transparent data-[state=active]:bg-black md:data-[state=active]:bg-white data-[state=active]:text-white md:data-[state=active]:text-black border-2 border-zinc-200 md:border-0 md:border-b-2 border-transparent md:data-[state=active]:border-black px-6 md:px-10 h-16 md:h-12 font-black text-sm md:text-base uppercase tracking-widest transition-all shadow-md md:shadow-none"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Tag className="mr-3 h-5 w-5" /> {t("promotions.title")}
              </div>
              <div className="md:hidden opacity-50 font-sans text-lg">→</div>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="vendors" className="mt-6 md:mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="rounded-none border-2 md:border-4 border-zinc-900 shadow-xl md:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] bg-white overflow-hidden">
            <CardHeader className="border-b-2 md:border-b-4 border-zinc-900 bg-zinc-50 p-6 md:p-8">
              <CardTitle className="font-serif text-2xl md:text-3xl font-black text-black">{t("vendors.title")}</CardTitle>
              <CardDescription className="text-zinc-600 font-bold text-base md:text-lg mt-1">{t("vendors.manage")}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               <VendorCmsList vendors={vendors} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trending" className="mt-6 md:mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="rounded-none border-2 md:border-4 border-zinc-900 shadow-xl md:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] bg-white overflow-hidden">
            <CardHeader className="border-b-2 md:border-b-4 border-zinc-900 bg-zinc-50 p-6 md:p-8">
              <CardTitle className="font-serif text-2xl md:text-3xl font-black text-black">{t("products.title")}</CardTitle>
              <CardDescription className="text-zinc-600 font-bold text-base md:text-lg mt-1">{t("products.manage")}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               <ProductCmsList vendors={vendorsWithProducts} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="promotions" className="mt-6 md:mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="rounded-none border-2 md:border-4 border-zinc-900 shadow-xl md:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] bg-white overflow-hidden">
            <CardHeader className="border-b-2 md:border-b-4 border-zinc-900 bg-zinc-50 flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 gap-4">
              <div>
                <CardTitle className="font-serif text-2xl md:text-3xl font-black text-black">{t("promotions.title")}</CardTitle>
                <CardDescription className="text-zinc-600 font-bold text-base md:text-lg mt-1">{t("promotions.description")}</CardDescription>
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