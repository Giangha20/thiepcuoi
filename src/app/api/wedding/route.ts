import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug") || "minh-anh-va-hoang-nam";

    const wedding = await prisma.wedding.findUnique({
      where: { slug },
      include: {
        events: {
          orderBy: { order: "asc" },
        },
        timeline: {
          orderBy: { order: "asc" },
        },
        gallery: {
          orderBy: { order: "asc" },
        },
        wishes: {
          where: { isApproved: true },
          orderBy: [
            { isPinned: "desc" },
            { createdAt: "desc" },
          ],
        },
      },
    });

    if (!wedding) {
      // Fallback to first available wedding if slug not found
      const firstWedding = await prisma.wedding.findFirst({
        include: {
          events: { orderBy: { order: "asc" } },
          timeline: { orderBy: { order: "asc" } },
          gallery: { orderBy: { order: "asc" } },
          wishes: {
            where: { isApproved: true },
            orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
          },
        },
      });

      if (!firstWedding) {
        return NextResponse.json({ error: "Không tìm thấy thiệp cưới" }, { status: 404 });
      }

      return NextResponse.json(firstWedding);
    }

    // Record page view (fire and forget / non-blocking)
    const userAgent = req.headers.get("user-agent") || "";
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);
    const isTablet = /tablet|ipad/i.test(userAgent);
    const device = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";
    const referrer = req.headers.get("referer") || "direct";

    prisma.pageView.create({
      data: {
        weddingId: wedding.id,
        device,
        userAgent: userAgent.slice(0, 200),
        referrer: referrer.slice(0, 200),
      },
    }).catch((err) => console.error("Error logging pageview:", err));

    return NextResponse.json(wedding);
  } catch (error: any) {
    console.error("Error fetching wedding:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tải thiệp cưới" }, { status: 500 });
  }
}
