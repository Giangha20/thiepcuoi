"use client";

import React, { useState, useEffect } from "react";
import { Search, Download, Trash2, Users, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Rsvp } from "@/lib/types";

export default function RsvpManager() {
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [attendingFilter, setAttendingFilter] = useState<string>("all");
  const [sideFilter, setSideFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRsvps = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        attending: attendingFilter,
        side: sideFilter,
        search,
      });
      const res = await fetch(`/api/admin/rsvp?${query.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) setRsvps(data);
    } catch (e) {
      console.error("Fetch RSVP error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRsvps();
  }, [attendingFilter, sideFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRsvps();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa phản hồi này?")) return;
    try {
      const res = await fetch(`/api/admin/rsvp/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRsvps((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (e) {
      alert("Lỗi khi xóa");
    }
  };

  const handleExportExcel = () => {
    window.open("/api/admin/rsvp/export", "_blank");
  };

  const attendingCount = rsvps.filter((r) => r.isAttending).length;
  const decliningCount = rsvps.filter((r) => !r.isAttending).length;
  const totalHeadcount = rsvps
    .filter((r) => r.isAttending)
    .reduce((sum, r) => sum + (r.guestCount || 1), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="font-serif text-2xl font-medium text-[#2D2A26]">
            Danh Sách Khách Mời Xác Nhận (RSVP)
          </h2>
          <p className="text-xs font-sans text-gray-500 mt-0.5">
            Theo dõi khách mời, số lượng người tham dự thực tế và xuất file báo cáo
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchRsvps}
            className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-sans font-medium transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Xuất file Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Mini Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#DFC5A8]/40 shadow-sm">
          <span className="text-[11px] font-sans text-gray-400 block">Tổng phản hồi</span>
          <span className="font-serif text-2xl font-semibold text-[#2D2A26]">
            {rsvps.length}
          </span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#DFC5A8]/40 shadow-sm">
          <span className="text-[11px] font-sans text-green-600 block">Khách sẽ tham dự</span>
          <span className="font-serif text-2xl font-semibold text-green-700">
            {attendingCount}
          </span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#DFC5A8]/40 shadow-sm">
          <span className="text-[11px] font-sans text-amber-600 block">Tổng số người (Headcount)</span>
          <span className="font-serif text-2xl font-semibold text-[#B88E5B]">
            {totalHeadcount}
          </span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#DFC5A8]/40 shadow-sm">
          <span className="text-[11px] font-sans text-gray-400 block">Bận không thể đến</span>
          <span className="font-serif text-2xl font-semibold text-gray-500">
            {decliningCount}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={attendingFilter}
            onChange={(e) => setAttendingFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-sans focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="yes">Chỉ khách tham dự</option>
            <option value="no">Chỉ khách không thể đến</option>
          </select>

          <select
            value={sideFilter}
            onChange={(e) => setSideFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-sans focus:outline-none"
          >
            <option value="all">Tất cả các bên</option>
            <option value="groom">Khách Nhà Trai</option>
            <option value="bride">Khách Nhà Gái</option>
            <option value="both">Khách Cả Hai Bên</option>
          </select>
        </div>

        <form onSubmit={handleSearch} className="relative max-w-xs w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, SĐT hoặc ghi chú..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-sans focus:outline-none focus:border-[#B88E5B]"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* RSVP Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#DFC5A8]/50 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-sans text-gray-400">
            Đang tải dữ liệu...
          </div>
        ) : rsvps.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-40 text-[#B88E5B]" />
            <p className="font-serif text-base text-gray-600">Không có phản hồi nào phù hợp</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#FAF7F2] text-[#7A5B33] uppercase text-[10px] tracking-wider border-b border-[#DFC5A8]/40">
                <tr>
                  <th className="py-3 px-4">Khách mời</th>
                  <th className="py-3 px-4">Số điện thoại</th>
                  <th className="py-3 px-4">Bên đại diện</th>
                  <th className="py-3 px-4">Tham dự</th>
                  <th className="py-3 px-4">Số người</th>
                  <th className="py-3 px-4">Lời nhắn / Yêu cầu</th>
                  <th className="py-3 px-4">Thời gian</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-gray-900">
                      {rsvp.name}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 font-mono">
                      {rsvp.phone || "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#7A5B33] border border-[#DFC5A8]/40 text-[11px]">
                        {rsvp.side === "groom"
                          ? "Nhà Trai"
                          : rsvp.side === "bride"
                          ? "Nhà Gái"
                          : "Cả hai bên"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                          rsvp.isAttending
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {rsvp.isAttending ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span>Có tham dự</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-gray-500" />
                            <span>Không thể đến</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-800">
                      {rsvp.isAttending ? rsvp.guestCount : 0}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 max-w-xs truncate">
                      {rsvp.notes || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-gray-400 text-[11px]">
                      {new Date(rsvp.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(rsvp.id)}
                        title="Xóa phản hồi"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
