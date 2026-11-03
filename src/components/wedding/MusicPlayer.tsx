"use client";

import React, { useEffect, useRef, useState } from "react";
import { Music, Volume2, VolumeX, Disc } from "lucide-react";
import { ThemeConfig } from "@/lib/theme";

interface MusicPlayerProps {
  musicUrl: string;
  musicTitle?: string;
  autoPlay?: boolean;
  theme: ThemeConfig;
  forcePlay?: boolean;
}

export default function MusicPlayer({
  musicUrl,
  musicTitle = "Giai điệu tình yêu",
  autoPlay = false,
  theme,
  forcePlay = false,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (forcePlay && audioRef.current && !isPlaying) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio play prevented:", err));
    }
  }, [forcePlay]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio play error:", err));
    }
    setHasInteracted(true);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 group">
        {/* Track Title Tooltip */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-[#DFC5A8]/50 text-xs font-serif text-[#7A5B33] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <Music className="w-3.5 h-3.5 text-[#B88E5B]" />
          <span className="truncate max-w-[150px]">{musicTitle}</span>
        </div>

        {/* Music Button */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Tạm dừng nhạc" : "Bật nhạc"}
          className="relative w-12 h-12 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-md shadow-lg border-2 transition-all duration-300 hover:scale-108 active:scale-95"
          style={{
            borderColor: theme.primary,
            boxShadow: isPlaying
              ? "0 4px 18px rgba(184, 142, 91, 0.4)"
              : "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {isPlaying ? (
            <div className="relative flex items-center justify-center">
              <Disc className="w-7 h-7 text-[#B88E5B] animate-spin" style={{ animationDuration: "5s" }} />
              <span className="absolute w-2 h-2 rounded-full bg-[#B88E5B]" />
            </div>
          ) : (
            <VolumeX className="w-5 h-5 text-gray-500" />
          )}

          {/* Pulse ring when playing */}
          {isPlaying && (
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-30 pointer-events-none"
              style={{ backgroundColor: theme.primary }}
            />
          )}
        </button>
      </div>
    </>
  );
}
