"use client";

import React from "react";
import { Eye, Smartphone, Monitor, MessageCircleHeart, Users, CheckCircle, XCircle, ArrowUpRight, Sparkles } from "lucide-react";

interface DashboardOverviewProps {
  stats: any;
  recentActivity: any;
  onNavigateTab: (tabId: string) => void;
  slug: string;
}

export default function DashboardOverview({
  stats,
  recentActivity,
  onNavigateTab,
  slug,
}: DashboardOverviewProps) {
  if (!stats) return <div className="p-8 text-center text-gray-500">Đang tải số liệu...</div>;

  return (
    <div className="space-y-8">
      {/* Quick Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#FAF7F2] via-[#F5EFE6] to-[#FAF7F2] border border-[#DFC5A8]/50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-[#7A5B33] text-xs font-sans font-medium mb-2 border border-[#DFC5A8]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#B88E5B]" />
            <span>Hệ thống hoạt động trực tuyến</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2D2A26] font-medium">
            Chào Mừng Đến Trang Quản Trị
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[#7A5B33] mt-1">
            Đường dẫn thiệp cưới hiện tại:{" "}
            <a
              href={`/thiep-cuoi/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[#B88E5B] hover:underline"
            >
              /thiep-cuoi/{slug}
            </a>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab("info")}
            className="px-4 py-2.5 rounded-xl bg-[#B88E5B] hover:bg-[#997343] text-white text-xs font-sans font-medium transition-all shadow-sm"
          >
            Chỉnh sửa thiệp cưới
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Views */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#DFC5A8]/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-3">
            <span className="text-xs font-sans uppercase tracking-wider text-gray-500">
              Tổng lượt xem
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#B88E5B]">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-serif text-3xl font-semibold text-[#2D2A26]">
              {stats.views?.total || 0}
            </span>
            <span className="text-xs font-sans text-gray-500 ml-1.5">lượt truy cập</span>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-sans">
            <span className="flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-[#B88E5B]" />
              Di động: {stats.views?.mobilePercent || 0}%
            </span>
            <span className="flex items-center gap-1">
              <Monitor className="w-3.5 h-3.5 text-gray-400" />
              Máy tính: {100 - (stats.views?.mobilePercent || 0)}%
            </span>
          </div>
        </div>

        {/* Total Wishes */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#DFC5A8]/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-3">
            <span className="text-xs font-sans uppercase tracking-wider text-gray-500">
              Tổng số lời chúc
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FDF8F7] flex items-center justify-center text-[#C67667]">
              <MessageCircleHeart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-serif text-3xl font-semibold text-[#2D2A26]">
              {stats.wishes?.total || 0}
            </span>
            <span className="text-xs font-sans text-gray-500 ml-1.5">lời chúc</span>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-sans">
            <span className="text-green-600">Đã công khai: {stats.wishes?.approved || 0}</span>
            {stats.wishes?.pending > 0 && (
              <span className="text-amber-600 font-semibold">
                Chờ duyệt: {stats.wishes?.pending}
              </span>
            )}
          </div>
        </div>

        {/* Total RSVPs */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#DFC5A8]/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-3">
            <span className="text-xs font-sans uppercase tracking-wider text-gray-500">
              Xác nhận tham dự
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#B88E5B]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-serif text-3xl font-semibold text-[#2D2A26]">
              {stats.rsvp?.totalSubmissions || 0}
            </span>
            <span className="text-xs font-sans text-gray-500 ml-1.5">phản hồi</span>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-sans">
            <span className="text-green-600 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Tham dự: {stats.rsvp?.attendingCount || 0}
            </span>
            <span className="text-gray-400 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> Bận: {stats.rsvp?.decliningCount || 0}
            </span>
          </div>
        </div>

        {/* Total Headcount */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#DFC5A8]/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-3">
            <span className="text-xs font-sans uppercase tracking-wider text-gray-500">
              Lượng khách dự kiến
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-[#B88E5B]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-serif text-3xl font-semibold text-[#B88E5B]">
              {stats.rsvp?.totalHeadcount || 0}
            </span>
            <span className="text-xs font-sans text-gray-500 ml-1.5">người tham gia</span>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-sans">
            <span>Nhà trai: {stats.rsvp?.groomSide || 0}</span>
            <span>Nhà gái: {stats.rsvp?.brideSide || 0}</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Recent Wishes */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#DFC5A8]/40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-medium text-[#2D2A26]">
              Lời Chúc Gần Đây
            </h3>
            <button
              onClick={() => onNavigateTab("wishes")}
              className="text-xs font-sans text-[#B88E5B] hover:text-[#997343] flex items-center gap-0.5"
            >
              <span>Xem tất cả</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentActivity?.wishes?.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">Chưa có lời chúc nào.</p>
            ) : (
              recentActivity?.wishes?.map((w: any) => (
                <div
                  key={w.id}
                  className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#DFC5A8]/30 text-xs font-sans"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#2D2A26] flex items-center gap-1.5">
                      <span>{w.emoji || "❤️"}</span>
                      <span>{w.name}</span>
                    </span>
                    <span className="text-gray-400 text-[10px]">
                      {new Date(w.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <p className="text-gray-600 line-clamp-2 italic">{w.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent RSVPs */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#DFC5A8]/40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-medium text-[#2D2A26]">
              Phản Hồi Tham Dự Mới Nhất
            </h3>
            <button
              onClick={() => onNavigateTab("rsvp")}
              className="text-xs font-sans text-[#B88E5B] hover:text-[#997343] flex items-center gap-0.5"
            >
              <span>Xem tất cả</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentActivity?.rsvps?.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">Chưa có phản hồi tham dự nào.</p>
            ) : (
              recentActivity?.rsvps?.map((r: any) => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#DFC5A8]/30 text-xs font-sans flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#2D2A26]">{r.name}</span>
                      <span className="text-[10px] text-gray-500">
                        ({r.side === "groom" ? "Nhà Trai" : r.side === "bride" ? "Nhà Gái" : "Cả hai"})
                      </span>
                    </div>
                    {r.phone && <p className="text-gray-400 text-[11px]">{r.phone}</p>}
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-medium ${
                        r.isAttending
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {r.isAttending ? `Tham dự (${r.guestCount} người)` : "Không thể đến"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
