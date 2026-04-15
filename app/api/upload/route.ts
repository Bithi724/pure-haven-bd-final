import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const allowedMimeToExt: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function sanitizeBaseName(fileName: string) {
  const withoutExt = fileName.replace(/\.[^/.]+$/, "");
  const cleaned = withoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  return cleaned || "product";
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!file.size || file.size <= 0) {
      return NextResponse.json(
        { success: false, message: "Uploaded file is empty" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, message: "Image must be 5 MB or smaller" },
        { status: 400 }
      );
    }

    const ext = allowedMimeToExt[file.type];

    if (!ext) {
      return NextResponse.json(
        {
          success: false,
          message: "Only JPG, PNG, and WEBP images are allowed",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fs.mkdir(uploadDir, { recursive: true });

    const safeBase = sanitizeBaseName(file.name);
    const uniqueSuffix = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;
    const fileName = `${safeBase}-${uniqueSuffix}.${ext}`;
    const fullPath = path.join(uploadDir, fileName);
    const imagePath = `/uploads/products/${fileName}`;

    await fs.writeFile(fullPath, buffer);

    return NextResponse.json(
      {
        success: true,
        message: "Upload successful",
        imagePath,
        fileName,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/upload error:", error);

    return NextResponse.json(
      { success: false, message: "Image upload failed" },
      { status: 500 }
    );
  }
}