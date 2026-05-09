import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CategoryBody = {
  type?: unknown;
  id?: unknown;
  categoryId?: unknown;
  name?: unknown;
  image?: unknown;
  isActive?: unknown;
  sortOrder?: unknown;
};

const defaultCategories = [
  {
    name: "Cosmetics",
    slug: "cosmetics",
    subcategories: [
      "lipstick",
      "liquid-lipstick",
      "lip-liner",
      "lip-gloss",
      "lip-balm",
      "foundation",
      "face-powder",
      "primer",
      "concealer",
      "blush",
      "highlighter",
      "eyeliner",
      "kajal",
      "mascara",
      "eyeshadow",
      "eyebrow-pencil",
      "brush",
    ],
  },
  {
    name: "Skincare",
    slug: "skincare",
    subcategories: [
      "face-wash",
      "moisturizer",
      "cream",
      "lotion",
      "serum",
      "sunscreen",
      "toner",
      "scrub",
      "face-mask",
      "petroleum-jelly",
      "others",
    ],
  },
  {
    name: "Haircare",
    slug: "haircare",
    subcategories: [
      "shampoo",
      "conditioner",
      "hair-oil",
      "hair-serum",
      "hair-mask",
      "hair-color",
      "hair-treatment",
      "styling-gel-spray",
      "others",
    ],
  },
  {
    name: "Perfume",
    slug: "perfume",
    subcategories: [
      "edt-men",
      "edp-men",
      "perfume-men",
      "edt-women",
      "edp-women",
      "perfume-women",
      "attar",
      "others",
    ],
  },
  {
    name: "Food",
    slug: "food",
    subcategories: [
      "oil-ghee",
      "honey",
      "dates",
      "spices",
      "nuts-seeds",
      "beverage",
      "rice",
      "flours-lentils",
      "certified",
      "pickle",
      "others",
    ],
  },
  {
    name: "Mens Products",
    slug: "mens-products",
    subcategories: [
      "shirts",
      "t-shirts",
      "panjabi",
      "pants",
      "wallet",
      "belt",
      "watch",
      "others",
    ],
  },
  {
    name: "Baby Products",
    slug: "baby-products",
    subcategories: [
      "diapers",
      "baby-wipes",
      "baby-lotion",
      "baby-oil",
      "baby-shampoo",
      "baby-soap",
      "baby-powder",
      "feeding-bottle",
      "baby-food",
      "others",
    ],
  },
];

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function idValue(value: unknown) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function labelFromSlug(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function seedCategoriesIfEmpty() {
  const count = await prisma.category.count();

  if (count > 0) return;

  for (const [index, category] of defaultCategories.entries()) {
    await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        sortOrder: index,
        subcategories: {
          create: category.subcategories.map((slug, subIndex) => ({
            name: labelFromSlug(slug),
            slug,
            sortOrder: subIndex,
          })),
        },
      },
    });
  }
}

export async function GET(req: Request) {
  try {
    await seedCategoriesIfEmpty();

    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    const categories = await prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        subcategories: {
          where: includeInactive ? {} : { isActive: true },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        },
      },
    });

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("GET /api/categories failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load categories.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CategoryBody;
    const type = text(body.type);
    const name = text(body.name);

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required." },
        { status: 400 }
      );
    }

    if (type === "subcategory") {
      const categoryId = idValue(body.categoryId);

      if (!categoryId) {
        return NextResponse.json(
          { success: false, message: "Category id is required." },
          { status: 400 }
        );
      }

      const subcategory = await prisma.subcategory.create({
        data: {
          categoryId,
          name,
          slug: slugify(name),
        },
      });

      return NextResponse.json({
        success: true,
        subcategory,
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: slugify(name),
        image: text(body.image) || null,
      },
      include: {
        subcategories: true,
      },
    });

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error: any) {
    console.error("POST /api/categories failed:", error);

    if (error?.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "This name already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create category item." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as CategoryBody;
    const type = text(body.type);
    const id = idValue(body.id);
    const name = text(body.name);
    const sortOrder = Number(body.sortOrder);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Valid id is required." },
        { status: 400 }
      );
    }

    const data: any = {};

    if (name) {
      data.name = name;
      data.slug = slugify(name);
    }

    if (typeof body.isActive === "boolean") {
      data.isActive = body.isActive;
    }

    if (Number.isFinite(sortOrder)) {
      data.sortOrder = Math.floor(sortOrder);
    }

    if (type !== "subcategory") {
      const image = text(body.image);
      data.image = image || null;
    }

    if (type === "subcategory") {
      const subcategory = await prisma.subcategory.update({
        where: { id },
        data,
      });

      return NextResponse.json({
        success: true,
        subcategory,
      });
    }

    const category = await prisma.category.update({
      where: { id },
      data,
      include: {
        subcategories: true,
      },
    });

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error: any) {
    console.error("PUT /api/categories failed:", error);

    if (error?.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Item not found." },
        { status: 404 }
      );
    }

    if (error?.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "This name already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update category item." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "category";
    const id = idValue(searchParams.get("id"));

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Valid id is required." },
        { status: 400 }
      );
    }

    if (type === "subcategory") {
      await prisma.subcategory.delete({
        where: { id },
      });

      return NextResponse.json({
        success: true,
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error("DELETE /api/categories failed:", error);

    if (error?.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Item not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to delete category item." },
      { status: 500 }
    );
  }
}