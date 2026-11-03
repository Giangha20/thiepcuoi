import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { weddingId, name, relationship, message, emoji, honeypot } = body;

    // Bot honeypot check
    if (honeypot) {
      return NextResponse.json({ error: "Spam detected" }, { status: 400 });
    }

    if (!weddingId || !name?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Vui lòng nhập tên và lời chúc của bạn." },
        { status: 400 }
      );
    }

    if (name.trim().length > 100) {
      return NextResponse.json({ error: "Tên người gửi quá dài (tối đa 100 ký tự)." }, { status: 400 });
    }

    if (message.trim().length > 1000) {
      return NextResponse.json({ error: "Lời chúc quá dài (tối đa 1000 ký tự)." }, { status: 400 });
    }

    const wedding = await prisma.wedding.findUnique({
      where: { id: weddingId },
    });

    if (!wedding) {
      return NextResponse.json({ error: "Không tìm thấy thiệp cưới tương ứng." }, { status: 404 });
    }

    const isApproved = !wedding.requireWishApproval;

    const newWish = await prisma.wish.create({
      data: {
        weddingId,
        name: name.trim(),
        relationship: relationship?.trim() || "Bạn bè",
        message: message.trim(),
        emoji: emoji || "❤️",
        isApproved,
        isPinned: false,
        likes: 0,
      },
    });

    return NextResponse.json({
      success: true,
      wish: newWish,
      message: isApproved
        ? "Cảm ơn bạn! Lời chúc tốt đẹp của bạn đã được đăng lên sổ lưu bút."
        : "Cảm ơn bạn! Lời chúc đã được gửi và đang chờ cô dâu chú rể duyệt.",
    });
  } catch (error: any) {
    console.error("Error creating wish:", error);
    return NextResponse.json({ error: "Có lỗi xảy ra khi gửi lời chúc: " + error.message }, { status: 500 });
  }
}
