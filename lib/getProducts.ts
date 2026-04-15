import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "products.json");

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  description?: string;
  stock?: number;
};

export async function getProducts(): Promise<Product[]> {
  try {
    const file = await fs.readFile(filePath, "utf-8");
    const products = JSON.parse(file);
    return Array.isArray(products) ? products : [];
  } catch {
    return [];
  }
}