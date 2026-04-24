"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const categoryMap: Record<string, string[]> = {
  Skincare: [
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
  Cosmetics: [
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
  Haircare: [
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
  Perfume: [
    "Edt-men",
    "Edt-women",
    "Men's-Perfume",
    "women's-Perfume",
    "Edp-men",
    "Edp-women",
    
    "Attar",
    "others",
  ],
  Food: [
    "Olive-oil",
    "Honey",
    "Dates",
    "Spices",
    "Nuts-Seeds",
    "Beverage",
    

    "certified",
    
    "others",
  ],
  "Mens Products": [
   "Men's-shampoo",
    "beard-oil",
    "shaving-cream",
    "shaving-razor",
    "shaving-gel",
    "beard-shampoo",


    
    "others",
  ],
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "Skincare",
    subcategory: "face-wash",
    image: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const subcategories = useMemo(
    () => categoryMap[form.category] || [],
    [form.category]
  );

  useEffect(() => {
    async function loadProduct() {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();

      const product = (data.products || []).find(
        (item: any) => item.id === productId
      );

      if (!product) {
        alert("Product not found");
        router.push("/admin/products");
        return;
      }

      setForm({
        name: product.name || "",
        price: String(product.price ?? ""),
        stock: String(product.stock ?? 0),
        category: product.category || "Skincare",
        subcategory: product.subcategory || "face-wash",
        image: product.image || "",
        description: product.description || "",
      });

      setLoading(false);
    }

    loadProduct();
  }, [productId, router]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === "category") {
        return {
          ...prev,
          category: value,
          subcategory: categoryMap[value]?.[0] || "",
        };
      }

      return { ...prev, [name]: value };
    });
  }

  async function uploadImageIfNeeded() {
    if (!imageFile) return form.image;

    const formData = new FormData();
    formData.append("file", imageFile);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data.url) {
      throw new Error("Image upload failed");
    }

    return data.url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const imageUrl = await uploadImageIfNeeded();

      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: productId,
          name: form.name,
          price: Number(form.price),
          stock: Number(form.stock),
          category: form.category,
          subcategory: form.subcategory,
          image: imageUrl,
          description: form.description,
        }),
      });

      if (!res.ok) {
        alert("Update failed");
        return;
      }

      alert("Product updated");
      router.push("/admin/products");
    } catch {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main className="container-ph py-10">Loading...</main>;
  }

  return (
    <main className="container-ph py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold text-[#2e221d]">
            Edit Product
          </h1>
          <p className="mt-3 text-neutral-600">
            Update product category, subcategory, stock, and image.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="rounded-full border border-[#ead9d1] px-6 py-3 text-sm font-medium"
        >
          Back Products
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block">
          <span className="mb-3 block text-sm font-medium">Product Name</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-[18px] border border-[#ead9d1] px-5 py-4"
            required
          />
        </label>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="mb-3 block text-sm font-medium">Price</span>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-[18px] border border-[#ead9d1] px-5 py-4"
              required
            />
          </label>

          <label className="block">
            <span className="mb-3 block text-sm font-medium">Stock</span>
            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              className="w-full rounded-[18px] border border-[#ead9d1] px-5 py-4"
              required
            />
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="mb-3 block text-sm font-medium">Category</span>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-[18px] border border-[#ead9d1] px-5 py-4"
            >
              {Object.keys(categoryMap).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-3 block text-sm font-medium">Subcategory</span>
            <select
              name="subcategory"
              value={form.subcategory}
              onChange={handleChange}
              className="w-full rounded-[18px] border border-[#ead9d1] px-5 py-4"
            >
              {subcategories.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="mb-3 block text-sm font-medium">Product Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full rounded-[18px] border border-[#ead9d1] px-5 py-4"
          />
        </label>

       {form.image ? (
  <div className="max-w-[260px] rounded-[18px] border border-[#ead9d1] bg-white p-3">
    <img
      src={form.image}
      alt={form.name}
      className="h-[80px] w-full rounded-[8px] object-cover"
    />
    <p className="mt-2 text-xs text-neutral-500">Current product image</p>
  </div>
) : null}

        <label className="block">
          <span className="mb-3 block text-sm font-medium">Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="min-h-[150px] w-full rounded-[18px] border border-[#ead9d1] px-5 py-4"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-full bg-[#2e221d] px-6 py-4 text-sm font-semibold text-white"
        >
          {saving ? "Updating..." : "Update Product"}
        </button>
      </form>
    </main>
  );
}