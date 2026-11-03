import { NextRequest, NextResponse } from "next/server";
import { verifyAuthRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const admin = await verifyAuthRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, weddingId, title, time, date, venueName, address, mapUrl, mapEmbedUrl, photo, order } = body;

    if (!weddingId || !title) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    if (id) {
      const updated = await prisma.event.update({
        where: { id },
        data: {
          title,
          time: time || "",
          date: date || "",
          venueName: venueName || "",
          address: address || "",
          mapUrl: mapUrl || "",
          mapEmbedUrl: mapEmbedUrl || "",
          photo: photo || "",
          order: Number(order) || 0,
        },
      });
      return NextResponse.json({ success: true, event: updated });
    } else {
      const created = await prisma.event.create({
        data: {
          weddingId,
          title,
          time: time || "",
          date: date || "",
          venueName: venueName || "",
          address: address || "",
          mapUrl: mapUrl || "",
          mapEmbedUrl: mapEmbedUrl || "",
          photo: photo || "",
          order: Number(order) || 0,
        },
      });
      return NextResponse.json({ success: true, event: created });
    }
  } catch (error: any) {
    return NextResponse.json({ error: "Lỗi lưu sự kiện: " + error.message }, { status: 500 });
  }
}
