import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ProductBody = {
  id?: number;
  name?: string;
  price?: number;
  image?: string;
  category?: string;
  subcategory?: string;
  description?: string;
  stock?: number;
};

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNumber(value: unknown, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "desc" },
    });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ProductBody;

    const name = normalizeString(body.name);
    const category = normalizeString(body.category);
    const image = normalizeString(body.image);
    const subcategory = normalizeString(body.subcategory);
    const description = normalizeString(body.description);
    const price = normalizeNumber(body.price, 0);
    const stock = Math.max(0, Math.floor(normalizeNumber(body.stock, 0)));

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Product name is required." },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category is required." },
        { status: 400 }
      );
    }

    if (price < 0) {
      return NextResponse.json(
        { success: false, message: "Price cannot be negative." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        price,
        image: image || "/uploads/placeholder-product.png",
        category,
        subcategory: subcategory || null,
        description: description || null,
        stock,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as ProductBody;

    const id = Number(body.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json(
        { success: false, message: "Valid product ID is required." },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    const name = normalizeString(body.name) || existing.name;
    const category = normalizeString(body.category) || existing.category;
    const image = normalizeString(body.image) || existing.image;
    const subcategory =
      body.subcategory !== undefined
        ? normalizeString(body.subcategory) || null
        : existing.subcategory;
    const description =
      body.description !== undefined
        ? normalizeString(body.description) || null
        : existing.description;
    const price =
      body.price !== undefined ? normalizeNumber(body.price, existing.price) : existing.price;
    const stock =
      body.stock !== undefined
        ? Math.max(0, Math.floor(normalizeNumber(body.stock, existing.stock)))
        : existing.stock;

    if (price < 0) {
      return NextResponse.json(
        { success: false, message: "Price cannot be negative." },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        image,
        category,
        subcategory,
        description,
        stock,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const idParam = req.nextUrl.searchParams.get("id");
    const id = Number(idParam);

    if (!Number.isFinite(id)) {
      return NextResponse.json(
        { success: false, message: "Valid product ID is required." },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete product.",
      },
      { status: 500 }
    );
  }
}