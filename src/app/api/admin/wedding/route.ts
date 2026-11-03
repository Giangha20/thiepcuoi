import { NextRequest, NextResponse } from "next/server";
import { verifyAuthRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const admin = await verifyAuthRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const wedding = await prisma.wedding.findFirst({
      include: {
        events: { orderBy: { order: "asc" } },
        timeline: { orderBy: { order: "asc" } },
        gallery: { orderBy: { order: "asc" } },
      },
    });

    if (!wedding) {
      return NextResponse.json({ error: "Không tìm thấy thiệp cưới" }, { status: 404 });
    }

    return NextResponse.json(wedding);
  } catch (error: any) {
    return NextResponse.json({ error: "Lỗi tải thông tin thiệp cưới" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await verifyAuthRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, events, timeline, gallery, wishes, rsvps, pageViews, createdAt, updatedAt, ...updateData } = body;

    // Validate weddingDate if present
    if (updateData.weddingDate) {
      updateData.weddingDate = new Date(updateData.weddingDate);
    }

    // Slug check: ensure slug is URL safe
    if (updateData.slug) {
      updateData.slug = updateData.slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-");

      // Check if slug taken by another wedding
      const existing = await prisma.wedding.findFirst({
        where: {
          slug: updateData.slug,
          NOT: { id: id },
        },
      });

      if (existing) {
        return NextResponse.json({ error: "Đường dẫn (slug) này đã được sử dụng. Vui lòng chọn đường dẫn khác." }, { status: 400 });
      }
    }

    const updatedWedding = await prisma.wedding.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, wedding: updatedWedding });
  } catch (error: any) {
    console.error("Update wedding error:", error);
    return NextResponse.json({ error: "Lỗi lưu thông tin: " + error.message }, { status: 500 });
  }
}
