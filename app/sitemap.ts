import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/getProducts";

const baseUrl = "https://pure-haven-bd-final-wdb1.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  const staticRoutes = ["", "/shop", "/track-order"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...productRoutes];
}