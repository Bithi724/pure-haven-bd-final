"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SubcategoryCard from "@/components/ui/SubcategoryCard";
import { categoryMap } from "@/lib/categoryMap";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  stock?: number;
};

type ProductSectionProps = {
  title?: string;
  subtitle?: string;
  products?: Product[];
  viewAllHref?: string;
};

function normalizeSlug(value?: string) {
  return (value || "").trim().toLowerCase().replace(/\s+/g, "-");
}

function formatLabel(value?: string) {
  if (!value) return "";
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function ProductSection({
  title = "Featured Products",
  subtitle = "Discover some of our selected products.",
  products = [],
  viewAllHref = "/shop",
}: ProductSectionProps) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const categorySlug = normalizeSlug(title);

  const subcategoryCards = useMemo(() => {
    const configuredSubcategories =
      categoryMap[categorySlug as keyof typeof categoryMap] || [];

    return configuredSubcategories.map((subcategory) => {
      const matchedProduct = products.find(
        (product) =>
          normalizeSlug(product.subcategory) === normalizeSlug(subcategory)
      );

      return {
        slug: normalizeSlug(subcategory),
        label: formatLabel(subcategory),
        image:
          matchedProduct?.image?.trim()
            ? matchedProduct.image
            : "https://via.placeholder.com/800x1000?text=No+Image",
        href: `${viewAllHref}&subcategory=${normalizeSlug(subcategory)}`,
      };
    });
  }, [categorySlug, products, viewAllHref]);

  function scrollRail(direction: "left" | "right") {
    const rail = railRef.current;
    if (!rail) return;

    const firstCard = rail.querySelector(
      "[data-subcategory-card]"
    ) as HTMLDivElement | null;

    const cardWidth = firstCard?.offsetWidth ?? rail.clientWidth * 0.72;
    const gap = 16;
    const offset = cardWidth + gap;

    rail.scrollBy({
      left: direction === "right" ? offset : -offset,
      behavior: "smooth",
    });
  }

  if (subcategoryCards.length === 0) {
    return null;
  }

  return (
    <section className="container-ph section-gap">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold text-[#2e221d] sm:text-3xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 hidden text-sm text-neutral-600 sm:block">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={viewAllHref}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold uppercase tracking-[0.12em] text-[#2e221d] transition hover:text-[#7a5244]"
          >
            <span>Explore All</span>
          </Link>

          {subcategoryCards.length > 1 ? (
            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                aria-label="Scroll subcategories left"
                onClick={() => scrollRail("left")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ead9d1] bg-white text-[#2e221d] transition hover:bg-[#f8f3ef]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                aria-label="Scroll subcategories right"
                onClick={() => scrollRail("right")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ead9d1] bg-white text-[#2e221d] transition hover:bg-[#f8f3ef]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mb-1 -mx-4 overflow-hidden px-4 sm:mx-0 sm:px-0">
        <div
          ref={railRef}
          className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory overscroll-x-contain touch-pan-x pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {subcategoryCards.map((subcategory) => (
            <div
              key={subcategory.slug}
              data-subcategory-card
              className="snap-center shrink-0 basis-[72%] sm:basis-[42%] lg:basis-[30%] xl:basis-[24%]"
            >
              <SubcategoryCard
                title={subcategory.label}
                image={subcategory.image}
                href={subcategory.href}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}