"use client";

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

    const cardWidth = firstCard?.offsetWidth ?? rail.clientWidth * 0.78;
    const gap = 16;
    const offset = cardWidth + gap;

    rail.scrollBy({
      left: direction === "right" ? offset : -offset,
      behavior: "smooth",
    });
  }

  return (
    <section className="container-ph section-gap relative z-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-[#7a5244]">
            Browse Categories
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-[#2e221d]">
            Shop by Category
          </h2>
          <p className="mt-2 max-w-xl text-sm text-neutral-600">
            Explore our curated beauty, care, fragrance, and lifestyle
            collections.
          </p>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            aria-label="Scroll categories left"
            onClick={() => scrollRail("left")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#ead9d1] bg-white text-[#2e221d] transition hover:bg-[#f8f3ef]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Scroll categories right"
            onClick={() => scrollRail("right")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#ead9d1] bg-white text-[#2e221d] transition hover:bg-[#f8f3ef]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
        <div
          ref={railRef}
          className="flex gap-4 overflow-x-scroll overflow-y-hidden scroll-smooth snap-x snap-mandatory overscroll-x-contain touch-pan-x pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {categories.map((category) => (
            <div
              key={category.title}
              data-category-card
              className="snap-start shrink-0 basis-[78%] sm:basis-[46%] lg:basis-[34%] xl:basis-[28%]"
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

      <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
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
    </section>
  );
}