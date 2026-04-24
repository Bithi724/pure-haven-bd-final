import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { getProducts, type Product } from "@/lib/getProducts";

type ShopPageProps = {
  searchParams?: Promise<{
    category?: string;
    subcategory?: string;
  }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

function slug(value?: string | null) {
  return (value || "").trim().toLowerCase().replace(/\s+/g, "-");
}

function label(value?: string | null) {
  return (value || "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const fallbackImage =
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200&auto=format&fit=crop";

const fixedSubcategories: Record<string, string[]> = {
  cosmetics: [
    "lipstick",
    "liquid-lipstick",
    "lip-liner",
    "lip-gloss",
    "lip-balm",
    "foundation",
    "face-powder",
    "primer",
    "concealer",
    "blush",
    "highlighter",
    "eyeliner",
    "kajal",
    "mascara",
    "eyeshadow",
    "eyebrow-pencil",
    "brush",
  ],
  skincare: [
    "face-wash",
    "moisturizer",
    "cream",
    "lotion",
    "serum",
    "sunscreen",
    "toner",
    "scrub",
    "face-mask",
    "petroleum-jelly",
    "others",
  ],
  haircare: [
    "shampoo",
    "conditioner",
    "hair-oil",
    "hair-serum",
    "hair-mask",
    "hair-color",
    "hair-treatment",
    "styling-gel-spray",
    "others",
  ],
  perfume: [
    "edt-men",
    "edp-men",
    "perfume-men",
    "edt-women",
    "edp-women",
    "perfume-women",
    "attar",
    "others",
  ],
  food: [
    "oil-ghee",
    "honey",
    "dates",
    "spices",
    "nuts-seeds",
    "beverage",
    "rice",
    "flours-lentils",
    "certified",
    "pickle",
    "others",
  ],
  "mens-products": [
    "shirts",
    "t-shirts",
    "panjabi",
    "pants",
    "wallet",
    "belt",
    "watch",
    "others",
  ],
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = (await searchParams) || {};
  const category = slug(params.category);
  const subcategory = slug(params.subcategory);

  const allProducts = await getProducts();

  const categoryProducts = category
    ? allProducts.filter((product) => slug(product.category) === category)
    : allProducts;

  const categoryImage = categoryProducts[0]?.image || fallbackImage;

  const subcategories = category
    ? (fixedSubcategories[category] || []).map((item) => {
        const matchedProduct = categoryProducts.find(
          (product) => slug(product.subcategory) === item
        );

        return {
          title: label(item),
          slug: item,
          image: matchedProduct?.image || categoryImage,
        };
      })
    : [];

  const visibleProducts =
    category && !subcategory
      ? []
      : categoryProducts.filter((product: Product) =>
          subcategory ? slug(product.subcategory) === subcategory : true
        );

  return (
    <main>
      <TopBar />
      <Navbar />

      <section className="container-ph section-gap">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-[#7a5244]">
              Browse Products
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[#2e221d]">
              {category ? label(category) : "All Products"}
            </h1>
          </div>

          <Link href="/shop" className="text-sm font-semibold underline">
            All Products
          </Link>
        </div>

        {category && subcategories.length > 0 ? (
          <div className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#2e221d]">
                Shop by Subcategory
              </h2>
            </div>

            <div className="flex gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {subcategories.map((item) => (
                <Link
                  key={item.slug}
                  href={`/shop?category=${category}&subcategory=${item.slug}`}
                  className={`relative h-[300px] w-[260px] shrink-0 overflow-hidden rounded-[28px] border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    subcategory === item.slug
                      ? "border-[#2e221d]"
                      : "border-[#ead9d1]"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  <div className="absolute bottom-5 left-5 text-white">
                    <p className="text-xs uppercase tracking-[0.2em]">
                      Subcategory
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {category && !subcategory ? (
          <div className="rounded-[24px] border border-[#ead9d1] bg-white p-8 text-center">
            <h2 className="text-xl font-semibold text-[#2e221d]">
              Select a subcategory
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Products will appear after choosing a subcategory.
            </p>
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="rounded-[24px] border border-[#ead9d1] bg-white p-8 text-center">
            <h2 className="text-xl font-semibold text-[#2e221d]">
              No products found
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Products will appear here when available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            {visibleProducts.map((product: Product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                category={product.category}
                stock={product.stock}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}