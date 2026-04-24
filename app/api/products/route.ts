export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch products.", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const product = await prisma.product.create({
    data: {
      name: body.name,
      price: Number(body.price),
      image: body.image || "/uploads/placeholder-product.png",
      category: body.category,
      subcategory: body.subcategory || null,
      description: body.description || null,
      stock: Number(body.stock || 0),
    },
  });

  return NextResponse.json({ success: true, product });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  const product = await prisma.product.update({
    where: { id: Number(body.id) },
    data: {
      name: body.name,
      price: Number(body.price),
      image: body.image || "/uploads/placeholder-product.png",
      category: body.category,
      subcategory: body.subcategory || null,
      description: body.description || null,
      stock: Number(body.stock || 0),
    },
  });

  return NextResponse.json({ success: true, product });
}

export async function DELETE(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get("id"));

  await prisma.product.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}