"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CategoryCard from "@/components/ui/CategoryCard";
import { categories } from "@/lib/data";

export default function CategorySection() {
  const railRef = useRef<HTMLDivElement | null>(null);

  function scrollRail(direction: "left" | "right") {
    const rail = railRef.current;
    if (!rail) return;

    const firstCard = rail.querySelector(
      "[data-category-card]"
    ) as HTMLDivElement | null;

    const cardWidth = firstCard?.offsetWidth ?? rail.clientWidth * 0.72;
    const gap = 18;
    const offset = cardWidth + gap;

    rail.scrollBy({
      left: direction === "right" ? offset : -offset,
      behavior: "smooth",
    });
  }

  return (
    <section className="container-ph section-gap relative z-10">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm uppercase tracking-[0.22em] text-[#7a5244]">
            Browse Categories
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[#2e221d] sm:text-3xl">
            Shop by Category
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-[0.12em] text-[#2e221d] transition hover:text-[#7a5244]"
          >
            <span>Explore All</span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              aria-label="Scroll categories left"
              onClick={() => scrollRail("left")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ead9d1] bg-white text-[#2e221d] transition hover:bg-[#f8f3ef]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              aria-label="Scroll categories right"
              onClick={() => scrollRail("right")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ead9d1] bg-white text-[#2e221d] transition hover:bg-[#f8f3ef]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="-mx-4 overflow-hidden px-4 sm:mx-0 sm:px-0">
        <div
          ref={railRef}
          className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory overscroll-x-contain touch-pan-x pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {categories.map((category) => (
            <div
              key={category.title}
              data-category-card
              className="snap-center shrink-0 basis-[72%] sm:basis-[42%] lg:basis-[30%] xl:basis-[24%]"
            >
              <CategoryCard
                title={category.title}
                image={category.image}
                href={category.href}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}