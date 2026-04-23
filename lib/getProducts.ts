import { prisma } from "@/lib/prisma";

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string | null;
  description?: string | null;
  stock?: number;
};

export async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "desc" },
    });

    return products;
  } catch {
    return [];
  }
}