import { NextRequest, NextResponse } from "next/server";
import { verifyAuthRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const admin = await verifyAuthRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "all";
    const search = searchParams.get("search") || "";

    const where: any = {};
    if (filter === "pending") where.isApproved = false;
    if (filter === "approved") where.isApproved = true;

    if (search.trim()) {
      where.OR = [
        { name: { contains: search } },
        { message: { contains: search } },
      ];
    }

    const wishes = await prisma.wish.findMany({
      where,
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(wishes);
  } catch (error: any) {
    return NextResponse.json({ error: "Lỗi tải danh sách lời chúc" }, { status: 500 });
  }
}
