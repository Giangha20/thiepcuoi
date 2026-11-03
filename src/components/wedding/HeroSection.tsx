"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Heart, ChevronDown, Share2, MessageCircleHeart } from "lucide-react";
import { ThemeConfig } from "@/lib/theme";

interface HeroSectionProps {
  groomName: string;
  brideName: string;
  weddingDate: string | Date;
  weddingLunarDate?: string;
  heroSubtitle?: string;
  coverPhoto: string;
  theme: ThemeConfig;
  onOpenShare: () => void;
  onScrollToWishes: () => void;
  onScrollToRsvp: () => void;
}

export default function HeroSection({
  groomName,
  brideName,
  weddingDate,
  weddingLunarDate,
  heroSubtitle = "SAVE OUR DATE",
  coverPhoto,
  theme,
  onOpenShare,
  onScrollToWishes,
  onScrollToRsvp,
}: HeroSectionProps) {
  const dateObj = new Date(weddingDate);
  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear();

  const formattedDate = dateObj.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center text-center px-4 overflow-hidden">
      {/* Background Hero Image with Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={coverPhoto}
          alt="Wedding Couple"
          className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.05]"
        />
        {/* Soft Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-[#FAF7F2]" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-black/60 pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-3xl mx-auto py-16 sm:py-24 text-white">
        {/* Save The Date Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-amber-200 text-xs sm:text-sm font-sans tracking-[0.3em] uppercase mb-6 shadow-sm"
        >
          <Calendar className="w-3.5 h-3.5 text-amber-300" />
          <span>{heroSubtitle}</span>
          <Calendar className="w-3.5 h-3.5 text-amber-300" />
        </motion.div>

        {/* Couple Calligraphy Names */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="space-y-1 sm:space-y-2 mb-6"
        >
          <h1 className="font-script text-5xl sm:text-7xl md:text-8xl text-white drop-shadow-md tracking-wide">
            {groomName}
          </h1>
          <div className="flex items-center justify-center gap-4 py-1">
            <span className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-amber-200 to-white" />
            <Heart className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
            <span className="w-16 sm:w-24 h-px bg-gradient-to-l from-transparent via-amber-200 to-white" />
          </div>
          <h1 className="font-script text-5xl sm:text-7xl md:text-8xl text-white drop-shadow-md tracking-wide">
            {brideName}
          </h1>
        </motion.div>

        {/* Date Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-lg sm:text-2xl text-amber-100/90 font-light tracking-wider space-y-1 mb-8"
        >
          <p className="font-normal text-white">{formattedDate}</p>
          <p className="text-sm sm:text-base text-amber-200/80 tracking-widest font-sans">
            {day} . {month} . {year}
          </p>
          {weddingLunarDate && (
            <p className="text-xs sm:text-sm italic text-amber-200/70 font-sans">
              ({weddingLunarDate})
            </p>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-2"
        >
          <button
            onClick={onScrollToRsvp}
            className="px-6 sm:px-8 py-3 rounded-full text-white font-serif text-sm tracking-wider uppercase transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #B88E5B 0%, #D4AF37 50%, #997343 100%)",
              boxShadow: "0 4px 20px rgba(184, 142, 91, 0.4)",
            }}
          >
            Xác nhận tham dự (RSVP)
          </button>

          <button
            onClick={onScrollToWishes}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white font-serif text-sm tracking-wider uppercase transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
          >
            <MessageCircleHeart className="w-4 h-4 text-amber-300" />
            <span>Gửi lời chúc</span>
          </button>

          <button
            onClick={onOpenShare}
            aria-label="Chia sẻ thiệp cưới"
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white transition-all duration-300 hover:scale-110 active:scale-95 shadow-md"
          >
            <Share2 className="w-4 h-4 text-white" />
          </button>
        </motion.div>
      </div>

      {/* Gentle Floating Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/70 flex flex-col items-center gap-1 cursor-pointer pointer-events-none"
      >
        <span className="text-[10px] tracking-widest uppercase font-sans">Khám phá thiệp</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
}
