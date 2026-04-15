"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function navClass(active: boolean) {
  return active
    ? "rounded-full border border-[#d8c5bc] bg-[#f8f3ef] px-4 py-2 text-sm font-medium text-[#2e221d]"
    : "rounded-full border border-[#ead9d1] bg-white px-4 py-2 text-sm font-medium text-[#2e221d] hover:bg-[#f8f3ef]";
}

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("ph_admin_logged_in");
    window.dispatchEvent(new Event("ph-admin-auth-changed"));
    router.replace("/login");
  }

  const isDashboard = pathname === "/admin";
  const isProducts = pathname === "/admin/products";
  const isAddProduct = pathname === "/admin/products/add";
  const isOrders = pathname.startsWith("/admin/orders");

  return (
    <div className="mb-8 rounded-[24px] border border-[#ead9d1] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#2e221d]">Admin Panel</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Dashboard, products, orders, and store management.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/admin" className={navClass(isDashboard)}>
            Dashboard
          </Link>

          <Link href="/admin/products" className={navClass(isProducts)}>
            Products
          </Link>

          <Link
            href="/admin/products/add"
            className={navClass(isAddProduct)}
          >
            Add Product
          </Link>

          <Link href="/admin/orders" className={navClass(isOrders)}>
            Orders
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}