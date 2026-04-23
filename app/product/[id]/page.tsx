import Link from "next/link";
import { notFound } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetailsClient from "@/components/product/ProductDetailsClient";
import { getProducts, type Product } from "@/lib/getProducts";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

        <ProductDetailsClient product={product} relatedProducts={relatedProducts} />
      </section>

      <Footer />
    </main>
  );
}