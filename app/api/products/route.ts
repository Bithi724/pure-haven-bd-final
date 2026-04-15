import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const filePath = path.join(process.cwd(), "data", "products.json");

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  description?: string;
  stock?: number;
};

async function ensureProductsFile() {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]", "utf-8");
  }
}

async function readProducts(): Promise<Product[]> {
  await ensureProductsFile();

  const file = await fs.readFile(filePath, "utf-8");
  if (!file.trim()) return [];

  const parsed = JSON.parse(file);
  return Array.isArray(parsed) ? parsed : [];
}

async function writeProducts(products: Product[]) {
  await ensureProductsFile();
  await fs.writeFile(filePath, JSON.stringify(products, null, 2), "utf-8");
}

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanNumber(value: unknown, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function cleanStock(value: unknown) {
  const num = Math.floor(cleanNumber(value, 0));
  return Math.max(0, num);
}

function normalizeProductInput(body: any, existing?: Product): Omit<Product, "id"> {
  const name = cleanString(body?.name ?? existing?.name);
  const image = cleanString(body?.image ?? existing?.image);
  const category = cleanString(body?.category ?? existing?.category);
  const subcategory = cleanString(body?.subcategory ?? existing?.subcategory);
  const description = cleanString(body?.description ?? existing?.description);
  const price = cleanNumber(body?.price, existing?.price ?? 0);

  const stock =
    body?.stock !== undefined
      ? cleanStock(body.stock)
      : existing?.stock !== undefined
      ? cleanStock(existing.stock)
      : 0;

  return {
    name,
    price,
    image,
    category,
    subcategory: subcategory || undefined,
    description: description || "",
    stock,
  };
}

function validateProductInput(product: Omit<Product, "id">) {
  if (!product.name) return "Product name is required";
  if (!Number.isFinite(product.price) || product.price < 0) {
    return "Valid product price is required";
  }
  if (!product.image) return "Product image is required";
  if (!product.category) return "Product category is required";
  if (!Number.isFinite(product.stock ?? 0) || (product.stock ?? 0) < 0) {
    return "Valid product stock is required";
  }

  return null;
}

export async function GET() {
  try {
    const products = await readProducts();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const products = await readProducts();

    const normalized = normalizeProductInput(body);
    const validationError = validateProductInput(normalized);

    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    const newProduct: Product = {
      id: Date.now(),
      ...normalized,
    };

    products.push(newProduct);
    await writeProducts(products);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const products = await readProducts();

    const productId = Number(body?.id);

    if (!Number.isFinite(productId) || productId <= 0) {
      return NextResponse.json(
        { message: "Product id is required" },
        { status: 400 }
      );
    }

    const productIndex = products.findIndex((product) => product.id === productId);

    if (productIndex === -1) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const existingProduct = products[productIndex];
    const normalized = normalizeProductInput(body, existingProduct);
    const validationError = validateProductInput(normalized);

    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    const updatedProduct: Product = {
      id: productId,
      ...normalized,
    };

    products[productIndex] = updatedProduct;
    await writeProducts(products);

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("PUT /api/products error:", error);
    return NextResponse.json(
      { message: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json(
        { message: "Product id is required" },
        { status: 400 }
      );
    }

    const products = await readProducts();
    const productExists = products.some((product) => product.id === id);

    if (!productExists) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const filteredProducts = products.filter((product) => product.id !== id);
    await writeProducts(filteredProducts);

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/products error:", error);
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    );
  }
}