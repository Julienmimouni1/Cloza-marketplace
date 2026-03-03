import HeroSection from "@/components/home/HeroSection";
import LogoList from "@/components/home/LogoList";
import TextWithIcon from "@/components/home/TextWithIcon";
import ImageWithText from "@/components/home/ImageWithText";
import CollectionTabs from "@/components/home/CollectionTabs";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <main id="MainContent" className="content-for-layout focus-none" role="main" tabIndex={-1}>
      <HeroSection />
      <TextWithIcon />
      <LogoList />
      <ImageWithText />
      <CollectionTabs />
      <Testimonials />
    </main>
  );
}
