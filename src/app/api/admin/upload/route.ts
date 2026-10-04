import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, message: "Not signed in as admin." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ ok: false, message: "No file was provided." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ ok: false, message: "Invalid file type. Please upload an image." }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ ok: false, message: "Image size exceeds 5MB limit." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extMatch = file.name.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i);
    const ext = extMatch ? extMatch[0].toLowerCase() : ".png";
    const filename = `game-${Date.now()}-${Math.random().toString(36).slice(2, 7)}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "games");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    const url = `/uploads/games/${filename}`;
    return NextResponse.json({ ok: true, url, message: "Image uploaded successfully." });
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: "Upload failed: " + (err instanceof Error ? err.message : String(err)) },
      { status: 500 }
    );
  }
}
