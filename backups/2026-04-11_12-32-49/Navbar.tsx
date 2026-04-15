"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  Heart,
  ShoppingCart,
  User,
  Search,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { useWishlist } from "@/components/wishlist/WishlistContext";
import { navItems } from "@/lib/nav-data";

function ActionIconButton({
  href,
  label,
  icon,
  count,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  count?: number;
}) {
  const hasCount = typeof count === "number" && count > 0;

  return (
    <Link
      href={href}
      aria-label={label}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ead9d1] bg-white text-[#2e221d] transition hover:bg-[#f8f3ef] focus:outline-none focus:ring-2 focus:ring-[#d9c2b6] focus:ring-offset-2"
    >
      {icon}
      {hasCount ? (
        <span className="absolute -right-1 -top-1 inline-flex min-w-[18px] items-center justify-center rounded-full bg-[#2e221d] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileIndex, setOpenMobileIndex] = useState<number | null>(null);
  const [openDesktopIndex, setOpenDesktopIndex] = useState<number | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const syncAdminState = () => {
      try {
        setIsAdminLoggedIn(
          localStorage.getItem("ph_admin_logged_in") === "true"
        );
      } catch {
        setIsAdminLoggedIn(false);
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        syncAdminState();
      }
    };

    syncAdminState();

    window.addEventListener("storage", syncAdminState);
    window.addEventListener("focus", syncAdminState);
    window.addEventListener(
      "ph-admin-auth-changed",
      syncAdminState as EventListener
    );
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("storage", syncAdminState);
      window.removeEventListener("focus", syncAdminState);
      window.removeEventListener(
        "ph-admin-auth-changed",
        syncAdminState as EventListener
      );
      document.removeEventListener("visibilitychange", handleVisibility);

      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  function openDesktopMenu(index: number) {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    setOpenDesktopIndex(index);
  }

  function scheduleDesktopClose() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = setTimeout(() => {
      setOpenDesktopIndex(null);
    }, 180);
  }

  function toggleDesktopMenu(index: number) {
    setOpenDesktopIndex((prev) => (prev === index ? null : index));
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
    setOpenMobileIndex(null);
  }

  function toggleMobileSection(index: number) {
    setOpenMobileIndex((prev) => (prev === index ? null : index));
  }

  function isPrimaryActive(href: string) {
    const basePath = href.split("?")[0];

    if (basePath === "/shop") {
      return pathname === "/shop" || pathname.startsWith("/product");
    }

    return pathname === basePath;
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#ead9d1] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="container-ph py-3">
          <div className="flex items-center gap-3 lg:grid lg:grid-cols-[auto_minmax(320px,1fr)_auto] lg:gap-6">
            <Link href="/" className="min-w-0 shrink-0">
              <div className="text-xl font-semibold tracking-[0.18em] text-[#2e221d] sm:text-2xl">
                PURE
              </div>
              <div className="text-[10px] tracking-[0.34em] text-neutral-500 sm:text-[11px]">
                HAVEN BD
              </div>
            </Link>

            <form
              action="/shop"
              method="GET"
              className="hidden w-full lg:block"
              role="search"
            >
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  placeholder="Search products..."
                  className="input-soft h-11 rounded-full pl-5 pr-12 text-sm"
                />
                <button
                  type="submit"
                  aria-label="Search products"
                  className="absolute right-1.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#ead9d1] text-[#2e221d] transition hover:bg-[#f8f3ef] focus:outline-none focus:ring-2 focus:ring-[#d9c2b6]"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <div className="hidden items-center gap-2 lg:flex">
                <ActionIconButton
                  href="/wishlist"
                  label="Wishlist"
                  icon={<Heart className="h-[18px] w-[18px]" />}
                  count={wishlistCount}
                />

                <ActionIconButton
                  href="/cart"
                  label="Cart"
                  icon={<ShoppingCart className="h-[18px] w-[18px]" />}
                  count={cartCount}
                />

                <ActionIconButton
                  href={isAdminLoggedIn ? "/admin" : "/login"}
                  label={isAdminLoggedIn ? "Dashboard" : "Account"}
                  icon={<User className="h-[18px] w-[18px]" />}
                />
              </div>

              <div className="flex items-center gap-2 lg:hidden">
                <ActionIconButton
                  href="/wishlist"
                  label="Wishlist"
                  icon={<Heart className="h-[18px] w-[18px]" />}
                  count={wishlistCount}
                />

                <ActionIconButton
                  href="/cart"
                  label="Cart"
                  icon={<ShoppingCart className="h-[18px] w-[18px]" />}
                  count={cartCount}
                />

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ead9d1] bg-white text-[#2e221d] transition hover:bg-[#f8f3ef] focus:outline-none focus:ring-2 focus:ring-[#d9c2b6] focus:ring-offset-2"
                >
                  {mobileMenuOpen ? (
                    <X className="h-[18px] w-[18px]" />
                  ) : (
                    <Menu className="h-[18px] w-[18px]" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 lg:hidden">
            <form action="/shop" method="GET" role="search">
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  placeholder="Search products..."
                  className="input-soft h-11 rounded-full pl-5 pr-12 text-sm"
                />
                <button
                  type="submit"
                  aria-label="Search products"
                  className="absolute right-1.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#ead9d1] text-[#2e221d] transition hover:bg-[#f8f3ef] focus:outline-none focus:ring-2 focus:ring-[#d9c2b6]"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

       <nav className="hidden border-t border-[#f1e4de] lg:block">
          <div className="container-ph flex flex-wrap items-center gap-7 py-3 text-sm font-medium">
            {navItems.map((item, index) => {
              const hasSections = !!item.sections?.length;
              const isOpen = openDesktopIndex === index;
              const active = isPrimaryActive(item.href);

              return (
                <div
                  key={item.label}
                  className="relative pb-3 -mb-3"
                  onMouseEnter={() => {
                    if (hasSections) openDesktopMenu(index);
                  }}
                  onMouseLeave={() => {
                    if (hasSections) scheduleDesktopClose();
                  }}
                >
                  <div className="flex items-center gap-1">
                    <Link
                      href={item.href}
                      className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1.5 transition ${
                        active
                          ? "bg-[#f8f3ef] text-[#2e221d]"
                          : "text-[#2e221d] hover:bg-[#f8f3ef] hover:text-[#7a5244]"
                      }`}
                    >
                      {item.label}
                    </Link>

                    {hasSections ? (
                      <button
                        type="button"
                        aria-label={`Toggle ${item.label} submenu`}
                        aria-expanded={isOpen}
                        onClick={() => toggleDesktopMenu(index)}
                        onFocus={() => openDesktopMenu(index)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#2e221d] transition hover:bg-[#f8f3ef] focus:outline-none focus:ring-2 focus:ring-[#d9c2b6]"
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    ) : null}
                  </div>

                  {hasSections ? (
                    <div
                      className={`absolute left-0 top-full z-[70] w-[820px] max-w-[calc(100vw-40px)] pt-2 ${
                        isOpen ? "pointer-events-auto" : "pointer-events-none"
                      }`}
                    >
                      <div
                        className={`rounded-[24px] border border-[#ead9d1] bg-white p-6 shadow-xl transition-all duration-150 ${
                          isOpen
                            ? "translate-y-0 opacity-100"
                            : "translate-y-1 opacity-0"
                        }`}
                      >
                        <div className="mb-4 border-b border-[#f1e4de] pb-3">
                          <Link
                            href={item.href}
                            className="text-base font-semibold text-[#2e221d] hover:text-[#7a5244]"
                          >
                            Explore {item.label}
                          </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                          {item.sections!.map((section) => (
                            <div key={section.title}>
                              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a5244]">
                                {section.title}
                              </h3>

                              <div className="space-y-2">
                                {section.children.map((child) => (
                                  <Link
                                    key={child.label}
                                    href={child.href}
                                    className="block text-sm text-neutral-700 transition hover:translate-x-1 hover:text-[#7a5244]"
                                  >
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </nav>

        {mobileMenuOpen ? (
          <div className="border-t border-[#f1e4de] bg-white lg:hidden">
            <div className="container-ph py-4">
              <div className="mb-4 flex items-center gap-2">
                <ActionIconButton
                  href={isAdminLoggedIn ? "/admin" : "/login"}
                  label={isAdminLoggedIn ? "Dashboard" : "Account"}
                  icon={<User className="h-[18px] w-[18px]" />}
                />
              </div>

              <div className="space-y-3">
                {navItems.map((item, index) => {
                  const hasSections = !!item.sections?.length;
                  const isOpen = openMobileIndex === index;

                  return (
                    <div
                      key={item.label}
                      className="rounded-[20px] border border-[#ead9d1] bg-white px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <Link
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="font-medium text-[#2e221d] hover:text-[#7a5244]"
                        >
                          {item.label}
                        </Link>

                        {hasSections ? (
                          <button
                            type="button"
                            onClick={() => toggleMobileSection(index)}
                            className="rounded-full border border-[#ead9d1] px-3 py-1 text-sm text-[#2e221d] hover:bg-[#f8f3ef]"
                          >
                            {isOpen ? "−" : "+"}
                          </button>
                        ) : null}
                      </div>

                      {hasSections && isOpen ? (
                        <div className="mt-4 space-y-4 border-t border-[#f1e4de] pt-4">
                          {item.sections!.map((section) => (
                            <div key={section.title}>
                              <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a5244]">
                                {section.title}
                              </h4>

                              <div className="space-y-2">
                                {section.children.map((child) => (
                                  <Link
                                    key={child.label}
                                    href={child.href}
                                    onClick={closeMobileMenu}
                                    className="block text-sm text-neutral-700 hover:text-[#7a5244]"
                                  >
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </header>
    </>
  );
}