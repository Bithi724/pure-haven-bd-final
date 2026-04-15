import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { getProducts } from "@/lib/getProducts";

type ShopPageProps = {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    q?: string;
    sort?: string;
    min?: string;
    max?: string;
  }>;
};

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

export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeSlug(value?: string) {
  return (value || "").trim().toLowerCase().replace(/\s+/g, "-");
}

function formatLabel(value?: string) {
  return (value || "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const categoryLinks = [
  { label: "All", href: "/shop", slug: "" },
  { label: "Cosmetics", href: "/shop?category=cosmetics", slug: "cosmetics" },
  { label: "Haircare", href: "/shop?category=haircare", slug: "haircare" },
  { label: "Skincare", href: "/shop?category=skincare", slug: "skincare" },
  { label: "Perfume", href: "/shop?category=perfume", slug: "perfume" },
  { label: "Food", href: "/shop?category=food", slug: "food" },
  {
    label: "Men’s Products",
    href: "/shop?category=mens-products",
    slug: "mens-products",
  },
];

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const selectedCategory = params.category;
  const selectedSubcategory = params.subcategory;
  const query = (params.q || "").trim().toLowerCase();
  const sort = params.sort || "latest";
  const minPrice = params.min ? Number(params.min) : undefined;
  const maxPrice = params.max ? Number(params.max) : undefined;

  const allProducts: Product[] = await getProducts();

  let filteredProducts = allProducts.filter((product) => {
    const productCategory = normalizeSlug(product.category);
    const productSubcategory = normalizeSlug(product.subcategory);

    const categoryMatch = selectedCategory
      ? productCategory === normalizeSlug(selectedCategory)
      : true;

    const subcategoryMatch = selectedSubcategory
      ? productSubcategory === normalizeSlug(selectedSubcategory)
      : true;

    const searchMatch = query
      ? [
          product.name,
          product.category,
          product.subcategory,
          product.description,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query)
      : true;

    const minMatch =
      typeof minPrice === "number" && !Number.isNaN(minPrice)
        ? product.price >= minPrice
        : true;

    const maxMatch =
      typeof maxPrice === "number" && !Number.isNaN(maxPrice)
        ? product.price <= maxPrice
        : true;

    return (
      categoryMatch &&
      subcategoryMatch &&
      searchMatch &&
      minMatch &&
      maxMatch
    );
  });

  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sort) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name-az":
        return a.name.localeCompare(b.name);
      case "name-za":
        return b.name.localeCompare(a.name);
      case "latest":
      default:
        return Number(b.id) - Number(a.id);
    }
  });

  const headingTitle = query
    ? `Search: ${query}`
    : selectedSubcategory
    ? formatLabel(selectedSubcategory)
    : selectedCategory
    ? formatLabel(selectedCategory)
    : "Shop";

  const activeCategorySlug = normalizeSlug(selectedCategory);

  return (
    <main>
      <TopBar />
      <Navbar />

      <section className="container-ph section-gap">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#2e221d] md:text-4xl">
              {headingTitle}
            </h1>
            <div className="mt-2 text-sm text-neutral-500">
              <Link href="/" className="hover:text-[#7a5244]">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span>{headingTitle}</span>
            </div>
          </div>

          <p className="text-sm text-neutral-600">
            {filteredProducts.length} product
            {filteredProducts.length === 1 ? "" : "s"} found
          </p>
        </div>

        <div className="mb-5 -mx-4 overflow-x-auto px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-3">
            {categoryLinks.map((item) => {
              const isActive =
                item.slug === ""
                  ? !selectedCategory
                  : activeCategorySlug === item.slug;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-[#2e221d] bg-[#2e221d] text-white"
                      : "border-[#ead9d1] bg-white text-[#2e221d] hover:bg-[#f8f3ef]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <form
          action="/shop"
          method="GET"
          className="mb-6 grid gap-3 rounded-[24px] border border-[#ead9d1] bg-white p-4 md:grid-cols-5"
        >
          <input type="hidden" name="category" value={selectedCategory || ""} />
          <input
            type="hidden"
            name="subcategory"
            value={selectedSubcategory || ""}
          />

          <input
            type="text"
            name="q"
            defaultValue={params.q || ""}
            placeholder="Search products..."
            className="rounded-2xl border border-[#ead9d1] px-4 py-3 outline-none"
          />

          <input
            type="number"
            name="min"
            defaultValue={params.min || ""}
            placeholder="Min price"
            className="rounded-2xl border border-[#ead9d1] px-4 py-3 outline-none"
          />

          <input
            type="number"
            name="max"
            defaultValue={params.max || ""}
            placeholder="Max price"
            className="rounded-2xl border border-[#ead9d1] px-4 py-3 outline-none"
          />

          <select
            name="sort"
            defaultValue={sort}
            className="rounded-2xl border border-[#ead9d1] px-4 py-3 outline-none"
          >
            <option value="latest">Default Sorting</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-az">Name: A to Z</option>
            <option value="name-za">Name: Z to A</option>
          </select>

          <button
            type="submit"
            className="rounded-2xl bg-[#2e221d] px-4 py-3 text-white hover:bg-[#7a5244]"
          >
            Apply
          </button>
        </form>

        {filteredProducts.length === 0 ? (
          <div className="rounded-[24px] border border-[#ead9d1] bg-white p-10 text-center">
            <h2 className="text-2xl font-semibold">No products found</h2>
            <p className="mt-3 text-neutral-600">
              Try another keyword, category, subcategory, or price range.
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