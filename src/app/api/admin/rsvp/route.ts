import { NextRequest, NextResponse } from "next/server";
import { verifyAuthRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const admin = await verifyAuthRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const attending = searchParams.get("attending"); // "yes" | "no" | "all"
    const side = searchParams.get("side"); // "groom" | "bride" | "both" | "all"
    const search = searchParams.get("search") || "";

    const where: any = {};

    if (attending === "yes") where.isAttending = true;
    if (attending === "no") where.isAttending = false;

    if (side && side !== "all") {
      where.side = side;
    }

    if (search.trim()) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { notes: { contains: search } },
      ];
    }

    const rsvps = await prisma.rsvp.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(rsvps);
  } catch (error: any) {
    return NextResponse.json({ error: "Lỗi tải danh sách RSVP" }, { status: 500 });
  }
}
