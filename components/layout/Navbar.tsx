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
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { useWishlist } from "@/components/wishlist/WishlistContext";
import { useMobileUI } from "@/components/mobile/MobileUIContext";
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
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#ead9d1] bg-white text-[#2e221d] transition hover:bg-[#f8f3ef] focus:outline-none focus:ring-2 focus:ring-[#d9c2b6] focus:ring-offset-2 sm:h-10 sm:w-10"
    >
      {icon}
      {hasCount ? (
        <span className="absolute -right-1 -top-1 inline-flex min-w-[16px] items-center justify-center rounded-full bg-[#2e221d] px-1 text-[10px] font-semibold leading-4 text-white sm:min-w-[18px]">
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
  const {
    isMenuOpen,
    isSearchOpen,
    toggleMenu,
    toggleSearch,
    closeAll,
    closeMenu,
  } = useMobileUI();

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

    syncAdminState();

    window.addEventListener("storage", syncAdminState);
    window.addEventListener("focus", syncAdminState);
    window.addEventListener(
      "ph-admin-auth-changed",
      syncAdminState as EventListener
    );

    return () => {
      window.removeEventListener("storage", syncAdminState);
      window.removeEventListener("focus", syncAdminState);
      window.removeEventListener(
        "ph-admin-auth-changed",
        syncAdminState as EventListener
      );

      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setOpenMobileIndex(null);
    setOpenDesktopIndex(null);
    closeAll();
  }, [pathname, closeAll]);

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
    closeMenu();
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
    <header className="sticky top-0 z-50 border-b border-[#ead9d1] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="container-ph py-2 lg:py-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 lg:gap-3">
          <div className="flex items-center gap-2 justify-self-start">
            <button
              type="button"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#ead9d1] bg-white text-[#2e221d] transition hover:bg-[#f8f3ef] lg:hidden"
            >
              {isMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>

            <Link
              href="/shop"
              className="hidden h-10 items-center gap-2 rounded-full border border-[#ead9d1] bg-white px-4 text-sm font-medium text-[#2e221d] transition hover:bg-[#f8f3ef] lg:inline-flex"
            >
              <Menu className="h-4 w-4" />
              <span>Browse</span>
            </Link>
          </div>

          <Link href="/" className="justify-self-center text-center">
            <div className="text-lg font-semibold tracking-[0.16em] text-[#2e221d] sm:text-xl lg:text-2xl lg:tracking-[0.18em]">
              PURE
            </div>
            <div className="text-[9px] tracking-[0.28em] text-neutral-500 sm:text-[10px] lg:text-[11px] lg:tracking-[0.34em]">
              HAVEN BD
            </div>
          </Link>

          <div className="flex items-center justify-end gap-2 justify-self-end">
            <button
              type="button"
              onClick={toggleSearch}
              aria-label={isSearchOpen ? "Close search" : "Open search"}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition sm:h-10 sm:w-10 ${
                isSearchOpen
                  ? "border-[#2e221d] bg-[#2e221d] text-white"
                  : "border-[#ead9d1] bg-white text-[#2e221d] hover:bg-[#f8f3ef]"
              }`}
            >
              <Search className="h-4 w-4" />
            </button>

            <div className="hidden items-center gap-2 sm:flex lg:hidden">
              <ActionIconButton
                href="/cart"
                label="Cart"
                icon={<ShoppingCart className="h-[18px] w-[18px]" />}
                count={cartCount}
              />
            </div>

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
          </div>
        </div>
      </div>

      {isSearchOpen ? (
        <div className="border-t border-[#f1e4de] bg-white lg:hidden">
          <div className="container-ph py-2">
            <form
              action="/shop"
              method="GET"
              role="search"
              className="mx-auto max-w-2xl"
            >
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  placeholder="Search products..."
                  className="input-soft h-10 rounded-full pl-4 pr-11 text-sm"
                />
                <button
                  type="submit"
                  aria-label="Search products"
                  className="absolute right-1.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-[#ead9d1] text-[#2e221d] transition hover:bg-[#f8f3ef]"
                >
                  <Search className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

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
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#2e221d] transition hover:bg-[#f8f3ef]"
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

      {isMenuOpen ? (
        <div className="border-t border-[#f1e4de] bg-white lg:hidden">
          <div className="container-ph max-h-[calc(100dvh-84px)] overflow-y-auto overscroll-contain py-3 pr-1 [scrollbar-width:thin]">
            <div className="mb-3 flex items-center gap-2">
              <ActionIconButton
                href="/wishlist"
                label="Wishlist"
                icon={<Heart className="h-4 w-4" />}
                count={wishlistCount}
              />
              <ActionIconButton
                href={isAdminLoggedIn ? "/admin" : "/login"}
                label={isAdminLoggedIn ? "Dashboard" : "Account"}
                icon={<User className="h-4 w-4" />}
              />
            </div>

            <div className="space-y-2 pb-4">
              {navItems.map((item, index) => {
                const hasSections = !!item.sections?.length;
                const isOpen = openMobileIndex === index;

                return (
                  <div
                    key={item.label}
                    className="rounded-[16px] border border-[#ead9d1] bg-white px-3.5 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        className="flex-1 text-[15px] font-medium text-[#2e221d] hover:text-[#7a5244]"
                      >
                        {item.label}
                      </Link>

                      {hasSections ? (
                        <button
                          type="button"
                          aria-label={`Toggle ${item.label} submenu`}
                          onClick={() => toggleMobileSection(index)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#2e221d] transition hover:bg-[#f8f3ef]"
                        >
                          <ChevronRight
                            className={`h-4.5 w-4.5 transition-transform duration-200 ${
                              isOpen ? "rotate-90" : ""
                            }`}
                          />
                        </button>
                      ) : null}
                    </div>

                    {hasSections && isOpen ? (
                      <div className="mt-3 space-y-3 border-t border-[#f1e4de] pt-3">
                        {item.sections!.map((section) => (
                          <div key={section.title}>
                            <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7a5244]">
                              {section.title}
                            </h4>
                            <div className="space-y-1.5">
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
  );
}