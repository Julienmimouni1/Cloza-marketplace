import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function VendorSettingsPage() {
  const session = await auth();
  
  if (!session?.user) return <div>Unauthorized</div>;
  
  // Fetch Vendor linked to user
  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) return <div>Vendor profile not found</div>;

  // Fetch Global Rate
  const globalRateSetting = await prisma.systemSetting.findUnique({
    where: { key: "GLOBAL_COMMISSION_RATE" },
  });
  const globalRate = globalRateSetting ? parseInt(globalRateSetting.value, 10) : 1500;

  const effectiveRate = vendor.commissionRate ?? globalRate;
  const isCustom = vendor.commissionRate !== null;

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
       
       <div className="grid gap-6">
         <div className="p-6 bg-card rounded-lg border shadow-sm">
           <h2 className="text-xl font-semibold mb-4">Financials</h2>
           <div className="space-y-2">
             <p className="text-sm font-medium">Commission Rate</p>
             <div className="flex items-baseline gap-2">
               <span className="text-2xl font-bold">{(effectiveRate / 100).toFixed(2)}%</span>
               {isCustom ? (
                 <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-100">Custom Rate</span>
               ) : (
                 <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full dark:bg-gray-800 dark:text-gray-100">Standard Platform Rate</span>
               )}
             </div>
             <p className="text-sm text-muted-foreground">
               This is the percentage deducted from each sale processed on the platform.
             </p>
           </div>
         </div>
       </div>
    </div>
  );
}
