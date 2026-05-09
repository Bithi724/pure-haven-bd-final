import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes, scryptSync } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function hashSecret(value: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(value, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (key !== "purehaven-reset") {
    return NextResponse.json(
      { success: false, message: "Invalid reset key." },
      { status: 403 }
    );
  }

  const email = "bithibithi724@gmail.com";
  const password = "admin123";
  const recoveryCode = "123456";

  const filePath = path.join(process.cwd(), "data", "admin-auth.json");

  await mkdir(path.dirname(filePath), { recursive: true });

  await writeFile(
    filePath,
    JSON.stringify(
      {
        email,
        passwordHash: hashSecret(password),
        recoveryCodeHash: hashSecret(recoveryCode)
      },
      null,
      2
    ),
    "utf8"
  );

  return NextResponse.json({
    success: true,
    message: "Admin login reset successfully.",
    email,
    password,
    recoveryCode
  });
}