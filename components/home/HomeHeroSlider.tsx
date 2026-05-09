"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Slide = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  isActive: boolean;
  sortOrder: number;
};

const fallbackSlides: Slide[] = [
  {
    id: "fallback-1",
    label: "New Arrivals",
    title: "Fresh Beauty Collection",
    subtitle: "Explore cosmetics, skincare, haircare, and daily essentials.",
    image: "/images/categories/cosmetics.jpg",
    href: "/shop",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "fallback-2",
    label: "Skincare",
    title: "Glow Essentials",
    subtitle: "Hydrating and nourishing skincare picks for daily care.",
    image: "/images/categories/skincare.jpg",
    href: "/shop",
    isActive: true,
    sortOrder: 2,
  },
];

export default function HomeHeroSlider() {
  const [slides, setSlides] = useState<Slide[]>(fallbackSlides);
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    async function loadSlides() {
      try {
        const res = await fetch("/api/home-promos?kind=slider", { cache: "no-store" });
        const data = await res.json();

        if (res.ok && data?.success && Array.isArray(data.items)) {
          const activeSlides = data.items
            .filter((item: Slide) => item.isActive)
            .sort((a: Slide, b: Slide) => a.sortOrder - b.sortOrder);

          if (activeSlides.length > 0) setSlides(activeSlides);
        }
      } catch {}
    }

    loadSlides();
  }, []);

  const safeSlides = useMemo(() => {
    return slides.length > 0 ? slides : fallbackSlides;
  }, [slides]);

  function goNext() {
    setActive((prev) => (prev + 1) % safeSlides.length);
  }

  function goPrev() {
    setActive((prev) => (prev - 1 + safeSlides.length) % safeSlides.length);
  }

  useEffect(() => {
    if (safeSlides.length <= 1) return;

    const timer = window.setInterval(goNext, 4500);
    return () => window.clearInterval(timer);
  }, [safeSlides.length]);

  return (
    <section className="bg-[#fcf8f6] px-3 pt-4 sm:px-4 md:px-6 lg:px-8">
      <div
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[24px] bg-[#2e221d] shadow-sm"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null || safeSlides.length <= 1) return;
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (diff > 40) goNext();
          if (diff < -40) goPrev();
          touchStartX.current = null;
        }}
      >
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {safeSlides.map((slide) => (
            <Link
              key={slide.id}
              href={slide.href || "/shop"}
              className="relative h-[230px] w-full shrink-0 overflow-hidden sm:h-[330px] md:h-[430px]"
            >
              <img
                src={slide.image || "/images/categories/cosmetics.jpg"}
                alt={slide.title}
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

              <div className="absolute inset-0 flex items-center px-5 text-white sm:px-10 md:px-14">
                <div className="max-w-[80%] sm:max-w-xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80 sm:text-xs">
                    {slide.label}
                  </p>

                  <h1 className="mt-2 text-[30px] font-semibold leading-tight sm:text-5xl md:text-6xl">
                    {slide.title}
                  </h1>

                  {slide.subtitle ? (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/85 md:text-base">
                      {slide.subtitle}
                    </p>
                  ) : null}

                  <span className="mt-5 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#2e221d]">
                    Shop now
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {safeSlides.length > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-[#2e221d] shadow md:grid"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-[#2e221d] shadow md:grid"
            >
              ›
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {safeSlides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`h-2 rounded-full transition-all ${
                    active === index ? "w-7 bg-white" : "w-2 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
