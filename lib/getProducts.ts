import { prisma } from "@/lib/prisma";

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string; // 🔥 IMPORTANT
  description?: string;
  stock?: number;
};

export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    image: p.image,
    category: p.category,
    subcategory: p.subcategory ?? undefined, // 🔥 FIX
    description: p.description ?? undefined,
    stock: p.stock ?? 0,
  }));
}