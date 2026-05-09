import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EditorialPromoSection from "@/components/home/EditorialPromoSection";
import CategorySection from "@/components/home/CategorySection";
import HomeSubcategorySections from "@/components/home/HomeSubcategorySections";
import DealsBanner from "@/components/home/DealsBanner";
import BrandsSection from "@/components/home/BrandsSection";
import TrustSection from "@/components/home/TrustSection";
import { getProducts } from "@/lib/getProducts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main>
      <TopBar />
      <Navbar />

      <EditorialPromoSection />
      <CategorySection />

      <HomeSubcategorySections products={products} />

      <DealsBanner />
      <BrandsSection />
      <TrustSection />

      <Footer />
    </main>
  );
}