"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { GalleryPhoto } from "@/lib/types";
import { ThemeConfig } from "@/lib/theme";

interface GallerySectionProps {
  gallery: GalleryPhoto[];
  theme: ThemeConfig;
}

export default function GallerySection({ gallery, theme }: GallerySectionProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === "Escape") setActivePhotoIndex(null);
      if (e.key === "ArrowLeft") {
        setActivePhotoIndex((prev) => (prev! > 0 ? prev! - 1 : gallery.length - 1));
      }
      if (e.key === "ArrowRight") {
        setActivePhotoIndex((prev) => (prev! < gallery.length - 1 ? prev! + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIndex, gallery.length]);

  if (!gallery || gallery.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-sans tracking-[0.3em] uppercase text-[#B88E5B] font-semibold">
          Kỷ Niệm Ngọt Ngào
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#2D2A26] mt-2 mb-4 font-normal">
          Album Ảnh Cưới
        </h2>
        <div className="flex items-center justify-center gap-3">
          <span className="w-12 h-px bg-[#DFC5A8]" />
          <ImageIcon className="w-4 h-4 text-[#B88E5B]" />
          <span className="w-12 h-px bg-[#DFC5A8]" />
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {gallery.map((photo, idx) => (
          <motion.div
            key={photo.id || idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            onClick={() => setActivePhotoIndex(idx)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#F5EFE6] shadow-sm hover:shadow-xl transition-all duration-300 aspect-[3/4]"
          >
            <img
              src={photo.url}
              alt={photo.caption || `Ảnh cưới ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
            />
            {/* Subtle overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
              <Maximize2 className="w-5 h-5 mb-auto ml-auto text-white/80" />
              {photo.caption && (
                <p className="font-serif text-xs sm:text-sm line-clamp-2 drop-shadow-sm">
                  {photo.caption}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setActivePhotoIndex(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIndex((prev) =>
                  prev! > 0 ? prev! - 1 : gallery.length - 1
                );
              }}
              className="absolute left-3 sm:left-6 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIndex((prev) =>
                  prev! < gallery.length - 1 ? prev! + 1 : 0
                );
              }}
              className="absolute right-3 sm:right-6 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Lightbox Image Container */}
            <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
              <motion.img
                key={activePhotoIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                src={gallery[activePhotoIndex].url}
                alt={gallery[activePhotoIndex].caption || "Ảnh cưới phóng to"}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
              />

              {/* Caption & Counter */}
              <div className="text-center mt-3 text-white">
                {gallery[activePhotoIndex].caption && (
                  <p className="font-serif text-sm sm:text-base text-amber-100">
                    {gallery[activePhotoIndex].caption}
                  </p>
                )}
                <span className="text-xs text-white/60 font-sans tracking-widest mt-1 inline-block">
                  {activePhotoIndex + 1} / {gallery.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
