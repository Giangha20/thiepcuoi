import { NextRequest, NextResponse } from "next/server";
import { verifyAuthRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const admin = await verifyAuthRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, weddingId, date, title, description, photo, order } = body;

    if (!weddingId || !title) {
      return NextResponse.json({ error: "Vui lòng nhập tiêu đề cột mốc" }, { status: 400 });
    }

    if (id) {
      const updated = await prisma.timelineMilestone.update({
        where: { id },
        data: {
          date: date || "",
          title,
          description: description || "",
          photo: photo || "",
          order: Number(order) || 0,
        },
      });
      return NextResponse.json({ success: true, milestone: updated });
    } else {
      const created = await prisma.timelineMilestone.create({
        data: {
          weddingId,
          date: date || "",
          title,
          description: description || "",
          photo: photo || "",
          order: Number(order) || 0,
        },
      });
      return NextResponse.json({ success: true, milestone: created });
    }
  } catch (error: any) {
    return NextResponse.json({ error: "Lỗi lưu cột mốc: " + error.message }, { status: 500 });
  }
}
