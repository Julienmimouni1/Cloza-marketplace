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
import { useTransition } from "react";
import { DefaultValues } from "react-hook-form";
import { useTranslations } from "next-intl";

interface ProductFormProps {
  initialData?: any; // Simplify for now to handle image relations
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Vendor.products.form");
  const tc = useTranslations("Common");
  const tp = useTranslations("Vendor.products");

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
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">{t("tabs.details")}</TabsTrigger>
            <TabsTrigger value="media">{t("tabs.media")}</TabsTrigger>
            <TabsTrigger value="pricing">{t("tabs.pricing")}</TabsTrigger>
            <TabsTrigger value="shipping">{t("tabs.shipping")}</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("labels.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("placeholders.name")} {...field} />
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
                    <Textarea placeholder={t("placeholders.description")} className="min-h-[150px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.category")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
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
                        <SelectTrigger>
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.material")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("placeholders.material")} {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.origin")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("placeholders.origin")} {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="media" className="pt-6">
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
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6 pt-6">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="priceHt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.priceHt")}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
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
                      <Input type="number" step="0.01" {...field} value={field.value || ""} />
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
                      <Input type="number" step="0.1" {...field} value={field.value || ""} />
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
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="shipping" className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("labels.weight")}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={t("placeholders.weight")} {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>{t("descriptions.weight")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("labels.length")}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} value={field.value || ""} />
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
                      <Input type="number" step="0.1" {...field} value={field.value || ""} />
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
                      <Input type="number" step="0.1" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 border-t pt-6">
            <Button variant="outline" type="button" onClick={() => router.back()}>{tc("cancel")}</Button>
            <Button type="submit" disabled={isPending} className="min-w-[150px]">
              {isPending ? t("messages.saving") : (initialData?.id ? tc("update") : tc("create"))}
            </Button>
        </div>
      </form>
    </Form>
  );
}

