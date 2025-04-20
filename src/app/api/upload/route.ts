// app/api/upload/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(request: Request) {
  // Parse the incoming multipart/form-data
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Read file into a Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Create a unique filename
  const filename = `${Date.now()}-${file.name}`;
  const uploadPath = path.join(process.cwd(), "public", "uploads", filename);

  // Write to disk
  await fs.promises.writeFile(uploadPath, buffer);

  // Return the public URL
  const url = `/uploads/${filename}`;
  return NextResponse.json({ url });
}
