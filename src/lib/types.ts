export interface WeddingEvent {
  id: string;
  weddingId: string;
  title: string;
  time: string;
  date: string;
  venueName: string;
  address: string;
  mapUrl: string;
  mapEmbedUrl: string;
  photo?: string;
  order: number;
}

export interface TimelineMilestone {
  id: string;
  weddingId: string;
  date: string;
  title: string;
  description: string;
  photo?: string;
  order: number;
}

export interface GalleryPhoto {
  id: string;
  weddingId: string;
  url: string;
  caption: string;
  featured: boolean;
  order: number;
}

export interface Wish {
  id: string;
  weddingId: string;
  name: string;
  relationship: string;
  message: string;
  emoji: string;
  isApproved: boolean;
  isPinned: boolean;
  likes: number;
  createdAt: string;
}

export interface Rsvp {
  id: string;
  weddingId: string;
  name: string;
  phone: string;
  guestCount: number;
  side: "groom" | "bride" | "both";
  isAttending: boolean;
  notes: string;
  createdAt: string;
}

export interface WeddingData {
  id: string;
  slug: string;
  isPublished: boolean;
  title: string;

  // Groom
  groomName: string;
  groomFullName: string;
  groomTitle: string;
  groomBio: string;
  groomPhoto: string;
  groomFather: string;
  groomMother: string;
  groomAddress: string;
  groomPhone: string;
  groomBankName: string;
  groomBankAccount: string;
  groomBankOwner: string;
  groomBankQr: string;

  // Bride
  brideName: string;
  brideFullName: string;
  brideTitle: string;
  brideBio: string;
  bridePhoto: string;
  brideFather: string;
  brideMother: string;
  brideAddress: string;
  bridePhone: string;
  brideBankName: string;
  brideBankAccount: string;
  brideBankOwner: string;
  brideBankQr: string;

  // Time & Texts
  weddingDate: string | Date;
  weddingLunarDate: string;
  invitationMessage: string;
  thankYouMessage: string;
  coverPhoto: string;
  envelopeTitle: string;
  envelopeSubtitle: string;
  heroSubtitle: string;

  // Theme & Appearance
  themeColor: "champagne" | "rose_gold" | "sage_green" | "burgundy" | "dusty_blue";
  fontStyle: "classic_serif" | "romantic_script" | "modern_sans";
  musicUrl: string;
  musicTitle: string;
  musicAutoPlay: boolean;
  showPetals: boolean;
  showCountdown: boolean;
  showTimeline: boolean;
  showGallery: boolean;
  showEvents: boolean;
  showRsvp: boolean;
  showWishes: boolean;
  showGiftBox: boolean;
  requireWishApproval: boolean;

  // Relations
  events: WeddingEvent[];
  timeline: TimelineMilestone[];
  gallery: GalleryPhoto[];
  wishes: Wish[];
}
