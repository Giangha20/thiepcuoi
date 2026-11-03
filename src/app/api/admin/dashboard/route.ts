import { NextRequest, NextResponse } from "next/server";
import { verifyAuthRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const admin = await verifyAuthRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const wedding = await prisma.wedding.findFirst();
    if (!wedding) {
      return NextResponse.json({ error: "Không tìm thấy thiệp cưới" }, { status: 404 });
    }

    const [
      totalViews,
      mobileViews,
      desktopViews,
      totalWishes,
      pendingWishes,
      approvedWishes,
      allRsvps,
      recentWishes,
      recentRsvps,
    ] = await Promise.all([
      prisma.pageView.count({ where: { weddingId: wedding.id } }),
      prisma.pageView.count({ where: { weddingId: wedding.id, device: "mobile" } }),
      prisma.pageView.count({ where: { weddingId: wedding.id, device: "desktop" } }),
      prisma.wish.count({ where: { weddingId: wedding.id } }),
      prisma.wish.count({ where: { weddingId: wedding.id, isApproved: false } }),
      prisma.wish.count({ where: { weddingId: wedding.id, isApproved: true } }),
      prisma.rsvp.findMany({ where: { weddingId: wedding.id } }),
      prisma.wish.findMany({
        where: { weddingId: wedding.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.rsvp.findMany({
        where: { weddingId: wedding.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    const attendingCount = allRsvps.filter((r) => r.isAttending).length;
    const decliningCount = allRsvps.filter((r) => !r.isAttending).length;
    const totalHeadcount = allRsvps
      .filter((r) => r.isAttending)
      .reduce((sum, r) => sum + (r.guestCount || 1), 0);

    const groomSideRsvp = allRsvps.filter((r) => r.side === "groom" && r.isAttending).length;
    const brideSideRsvp = allRsvps.filter((r) => r.side === "bride" && r.isAttending).length;
    const bothSideRsvp = allRsvps.filter((r) => r.side === "both" && r.isAttending).length;

    return NextResponse.json({
      wedding: {
        id: wedding.id,
        slug: wedding.slug,
        title: wedding.title,
        groomName: wedding.groomName,
        brideName: wedding.brideName,
        weddingDate: wedding.weddingDate,
        isPublished: wedding.isPublished,
      },
      stats: {
        views: {
          total: totalViews,
          mobile: mobileViews,
          desktop: desktopViews,
          mobilePercent: totalViews ? Math.round((mobileViews / totalViews) * 100) : 0,
        },
        wishes: {
          total: totalWishes,
          approved: approvedWishes,
          pending: pendingWishes,
        },
        rsvp: {
          totalSubmissions: allRsvps.length,
          attendingCount,
          decliningCount,
          totalHeadcount,
          groomSide: groomSideRsvp,
          brideSide: brideSideRsvp,
          bothSide: bothSideRsvp,
        },
      },
      recentActivity: {
        wishes: recentWishes,
        rsvps: recentRsvps,
      },
    });
  } catch (error: any) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Lỗi tải dữ liệu dashboard: " + error.message }, { status: 500 });
  }
}
