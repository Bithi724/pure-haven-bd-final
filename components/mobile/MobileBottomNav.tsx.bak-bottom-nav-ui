"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Menu,
  ShoppingBag,
  Search,
  User,
} from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { useMobileUI } from "@/components/mobile/MobileUIContext";

function ItemButton({
  active,
  label,
  icon,
  onClick,
}: {
  active?: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition ${
        active ? "text-[#2e221d]" : "text-[#6f625c]"
      }`}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}

function ItemLink({
  href,
  active,
  label,
  icon,
  badge,
}: {
  href: string;
  active?: boolean;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}) {
  const hasBadge = typeof badge === "number" && badge > 0;

  return (
    <Link
      href={href}
      className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition ${
        active ? "text-[#2e221d]" : "text-[#6f625c]"
      }`}
    >
      <span className="relative">
        {icon}
        {hasBadge ? (
          <span className="absolute -right-2 -top-2 inline-flex min-w-[16px] items-center justify-center rounded-full bg-[#2e221d] px-1 text-[10px] font-semibold leading-4 text-white">
            {badge}
          </span>
        ) : null}
      </span>
      <span className="truncate">{label}</span>
    </Link>
  );
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { isMenuOpen, isSearchOpen, toggleMenu, toggleSearch, closeAll } =
    useMobileUI();

  const accountHref = "/login";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[80] border-t border-[#ead9d1] bg-white/95 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-screen-sm items-stretch px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-1">
        <ItemLink
          href="/"
          active={pathname === "/"}
          label="Home"
          icon={<House className="h-5 w-5" />}
        />

        <ItemButton
          active={isMenuOpen}
          label="Menu"
          icon={<Menu className="h-5 w-5" />}
          onClick={toggleMenu}
        />

        <ItemLink
          href="/cart"
          active={pathname === "/cart"}
          label="Cart"
          icon={<ShoppingBag className="h-5 w-5" />}
          badge={cartCount}
        />

        <ItemButton
          active={isSearchOpen}
          label="Search"
          icon={<Search className="h-5 w-5" />}
          onClick={toggleSearch}
        />

        <ItemLink
          href={accountHref}
          active={pathname === "/login" || pathname.startsWith("/admin")}
          label="Account"
          icon={<User className="h-5 w-5" />}
        />
      </div>

      {(isMenuOpen || isSearchOpen) && (
        <button
          type="button"
          aria-label="Close mobile overlays"
          onClick={closeAll}
          className="sr-only"
        />
      )}
    </nav>
  );
}