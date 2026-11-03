import { NextRequest, NextResponse } from "next/server";
import { verifyAuthRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const admin = await verifyAuthRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { weddingId, url, caption, featured, order } = body;

    if (!weddingId || !url) {
      return NextResponse.json({ error: "Vui lòng chọn ảnh và đường dẫn" }, { status: 400 });
    }

    const highest = await prisma.galleryPhoto.findFirst({
      where: { weddingId },
      orderBy: { order: "desc" },
    });

    const nextOrder = order !== undefined ? Number(order) : (highest?.order ?? 0) + 1;

    const photo = await prisma.galleryPhoto.create({
      data: {
        weddingId,
        url,
        caption: caption || "",
        featured: Boolean(featured),
        order: nextOrder,
      },
    });

    return NextResponse.json({ success: true, photo });
  } catch (error: any) {
    return NextResponse.json({ error: "Lỗi thêm ảnh vào album: " + error.message }, { status: 500 });
  }
}
