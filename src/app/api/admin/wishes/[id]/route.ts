import { NextRequest, NextResponse } from "next/server";
import { verifyAuthRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAuthRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { isApproved, isPinned, message, name } = body;

    const data: any = {};
    if (typeof isApproved === "boolean") data.isApproved = isApproved;
    if (typeof isPinned === "boolean") data.isPinned = isPinned;
    if (message !== undefined) data.message = message;
    if (name !== undefined) data.name = name;

    const updated = await prisma.wish.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ success: true, wish: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Lỗi cập nhật lời chúc" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAuthRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.wish.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Lỗi xóa lời chúc" }, { status: 500 });
  }
}
