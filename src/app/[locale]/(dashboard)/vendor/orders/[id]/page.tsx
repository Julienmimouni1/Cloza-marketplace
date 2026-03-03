import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ArrowLeft, Printer, Truck, CheckCircle, MapPin, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from "next-intl/server";

// Helper to format currency
const formatPrice = (amount: number) => 
  (amount / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

export default async function VendorOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const order = await prisma.subOrder.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true }
      },
      parentOrder: {
        include: {
          buyer: true // Need buyer details for shipping
        }
      }
    }
  });

  if (!order) return notFound();

  const buyer = order.parentOrder.buyer;
  const t = await getTranslations("Orders.detail");
  const tc = await getTranslations("Common");

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/vendor"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-3">
              {t("title", { id: order.id.slice(-8) })}
              <Badge variant="outline" className={
                order.status === 'SHIPPED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'
              }>
                {order.status.replace('_', ' ')}
              </Badge>
            </h1>
            <p className="text-sm text-slate-500">
              {t("placedOn", { 
                date: order.parentOrder.createdAt.toLocaleDateString(), 
                time: order.parentOrder.createdAt.toLocaleTimeString() 
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" /> {t("printPackingSlip")}
          </Button>
          {order.status !== 'SHIPPED' && (
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Truck className="mr-2 h-4 w-4" /> {t("markAsShipped")}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content: Items */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("itemsTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("product")}</TableHead>
                    <TableHead className="text-right">{t("price")}</TableHead>
                    <TableHead className="text-right">{t("qty")}</TableHead>
                    <TableHead className="text-right">{tc("total")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.product.image || "https://placehold.co/50"} 
                            alt={item.product.name}
                            className="h-10 w-10 rounded object-cover border"
                          />
                          <div>
                            <p className="font-medium text-sm">{item.product.name}</p>
                            <p className="text-xs text-slate-500">{tc("sku")}: {item.product.sku}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{formatPrice(item.priceAtPurchase)}</TableCell>
                      <TableCell className="text-right font-medium">{item.quantity}</TableCell>
                      <TableCell className="text-right font-bold">{formatPrice(item.priceAtPurchase * item.quantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 bg-slate-50 border-t p-6">
               <div className="flex justify-between w-full text-sm">
                 <span className="text-slate-500">{t("subtotal")}</span>
                 <span>{formatPrice(order.totalAmount)}</span>
               </div>
               <div className="flex justify-between w-full text-sm">
                 <span className="text-slate-500">{t("commission")}</span>
                 <span className="text-red-500">-{formatPrice(order.commissionAmount)}</span>
               </div>
               <Separator className="my-2"/>
               <div className="flex justify-between w-full font-bold text-lg">
                 <span>{t("netPayout")}</span>
                 <span className="text-emerald-700">{formatPrice(order.totalAmount - order.commissionAmount)}</span>
               </div>
            </CardFooter>
          </Card>

          {/* Timeline / Activity Log (Placeholder) */}
          <Card>
            <CardHeader>
              <CardTitle>{t("timeline")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-l-2 border-slate-200 ml-3 space-y-8 pl-6 pb-2">
                <div className="relative">
                  <div className="absolute -left-[31px] bg-slate-200 h-4 w-4 rounded-full border-2 border-white"></div>
                  <p className="text-sm font-medium text-slate-900">{t("orderPlaced")}</p>
                  <p className="text-xs text-slate-500">{order.parentOrder.createdAt.toLocaleString()}</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] bg-amber-500 h-4 w-4 rounded-full border-2 border-white"></div>
                  <p className="text-sm font-medium text-slate-900">{t("paymentConfirmed")}</p>
                  <p className="text-xs text-slate-500">{order.parentOrder.createdAt.toLocaleString()}</p>
                </div>
                {order.status === 'SHIPPED' && (
                   <div className="relative">
                     <div className="absolute -left-[31px] bg-emerald-500 h-4 w-4 rounded-full border-2 border-white"></div>
                     <p className="text-sm font-medium text-slate-900">{t("shipped")}</p>
                     <p className="text-xs text-slate-500">{t("tracking", { number: "1Z9999999999999999" })}</p>
                   </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Customer & Shipping */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">{t("customer")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                  {buyer.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{buyer.name}</p>
                  <p className="text-sm text-slate-500">{buyer.companyName}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${buyer.email}`} className="hover:underline">{buyer.email}</a>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="h-4 w-4" />
                  <span>+33 6 12 34 56 78</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">{t("shippingAddress")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2 text-slate-700">
                <MapPin className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
                <address className="not-italic text-sm leading-relaxed">
                  <strong className="block text-slate-900">{buyer.companyName || t("unknownCompany")}</strong>
                  {buyer.address || '123 Fashion Street'}<br/>
                  {buyer.zipCode || '75001'} {buyer.city || 'Paris'}<br/>
                  France
                </address>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 text-white border-none">
            <CardContent className="p-6">
              <h3 className="font-medium mb-2">{t("needHelp")}</h3>
              <p className="text-sm text-slate-300 mb-4">
                {t("helpDesc")}
              </p>
              <Button variant="secondary" size="sm" className="w-full">{t("openDispute")}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
