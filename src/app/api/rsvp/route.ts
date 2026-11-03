import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { weddingId, name, phone, guestCount, side, isAttending, notes } = body;

    if (!weddingId || !name?.trim()) {
      return NextResponse.json({ error: "Vui lòng nhập họ tên của bạn." }, { status: 400 });
    }

    const rsvp = await prisma.rsvp.create({
      data: {
        weddingId,
        name: name.trim(),
        phone: phone?.trim() || "",
        guestCount: Number(guestCount) || 1,
        side: side || "groom",
        isAttending: Boolean(isAttending),
        notes: notes?.trim() || "",
      },
    });

    return NextResponse.json({
      success: true,
      rsvp,
      message: isAttending
        ? "Cảm ơn bạn đã xác nhận tham dự! Chúng mình rất háo hức được đón tiếp bạn trong ngày vui."
        : "Cảm ơn bạn đã phản hồi! Dù bạn không thể đến, tình cảm và lời chúc của bạn luôn là niềm vui lớn với chúng mình.",
    });
  } catch (error: any) {
    console.error("RSVP error:", error);
    return NextResponse.json({ error: "Có lỗi xảy ra khi xác nhận tham dự." }, { status: 500 });
  }
}
