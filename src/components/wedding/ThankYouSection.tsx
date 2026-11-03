"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Share2 } from "lucide-react";
import { ThemeConfig } from "@/lib/theme";

interface ThankYouSectionProps {
  groomName: string;
  brideName: string;
  thankYouMessage?: string;
  coverPhoto?: string;
  theme: ThemeConfig;
  onOpenShare: () => void;
}

export default function ThankYouSection({
  groomName,
  brideName,
  thankYouMessage,
  coverPhoto,
  theme,
  onOpenShare,
}: ThankYouSectionProps) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-[#FAF7F2] to-[#F5EFE6] border-t border-[#DFC5A8]/40 relative overflow-hidden">
      {/* Decorative background sparkles */}
      <div className="absolute top-10 left-1/4 w-32 h-32 rounded-full bg-[#B88E5B]/5 blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-32 h-32 rounded-full bg-[#D4AF37]/5 blur-2xl pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="w-14 h-14 rounded-full bg-white border border-[#DFC5A8] flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Heart className="w-6 h-6 text-[#C67667] fill-[#C67667] animate-pulse" />
        </div>

        <span className="text-xs font-sans tracking-[0.3em] uppercase text-[#B88E5B] font-semibold">
          Lời Cảm Ơn
        </span>

        <h2 className="font-serif text-3xl sm:text-5xl text-[#2D2A26] mt-2 mb-6 font-normal">
          Thank You!
        </h2>

        <p className="font-serif italic text-base sm:text-lg text-[#5D4426]/90 leading-relaxed max-w-xl mx-auto mb-10">
          &ldquo;
          {thankYouMessage ||
            "Sự hiện diện và những lời chúc phúc ngọt ngào của bạn là món quà ý nghĩa nhất dành cho chúng tôi trên hành trình xây đắp tổ ấm mới. Xin chân thành cảm ơn!"}
          &rdquo;
        </p>

        {/* Couple Signatures */}
        <div className="py-4">
          <p className="font-script text-4xl sm:text-5xl text-[#B88E5B]">
            {groomName} &amp; {brideName}
          </p>
          <p className="font-serif text-xs text-[#7A5B33] tracking-widest uppercase mt-2">
            Trân Trọng &amp; Yêu Thương
          </p>
        </div>

        {/* Share Button CTA */}
        <div className="pt-8">
          <button
            onClick={onOpenShare}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white hover:bg-[#FAF7F2] text-[#7A5B33] text-xs font-sans font-medium transition-all shadow-sm border border-[#DFC5A8]/60 hover:scale-105 active:scale-95"
          >
            <Share2 className="w-4 h-4 text-[#B88E5B]" />
            <span>Chia sẻ thiệp cưới cho bạn bè</span>
          </button>
        </div>
      </div>
    </section>
  );
}
