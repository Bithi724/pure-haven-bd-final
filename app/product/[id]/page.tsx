import Link from "next/link";
import { notFound } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { getProducts, type Product } from "@/lib/getProducts";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatLabel(value?: string | null) {
  if (!value) return "";
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isFinite(productId)) {
    notFound();
  }

  const allProducts = await getProducts();
  const product = allProducts.find((item) => item.id === productId);

  if (!product) {
    notFound();
  }

  const relatedProducts: Product[] = allProducts
    .filter(
      (item) =>
        item.id !== product.id &&
        item.category?.trim().toLowerCase() ===
          product.category?.trim().toLowerCase()
    )
    .slice(0, 4);

  return (
    <main>
      <TopBar />
      <Navbar />

      <section className="container-ph section-gap">
        <div className="mb-6 text-sm text-neutral-500">
          <Link href="/" className="hover:text-[#7a5244]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-[#7a5244]">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#2e221d]">{product.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="overflow-hidden rounded-[28px] border border-[#ead9d1] bg-white p-4 shadow-sm">
            <div className="overflow-hidden rounded-[24px] bg-[#f8f3ef]">
              <img
                src={product.image || "/uploads/placeholder-product.png"}
                alt={product.name}
                className="h-[360px] w-full object-cover sm:h-[460px]"
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-[#ead9d1] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#f8f3ef] px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-[#7a5244]">
                {product.category}
              </span>

              {product.subcategory ? (
                <span className="rounded-full bg-[#f8f3ef] px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-[#7a5244]">
                  {formatLabel(product.subcategory)}
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 text-3xl font-semibold text-[#2e221d] sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-4 text-2xl font-semibold text-[#2e221d]">
              ৳ {product.price}
            </p>

            {typeof product.stock === "number" ? (
              <div className="mt-4">
                {product.stock <= 0 ? (
                  <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-medium text-red-600">
                    Out of Stock
                  </span>
                ) : product.stock <= 5 ? (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                    Low Stock
                  </span>
                ) : (
                  <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                    In Stock
                  </span>
                )}
              </div>
            ) : null}

            <div className="mt-6 rounded-[22px] border border-[#ead9d1] bg-[#fffdfb] p-5">
              <h2 className="text-lg font-semibold text-[#2e221d]">
                Product Details
              </h2>

              <div className="mt-3 space-y-3 text-sm text-neutral-700">
                <p>
                  <span className="font-medium text-[#2e221d]">Category:</span>{" "}
                  {product.category}
                </p>

                {product.subcategory ? (
                  <p>
                    <span className="font-medium text-[#2e221d]">
                      Subcategory:
                    </span>{" "}
                    {formatLabel(product.subcategory)}
                  </p>
                ) : null}

                {typeof product.stock === "number" ? (
                  <p>
                    <span className="font-medium text-[#2e221d]">Stock:</span>{" "}
                    {product.stock}
                  </p>
                ) : null}

                <p className="leading-7 text-neutral-600">
                  {product.description?.trim()
                    ? product.description
                    : "No detailed description has been added for this product yet."}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full border border-[#ead9d1] px-5 py-3 text-sm font-medium text-[#2e221d] transition hover:bg-[#f8f3ef]"
              >
                Back to Shop
              </Link>

              <Link
                href="/cart"
                className="inline-flex items-center justify-center rounded-full bg-[#2e221d] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#7a5244]"
              >
                View Cart
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-[#2e221d]">
                Related Products
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                More items from the same category.
              </p>
            </div>

            <Link
              href={`/shop?category=${encodeURIComponent(product.category)}`}
              className="text-sm font-medium text-[#7a5244] hover:underline"
            >
              View All
            </Link>
          </div>

          {relatedProducts.length === 0 ? (
            <div className="rounded-[24px] border border-[#ead9d1] bg-white p-6 text-center shadow-sm">
              <p className="text-sm text-neutral-600">
                No related products found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
              {relatedProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  category={item.category}
                  stock={item.stock}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}