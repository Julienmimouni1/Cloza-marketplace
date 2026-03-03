import { Search, ShoppingBag, Clock, Store, Users, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function HowItWorks() {
  const t = useTranslations('HowItWorks');

  const retailerSteps = [
    {
      icon: Search,
      title: t('retailer.step1Title'),
      description: t('retailer.step1Desc')
    },
    {
      icon: ShoppingBag,
      title: t('retailer.step2Title'),
      description: t('retailer.step2Desc')
    },
    {
      icon: Clock,
      title: t('retailer.step3Title'),
      description: t('retailer.step3Desc')
    }
  ];

  const brandSteps = [
    {
      icon: Store,
      title: t('brand.step1Title'),
      description: t('brand.step1Desc')
    },
    {
      icon: Users,
      title: t('brand.step2Title'),
      description: t('brand.step2Desc')
    },
    {
      icon: ShieldCheck,
      title: t('brand.step3Title'),
      description: t('brand.step3Desc')
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-serif text-center mb-12 md:mb-16 tracking-tight">{t('title')}</h2>
        
        <Tabs defaultValue="retailer" className="w-full max-w-4xl mx-auto">
          <div className="flex justify-center mb-12">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2">
              <TabsTrigger value="retailer">{t('retailerTab')}</TabsTrigger>
              <TabsTrigger value="brand">{t('brandTab')}</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="retailer">
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {retailerSteps.map((step, index) => (
                <li key={index} className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full text-primary transition-transform hover:scale-110 duration-300">
                    <step.icon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="brand">
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {brandSteps.map((step, index) => (
                <li key={index} className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full text-primary transition-transform hover:scale-110 duration-300">
                    <step.icon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
