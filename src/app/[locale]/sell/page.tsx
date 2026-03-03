import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, TrendingUp, ShieldCheck, Zap } from "lucide-react";

export default function SellPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-5xl font-serif font-bold mb-6">
            Développez votre marque B2B avec Cloza
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Connectez-vous instantanément à des milliers de boutiques indépendantes vérifiées. 
            Paiements garantis, logistique simplifiée.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-8" asChild>
              <Link href="/register?role=vendor">Devenir Vendeur</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900 text-lg px-8" asChild>
              <Link href="/login">Connexion Vendeur</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Paiements Garantis</h3>
              <p className="text-slate-600">
                Nous prenons le risque de crédit. Vous êtes payé à l'expédition, quoi qu'il arrive.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ventes B2B Simplifiées</h3>
              <p className="text-slate-600">
                Une seule interface pour gérer toutes vos commandes wholesale. Synchronisation Shopify incluse.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Intégration Rapide</h3>
              <p className="text-slate-600">
                Importez votre catalogue en 2 clics. Pas de frais d'installation, juste une commission au succès.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-12">Ils nous font confiance</h2>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholders for logos */}
            <div className="text-2xl font-bold font-serif">VOGUE</div>
            <div className="text-2xl font-bold font-sans tracking-tighter">HYPEBEAST</div>
            <div className="text-2xl font-bold font-mono">BUSINESS OF FASHION</div>
            <div className="text-2xl font-bold font-serif italic">ELLE</div>
          </div>
        </div>
      </section>
    </div>
  );
}
