"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  async function loadProducts() {
    const res = await fetch("/api/products", { cache: "no-store" });
    const data = await res.json();
    setProducts(data.products || []);
  }

  async function deleteProduct(id: number) {
    if (!confirm("Delete this product?")) return;

    await fetch(`/api/products?id=${id}`, {
      method: "DELETE",
    });

    loadProducts();
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <main className="container-ph py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-[#2e221d]">
          Admin Products
        </h1>

        <Link
          href="/admin/products/add"
          className="rounded-full bg-[#2e221d] px-5 py-3 text-sm font-semibold text-white"
        >
          Add New Product
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="rounded-[22px] border border-[#ead9d1] bg-white p-4 shadow-sm"
          >
            <img
              src={p.image || "/uploads/placeholder-product.png"}
              alt={p.name}
              className="h-52 w-full rounded-[16px] object-cover"
            />

            <h2 className="mt-4 text-lg font-semibold text-[#2e221d]">
              {p.name}
            </h2>

            <p className="mt-1 font-semibold">৳ {p.price}</p>

            <p className="mt-1 text-sm text-neutral-500">
              {p.category}
              {p.subcategory ? ` / ${p.subcategory}` : ""}
            </p>

            <p className="mt-1 text-sm text-neutral-500">
              Stock: {p.stock ?? 0}
            </p>

            <div className="mt-4 flex gap-2">
              <Link
                href={`/admin/products/${p.id}/edit`}
                className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-black"
              >
                Edit
              </Link>

              <button
                onClick={() => deleteProduct(p.id)}
                className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}