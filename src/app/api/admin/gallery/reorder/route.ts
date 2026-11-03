import { NextRequest, NextResponse } from "next/server";
import { verifyAuthRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  const admin = await verifyAuthRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { items } = await req.json(); // Array of { id, order }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
    }

    await Promise.all(
      items.map((item) =>
        prisma.galleryPhoto.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Lỗi cập nhật thứ tự: " + error.message }, { status: 500 });
  }
}
