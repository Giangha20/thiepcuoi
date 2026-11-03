import React from "react";
import { prisma } from "@/lib/prisma";
import WeddingInvitationPage from "@/components/wedding/WeddingInvitationPage";
import { WeddingData } from "@/lib/types";
import Link from "next/link";
import { Settings } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const wedding = await prisma.wedding.findFirst({
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

  if (!wedding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] p-4 text-center">
        <div className="max-w-md p-8 bg-white rounded-3xl shadow-sm border border-[#DFC5A8]">
          <h1 className="font-serif text-2xl text-[#2D2A26] mb-3">Chưa có dữ liệu thiệp cưới</h1>
          <p className="font-sans text-sm text-[#7A5B33] mb-6">
            Hệ thống đang chuẩn bị dữ liệu khởi tạo. Vui lòng chạy lệnh npx tsx prisma/seed.ts hoặc vào trang quản trị để tạo thiệp.
          </p>
          <Link
            href="/admin/login"
            className="inline-block px-6 py-2.5 bg-[#B88E5B] text-white rounded-full text-xs font-sans uppercase tracking-wider"
          >
            Đăng nhập quản trị
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <WeddingInvitationPage wedding={wedding as unknown as WeddingData} />

      {/* Floating Admin Quick Access Link */}
      <Link
        href="/admin"
        title="Trang quản trị thiệp cưới"
        className="fixed bottom-5 left-5 z-40 p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-[#B88E5B] shadow-md border border-[#DFC5A8]/50 backdrop-blur-sm transition-all hover:scale-108"
      >
        <Settings className="w-4 h-4" />
      </Link>
    </>
  );
}
