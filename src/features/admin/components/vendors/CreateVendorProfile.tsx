"use client";

import { useState } from "react";
import { createVendorProfile } from "@/features/admin/actions/vendors";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Store } from "lucide-react";

interface Props {
  userId: string;
  userName: string;
}

export function CreateVendorProfile({ userId, userName }: Props) {
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState("");

  const handleCreate = async () => {
    if (!slug) return toast.error("Slug is required");
    
    setLoading(true);
    try {
      await createVendorProfile(userId, { name: userName, slug });
      toast.success("Vendor profile created");
    } catch (error) {
      toast.error("Failed to create vendor profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-none border-dashed border-zinc-300 shadow-none bg-zinc-50/50">
      <CardHeader>
        <CardTitle className="font-serif flex items-center gap-2">
          <Store className="h-5 w-5" />
          Activate Vendor Features
        </CardTitle>
        <CardDescription>
          This user does not have a vendor profile yet. Create one to manage products, commissions, and shipping.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label>Vendor Slug (URL Identifier)</Label>
          <div className="flex gap-2">
            <Input 
              placeholder="brand-name" 
              value={slug} 
              onChange={(e) => setSlug(e.target.value)}
              className="font-mono text-sm"
            />
            <Button onClick={handleCreate} disabled={loading}>
              {loading ? "Creating..." : "Activate"}
            </Button>
          </div>
          <p className="text-xs text-zinc-500">
            Suggested: {userName.toLowerCase().replace(/\s+/g, '-')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
