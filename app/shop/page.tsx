import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { getProducts } from "@/lib/getProducts";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  description?: string;
  stock?: number;
};

type ShopPageProps = {
  searchParams?: Promise<{
    category?: string;
    subcategory?: string;
    sort?: string;
    q?: string;
  }>;
};

function normalizeSlug(value?: string) {
  return (value || "").trim().toLowerCase().replace(/\s+/g, "-");
}

function formatLabel(value?: string) {
  if (!value) return "";
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const categoryOptions = [
  { label: "All Categories", value: "" },
  { label: "Cosmetics", value: "cosmetics" },
  { label: "Haircare", value: "haircare" },
  { label: "Skincare", value: "skincare" },
  { label: "Perfume", value: "perfume" },
  { label: "Mens Products", value: "mens-products" },
  { label: "Food", value: "food" },
];

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = (await searchParams) || {};

  const category = params.category || "";
  const subcategory = params.subcategory || "";
  const sort = params.sort || "";
  const query = (params.q || "").trim();

  const allProducts: Product[] = await getProducts();

  const filteredProducts = allProducts
    .filter((product) => {
      const matchesCategory = category
        ? normalizeSlug(product.category) === normalizeSlug(category)
        : true;

      const matchesSubcategory = subcategory
        ? normalizeSlug(product.subcategory) === normalizeSlug(subcategory)
        : true;

      const matchesQuery = query
        ? [product.name, product.category, product.subcategory, product.description]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase())
        : true;

      return matchesCategory && matchesSubcategory && matchesQuery;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return Number(a.price) - Number(b.price);
      if (sort === "price-desc") return Number(b.price) - Number(a.price);
      if (sort === "latest") return Number(b.id) - Number(a.id);
      return Number(b.id) - Number(a.id);
    });

  const categoryProducts = category
    ? allProducts.filter(
        (product) => normalizeSlug(product.category) === normalizeSlug(category)
      )
    : allProducts;

  const subcategoryOptions = Array.from(
    new Set(
      categoryProducts
        .map((product) => normalizeSlug(product.subcategory))
        .filter(Boolean)
    )
  );

  return (
    <main>
      <TopBar />
      <Navbar />

      <section className="container-ph section-gap">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.18em] text-[#7a5244]">
            Shop
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#2e221d] sm:text-4xl">
            Explore Products
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600 sm:text-base">
            Browse products by category, subcategory, and price.
          </p>
        </div>

        <div className="mb-6 rounded-[24px] border border-[#ead9d1] bg-white p-4 shadow-sm">
          <form method="GET" action="/shop" className="grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr_auto]">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search products..."
              className="w-full rounded-2xl border border-[#ead9d1] bg-[#fffdfb] px-4 py-3 text-sm outline-none"
            />

            <select
              name="category"
              defaultValue={category}
              className="w-full rounded-2xl border border-[#ead9d1] bg-[#fffdfb] px-4 py-3 text-sm outline-none"
            >
              {categoryOptions.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              name="subcategory"
              defaultValue={subcategory}
              className="w-full rounded-2xl border border-[#ead9d1] bg-[#fffdfb] px-4 py-3 text-sm outline-none"
            >
              <option value="">All Subcategories</option>
              {subcategoryOptions.map((option) => (
                <option key={option} value={option}>
                  {formatLabel(option)}
                </option>
              ))}
            </select>

            <select
              name="sort"
              defaultValue={sort}
              className="w-full rounded-2xl border border-[#ead9d1] bg-[#fffdfb] px-4 py-3 text-sm outline-none"
            >
              <option value="">Latest</option>
              <option value="latest">Latest</option>
              <option value="price-asc">Price Low → High</option>
              <option value="price-desc">Price High → Low</option>
            </select>

            <div className="flex gap-3 lg:col-span-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[#2e221d] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#7a5244]"
              >
                Apply Filters
              </button>

              <a
                href="/shop"
                className="inline-flex items-center justify-center rounded-full border border-[#ead9d1] px-5 py-3 text-sm font-medium text-[#2e221d] transition hover:bg-[#f8f3ef]"
              >
                Clear Filters
              </a>
            </div>
          </form>
        </div>

        {(category || subcategory || query) && (
          <div className="mb-5 flex flex-wrap gap-2">
            {category ? (
              <span className="rounded-full bg-[#f8f3ef] px-3 py-1 text-xs font-medium text-[#2e221d]">
                Category: {formatLabel(category)}
              </span>
            ) : null}

            {subcategory ? (
              <span className="rounded-full bg-[#f8f3ef] px-3 py-1 text-xs font-medium text-[#2e221d]">
                Subcategory: {formatLabel(subcategory)}
              </span>
            ) : null}

            {query ? (
              <span className="rounded-full bg-[#f8f3ef] px-3 py-1 text-xs font-medium text-[#2e221d]">
                Search: {query}
              </span>
            ) : null}
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="rounded-[24px] border border-[#ead9d1] bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-[#2e221d]">
              No products found
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Try changing your category, subcategory, search, or sort option.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            {filteredProducts.map((product) => (
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