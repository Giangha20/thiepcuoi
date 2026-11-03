"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Phone, Sparkles } from "lucide-react";
import { ThemeConfig } from "@/lib/theme";

interface CoupleSectionProps {
  groomName: string;
  groomFullName: string;
  groomTitle?: string;
  groomBio?: string;
  groomPhoto: string;
  groomFather?: string;
  groomMother?: string;
  groomPhone?: string;

  brideName: string;
  brideFullName: string;
  brideTitle?: string;
  brideBio?: string;
  bridePhoto: string;
  brideFather?: string;
  brideMother?: string;
  bridePhone?: string;

  invitationMessage?: string;
  theme: ThemeConfig;
}

export default function CoupleSection({
  groomName,
  groomFullName,
  groomTitle = "Chú Rể",
  groomBio,
  groomPhoto,
  groomFather,
  groomMother,
  groomPhone,

  brideName,
  brideFullName,
  brideTitle = "Cô Dâu",
  brideBio,
  bridePhoto,
  brideFather,
  brideMother,
  bridePhone,

  invitationMessage,
  theme,
}: CoupleSectionProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-sans tracking-[0.3em] uppercase text-[#B88E5B] font-semibold">
          Cô Dâu & Chú Rể
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#2D2A26] mt-2 mb-4 font-normal">
          Hành Trình Tình Yêu
        </h2>
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="w-12 h-px bg-[#DFC5A8]" />
          <Heart className="w-4 h-4 text-[#C67667] fill-[#C67667]" />
          <span className="w-12 h-px bg-[#DFC5A8]" />
        </div>
        {invitationMessage && (
          <p className="font-serif italic text-base sm:text-lg text-[#5D4426]/90 leading-relaxed max-w-xl mx-auto">
            &ldquo;{invitationMessage}&rdquo;
          </p>
        )}
      </div>

      {/* Couple Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-stretch">
        {/* Groom Card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-wedding-card border border-[#DFC5A8]/40 flex flex-col items-center text-center relative overflow-hidden"
        >
          {/* Subtle gold badge */}
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#F5EFE6] text-[#7A5B33] text-xs font-sans font-medium">
            {groomTitle}
          </div>

          {/* Groom Portrait */}
          <div className="relative mb-6">
            <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden p-1.5 border-2 border-[#DFC5A8] shadow-md">
              <img
                src={groomPhoto}
                alt={groomFullName}
                className="w-full h-full object-cover rounded-full transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-2 right-4 w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#DFC5A8] flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-[#B88E5B]" />
            </div>
          </div>

          {/* Groom Names */}
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#2D2A26] mb-1">
            {groomFullName}
          </h3>
          <p className="font-script text-3xl sm:text-4xl text-[#B88E5B] mb-3">
            {groomName}
          </p>

          {/* Parents Info */}
          {(groomFather || groomMother) && (
            <div className="text-xs font-serif text-[#7A5B33] bg-[#FAF7F2] rounded-xl px-4 py-2.5 mb-4 w-full border border-[#DFC5A8]/30">
              <p className="font-semibold uppercase tracking-wider text-[11px] mb-1">
                Gia đình Nhà Trai
              </p>
              {groomFather && <p>Thân phụ: {groomFather}</p>}
              {groomMother && <p>Thân mẫu: {groomMother}</p>}
            </div>
          )}

          {/* Bio */}
          {groomBio && (
            <p className="text-sm font-sans text-[#5D4426]/80 leading-relaxed mb-4 flex-grow">
              {groomBio}
            </p>
          )}

          {/* Phone */}
          {groomPhone && (
            <a
              href={`tel:${groomPhone}`}
              className="inline-flex items-center gap-2 text-xs font-sans text-[#B88E5B] hover:text-[#997343] transition-colors mt-auto pt-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Liên hệ chú rể: {groomPhone}</span>
            </a>
          )}
        </motion.div>

        {/* Bride Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-wedding-card border border-[#DFC5A8]/40 flex flex-col items-center text-center relative overflow-hidden"
        >
          {/* Subtle gold badge */}
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#F5EFE6] text-[#7A5B33] text-xs font-sans font-medium">
            {brideTitle}
          </div>

          {/* Bride Portrait */}
          <div className="relative mb-6">
            <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden p-1.5 border-2 border-[#DFC5A8] shadow-md">
              <img
                src={bridePhoto}
                alt={brideFullName}
                className="w-full h-full object-cover rounded-full transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-2 right-4 w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#DFC5A8] flex items-center justify-center shadow-sm">
              <Heart className="w-4 h-4 text-[#C67667] fill-[#C67667]" />
            </div>
          </div>

          {/* Bride Names */}
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#2D2A26] mb-1">
            {brideFullName}
          </h3>
          <p className="font-script text-3xl sm:text-4xl text-[#B88E5B] mb-3">
            {brideName}
          </p>

          {/* Parents Info */}
          {(brideFather || brideMother) && (
            <div className="text-xs font-serif text-[#7A5B33] bg-[#FAF7F2] rounded-xl px-4 py-2.5 mb-4 w-full border border-[#DFC5A8]/30">
              <p className="font-semibold uppercase tracking-wider text-[11px] mb-1">
                Gia đình Nhà Gái
              </p>
              {brideFather && <p>Thân phụ: {brideFather}</p>}
              {brideMother && <p>Thân mẫu: {brideMother}</p>}
            </div>
          )}

          {/* Bio */}
          {brideBio && (
            <p className="text-sm font-sans text-[#5D4426]/80 leading-relaxed mb-4 flex-grow">
              {brideBio}
            </p>
          )}

          {/* Phone */}
          {bridePhone && (
            <a
              href={`tel:${bridePhone}`}
              className="inline-flex items-center gap-2 text-xs font-sans text-[#B88E5B] hover:text-[#997343] transition-colors mt-auto pt-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Liên hệ cô dâu: {bridePhone}</span>
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
