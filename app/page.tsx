import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import HomeHeroSlider from "@/components/home/HomeHeroSlider";
import HomePromoGrid from "@/components/home/HomePromoGrid";
import CategorySection from "@/components/home/CategorySection";
import DealsBanner from "@/components/home/DealsBanner";
import BrandsSection from "@/components/home/BrandsSection";
import TrustSection from "@/components/home/TrustSection";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <TopBar />
      <Navbar />

      <HomeHeroSlider />
      <HomePromoGrid />

      <CategorySection />

      <DealsBanner />
      <BrandsSection />
      <TrustSection />
      <Footer />
    </>
  );
}