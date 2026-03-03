"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ImpersonateButton({ userId, userName }: { userId: string; userName: string }) {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleImpersonate = async () => {
    if (!session?.user || session.user.role !== "ADMIN") {
      toast.error("Unauthorized");
      return;
    }

    setIsLoading(true);
    try {
      // Trigger NextAuth session update
      await update({
        isImpersonating: true,
        originalId: session.user.id,
        originalRole: session.user.role,
        targetId: userId,
      });

      toast.success(`Now impersonating ${userName}`);
      
      // Redirect to the impersonated user's dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Impersonation failed", error);
      toast.error("Failed to impersonate user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start text-cloza-gold font-bold rounded-none"
      onClick={handleImpersonate}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ExternalLink className="mr-2 h-4 w-4" />
      )}
      Impersonate (Ghost)
    </Button>
  );
}
