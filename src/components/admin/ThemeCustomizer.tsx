"use client";

import React, { useState } from "react";
import { THEMES } from "@/lib/theme";
import { Save, Music, Palette, Eye, CheckCircle2, Volume2, Sparkles } from "lucide-react";

interface ThemeCustomizerProps {
  wedding: any;
  onSave: (data: any) => Promise<void>;
}

const MUSIC_PRESETS = [
  {
    title: "Romantic Wedding Piano - Until I Found You",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-113224.mp3",
  },
  {
    title: "Canon in D (Gentle Wedding Piano)",
    url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=canon-in-d-major-piano-10114.mp3",
  },
  {
    title: "A Thousand Years (Sweet Acoustic Guitar & Cello)",
    url: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=romantic-acoustic-love-123498.mp3",
  },
  {
    title: "Beautiful In White (Pure Piano Solo)",
    url: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_924bb3e85e.mp3?filename=wedding-love-story-piano-8422.mp3",
  },
];

export default function ThemeCustomizer({ wedding, onSave }: ThemeCustomizerProps) {
  const [themeColor, setThemeColor] = useState(wedding.themeColor || "champagne");
  const [musicUrl, setMusicUrl] = useState(wedding.musicUrl || "");
  const [musicTitle, setMusicTitle] = useState(wedding.musicTitle || "");
  const [musicAutoPlay, setMusicAutoPlay] = useState(Boolean(wedding.musicAutoPlay));

  // Toggles
  const [showPetals, setShowPetals] = useState(Boolean(wedding.showPetals));
  const [showCountdown, setShowCountdown] = useState(Boolean(wedding.showCountdown));
  const [showEvents, setShowEvents] = useState(Boolean(wedding.showEvents));
  const [showTimeline, setShowTimeline] = useState(Boolean(wedding.showTimeline));
  const [showGallery, setShowGallery] = useState(Boolean(wedding.showGallery));
  const [showRsvp, setShowRsvp] = useState(Boolean(wedding.showRsvp));
  const [showWishes, setShowWishes] = useState(Boolean(wedding.showWishes));
  const [showGiftBox, setShowGiftBox] = useState(Boolean(wedding.showGiftBox));
  const [requireWishApproval, setRequireWishApproval] = useState(Boolean(wedding.requireWishApproval));

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        ...wedding,
        themeColor,
        musicUrl,
        musicTitle,
        musicAutoPlay,
        showPetals,
        showCountdown,
        showEvents,
        showTimeline,
        showGallery,
        showRsvp,
        showWishes,
        showGiftBox,
        requireWishApproval,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert("Lỗi lưu tùy chỉnh: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h2 className="font-serif text-2xl font-medium text-[#2D2A26]">
            Tùy Chỉnh Giao Diện &amp; Âm Nhạc
          </h2>
          <p className="text-xs font-sans text-gray-500 mt-0.5">
            Thay đổi bảng màu chủ đạo, nhạc nền lãng mạn và bật/tắt từng phân khu trên thiệp
          </p>
        </div>

        <button
          onClick={handleSave}
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
              <span>Lưu tùy chỉnh</span>
            </>
          )}
        </button>
      </div>

      {/* 1. Theme Color Palettes */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[#DFC5A8]/50">
        <h3 className="font-serif text-lg font-medium text-[#2D2A26] mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#B88E5B]" />
          <span>Bảng Màu Chủ Đạo Của Thiệp Cưới</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.values(THEMES).map((theme) => {
            const isSelected = themeColor === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => setThemeColor(theme.id as any)}
                className={`p-4 rounded-2xl cursor-pointer border-2 transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-[#B88E5B] bg-[#FAF7F2] shadow-md ring-2 ring-[#B88E5B]/20"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="w-5 h-5 rounded-full shadow-inner shrink-0"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <span
                      className="w-5 h-5 rounded-full shadow-inner shrink-0"
                      style={{ backgroundColor: theme.accent }}
                    />
                    <span
                      className="w-5 h-5 rounded-full border border-gray-300 shadow-inner shrink-0"
                      style={{ backgroundColor: theme.bgLight }}
                    />
                  </div>
                  <h4 className="font-serif text-sm font-medium text-[#2D2A26]">
                    {theme.name}
                  </h4>
                </div>

                <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-sans">
                  <span className={isSelected ? "text-[#B88E5B] font-semibold" : "text-gray-400"}>
                    {isSelected ? "Đang áp dụng" : "Bấm để chọn"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Background Music */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[#DFC5A8]/50 space-y-4">
        <h3 className="font-serif text-lg font-medium text-[#2D2A26] flex items-center gap-2">
          <Music className="w-5 h-5 text-[#B88E5B]" />
          <span>Nhạc Nền Thiệp Cưới (Background Audio)</span>
        </h3>

        {/* Preset Selector */}
        <div>
          <label className="block text-xs font-sans font-medium text-gray-700 mb-2">
            Chọn từ danh sách giai điệu có sẵn:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {MUSIC_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setMusicUrl(preset.url);
                  setMusicTitle(preset.title);
                }}
                className={`p-3 rounded-xl text-left border text-xs font-sans transition-all flex items-center gap-2.5 ${
                  musicUrl === preset.url
                    ? "bg-[#FAF7F2] border-[#B88E5B] text-[#7A5B33] font-medium shadow-sm"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Volume2 className="w-4 h-4 text-[#B88E5B] shrink-0" />
                <span className="truncate">{preset.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Music URL input */}
        <div>
          <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
            Hoặc tự nhập đường dẫn file âm thanh (.mp3):
          </label>
          <input
            type="text"
            value={musicUrl}
            onChange={(e) => setMusicUrl(e.target.value)}
            placeholder="https://example.com/bai-hat-cuoi.mp3"
            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
          />
        </div>

        <div>
          <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
            Tên bài hát hiển thị:
          </label>
          <input
            type="text"
            value={musicTitle}
            onChange={(e) => setMusicTitle(e.target.value)}
            placeholder="Until I Found You - Romantic Piano"
            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
          />
        </div>
      </div>

      {/* 3. Section Visibility & Moderation Toggles */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[#DFC5A8]/50">
        <h3 className="font-serif text-lg font-medium text-[#2D2A26] mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-[#B88E5B]" />
          <span>Bật / Tắt Các Phân Khu &amp; Tính Năng Thiệp</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              id: "petals",
              label: "Hiệu ứng cánh hoa bay & bụi vàng lãng mạn",
              desc: "Cánh hoa nhẹ nhàng rơi trên màn hình (không gây lag)",
              checked: showPetals,
              set: setShowPetals,
            },
            {
              id: "countdown",
              label: "Đồng hồ đếm ngược ngày cưới",
              desc: "Đếm ngược ngày, giờ, phút, giây đến thời khắc trọng đại",
              checked: showCountdown,
              set: setShowCountdown,
            },
            {
              id: "events",
              label: "Thông tin Lễ Cưới & Bản đồ Google Maps",
              desc: "Hiển thị các buổi lễ (Vu Quy, Thành Hôn, Tiệc Cưới)",
              checked: showEvents,
              set: setShowEvents,
            },
            {
              id: "timeline",
              label: "Dòng thời gian tình yêu (Love Story Timeline)",
              desc: "Các mốc thời gian đáng nhớ của hai người",
              checked: showTimeline,
              set: setShowTimeline,
            },
            {
              id: "gallery",
              label: "Bộ sưu tập album ảnh cưới",
              desc: "Xem ảnh dạng lưới và phóng to toàn màn hình",
              checked: showGallery,
              set: setShowGallery,
            },
            {
              id: "rsvp",
              label: "Mục xác nhận tham dự (RSVP)",
              desc: "Cho phép khách báo số lượng người tham dự",
              checked: showRsvp,
              set: setShowRsvp,
            },
            {
              id: "wishes",
              label: "Sổ lưu bút & Gửi lời chúc",
              desc: "Cho phép bất kỳ ai gửi lời chúc phúc trực tiếp",
              checked: showWishes,
              set: setShowWishes,
            },
            {
              id: "giftBox",
              label: "Hộp mừng cưới & Mã QR ngân hàng",
              desc: "Mừng lì xì từ xa tiện lợi cho bạn bè",
              checked: showGiftBox,
              set: setShowGiftBox,
            },
            {
              id: "moderation",
              label: "Chế độ kiểm duyệt lời chúc",
              desc: "Khi bật, lời chúc mới phải được duyệt trong trang admin mới công khai",
              checked: requireWishApproval,
              set: setRequireWishApproval,
            },
          ].map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#DFC5A8]/40 flex items-start justify-between gap-4"
            >
              <div>
                <h4 className="font-sans text-xs font-semibold text-[#2D2A26]">
                  {item.label}
                </h4>
                <p className="text-[11px] font-sans text-gray-500 mt-0.5">
                  {item.desc}
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => item.set(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B88E5B]" />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
