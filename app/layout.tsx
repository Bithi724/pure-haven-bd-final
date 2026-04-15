import "./globals.css";
import type { Metadata } from "next";
import { CartProvider } from "@/components/cart/CartContext";
import { WishlistProvider } from "@/components/wishlist/WishlistContext";
import { MobileUIProvider } from "@/components/mobile/MobileUIContext";
import MobileBottomNav from "@/components/mobile/MobileBottomNav";
import FloatingCartSummary from "@/components/mobile/FloatingCartSummary";

export const metadata: Metadata = {
  title: "Pure Haven BD",
  description: "Beauty, care, fragrance and essentials.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#fffaf7] pb-20 lg:pb-0">
        <CartProvider>
          <WishlistProvider>
            <MobileUIProvider>
              {children}
              <FloatingCartSummary />
              <MobileBottomNav />
            </MobileUIProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}