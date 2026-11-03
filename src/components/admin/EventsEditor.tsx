"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, MapPin, Calendar, Clock, ExternalLink } from "lucide-react";
import { WeddingEvent } from "@/lib/types";

interface EventsEditorProps {
  weddingId: string;
  initialEvents: WeddingEvent[];
  onRefresh: () => void;
}

export default function EventsEditor({
  weddingId,
  initialEvents,
  onRefresh,
}: EventsEditorProps) {
  const [events, setEvents] = useState<WeddingEvent[]>(initialEvents || []);
  const [editingEvent, setEditingEvent] = useState<WeddingEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenAdd = () => {
    setEditingEvent({
      id: "",
      weddingId,
      title: "",
      time: "11:00 Trưa",
      date: "Thứ Sáu, 25 Tháng 12, 2026",
      venueName: "",
      address: "",
      mapUrl: "",
      mapEmbedUrl: "",
      photo: "",
      order: events.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: WeddingEvent) => {
    setEditingEvent({ ...event });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
        onRefresh();
      }
    } catch (e) {
      alert("Lỗi khi xóa sự kiện");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent?.title) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingEvent),
      });

      if (!res.ok) throw new Error("Lỗi lưu sự kiện");

      setIsModalOpen(false);
      onRefresh();
      // Reload events locally
      const listRes = await fetch("/api/admin/wedding");
      const listData = await listRes.json();
      if (listData?.events) setEvents(listData.events);
    } catch (err: any) {
      alert("Lỗi lưu sự kiện: " + err.message);
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
            Sự Kiện &amp; Địa Điểm Lễ Cưới
          </h2>
          <p className="text-xs font-sans text-gray-500 mt-0.5">
            Quản lý các sự kiện chính: Lễ Vu Quy, Lễ Thành Hôn, Tiệc Cưới và bản đồ chỉ đường
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B88E5B] hover:bg-[#997343] text-white text-xs font-sans font-medium transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm sự kiện mới</span>
        </button>
      </div>

      {/* Events List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-[#DFC5A8]/50 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#7A5B33] font-medium border border-[#DFC5A8]/40">
                  Thứ tự: {event.order}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(event)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-[#B88E5B] hover:bg-gray-100 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-serif text-xl font-medium text-[#2D2A26] mb-3">
                {event.title}
              </h3>

              <div className="space-y-2 text-xs font-sans text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#B88E5B]" />
                  <span className="font-medium text-gray-800">{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#B88E5B]" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-start gap-2 pt-1 border-t border-gray-100">
                  <MapPin className="w-3.5 h-3.5 text-[#C67667] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">{event.venueName}</p>
                    <p className="text-gray-500 text-[11px] mt-0.5">{event.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {event.mapUrl && (
              <a
                href={event.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-sans text-[#B88E5B] hover:underline"
              >
                <span>Xem bản đồ đã gán</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Modal Add/Edit Event */}
      {isModalOpen && editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-xl font-medium text-[#2D2A26] mb-4">
              {editingEvent.id ? "Chỉnh Sửa Sự Kiện" : "Thêm Sự Kiện Mới"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
                  Tên sự kiện <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, title: e.target.value })
                  }
                  placeholder="Ví dụ: Lễ Vu Quy, Lễ Thành Hôn, Tiệc Cưới"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
                    Giờ tổ chức
                  </label>
                  <input
                    type="text"
                    value={editingEvent.time}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, time: e.target.value })
                    }
                    placeholder="11:30 Trưa"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
                    Thứ tự hiển thị
                  </label>
                  <input
                    type="number"
                    value={editingEvent.order}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        order: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
                  Ngày tổ chức
                </label>
                <input
                  type="text"
                  value={editingEvent.date}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, date: e.target.value })
                  }
                  placeholder="Thứ Sáu, 25 Tháng 12, 2026"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
                  Tên địa điểm / Hội trường / Tư gia
                </label>
                <input
                  type="text"
                  value={editingEvent.venueName}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, venueName: e.target.value })
                  }
                  placeholder="Ví dụ: Trung tâm Tiệc cưới Trống Đồng Palace"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
                  Địa chỉ chi tiết
                </label>
                <input
                  type="text"
                  value={editingEvent.address}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, address: e.target.value })
                  }
                  placeholder="Số 65 Quán Sứ, Hoàn Kiếm, Hà Nội"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
                  Đường link chỉ đường Google Maps (Direct Link)
                </label>
                <input
                  type="text"
                  value={editingEvent.mapUrl}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, mapUrl: e.target.value })
                  }
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
                  Mã nhúng bản đồ (Google Maps Embed iframe URL - tùy chọn)
                </label>
                <input
                  type="text"
                  value={editingEvent.mapEmbedUrl}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, mapEmbedUrl: e.target.value })
                  }
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
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
                  {loading ? "Đang lưu..." : "Lưu sự kiện"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
