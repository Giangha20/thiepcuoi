"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Calendar, Upload, Image as ImageIcon } from "lucide-react";
import { TimelineMilestone } from "@/lib/types";

interface TimelineEditorProps {
  weddingId: string;
  initialTimeline: TimelineMilestone[];
  onRefresh: () => void;
}

export default function TimelineEditor({
  weddingId,
  initialTimeline,
  onRefresh,
}: TimelineEditorProps) {
  const [timeline, setTimeline] = useState<TimelineMilestone[]>(initialTimeline || []);
  const [editingItem, setEditingItem] = useState<TimelineMilestone | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleOpenAdd = () => {
    setEditingItem({
      id: "",
      weddingId,
      date: "Mùa thu 2024",
      title: "",
      description: "",
      photo: "",
      order: timeline.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TimelineMilestone) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa mốc thời gian này?")) return;
    try {
      const res = await fetch(`/api/admin/timeline/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTimeline((prev) => prev.filter((t) => t.id !== id));
        onRefresh();
      }
    } catch (e) {
      alert("Lỗi khi xóa cột mốc");
    }
  };

  const handleUploadPhoto = async (file: File) => {
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Lỗi tải ảnh");
      setEditingItem((prev: any) => ({ ...prev, photo: resData.url }));
    } catch (err: any) {
      alert("Lỗi tải ảnh: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      if (!res.ok) throw new Error("Lỗi lưu cột mốc");

      setIsModalOpen(false);
      onRefresh();
      const listRes = await fetch("/api/admin/wedding");
      const listData = await listRes.json();
      if (listData?.timeline) setTimeline(listData.timeline);
    } catch (err: any) {
      alert("Lỗi lưu cột mốc: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h2 className="font-serif text-2xl font-medium text-[#2D2A26]">
            Câu Chuyện Tình Yêu (Love Story Timeline)
          </h2>
          <p className="text-xs font-sans text-gray-500 mt-0.5">
            Kể lại những cột mốc đáng nhớ nhất: Ngày đầu gặp gỡ, lần hẹn hò đầu tiên, lời cầu hôn...
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B88E5B] hover:bg-[#997343] text-white text-xs font-sans font-medium transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm cột mốc mới</span>
        </button>
      </div>

      {/* Timeline Items List */}
      <div className="space-y-4">
        {timeline.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-[#DFC5A8]/50 flex flex-col md:flex-row items-start md:items-center gap-6"
          >
            {item.photo && (
              <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-gray-200 shadow-sm">
                <img
                  src={item.photo}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex-grow space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#7A5B33] font-medium border border-[#DFC5A8]/40">
                  <Calendar className="w-3 h-3 text-[#B88E5B]" />
                  <span>{item.date}</span>
                </span>
                <span className="text-[10px] text-gray-400 font-sans">
                  Thứ tự: {item.order}
                </span>
              </div>

              <h3 className="font-serif text-lg font-medium text-[#2D2A26]">
                {item.title}
              </h3>
              <p className="text-xs font-sans text-gray-600 leading-relaxed max-w-2xl">
                {item.description}
              </p>
            </div>

            <div className="flex items-center gap-1 ml-auto shrink-0">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-2 rounded-lg text-gray-500 hover:text-[#B88E5B] hover:bg-gray-100 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-xl font-medium text-[#2D2A26] mb-4">
              {editingItem.id ? "Chỉnh Sửa Cột Mốc" : "Thêm Cột Mốc Mới"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
                  Tiêu đề cột mốc <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, title: e.target.value })
                  }
                  placeholder="Ví dụ: Lần đầu gặp gỡ / Khoảnh khắc cầu hôn"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
                    Thời gian / Ngày kỷ niệm
                  </label>
                  <input
                    type="text"
                    value={editingItem.date}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, date: e.target.value })
                    }
                    placeholder="15 Tháng 10, 2021"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
                    Thứ tự
                  </label>
                  <input
                    type="number"
                    value={editingItem.order}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        order: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
                  />
                </div>
              </div>

              {/* Photo */}
              <div>
                <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
                  Hình ảnh kỷ niệm (Tùy chọn)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editingItem.photo || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, photo: e.target.value })
                    }
                    placeholder="Đường dẫn ảnh hoặc tải lên..."
                    className="flex-grow px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#7A5B33] text-xs font-sans font-medium cursor-pointer border border-[#DFC5A8]/60 transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#B88E5B]" />
                    <span>{uploading ? "Đang tải..." : "Tải ảnh"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleUploadPhoto(e.target.files[0]);
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
                  Nội dung câu chuyện
                </label>
                <textarea
                  rows={4}
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      description: e.target.value,
                    })
                  }
                  placeholder="Kể lại kỷ niệm ngọt ngào của hai bạn..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-sans text-gray-600 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#B88E5B] hover:bg-[#997343] text-white text-xs font-sans font-medium shadow-sm"
                >
                  {loading ? "Đang lưu..." : "Lưu mốc thời gian"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
