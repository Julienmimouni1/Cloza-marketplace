"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, RegisterInput } from "../schemas";
import { registerUser } from "../actions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const phonePrefixes = [
  { label: "FR (+33)", value: "+33" },
  { label: "BE (+32)", value: "+32" },
  { label: "CH (+41)", value: "+41" },
  { label: "UK (+44)", value: "+44" },
  { label: "DE (+49)", value: "+49" },
  { label: "IT (+39)", value: "+39" },
  { label: "ES (+34)", value: "+34" },
  { label: "US (+1)", value: "+1" },
];

export function RegisterForm() {
  const t = useTranslations("Registration");
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [phonePrefix, setPhonePrefix] = useState("+33");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role")?.toUpperCase() === "VENDOR" ? "VENDOR" : "RETAILER";

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      role: roleParam,
      termsAccepted: false as any,
    }
  });

  const nextStep = async () => {
    const fieldsToValidate = step === 1 
      ? ["name", "email", "password", "confirmPassword", "phoneNumber"] 
      : ["vatNumber", "companyName", "termsAccepted"];
    
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    setError(null);
    
    // Combine prefix and phone number
    const finalData = {
      ...data,
      phoneNumber: `${phonePrefix}${data.phoneNumber}`,
    };

    const result = await registerUser(finalData);
    setLoading(false);

    if (result.success) {
      toast.success(t("success"));
      if (result.data.role === "VENDOR") {
        router.push("/vendor");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } else {
      setError(result.error?.message || "An error occurred");
      toast.error(result.error?.message || "An error occurred");
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto overflow-hidden shadow-xl border-zinc-200">
      <CardHeader className="bg-zinc-50/50 border-b">
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-1">
            <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 1 ? "bg-primary" : "bg-zinc-200"}`} />
            <div className={`h-1.5 w-8 rounded-full transition-colors ${step >= 2 ? "bg-primary" : "bg-zinc-200"}`} />
          </div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {step === 1 ? "Step 1/2" : "Step 2/2"}
          </span>
        </div>
        <CardTitle className="text-2xl font-serif">
          {roleParam === "VENDOR" ? t("titleVendor") : t("titleRetailer")}
        </CardTitle>
        <CardDescription>
          {roleParam === "VENDOR" ? t("descriptionVendor") : t("descriptionRetailer")}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" {...register("role")} />
        
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">{t("name")}</Label>
                  <Input id="name" placeholder="Julien Dupont" {...register("name")} className="h-11 border-zinc-300 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all" />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input id="email" type="email" placeholder="julien@entreprise.com" {...register("email")} className="h-11 border-zinc-300 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all" />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">{t("phoneNumber")}</Label>
                  <div className="flex gap-2">
                    <div className="w-[110px]">
                      <Select value={phonePrefix} onValueChange={setPhonePrefix}>
                        <SelectTrigger className="h-11 border-zinc-300 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all">
                          <SelectValue placeholder="+33" />
                        </SelectTrigger>
                        <SelectContent>
                          {phonePrefixes.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Input 
                      id="phoneNumber" 
                      placeholder="612345678" 
                      {...register("phoneNumber")} 
                      className="flex-1 h-11 border-zinc-300 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all" 
                    />
                  </div>
                  {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">{t("password")}</Label>
                    <Input id="password" type="password" {...register("password")} className="h-11 border-zinc-300 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all" />
                    {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                    <Input id="confirmPassword" type="password" {...register("confirmPassword")} className="h-11 border-zinc-300 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all" />
                    {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="vatNumber">{t("vatNumber")}</Label>
                  <Input id="vatNumber" placeholder="FR12345678901" {...register("vatNumber")} className="h-11 border-zinc-300 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all" />
                  {errors.vatNumber && <p className="text-sm text-destructive">{errors.vatNumber.message}</p>}
                  <p className="text-xs text-muted-foreground">Requis pour la facturation inter-entreprises.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">{t("companyName")}</Label>
                  <Input id="companyName" placeholder="Ma Boutique SAS" {...register("companyName")} className="h-11 border-zinc-300 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all" />
                  {errors.companyName && <p className="text-sm text-destructive">{errors.companyName.message}</p>}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="termsAccepted" 
                      onCheckedChange={(checked) => setValue("termsAccepted", checked as boolean)}
                      className="mt-1"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="termsAccepted"
                        className="text-sm font-normal text-muted-foreground leading-relaxed"
                      >
                        {t.rich("termsText", {
                          terms: (chunks) => <Link href="/legal/terms" className="text-primary hover:underline font-medium">{chunks}</Link>,
                          policies: (chunks) => <Link href="/legal/privacy" className="text-primary hover:underline font-medium">{chunks}</Link>,
                        })}
                      </Label>
                      {errors.termsAccepted && (
                        <p className="text-sm text-destructive">{errors.termsAccepted.message as string}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="flex items-center gap-2 p-4 mt-6 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4 p-6 bg-zinc-50/30 border-t">
          <div className="flex w-full gap-3">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-11">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("back")}
              </Button>
            )}
            
            {step < 2 ? (
              <Button type="button" onClick={nextStep} className="flex-1 h-11">
                {t("next")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" className="flex-1 h-11" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                {t("submit")}
              </Button>
            )}
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-2">
            {t("alreadyHaveAccount")}{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              {t("signIn")}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
