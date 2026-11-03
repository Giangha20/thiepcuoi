import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const wishId = params.id;
    if (!wishId) {
      return NextResponse.json({ error: "Thiếu ID lời chúc" }, { status: 400 });
    }

    const updated = await prisma.wish.update({
      where: { id: wishId },
      data: {
        likes: { increment: 1 },
      },
    });

    return NextResponse.json({ success: true, likes: updated.likes });
  } catch (error: any) {
    return NextResponse.json({ error: "Không thể thả tim lời chúc" }, { status: 500 });
  }
}
