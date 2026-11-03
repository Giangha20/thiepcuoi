"use client";

import React, { useState } from "react";
import { Plus, Trash2, Upload, Star, Image as ImageIcon } from "lucide-react";
import { GalleryPhoto } from "@/lib/types";

interface GalleryEditorProps {
  weddingId: string;
  initialGallery: GalleryPhoto[];
  onRefresh: () => void;
}

export default function GalleryEditor({
  weddingId,
  initialGallery,
  onRefresh,
}: GalleryEditorProps) {
  const [gallery, setGallery] = useState<GalleryPhoto[]>(initialGallery || []);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Lỗi tải ảnh");

      setNewPhotoUrl(resData.url);
    } catch (err: any) {
      alert("Lỗi tải ảnh: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) {
      alert("Vui lòng tải ảnh lên hoặc dán đường dẫn ảnh");
      return;
    }

    setAdding(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weddingId,
          url: newPhotoUrl.trim(),
          caption: newCaption.trim(),
          featured: isFeatured,
        }),
      });

      if (!res.ok) throw new Error("Lỗi thêm ảnh vào album");

      setNewPhotoUrl("");
      setNewCaption("");
      setIsFeatured(false);
      onRefresh();

      const listRes = await fetch("/api/admin/wedding");
      const listData = await listRes.json();
      if (listData?.gallery) setGallery(listData.gallery);
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa ảnh này khỏi album?")) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        setGallery((prev) => prev.filter((p) => p.id !== id));
        onRefresh();
      }
    } catch (e) {
      alert("Lỗi xóa ảnh");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h2 className="font-serif text-2xl font-medium text-[#2D2A26]">
          Quản Lý Album Ảnh Cưới
        </h2>
        <p className="text-xs font-sans text-gray-500 mt-0.5">
          Tải lên ảnh cưới, sắp xếp thứ tự và chú thích ảnh hiển thị trong bộ sưu tập
        </p>
      </div>

      {/* Add New Photo Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[#DFC5A8]/50">
        <h3 className="font-serif text-lg font-medium text-[#2D2A26] mb-4 flex items-center gap-2">
          <span>Thêm ảnh mới vào Album</span>
        </h3>

        <form onSubmit={handleAddPhoto} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Upload or Link */}
            <div className="md:col-span-8 flex items-center gap-3">
              <input
                type="text"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="Dán đường dẫn ảnh hoặc bấm Tải ảnh lên..."
                className="flex-grow px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans focus:outline-none focus:border-[#B88E5B]"
              />
              <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#7A5B33] text-xs font-sans font-medium cursor-pointer border border-[#DFC5A8]/60 transition-colors shrink-0">
                <Upload className="w-3.5 h-3.5 text-[#B88E5B]" />
                <span>{uploading ? "Đang tải..." : "Tải từ máy"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                  }}
                />
              </label>
            </div>

            {/* Caption */}
            <div className="md:col-span-4">
              <input
                type="text"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                placeholder="Chú thích ảnh (ví dụ: Khoảnh khắc trao nhẫn)"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans focus:outline-none focus:border-[#B88E5B]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="inline-flex items-center gap-2 text-xs font-sans text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded text-[#B88E5B] focus:ring-[#B88E5B]"
              />
              <span>Đánh dấu là ảnh nổi bật (hiển thị ưu tiên)</span>
            </label>

            <button
              type="submit"
              disabled={adding || !newPhotoUrl}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#B88E5B] hover:bg-[#997343] text-white text-xs font-sans font-medium transition-all shadow-sm disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{adding ? "Đang thêm..." : "Lưu vào album"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((photo) => (
          <div
            key={photo.id}
            className="group relative bg-white rounded-2xl overflow-hidden border border-[#DFC5A8]/40 shadow-sm aspect-[3/4] flex flex-col justify-end"
          >
            <img
              src={photo.url}
              alt={photo.caption || "Ảnh cưới"}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

            {/* Actions top right */}
            <div className="absolute top-2 right-2 flex items-center gap-1">
              {photo.featured && (
                <div className="w-7 h-7 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-md">
                  <Star className="w-3.5 h-3.5 fill-white" />
                </div>
              )}
              <button
                onClick={() => handleDelete(photo.id)}
                className="w-7 h-7 rounded-full bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-md"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Caption bottom */}
            <div className="relative z-10 p-3 text-white">
              <p className="font-serif text-xs line-clamp-2">
                {photo.caption || "Không có chú thích"}
              </p>
              <span className="text-[10px] text-gray-300 font-sans block mt-1">
                Thứ tự: {photo.order}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
