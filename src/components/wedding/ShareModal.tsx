"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, QrCode, Download, Share2 } from "lucide-react";
import QRCode from "qrcode";
import { ThemeConfig } from "@/lib/theme";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  slug: string;
  theme: ThemeConfig;
}

export default function ShareModal({
  isOpen,
  onClose,
  title,
  slug,
  theme,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [shareUrl, setShareUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/thiep-cuoi/${slug}`;
      setShareUrl(url);

      QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: "#2D2A26",
          light: "#FFFFFF",
        },
      })
        .then((dataUrl) => setQrDataUrl(dataUrl))
        .catch((err) => console.error("QR Error:", err));
    }
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
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

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  const handleShareZalo = () => {
    window.open(
      `https://sp.zalo.me/share_inline?link=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  const handleShareMessenger = () => {
    window.open(
      `fb-messenger://share/?link=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-[#DFC5A8]/50 text-center"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#DFC5A8] flex items-center justify-center mx-auto mb-3 text-[#B88E5B]">
            <Share2 className="w-6 h-6" />
          </div>

          <h3 className="font-serif text-xl sm:text-2xl text-[#2D2A26] font-medium mb-1">
            Chia Sẻ Thiệp Cưới
          </h3>
          <p className="text-xs text-[#7A5B33] font-sans mb-6">
            Gửi đường link hoặc mã QR để bạn bè cùng mở thiệp
          </p>

          {/* QR Code Container */}
          {qrDataUrl && (
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#DFC5A8]/40 inline-block mb-5">
              <img
                src={qrDataUrl}
                alt="QR Code Thiệp Cưới"
                className="w-44 h-44 mx-auto rounded-xl shadow-sm"
              />
              <button
                onClick={handleDownloadQr}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-sans text-[#B88E5B] hover:text-[#997343] font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải ảnh mã QR về máy</span>
              </button>
            </div>
          )}

          {/* Copy Link Input Bar */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl border border-[#DFC5A8]/60 bg-[#FAF7F2] mb-6">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-grow bg-transparent px-2 text-xs font-sans text-gray-700 outline-none truncate"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-lg bg-[#B88E5B] hover:bg-[#997343] text-white text-xs font-sans font-medium transition-colors flex items-center gap-1 shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Đã chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép</span>
                </>
              )}
            </button>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-2">
            <span className="text-[11px] font-sans uppercase tracking-wider text-gray-400 block mb-2">
              Chia sẻ nhanh qua mạng xã hội
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleShareFacebook}
                className="py-2.5 px-3 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] text-xs font-sans font-medium transition-colors border border-[#1877F2]/20"
              >
                Facebook
              </button>
              <button
                onClick={handleShareZalo}
                className="py-2.5 px-3 rounded-xl bg-[#0068FF]/10 hover:bg-[#0068FF]/20 text-[#0068FF] text-xs font-sans font-medium transition-colors border border-[#0068FF]/20"
              >
                Zalo
              </button>
              <button
                onClick={handleShareMessenger}
                className="py-2.5 px-3 rounded-xl bg-[#00B2FF]/10 hover:bg-[#00B2FF]/20 text-[#00B2FF] text-xs font-sans font-medium transition-colors border border-[#00B2FF]/20"
              >
                Messenger
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
