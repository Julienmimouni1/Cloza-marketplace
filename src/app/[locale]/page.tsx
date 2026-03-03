import { TrustBar } from "@/components/shared/TrustBar";
import { ShopByCategory } from "@/components/marketing/ShopByCategory";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Testimonials } from "@/components/marketing/Testimonials";
import { ActiveDeals } from "@/components/marketing/ActiveDeals";
import { FeaturedBrands } from "@/components/marketing/FeaturedBrands";
import { HeroSection } from "@/components/marketing/HeroSection";
import { CtaSection } from "@/components/marketing/CtaSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <TrustBar />
      <ShopByCategory />
      <ActiveDeals />
      <FeaturedBrands />
      <HowItWorks />
      <Testimonials />
      <CtaSection />
    </div>
  );
}
