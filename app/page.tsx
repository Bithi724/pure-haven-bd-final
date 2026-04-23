import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EditorialPromoSection from "@/components/home/EditorialPromoSection";
import CategorySection from "@/components/home/CategorySection";
import ProductSection from "@/components/home/ProductSection";
import DealsBanner from "@/components/home/DealsBanner";
import BrandsSection from "@/components/home/BrandsSection";
import TrustSection from "@/components/home/TrustSection";
import { getProducts } from "@/lib/getProducts";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string | null;
  description?: string | null;
  stock?: number;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeSlug(value?: string | null) {
  return (value || "").trim().toLowerCase().replace(/\s+/g, "-");
}

const homeCategoryConfig = [
  {
    title: "Cosmetics",
    slug: "cosmetics",
    subtitle: "Everyday beauty and makeup essentials.",
  },
  {
    title: "Skincare",
    slug: "skincare",
    subtitle: "Daily care picks for a healthier glow.",
  },
  {
    title: "Perfume",
    slug: "perfume",
    subtitle: "Signature scents and fragrance favorites.",
  },
  {
    title: "Food",
    slug: "food",
    subtitle: "Selected pantry and lifestyle essentials.",
  },
];

export default async function HomePage() {
  const allProducts: Product[] = await getProducts();

  const categorySections = homeCategoryConfig
    .map((section) => {
      const products = allProducts
        .filter(
          (product) =>
            normalizeSlug(product.category) === normalizeSlug(section.slug)
        )
        .sort((a, b) => Number(b.id) - Number(a.id))
        .slice(0, 4);

      return {
        ...section,
        products,
      };
    })
    .filter((section) => section.products.length > 0);

  return (
    <main>
      <TopBar />
      <Navbar />

      <EditorialPromoSection />
      <CategorySection />

      {categorySections.map((section) => (
        <ProductSection
          key={section.slug}
          title={section.title}
          subtitle={section.subtitle}
          products={section.products}
          viewAllHref={`/shop?category=${section.slug}`}
        />
      ))}

      <DealsBanner />
      <BrandsSection />
      <TrustSection />

      <Footer />
    </main>
  );
}