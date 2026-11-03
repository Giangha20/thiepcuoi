"use client";

import React, { useState, useEffect } from "react";
import { Link2, Copy, Check, Download, Lock, CheckCircle2, QrCode } from "lucide-react";
import QRCode from "qrcode";

interface LinkSettingsProps {
  wedding: any;
  onSave: (data: any) => Promise<void>;
}

export default function LinkSettings({ wedding, onSave }: LinkSettingsProps) {
  const [slug, setSlug] = useState(wedding.slug || "minh-anh-va-hoang-nam");
  const [isPublished, setIsPublished] = useState(Boolean(wedding.isPublished));
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [savingLink, setSavingLink] = useState(false);
  const [linkSaved, setLinkSaved] = useState(false);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPass, setChangingPass] = useState(false);
  const [passMessage, setPassMessage] = useState<{ text: string; error: boolean } | null>(null);

  const fullUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/thiep-cuoi/${slug}`
      : `/thiep-cuoi/${slug}`;

  useEffect(() => {
    if (typeof window !== "undefined") {
      QRCode.toDataURL(fullUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: "#2D2A26",
          light: "#FFFFFF",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("QR error:", err));
    }
  }, [fullUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `QR_Thiep_Cuoi_${slug}.png`;
    a.click();
  };

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLink(true);
    try {
      await onSave({ ...wedding, slug, isPublished });
      setLinkSaved(true);
      setTimeout(() => setLinkSaved(false), 3000);
    } catch (err: any) {
      alert("Lỗi lưu đường dẫn: " + err.message);
    } finally {
      setSavingLink(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPassMessage({ text: "Mật khẩu xác nhận không khớp", error: true });
      return;
    }

    setChangingPass(true);
    setPassMessage(null);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi đổi mật khẩu");

      setPassMessage({ text: "Đổi mật khẩu thành công!", error: false });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPassMessage({ text: err.message, error: true });
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h2 className="font-serif text-2xl font-medium text-[#2D2A26]">
          Đường Link Thiệp Cưới &amp; Bảo Mật
        </h2>
        <p className="text-xs font-sans text-gray-500 mt-0.5">
          Tùy chỉnh đường dẫn riêng (slug), tạo mã QR chia sẻ và đổi mật khẩu quản trị
        </p>
      </div>

      {/* Link and QR Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#DFC5A8]/50 space-y-6">
        <h3 className="font-serif text-lg font-medium text-[#2D2A26] flex items-center gap-2">
          <Link2 className="w-5 h-5 text-[#B88E5B]" />
          <span>Đường Link Thiệp Cưới Riêng</span>
        </h3>

        <form onSubmit={handleSaveLink} className="space-y-4">
          <div>
            <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
              Đường dẫn tĩnh (Slug)
            </label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-2 bg-gray-100 rounded-xl text-xs font-mono text-gray-500 border border-gray-200">
                /thiep-cuoi/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) =>
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                }
                placeholder="minh-anh-va-hoang-nam"
                className="flex-grow px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono focus:outline-none focus:border-[#B88E5B]"
              />
            </div>
            <p className="text-[11px] font-sans text-gray-400 mt-1">
              Chỉ sử dụng chữ cái thường, số và dấu gạch ngang (-)
            </p>
          </div>

          {/* Copy link preview */}
          <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#DFC5A8]/40 flex items-center justify-between gap-3">
            <span className="text-xs font-mono text-gray-700 truncate">
              {fullUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#DFC5A8]/50 text-xs font-sans text-[#7A5B33] hover:bg-gray-50 transition-colors shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-700">Đã chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#B88E5B]" />
                  <span>Sao chép link</span>
                </>
              )}
            </button>
          </div>

          {/* Public Access Toggle */}
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div>
              <h4 className="text-xs font-sans font-medium text-gray-800">
                Trạng thái xuất bản công khai
              </h4>
              <p className="text-[11px] text-gray-500">
                Cho phép khách mời truy cập link xem thiệp mà không cần đăng nhập
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B88E5B]" />
            </label>
          </div>

          <button
            type="submit"
            disabled={savingLink}
            className="px-5 py-2 rounded-xl bg-[#B88E5B] hover:bg-[#997343] text-white text-xs font-sans font-medium transition-all shadow-sm"
          >
            {savingLink ? "Đang lưu..." : linkSaved ? "Đã lưu!" : "Cập nhật đường link"}
          </button>
        </form>

        {/* QR Code Container */}
        {qrDataUrl && (
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-6">
            <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-sm shrink-0">
              <img
                src={qrDataUrl}
                alt="QR Link Thiệp"
                className="w-36 h-36 object-contain"
              />
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <h4 className="font-serif text-base font-medium text-[#2D2A26]">
                Mã QR Thiệp Cưới
              </h4>
              <p className="text-xs font-sans text-gray-500 max-w-sm">
                Bạn có thể tải ảnh mã QR này về để in lên thiệp giấy, standee hoặc chia sẻ trong tin nhắn.
              </p>
              <button
                type="button"
                onClick={handleDownloadQr}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#7A5B33] text-xs font-sans font-medium border border-[#DFC5A8]/50 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-[#B88E5B]" />
                <span>Tải ảnh QR (PNG độ nét cao)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#DFC5A8]/50 space-y-4">
        <h3 className="font-serif text-lg font-medium text-[#2D2A26] flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#B88E5B]" />
          <span>Đổi Mật Khẩu Quản Trị</span>
        </h3>

        {passMessage && (
          <div
            className={`p-3 rounded-xl text-xs font-sans ${
              passMessage.error
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {passMessage.text}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
          <div>
            <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
              Mật khẩu mới (tối thiểu 6 ký tự)
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={changingPass}
            className="px-5 py-2 rounded-xl bg-gray-800 hover:bg-black text-white text-xs font-sans font-medium transition-all shadow-sm"
          >
            {changingPass ? "Đang đổi mật khẩu..." : "Cập nhật mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
}
