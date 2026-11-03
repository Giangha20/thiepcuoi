"use client";

import React, { useState, useEffect } from "react";
import { Search, CheckCircle2, EyeOff, Trash2, Pin, Heart, MessageCircleHeart, RefreshCw } from "lucide-react";
import { Wish } from "@/lib/types";

export default function WishesManager() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWishes = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ filter, search });
      const res = await fetch(`/api/admin/wishes?${query.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) setWishes(data);
    } catch (e) {
      console.error("Fetch wishes error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, [filter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWishes();
  };

  const handleToggleApprove = async (wish: Wish) => {
    try {
      const res = await fetch(`/api/admin/wishes/${wish.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !wish.isApproved }),
      });
      if (res.ok) {
        setWishes((prev) =>
          prev.map((w) => (w.id === wish.id ? { ...w, isApproved: !w.isApproved } : w))
        );
      }
    } catch (e) {
      alert("Lỗi cập nhật trạng thái");
    }
  };

  const handleTogglePin = async (wish: Wish) => {
    try {
      const res = await fetch(`/api/admin/wishes/${wish.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !wish.isPinned }),
      });
      if (res.ok) {
        setWishes((prev) =>
          prev.map((w) => (w.id === wish.id ? { ...w, isPinned: !w.isPinned } : w))
        );
      }
    } catch (e) {
      alert("Lỗi ghim lời chúc");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa lời chúc này vĩnh viễn?")) return;
    try {
      const res = await fetch(`/api/admin/wishes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setWishes((prev) => prev.filter((w) => w.id !== id));
      }
    } catch (e) {
      alert("Lỗi xóa lời chúc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="font-serif text-2xl font-medium text-[#2D2A26]">
            Quản Lý Sổ Lưu Bút &amp; Lời Chúc
          </h2>
          <p className="text-xs font-sans text-gray-500 mt-0.5">
            Duyệt lời chúc, ghim lời chúc ý nghĩa lên đầu hoặc ẩn/xóa lời chúc không phù hợp
          </p>
        </div>

        <button
          onClick={fetchWishes}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-xs font-sans text-gray-700 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {[
            { id: "all", label: "Tất cả" },
            { id: "approved", label: "Đã công khai" },
            { id: "pending", label: "Chờ kiểm duyệt" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-sans transition-all ${
                filter === item.id
                  ? "bg-[#B88E5B] text-white font-medium shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative max-w-xs w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc nội dung..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-sans focus:outline-none focus:border-[#B88E5B]"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Wishes Table / List */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#DFC5A8]/50 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-sans text-gray-400">
            Đang tải danh sách lời chúc...
          </div>
        ) : wishes.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <MessageCircleHeart className="w-10 h-10 mx-auto mb-2 opacity-40 text-[#B88E5B]" />
            <p className="font-serif text-base text-gray-600">Không tìm thấy lời chúc nào</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {wishes.map((wish) => (
              <div
                key={wish.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="space-y-1 max-w-3xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg">{wish.emoji || "❤️"}</span>
                    <span className="font-serif font-medium text-base text-[#2D2A26]">
                      {wish.name}
                    </span>
                    {wish.relationship && (
                      <span className="text-[10px] font-sans px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#7A5B33] border border-[#DFC5A8]/40">
                        {wish.relationship}
                      </span>
                    )}

                    {/* Status Badge */}
                    <span
                      className={`text-[10px] font-sans px-2.5 py-0.5 rounded-full font-medium ${
                        wish.isApproved
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {wish.isApproved ? "Đã công khai" : "Chờ duyệt"}
                    </span>

                    {wish.isPinned && (
                      <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <Pin className="w-2.5 h-2.5 rotate-45" />
                        <span>Đã ghim</span>
                      </span>
                    )}
                  </div>

                  <p className="font-serif text-sm text-gray-700 leading-relaxed whitespace-pre-line pl-6">
                    {wish.message}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] font-sans text-gray-400 pl-6 pt-1">
                    <span>
                      {new Date(wish.createdAt).toLocaleString("vi-VN")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-[#C67667]" />
                      {wish.likes || 0} lượt thích
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleToggleApprove(wish)}
                    title={wish.isApproved ? "Ẩn lời chúc" : "Duyệt công khai"}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition-colors ${
                      wish.isApproved
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {wish.isApproved ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Ẩn</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Duyệt</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleTogglePin(wish)}
                    title={wish.isPinned ? "Bỏ ghim" : "Ghim lên đầu"}
                    className={`p-2 rounded-xl transition-colors ${
                      wish.isPinned
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(wish.id)}
                    title="Xóa lời chúc"
                    className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
