"use client";

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
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<Product>({
    id: 0,
    name: "",
    price: 0,
    image: "",
    category: "",
    subcategory: "",
    description: "",
    stock: 0,
  });

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit() {
    if (!form.name || !form.category) {
      alert("Name and category required");
      return;
    }

    const method = form.id ? "PUT" : "POST";

    await fetch("/api/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    resetForm();
    fetchProducts();
  }

  function handleEdit(product: Product) {
    setForm(product);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete product?")) return;

    await fetch(`/api/products?id=${id}`, {
      method: "DELETE",
    });

    fetchProducts();
  }

  function resetForm() {
    setForm({
      id: 0,
      name: "",
      price: 0,
      image: "",
      category: "",
      subcategory: "",
      description: "",
      stock: 0,
    });
  }

  return (
    <div className="container-ph py-6">
      <h1 className="text-2xl font-semibold mb-6">Admin Products</h1>

      {/* FORM */}
      <div className="mb-8 rounded-xl border p-4 bg-white">
        <div className="grid gap-3 md:grid-cols-2">
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="input-soft"
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="input-soft"
          />
          <input
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className="input-soft"
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="input-soft"
          />
          <input
            name="subcategory"
            placeholder="Subcategory"
            value={form.subcategory || ""}
            onChange={handleChange}
            className="input-soft"
          />
          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="input-soft"
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description || ""}
          onChange={handleChange}
          className="input-soft mt-3 w-full"
        />

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleSubmit}
            className="btn-primary px-4 py-2"
          >
            {form.id ? "Update Product" : "Add Product"}
          </button>

          <button
            onClick={resetForm}
            className="btn-secondary px-4 py-2"
          >
            Reset
          </button>
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="border rounded-xl p-3 bg-white"
            >
              <img
                src={p.image}
                className="w-full h-40 object-cover rounded mb-2"
              />

              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-sm">৳ {p.price}</p>
              <p className="text-xs text-gray-500">
                {p.category} / {p.subcategory}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-sm bg-yellow-400 px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}