"use client";

import React, { useState } from "react";
import { WeddingData } from "@/lib/types";
import { getTheme } from "@/lib/theme";
import EnvelopeModal from "./EnvelopeModal";
import MusicPlayer from "./MusicPlayer";
import FallingPetals from "./FallingPetals";
import HeroSection from "./HeroSection";
import CoupleSection from "./CoupleSection";
import CountdownSection from "./CountdownSection";
import EventsSection from "./EventsSection";
import TimelineSection from "./TimelineSection";
import GallerySection from "./GallerySection";
import RsvpSection from "./RsvpSection";
import WishesSection from "./WishesSection";
import GiftBoxSection from "./GiftBoxSection";
import ThankYouSection from "./ThankYouSection";
import ShareModal from "./ShareModal";

interface WeddingInvitationPageProps {
  wedding: WeddingData;
}

export default function WeddingInvitationPage({ wedding }: WeddingInvitationPageProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [playMusicTrigger, setPlayMusicTrigger] = useState(false);
  const theme = getTheme(wedding.themeColor);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main
      className="min-h-screen text-[#2D2A26] relative selection:bg-[#DFC5A8]/50 selection:text-[#5D4426]"
      style={{ backgroundColor: theme.bgLight }}
    >
      {/* 1. Envelope opening animation modal */}
      <EnvelopeModal
        groomName={wedding.groomName}
        brideName={wedding.brideName}
        weddingDate={wedding.weddingDate}
        weddingLunarDate={wedding.weddingLunarDate}
        envelopeTitle={wedding.envelopeTitle}
        envelopeSubtitle={wedding.envelopeSubtitle}
        theme={theme}
        onOpen={() => setPlayMusicTrigger(true)}
      />

      {/* 2. Falling romantic petals effect */}
      {wedding.showPetals && <FallingPetals enabled={wedding.showPetals} />}

      {/* 3. Floating background music player */}
      {wedding.musicUrl && (
        <MusicPlayer
          musicUrl={wedding.musicUrl}
          musicTitle={wedding.musicTitle}
          autoPlay={wedding.musicAutoPlay}
          theme={theme}
          forcePlay={playMusicTrigger}
        />
      )}

      {/* 4. Hero Section */}
      <HeroSection
        groomName={wedding.groomName}
        brideName={wedding.brideName}
        weddingDate={wedding.weddingDate}
        weddingLunarDate={wedding.weddingLunarDate}
        heroSubtitle={wedding.heroSubtitle}
        coverPhoto={wedding.coverPhoto}
        theme={theme}
        onOpenShare={() => setIsShareModalOpen(true)}
        onScrollToWishes={() => scrollToSection("wishes-section")}
        onScrollToRsvp={() => scrollToSection("rsvp-section")}
      />

      {/* 5. Couple Introduction */}
      <CoupleSection
        groomName={wedding.groomName}
        groomFullName={wedding.groomFullName}
        groomTitle={wedding.groomTitle}
        groomBio={wedding.groomBio}
        groomPhoto={wedding.groomPhoto}
        groomFather={wedding.groomFather}
        groomMother={wedding.groomMother}
        groomPhone={wedding.groomPhone}
        brideName={wedding.brideName}
        brideFullName={wedding.brideFullName}
        brideTitle={wedding.brideTitle}
        brideBio={wedding.brideBio}
        bridePhoto={wedding.bridePhoto}
        brideFather={wedding.brideFather}
        brideMother={wedding.brideMother}
        bridePhone={wedding.bridePhone}
        invitationMessage={wedding.invitationMessage}
        theme={theme}
      />

      {/* 6. Live Countdown Timer */}
      {wedding.showCountdown && (
        <CountdownSection
          weddingDate={wedding.weddingDate}
          theme={theme}
        />
      )}

      {/* 7. Wedding Events & Venues */}
      {wedding.showEvents && wedding.events && wedding.events.length > 0 && (
        <EventsSection
          events={wedding.events}
          theme={theme}
        />
      )}

      {/* 8. Love Story Timeline */}
      {wedding.showTimeline && wedding.timeline && wedding.timeline.length > 0 && (
        <TimelineSection
          timeline={wedding.timeline}
          theme={theme}
        />
      )}

      {/* 9. Photo Gallery */}
      {wedding.showGallery && wedding.gallery && wedding.gallery.length > 0 && (
        <GallerySection
          gallery={wedding.gallery}
          theme={theme}
        />
      )}

      {/* 10. RSVP Attendance Confirmation */}
      {wedding.showRsvp && (
        <RsvpSection
          weddingId={wedding.id}
          theme={theme}
        />
      )}

      {/* 11. Guestbook & Warm Wishes */}
      {wedding.showWishes && (
        <WishesSection
          weddingId={wedding.id}
          initialWishes={wedding.wishes || []}
          requireWishApproval={wedding.requireWishApproval}
          theme={theme}
        />
      )}

      {/* 12. Gift Box / Lì Xì Mừng Cưới */}
      {wedding.showGiftBox && (
        <GiftBoxSection
          groomName={wedding.groomName}
          groomBankName={wedding.groomBankName}
          groomBankAccount={wedding.groomBankAccount}
          groomBankOwner={wedding.groomBankOwner}
          groomBankQr={wedding.groomBankQr}
          brideName={wedding.brideName}
          brideBankName={wedding.brideBankName}
          brideBankAccount={wedding.brideBankAccount}
          brideBankOwner={wedding.brideBankOwner}
          brideBankQr={wedding.brideBankQr}
          theme={theme}
        />
      )}

      {/* 13. Heartfelt Thank You & Couple Signatures */}
      <ThankYouSection
        groomName={wedding.groomName}
        brideName={wedding.brideName}
        thankYouMessage={wedding.thankYouMessage}
        coverPhoto={wedding.coverPhoto}
        theme={theme}
        onOpenShare={() => setIsShareModalOpen(true)}
      />

      {/* 14. QR Code & Social Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={wedding.title}
        slug={wedding.slug}
        theme={theme}
      />
    </main>
  );
}
