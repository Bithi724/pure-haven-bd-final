"use client";

import Link from "next/link";
import { House, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMobileUI } from "@/components/mobile/MobileUIContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { closeAll } = useMobileUI();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    closeAll();
    document.body.style.overflow = "";

    const isLoggedIn = localStorage.getItem("ph_admin_logged_in") === "true";

    if (!isLoggedIn && pathname.startsWith("/admin")) {
      router.replace("/login");
      return;
    }

    setChecked(true);

    return () => {
      document.body.style.overflow = "";
    };
  }, [pathname, router, closeAll]);

  if (!checked) {
    return (
      <main className="grid min-h-screen place-items-center text-lg font-medium">
        Checking access...
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-[100] border-b border-[#ead9d1] bg-[#fcf8f6]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-2 px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#ead9d1] bg-white px-4 py-2 text-sm font-medium text-[#2e221d] shadow-sm transition hover:bg-[#f8f3ef]"
          >
            <House className="h-4 w-4" />
            <span>Home</span>
          </Link>

          {pathname !== "/admin" ? (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-[#ead9d1] bg-white px-4 py-2 text-sm font-medium text-[#2e221d] shadow-sm transition hover:bg-[#f8f3ef]"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          ) : null}
        </div>
      </div>

      {children}
    </div>
  );
}