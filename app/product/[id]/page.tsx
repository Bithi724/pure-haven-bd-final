import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import ProductPurchaseActions from "@/components/product/ProductPurchaseActions";
import { getProducts } from "@/lib/getProducts";

type ProductPageProps = {
  params: Promise<{
    id: string;
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

export default async function ProductDetailsPage({
  params,
}: ProductPageProps) {
  const { id } = await params;
  const productId = Number(id);

  const allProducts: Product[] = await getProducts();
  const product = allProducts.find((item) => item.id === productId);

  if (!product) {
    return (
      <main>
        <TopBar />
        <Navbar />
        <section className="container-ph section-gap text-center">
          <h1 className="text-4xl font-semibold">Product not found</h1>
          <p className="mt-4 text-neutral-600">
            The product you are looking for does not exist.
          </p>
          <Link href="/shop" className="btn-primary mt-6 inline-block">
            Back to Shop
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  const currentStock = typeof product.stock === "number" ? product.stock : null;
  const hasKnownStock = currentStock !== null;
  const isOutOfStock = currentStock !== null && currentStock <= 0;

  const availabilityText = hasKnownStock
    ? isOutOfStock
      ? "Out of Stock"
      : "In Stock"
    : "Available";

  const imageSrc =
    product.image && product.image.trim() !== ""
      ? product.image
      : "https://via.placeholder.com/800x800?text=No+Image";

  return (
    <main>
      <TopBar />
      <Navbar />

      <section className="container-ph section-gap">
        <div className="mb-6 text-sm text-neutral-500">
          <Link href="/" className="hover:text-[#7a5244]">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/shop" className="hover:text-[#7a5244]">
            Shop
          </Link>{" "}
          / <span>{product.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[28px] border border-[#ead9d1] bg-white p-4 sm:p-6">
            <img
              src={imageSrc}
              alt={product.name}
              className="aspect-square w-full rounded-[20px] bg-[#f8f3ef] object-cover"
            />
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#7a5244]">
              {product.category}
            </p>

            <h1 className="mt-3 text-3xl font-semibold text-[#2e221d] sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-4 text-2xl font-semibold text-[#2e221d]">
              ৳{product.price}
            </p>

            {isOutOfStock ? (
              <div className="mt-4 inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
                This product is currently out of stock
              </div>
            ) : null}

            <div className="mt-6 leading-7 text-neutral-600">
              {product.description ? (
                <p>{product.description}</p>
              ) : (
                <p>
                  Premium quality product from Pure Haven BD. Designed for daily
                  use with high-quality ingredients and long-lasting performance.
                </p>
              )}
            </div>

            <ProductPurchaseActions
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              category={product.category}
              stock={product.stock}
            />

            <div className="mt-8 space-y-2 rounded-[24px] border border-[#ead9d1] bg-white p-5 text-sm text-neutral-700">
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {product.category}
              </p>
              <p>
                <span className="font-semibold">Subcategory:</span>{" "}
                {product.subcategory ?? "N/A"}
              </p>
              <p>
                <span className="font-semibold">Availability:</span>{" "}
                {availabilityText}
              </p>
              {hasKnownStock ? (
                <p>
                  <span className="font-semibold">Stock:</span> {currentStock}
                </p>
              ) : null}
              <p>
                <span className="font-semibold">SKU:</span> PH-{product.id}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}