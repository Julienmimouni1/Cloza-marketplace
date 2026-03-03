"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PromotionSchema, type PromotionInput } from "../../schemas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createPromotion, updatePromotion } from "../../actions/cms";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string | null;
  expiresAt: Date | null;
  isActive: boolean;
}

interface PromotionFormDialogProps {
  promotion?: Promotion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PromotionFormDialog({
  promotion,
  open,
  onOpenChange,
}: PromotionFormDialogProps) {
  const t = useTranslations("Admin.cms.promotions.form");
  const tCommon = useTranslations("Common");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PromotionInput>({
    resolver: zodResolver(PromotionSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      discount: "",
      code: "",
      expiresAt: null,
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (promotion) {
        form.reset({
          title: promotion.title,
          description: promotion.description,
          discount: promotion.discount,
          code: promotion.code || "",
          expiresAt: promotion.expiresAt,
          isActive: promotion.isActive,
        });
      } else {
        form.reset({
          title: "",
          description: "",
          discount: "",
          code: "",
          expiresAt: null,
          isActive: true,
        });
      }
    }
  }, [open, promotion, form]);

  const onSubmit = async (data: PromotionInput) => {
    setIsSubmitting(true);
    try {
      const result = promotion
        ? await updatePromotion(promotion.id, data)
        : await createPromotion(data);

      if (result.success) {
        toast.success(promotion ? t("successUpdate") : t("successCreate"));
        onOpenChange(false);
      } else {
        toast.error(result.error.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-none">
        <DialogHeader>
          <DialogTitle className="font-serif">
            {promotion ? t("edit") : t("addNew")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("title")}</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-none border-zinc-200 focus-visible:ring-cloza-gold" />
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
                  <FormLabel>{t("description")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="rounded-none border-zinc-200 focus-visible:ring-cloza-gold" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("discount")}</FormLabel>
                    <FormControl>
                      <Input {...field} className="rounded-none border-zinc-200 focus-visible:ring-cloza-gold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("code")}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} className="rounded-none border-zinc-200 focus-visible:ring-cloza-gold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("expiresAt")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal rounded-none border-zinc-200",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>{t("selectDate")}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-none" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date("1900-01-01")
                        }
                        initialFocus
                        className="rounded-none"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="rounded-none"
              >
                {tCommon("cancel")}
              </Button>
              <Button
                type="submit"
                className="rounded-none bg-cloza-gold text-white hover:bg-cloza-gold/90"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {promotion ? t("submitUpdate") : t("submitCreate")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
