"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";

type Slide = {
  id: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  buttonText: string;
  isActive: boolean;
  sortOrder: number;
};

const emptyForm = {
  eyebrow: "PURE HAVEN BD",
  title: "",
  subtitle: "",
  image: "",
  href: "/shop",
  buttonText: "Shop Now",
  sortOrder: "0",
};

export default function AdminSlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadSlides() {
    try {
      const res = await fetch("/api/home-slides?includeInactive=true", {
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to load slides.");
      }

      setSlides(Array.isArray(data.slides) ? data.slides : []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load slides.");
    }
  }

  useEffect(() => {
    loadSlides();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function uploadImage(file: File) {
    const uploadData = new FormData();
    uploadData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: uploadData,
    });

    const data = await res.json();

    if (!res.ok || !data?.imagePath) {
      throw new Error(data?.message || "Image upload failed.");
    }

    return data.imagePath as string;
  }

  async function createSlide(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const image = imageFile ? await uploadImage(imageFile) : form.image.trim();

      const res = await fetch("/api/home-slides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          image,
          sortOrder: Number(form.sortOrder),
          isActive: true,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to create slide.");
      }

      setForm(emptyForm);
      setImageFile(null);
      await loadSlides();
      setMessage("Slide added successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to create slide.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleSlide(slide: Slide) {
    const res = await fetch("/api/home-slides", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: slide.id, isActive: !slide.isActive }),
    });

    if (res.ok) await loadSlides();
  }

  async function editSlide(slide: Slide) {
    const title = prompt("Slide title", slide.title);
    if (!title) return;

    const href = prompt("Button link", slide.href) || "/shop";
    const buttonText = prompt("Button text", slide.buttonText) || "Shop Now";
    const sortOrder = prompt("Sort order", String(slide.sortOrder)) || "0";

    const res = await fetch("/api/home-slides", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: slide.id,
        title,
        href,
        buttonText,
        sortOrder: Number(sortOrder),
      }),
    });

    if (res.ok) await loadSlides();
  }

  async function deleteSlide(slide: Slide) {
    if (!confirm(`Delete slide: ${slide.title}?`)) return;

    const res = await fetch(`/api/home-slides?id=${slide.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      await loadSlides();
      setMessage("Slide deleted successfully.");
    }
  }

  return (
    <main className="min-h-screen bg-[#fcf8f6] px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <AdminNav />

        <section className="rounded-[28px] border border-[#ead9d1] bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-3xl font-semibold text-[#2e221d]">
            Homepage Slider
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Add, edit, hide, or delete homepage slider images and buttons.
          </p>

          {message ? (
            <div className="mt-5 rounded-2xl border border-[#ead9d1] bg-[#fffaf7] p-4 text-sm">
              {message}
            </div>
          ) : null}

          <form onSubmit={createSlide} className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="eyebrow"
                value={form.eyebrow}
                onChange={handleChange}
                className="rounded-2xl border border-[#ead9d1] px-4 py-3"
                placeholder="Small top text"
              />
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="rounded-2xl border border-[#ead9d1] px-4 py-3"
                placeholder="Slide title"
                required
              />
            </div>

            <textarea
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              className="rounded-2xl border border-[#ead9d1] px-4 py-3"
              placeholder="Slide subtitle"
              rows={3}
              required
            />

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="rounded-2xl border border-[#ead9d1] px-4 py-3"
              />
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                className="rounded-2xl border border-[#ead9d1] px-4 py-3"
                placeholder="Or image URL/path"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <input
                name="href"
                value={form.href}
                onChange={handleChange}
                className="rounded-2xl border border-[#ead9d1] px-4 py-3"
                placeholder="/shop?category=cosmetics"
              />
              <input
                name="buttonText"
                value={form.buttonText}
                onChange={handleChange}
                className="rounded-2xl border border-[#ead9d1] px-4 py-3"
                placeholder="Button text"
              />
              <input
                name="sortOrder"
                type="number"
                value={form.sortOrder}
                onChange={handleChange}
                className="rounded-2xl border border-[#ead9d1] px-4 py-3"
                placeholder="Sort order"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#2e221d] px-6 py-3 text-sm font-semibold text-white hover:bg-[#7a5244] disabled:opacity-60"
            >
              {loading ? "Saving..." : "Add Slide"}
            </button>
          </form>
        </section>

        <section className="grid gap-4">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="grid gap-4 rounded-[24px] border border-[#ead9d1] bg-white p-4 shadow-sm md:grid-cols-[220px_1fr_auto]"
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="h-32 w-full rounded-2xl object-cover md:w-[220px]"
              />

              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#7a5244]">
                  {slide.eyebrow}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-[#2e221d]">
                  {slide.title}
                </h2>
                <p className="mt-1 text-sm text-neutral-600">{slide.subtitle}</p>
                <p className="mt-2 text-xs text-neutral-500">
                  Button: {slide.buttonText} → {slide.href}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  Sort: {slide.sortOrder} | {slide.isActive ? "Active" : "Hidden"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 md:flex-col">
                <button
                  type="button"
                  onClick={() => editSlide(slide)}
                  className="rounded-full border border-[#ead9d1] px-4 py-2 text-sm hover:bg-[#f8f3ef]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => toggleSlide(slide)}
                  className="rounded-full border border-[#ead9d1] px-4 py-2 text-sm hover:bg-[#f8f3ef]"
                >
                  {slide.isActive ? "Hide" : "Show"}
                </button>
                <button
                  type="button"
                  onClick={() => deleteSlide(slide)}
                  className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}