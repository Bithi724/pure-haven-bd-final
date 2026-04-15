"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
type StockFilter = "all" | "in-stock" | "low-stock" | "out-of-stock";

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

function getSafeStock(stock: unknown) {
  const value = Number(stock);
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

function normalizeStockFilter(value: string | null): StockFilter {
  if (
    value === "all" ||
    value === "in-stock" ||
    value === "low-stock" ||
    value === "out-of-stock"
  ) {
    return value;
  }

  return "all";
}

function getStockFilterMatch(product: Product, filter: StockFilter) {
  const stock = getSafeStock(product.stock);

  switch (filter) {
    case "in-stock":
      return stock > 5;
    case "low-stock":
      return stock > 0 && stock <= 5;
    case "out-of-stock":
      return stock <= 0;
    case "all":
    default:
      return true;
  }
}

function getStockBadge(stock?: number) {
  const safeStock = getSafeStock(stock);

  if (safeStock <= 0) {
    return {
      text: "Out of Stock",
      className: "border-red-200 bg-red-50 text-red-600",
    };
  }

  if (safeStock <= 5) {
    return {
      text: "Low Stock",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    };
  }

  return {
    text: "In Stock",
    className: "border-green-200 bg-green-50 text-green-700",
  };
}

function escapeCsv(value: string | number) {
  const text = String(value ?? "");
  const escaped = text.replace(/"/g, '""');
  return `"${escaped}"`;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "Skincare" as CategoryName,
    subcategory: "face-wash",
    description: "",
    stock: "",
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [updatingStockId, setUpdatingStockId] = useState<number | null>(null);
  const isSyncingFromUrl = useRef(true);

  const subcategoryList = useMemo(() => {
    return categoryOptions[form.category] ?? [];
  }, [form.category]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();
      setProducts(Array.isArray(data) ? [...data].reverse() : []);
    } catch {
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    isSyncingFromUrl.current = true;

    const nextSearch = searchParams.get("search") || "";
    const nextStockFilter = normalizeStockFilter(
      searchParams.get("stockFilter")
    );

    setSearch(nextSearch);
    setStockFilter(nextStockFilter);
  }, [searchParams]);

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    const currentStockFilter = normalizeStockFilter(
      searchParams.get("stockFilter")
    );

    if (isSyncingFromUrl.current) {
      if (search === currentSearch && stockFilter === currentStockFilter) {
        isSyncingFromUrl.current = false;
      }
      return;
    }

    if (search === currentSearch && stockFilter === currentStockFilter) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }

    if (stockFilter !== "all") {
      params.set("stockFilter", stockFilter);
    } else {
      params.delete("stockFilter");
    }

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  }, [search, stockFilter, pathname, router, searchParams]);

  function resetEditForm() {
    setForm({
      name: "",
      price: "",
      category: "Skincare",
      subcategory: "face-wash",
      description: "",
      stock: "",
    });
    setEditingId(null);
    setImageFile(null);
    setPreviewUrl("");
  }

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

  function handleEdit(product: Product) {
    const nextCategory = (product.category in categoryOptions
      ? product.category
      : "Skincare") as CategoryName;

    setEditingId(product.id);
    setForm({
      name: product.name,
      price: String(product.price),
      category: nextCategory,
      subcategory:
        product.subcategory || categoryOptions[nextCategory][0] || "",
      description: product.description || "",
      stock: String(getSafeStock(product.stock)),
    });
    setImageFile(null);
    setPreviewUrl(product.image || "");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!editingId) return;

    setLoading(true);
    setMessage("");

    try {
      let imagePath = previewUrl;

      if (imageFile) {
        imagePath = await uploadImageAndGetPath(imageFile);
      }

      const payload = {
        id: editingId,
        name: form.name.trim(),
        price: Number(form.price),
        image: imagePath,
        category: form.category,
        subcategory: form.subcategory,
        description: form.description.trim(),
        stock: getSafeStock(form.stock),
      };

      const res = await fetch("/api/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(result?.message || "Failed to update product");
      }

      setMessage("Product updated successfully.");
      resetEditForm();
      await fetchProducts();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(result?.message || "Delete failed");
      }

      if (editingId === id) {
        resetEditForm();
      }

      setMessage("Product deleted successfully.");
      await fetchProducts();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to delete product."
      );
    }
  }

  async function handleQuickStockUpdate(product: Product, delta: number) {
    const currentStock = getSafeStock(product.stock);
    const nextStock = Math.max(0, currentStock + delta);

    if (nextStock === currentStock) return;

    const previousProducts = products;
    const previousFormStock = form.stock;

    setUpdatingStockId(product.id);
    setMessage("");

    setProducts((prev) =>
      prev.map((item) =>
        item.id === product.id ? { ...item, stock: nextStock } : item
      )
    );

    if (editingId === product.id) {
      setForm((prev) => ({
        ...prev,
        stock: String(nextStock),
      }));
    }

    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          subcategory: product.subcategory,
          description: product.description ?? "",
          stock: nextStock,
        }),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(result?.message || "Failed to update stock");
      }

      setMessage(`Stock updated for ${product.name}.`);
      await fetchProducts();
    } catch (error) {
      setProducts(previousProducts);

      if (editingId === product.id) {
        setForm((prev) => ({
          ...prev,
          stock: previousFormStock,
        }));
      }

      setMessage(
        error instanceof Error ? error.message : "Failed to update stock."
      );
    } finally {
      setUpdatingStockId(null);
    }
  }

  function handleExportCsv() {
    if (filteredProducts.length === 0) return;

    const headers = [
      "Product ID",
      "Name",
      "Category",
      "Subcategory",
      "Price",
      "Stock",
      "Stock Status",
      "Description",
    ];

    const rows = filteredProducts.map((product) => [
      escapeCsv(product.id),
      escapeCsv(product.name),
      escapeCsv(product.category),
      escapeCsv(product.subcategory ?? ""),
      escapeCsv(product.price),
      escapeCsv(getSafeStock(product.stock)),
      escapeCsv(getStockBadge(product.stock).text),
      escapeCsv(product.description ?? ""),
    ]);

    const csvContent = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const now = new Date();
    const safeDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}`;

    link.href = url;
    link.download = `products-${stockFilter}-${safeDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const totalProducts = products.length;

  const lowStockCount = products.filter((product) => {
    const stock = getSafeStock(product.stock);
    return stock > 0 && stock <= 5;
  }).length;

  const outOfStockCount = products.filter((product) => {
    const stock = getSafeStock(product.stock);
    return stock <= 0;
  }).length;

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch = keyword
        ? [
            product.name,
            product.category,
            product.subcategory,
            product.description,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(keyword)
        : true;

      const matchesStock = getStockFilterMatch(product, stockFilter);

      return matchesSearch && matchesStock;
    });
  }, [products, search, stockFilter]);

  return (
    <main className="min-h-screen bg-[#fcf8f6] px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <AdminNav />

        {editingId ? (
          <div className="rounded-[28px] border border-[#ead9d1] bg-white p-6 shadow-sm md:p-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold text-[#2e221d]">
                  Edit Product
                </h1>
                <p className="mt-2 text-sm text-neutral-600">
                  Update existing product information.
                </p>
              </div>

              <button
                type="button"
                onClick={resetEditForm}
                className="rounded-full border border-[#ead9d1] px-4 py-2 text-sm hover:bg-[#f8f3ef]"
              >
                Cancel Edit
              </button>
            </div>

            <form onSubmit={handleUpdate} className="grid gap-5">
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
                  Change Product Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageChange}
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
                {loading ? "Updating..." : "Update Product"}
              </button>
            </form>
          </div>
        ) : null}

        {message ? (
          <div className="rounded-[24px] border border-[#ead9d1] bg-white p-4 text-sm font-medium text-[#7a5244] shadow-sm">
            {message}
          </div>
        ) : null}

        <div className="rounded-[28px] border border-[#ead9d1] bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-[#2e221d]">
                Products
              </h1>
              <p className="mt-2 text-sm text-neutral-600">
                Search, filter, edit, export, delete, and quickly update stock.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/products/add"
                className="rounded-full border border-[#ead9d1] px-4 py-2 text-sm font-medium hover:bg-[#f8f3ef]"
              >
                Add Product
              </Link>

              <button
                type="button"
                onClick={handleExportCsv}
                disabled={filteredProducts.length === 0}
                className="rounded-full border border-[#ead9d1] px-5 py-2 text-sm hover:bg-[#f8f3ef] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Export CSV
              </button>
            </div>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-[#ead9d1] bg-[#fffdfb] p-5 shadow-sm">
              <p className="text-sm text-neutral-500">Total Products</p>
              <h2 className="mt-2 text-3xl font-semibold">{totalProducts}</h2>
            </div>

            <Link
              href="/admin/products?stockFilter=low-stock"
              className="rounded-[24px] border border-[#ead9d1] bg-[#fffdfb] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-sm text-neutral-500">Low Stock</p>
              <h2 className="mt-2 text-3xl font-semibold text-amber-700">
                {lowStockCount}
              </h2>
            </Link>

            <Link
              href="/admin/products?stockFilter=out-of-stock"
              className="rounded-[24px] border border-[#ead9d1] bg-[#fffdfb] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-sm text-neutral-500">Out of Stock</p>
              <h2 className="mt-2 text-3xl font-semibold text-red-600">
                {outOfStockCount}
              </h2>
            </Link>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-[1.4fr_240px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, category, subcategory, description"
              className="w-full rounded-2xl border border-[#ead9d1] px-4 py-3 outline-none"
            />

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as StockFilter)}
              className="w-full rounded-2xl border border-[#ead9d1] px-4 py-3 outline-none"
            >
              <option value="all">All Inventory</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          {loadingProducts ? (
            <p className="text-sm text-neutral-600">Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-sm text-neutral-600">No matching products found.</p>
          ) : (
            <div className="grid gap-4">
              {filteredProducts.map((product) => {
                const stockBadge = getStockBadge(product.stock);
                const isUpdatingThisStock = updatingStockId === product.id;
                const currentStock = getSafeStock(product.stock);

                return (
                  <div
                    key={product.id}
                    className="flex flex-col gap-4 rounded-2xl border border-[#ead9d1] p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-20 w-20 rounded-xl bg-[#f8f3ef] object-cover"
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-[#2e221d]">
                            {product.name}
                          </h3>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${stockBadge.className}`}
                          >
                            {stockBadge.text}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-neutral-600">
                          {product.category} / {product.subcategory ?? "N/A"}
                        </p>

                        <p className="text-sm text-neutral-600">
                          {product.price} BDT
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <span className="text-sm font-medium text-neutral-700">
                            Stock: {currentStock}
                          </span>

                          <div className="flex items-center rounded-full border border-[#ead9d1]">
                            <button
                              type="button"
                              disabled={isUpdatingThisStock || currentStock <= 0}
                              onClick={() => handleQuickStockUpdate(product, -1)}
                              className="px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              -
                            </button>

                            <span className="min-w-[48px] px-3 text-center text-sm">
                              {currentStock}
                            </span>

                            <button
                              type="button"
                              disabled={isUpdatingThisStock}
                              onClick={() => handleQuickStockUpdate(product, 1)}
                              className="px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>

                          {isUpdatingThisStock ? (
                            <span className="text-xs text-neutral-500">
                              Updating...
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        className="rounded-full border border-[#ead9d1] px-5 py-2 text-sm font-medium hover:bg-[#f8f3ef]"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="rounded-full border border-red-200 px-5 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}