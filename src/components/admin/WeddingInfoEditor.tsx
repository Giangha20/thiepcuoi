"use client";

import React, { useState } from "react";
import { Save, Upload, CheckCircle2, Image as ImageIcon } from "lucide-react";

interface WeddingInfoEditorProps {
  wedding: any;
  onSave: (data: any) => Promise<void>;
}

export default function WeddingInfoEditor({ wedding, onSave }: WeddingInfoEditorProps) {
  const [formData, setFormData] = useState({ ...wedding });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingGroom, setUploadingGroom] = useState(false);
  const [uploadingBride, setUploadingBride] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const handleFileUpload = async (
    file: File,
    field: "groomPhoto" | "bridePhoto" | "coverPhoto",
    setUploading: (b: boolean) => void
  ) => {
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

      setFormData((prev: any) => ({ ...prev, [field]: resData.url }));
    } catch (err: any) {
      alert("Lỗi tải ảnh: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await onSave(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert("Lỗi lưu thông tin: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top action bar */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h2 className="font-serif text-2xl font-medium text-[#2D2A26]">
            Thông Tin Lễ Cưới &amp; Cô Dâu Chú Rể
          </h2>
          <p className="text-xs font-sans text-gray-500 mt-0.5">
            Tất cả thông tin được cập nhật theo thời gian thực lên thiệp cưới
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B88E5B] hover:bg-[#997343] text-white text-xs font-sans font-medium transition-all shadow-md disabled:opacity-60"
        >
          {saving ? (
            <span>Đang lưu...</span>
          ) : success ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Đã lưu thành công!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Lưu thay đổi</span>
            </>
          )}
        </button>
      </div>

      {/* Groom & Bride 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GROOM */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[#DFC5A8]/50 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B88E5B]" />
            <h3 className="font-serif text-lg font-medium text-[#2D2A26]">
              Thông Tin Chú Rể
            </h3>
          </div>

          {/* Photo */}
          <div>
            <label className="block text-xs font-sans font-medium text-gray-700 mb-2">
              Ảnh đại diện Chú Rể
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#DFC5A8] shrink-0 bg-gray-50">
                {formData.groomPhoto ? (
                  <img
                    src={formData.groomPhoto}
                    alt="Chú Rể"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="space-y-2 flex-grow">
                <input
                  type="text"
                  value={formData.groomPhoto || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, groomPhoto: e.target.value })
                  }
                  placeholder="Nhập đường dẫn ảnh hoặc bấm tải lên..."
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-sans focus:outline-none focus:border-[#B88E5B]"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#7A5B33] text-xs font-sans font-medium cursor-pointer border border-[#DFC5A8]/60 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#B88E5B]" />
                  <span>{uploadingGroom ? "Đang tải lên..." : "Tải ảnh từ máy"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(
                          e.target.files[0],
                          "groomPhoto",
                          setUploadingGroom
                        );
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
                Tên thường gọi
              </label>
              <input
                type="text"
                value={formData.groomName || ""}
                onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
                Họ và tên đầy đủ
              </label>
              <input
                type="text"
                value={formData.groomFullName || ""}
                onChange={(e) => setFormData({ ...formData, groomFullName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
                Thân phụ (Bố chú rể)
              </label>
              <input
                type="text"
                value={formData.groomFather || ""}
                onChange={(e) => setFormData({ ...formData, groomFather: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
                Thân mẫu (Mẹ chú rể)
              </label>
              <input
                type="text"
                value={formData.groomMother || ""}
                onChange={(e) => setFormData({ ...formData, groomMother: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
              Số điện thoại chú rể
            </label>
            <input
              type="text"
              value={formData.groomPhone || ""}
              onChange={(e) => setFormData({ ...formData, groomPhone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
              Lời giới thiệu ngắn (Bio)
            </label>
            <textarea
              rows={3}
              value={formData.groomBio || ""}
              onChange={(e) => setFormData({ ...formData, groomBio: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans resize-none"
            />
          </div>
        </div>

        {/* BRIDE */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[#DFC5A8]/50 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C67667]" />
            <h3 className="font-serif text-lg font-medium text-[#2D2A26]">
              Thông Tin Cô Dâu
            </h3>
          </div>

          {/* Photo */}
          <div>
            <label className="block text-xs font-sans font-medium text-gray-700 mb-2">
              Ảnh đại diện Cô Dâu
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#DFC5A8] shrink-0 bg-gray-50">
                {formData.bridePhoto ? (
                  <img
                    src={formData.bridePhoto}
                    alt="Cô Dâu"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="space-y-2 flex-grow">
                <input
                  type="text"
                  value={formData.bridePhoto || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, bridePhoto: e.target.value })
                  }
                  placeholder="Nhập đường dẫn ảnh hoặc bấm tải lên..."
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-sans focus:outline-none focus:border-[#B88E5B]"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#7A5B33] text-xs font-sans font-medium cursor-pointer border border-[#DFC5A8]/60 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#B88E5B]" />
                  <span>{uploadingBride ? "Đang tải lên..." : "Tải ảnh từ máy"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(
                          e.target.files[0],
                          "bridePhoto",
                          setUploadingBride
                        );
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
                Tên thường gọi
              </label>
              <input
                type="text"
                value={formData.brideName || ""}
                onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
                Họ và tên đầy đủ
              </label>
              <input
                type="text"
                value={formData.brideFullName || ""}
                onChange={(e) => setFormData({ ...formData, brideFullName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
                Thân phụ (Bố cô dâu)
              </label>
              <input
                type="text"
                value={formData.brideFather || ""}
                onChange={(e) => setFormData({ ...formData, brideFather: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
                Thân mẫu (Mẹ cô dâu)
              </label>
              <input
                type="text"
                value={formData.brideMother || ""}
                onChange={(e) => setFormData({ ...formData, brideMother: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
              Số điện thoại cô dâu
            </label>
            <input
              type="text"
              value={formData.bridePhone || ""}
              onChange={(e) => setFormData({ ...formData, bridePhone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
              Lời giới thiệu ngắn (Bio)
            </label>
            <textarea
              rows={3}
              value={formData.brideBio || ""}
              onChange={(e) => setFormData({ ...formData, brideBio: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans resize-none"
            />
          </div>
        </div>
      </div>

      {/* Wedding Date, Lunar Date & Quotes */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[#DFC5A8]/50 space-y-4">
        <h3 className="font-serif text-lg font-medium text-[#2D2A26] pb-2 border-b border-gray-100">
          Thời Gian Lễ Cưới &amp; Thông Điệp
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
              Ngày giờ tổ chức đám cưới (Dương lịch)
            </label>
            <input
              type="datetime-local"
              value={
                formData.weddingDate
                  ? new Date(formData.weddingDate).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                setFormData({ ...formData, weddingDate: new Date(e.target.value) })
              }
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
              Ngày cưới theo Âm lịch (hiển thị dưới ngày cưới)
            </label>
            <input
              type="text"
              value={formData.weddingLunarDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, weddingLunarDate: e.target.value })
              }
              placeholder="Ví dụ: Ngày 16 tháng 11 năm Bính Ngọ"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
            />
          </div>
        </div>

        {/* Cover Photo */}
        <div>
          <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
            Ảnh bìa lớn trang chính (Hero Cover Photo)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={formData.coverPhoto || ""}
              onChange={(e) => setFormData({ ...formData, coverPhoto: e.target.value })}
              placeholder="Đường dẫn ảnh bìa hoặc tải lên..."
              className="flex-grow px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
            />
            <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#7A5B33] text-xs font-sans font-medium cursor-pointer border border-[#DFC5A8]/60 transition-colors shrink-0">
              <Upload className="w-3.5 h-3.5 text-[#B88E5B]" />
              <span>{uploadingCover ? "Đang tải..." : "Tải ảnh bìa"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileUpload(
                      e.target.files[0],
                      "coverPhoto",
                      setUploadingCover
                    );
                  }
                }}
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
            Thông điệp lời mời gửi đến khách quý
          </label>
          <textarea
            rows={3}
            value={formData.invitationMessage || ""}
            onChange={(e) =>
              setFormData({ ...formData, invitationMessage: e.target.value })
            }
            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
            Lời cảm ơn ở cuối thiệp
          </label>
          <textarea
            rows={3}
            value={formData.thankYouMessage || ""}
            onChange={(e) =>
              setFormData({ ...formData, thankYouMessage: e.target.value })
            }
            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans resize-none"
          />
        </div>
      </div>
    </form>
  );
}
