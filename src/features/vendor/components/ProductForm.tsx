"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductInput } from "../schemas";
import { ProductStatus, Category } from "@/generated/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MultiImageUpload } from "@/components/shared/MultiImageUpload";
import { createProduct, updateProduct } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { DefaultValues } from "react-hook-form";
import { useTranslations } from "next-intl";

interface ProductFormProps {
  initialData?: any; // Simplify for now to handle image relations
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("details");
  const t = useTranslations("Vendor.products.form");
  const tc = useTranslations("Common");
  const tp = useTranslations("Vendor.products");

  const tabs = ["details", "media", "pricing", "shipping"];

  const nextTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const prevTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const defaultValues: DefaultValues<ProductInput> = initialData ? {
    ...initialData,
    images: initialData.images || [],
    tags: initialData.tags || [],
  } : {
    name: "",
    description: "",
    priceHt: 0,
    discountPrice: null,
    taxRate: 20,
    stock: 0,
    category: Category.Textile,
    status: ProductStatus.DRAFT,
    weight: null,
    height: null,
    width: null,
    length: null,
    material: "",
    origin: "",
    tags: [],
    images: [],
  };

  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema) as any,
    defaultValues,
  });

  function onSubmit(data: ProductInput) {
    startTransition(async () => {
      let result;
      if (initialData?.id) {
        result = await updateProduct(initialData.id, data);
      } else {
        result = await createProduct(data);
      }

      if (result.success) {
        toast.success(initialData?.id ? t("messages.successUpdate") : t("messages.successCreate"));
        router.push("/vendor/products");
      } else {
        toast.error(result.error?.message || tc("error"));
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-nowrap w-full overflow-x-auto no-scrollbar justify-start sm:grid sm:grid-cols-4 bg-zinc-100 p-1 rounded-md mb-2">
            <TabsTrigger value="details" className="flex-1 min-w-[100px]">{t("tabs.details")}</TabsTrigger>
            <TabsTrigger value="media" className="flex-1 min-w-[100px]">{t("tabs.media")}</TabsTrigger>
            <TabsTrigger value="pricing" className="flex-1 min-w-[100px]">{t("tabs.pricing")}</TabsTrigger>
            <TabsTrigger value="shipping" className="flex-1 min-w-[100px]">{t("tabs.shipping")}</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 pt-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("labels.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("placeholders.name")} className="h-12 text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("labels.description")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t("placeholders.description")} className="min-h-[150px] text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.category")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder={t("placeholders.selectCategory")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Category.Textile}>Textile</SelectItem>
                        <SelectItem value={Category.Beauty}>Beauté</SelectItem>
                        <SelectItem value={Category.Food}>Alimentation</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.status")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder={t("placeholders.selectStatus")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ProductStatus.DRAFT}>{tp("statusDraft")}</SelectItem>
                        <SelectItem value={ProductStatus.ACTIVE}>{tp("statusActive")}</SelectItem>
                        <SelectItem value={ProductStatus.OUT_OF_STOCK}>{tp("statusOutOfStock")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="button" onClick={nextTab} className="w-full sm:w-auto h-12 px-8 bg-zinc-900">
                {t("tabs.media")} →
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-6 pt-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("labels.images")}</FormLabel>
                  <FormControl>
                    <MultiImageUpload 
                      value={field.value} 
                      onChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("descriptions.images")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button type="button" variant="outline" onClick={prevTab} className="h-12 flex-1">
                ← {t("tabs.details")}
              </Button>
              <Button type="button" onClick={nextTab} className="h-12 flex-1 bg-zinc-900">
                {t("tabs.pricing")} →
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6 pt-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="priceHt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.priceHt")}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" className="h-12 text-base" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.discountPrice")}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" className="h-12 text-base" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.taxRate")}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" className="h-12 text-base" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("labels.stock")}</FormLabel>
                  <FormControl>
                    <Input type="number" className="h-12 text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button type="button" variant="outline" onClick={prevTab} className="h-12 flex-1">
                ← {t("tabs.media")}
              </Button>
              <Button type="button" onClick={nextTab} className="h-12 flex-1 bg-zinc-900">
                {t("tabs.shipping")} →
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="space-y-6 pt-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("labels.weight")}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={t("placeholders.weight")} className="h-12 text-base" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>{t("descriptions.weight")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.length")}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" className="h-12 text-base" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.width")}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" className="h-12 text-base" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.height")}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" className="h-12 text-base" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="pt-4 flex">
              <Button type="button" variant="outline" onClick={prevTab} className="h-12 w-full sm:w-auto px-8">
                ← {t("tabs.pricing")}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 border-t pt-8 mt-4">
            <Button variant="ghost" type="button" onClick={() => router.back()} className="h-12 sm:h-10 text-slate-500">{tc("cancel")}</Button>
            <Button type="submit" disabled={isPending} className="min-w-full sm:min-w-[200px] h-14 bg-cloza-gold text-zinc-900 font-bold text-lg shadow-lg hover:bg-amber-500">
              {isPending ? t("messages.saving") : (initialData?.id ? tc("update") : tc("create"))}
            </Button>
        </div>
      </form>
    </Form>
  );
}

