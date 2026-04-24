import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pure-haven-bd-final-wdb1.vercel.app"),
  title: {
    default: "Pure Haven BD | Beauty, Skincare, Perfume & Lifestyle Store",
    template: "%s | Pure Haven BD",
  },
  description:
    "Shop cosmetics, skincare, haircare, perfume, men's products, and lifestyle essentials from Pure Haven BD.",
  keywords: [
    "Pure Haven BD",
    "Bangladesh ecommerce",
    "cosmetics Bangladesh",
    "skincare Bangladesh",
    "perfume Bangladesh",
    "haircare products",
  ],
  openGraph: {
    title: "Pure Haven BD",
    description:
      "Beauty, skincare, fragrance and lifestyle essentials in one online store.",
    url: "https://pure-haven-bd-final-wdb1.vercel.app",
    siteName: "Pure Haven BD",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}