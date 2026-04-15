"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";

const categoryOptions: Record<string, string[]> = {
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
    "sponge",
    "makeup-remover",
    "others",
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
  Perfume: [
    "edt-men",
    "edp-men",
    "perfume-men",
    "edt-women",
    "edp-women",
    "perfume-women",
    "attar",
    "air-freshener",
    "others",
  ],
  Food: [
    "honey",
    "tea",
    "coffee",
    "snacks",
    "chocolate",
    "organic-food",
    "health-drinks",
    "others",
  ],
  "Mens Products": [
    "face-wash",
    "beard-oil",
    "shaving-cream",
    "after-shave",
    "deodorant",
    "body-spray",
    "grooming-kit",
    "others",
  ],
};

type CategoryName = keyof typeof categoryOptions;

function getSafeStock(stock: unknown) {
  const value = Number(stock);
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

export default function AddProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "Skincare" as CategoryName,
    subcategory: "face-wash",
    description: "",
    stock: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const subcategoryList = useMemo(() => {
    return categoryOptions[form.category] ?? [];
  }, [form.category]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    if (name === "category") {
      const nextCategory = value as CategoryName;
      setForm((prev) => ({
        ...prev,
        category: nextCategory,
        subcategory: categoryOptions[nextCategory][0] ?? "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  }

  async function uploadImageAndGetPath(file: File) {
    const uploadData = new FormData();
    uploadData.append("file", file);

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: uploadData,
    });

    const uploadResult = await uploadRes.json();

    if (!uploadRes.ok || !uploadResult?.imagePath) {
      throw new Error(uploadResult?.message || "Image upload failed");
    }

    return uploadResult.imagePath as string;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!imageFile) {
        throw new Error("Please choose an image");
      }

      const imagePath = await uploadImageAndGetPath(imageFile);

      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        image: imagePath,
        category: form.category,
        subcategory: form.subcategory,
        description: form.description.trim(),
        stock: getSafeStock(form.stock),
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(result?.message || "Failed to create product");
      }

      setMessage("Product added successfully.");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fcf8f6] px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <AdminNav />

        <div className="rounded-[28px] border border-[#ead9d1] bg-white p-6 shadow-sm md:p-8">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-[#2e221d]">
                Add Product
              </h1>
              <p className="mt-2 text-sm text-neutral-600">
                Create a new product with category, subcategory, stock, and image.
              </p>
            </div>

            <Link
              href="/admin/products"
              className="rounded-full border border-[#ead9d1] px-4 py-2 text-sm hover:bg-[#f8f3ef]"
            >
              Back Products
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-[#ead9d1] px-4 py-3 outline-none"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full rounded-2xl border border-[#ead9d1] px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full rounded-2xl border border-[#ead9d1] px-4 py-3 outline-none"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[#ead9d1] px-4 py-3 outline-none"
                >
                  {Object.keys(categoryOptions).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Subcategory
                </label>
                <select
                  name="subcategory"
                  value={form.subcategory}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[#ead9d1] px-4 py-3 outline-none"
                >
                  {subcategoryList.map((subcategory) => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Product Image
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageChange}
                required
                className="w-full rounded-2xl border border-[#ead9d1] px-4 py-3 outline-none"
              />
            </div>

            {previewUrl ? (
              <div className="rounded-2xl border border-[#ead9d1] p-4">
                <p className="mb-3 text-sm font-medium">Image Preview</p>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-52 w-full rounded-2xl object-cover"
                />
              </div>
            ) : null}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-2xl border border-[#ead9d1] px-4 py-3 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#2e221d] px-6 py-3 text-white transition hover:bg-[#7a5244] disabled:opacity-60"
            >
              {loading ? "Adding..." : "Add Product"}
            </button>

            {message ? (
              <p className="text-sm font-medium text-[#7a5244]">{message}</p>
            ) : null}
          </form>
        </div>
      </div>
    </main>
  );
}