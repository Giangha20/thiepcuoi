import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create Default Admin
  const adminPassword = await bcrypt.hash("admin123456", 10);
  const admin = await prisma.admin.upsert({
    where: { email: "admin@wedding.com" },
    update: {},
    create: {
      email: "admin@wedding.com",
      passwordHash: adminPassword,
      name: "Ban Quản Trị Cưới",
    },
  });
  console.log("Admin created:", admin.email);

  // 2. Create or update Default Wedding
  const wedding = await prisma.wedding.upsert({
    where: { slug: "minh-anh-va-hoang-nam" },
    update: {},
    create: {
      slug: "minh-anh-va-hoang-nam",
      title: "Lễ Thành Hôn - Hoàng Nam & Minh Anh",
      isPublished: true,

      groomName: "Hoàng Nam",
      groomFullName: "Nguyễn Hoàng Nam",
      groomTitle: "Chú Rể",
      groomBio: "Chàng kiến trúc sư yêu thiên nhiên, luôn tin vào duyên phận và nguyện ước xây đắp một mái ấm tràn ngập tiếng cười cùng Minh Anh.",
      groomPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
      groomFather: "Nguyễn Văn Hùng",
      groomMother: "Lê Thị Mai",
      groomAddress: "Số 18 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội",
      groomPhone: "0912 345 678",
      groomBankName: "Vietcombank",
      groomBankAccount: "10123456789",
      groomBankOwner: "NGUYEN HOANG NAM",
      groomBankQr: "https://api.vietqr.io/image/970436-10123456789-f5r3g0r.jpg?accountName=NGUYEN%20HOANG%20NAM&amount=0",

      brideName: "Minh Anh",
      brideFullName: "Trần Lê Minh Anh",
      brideTitle: "Cô Dâu",
      brideBio: "Cô gái thiết kế mộng mơ, thích hoa hồng và những tách trà chiều ấm áp. Tìm thấy ở Hoàng Nam bến đỗ bình yên nhất.",
      bridePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
      brideFather: "Trần Quang Minh",
      brideMother: "Phạm Thị Bích Ngọc",
      brideAddress: "Số 45 Phan Đình Phùng, Ba Đình, Hà Nội",
      bridePhone: "0987 654 321",
      brideBankName: "MB Bank",
      brideBankAccount: "9876543210",
      brideBankOwner: "TRAN LE MINH ANH",
      brideBankQr: "https://api.vietqr.io/image/970422-9876543210-f5r3g0r.jpg?accountName=TRAN%20LE%20MINH%20ANH&amount=0",

      weddingDate: new Date("2026-12-25T11:00:00.000Z"),
      weddingLunarDate: "Ngày 16 tháng 11 năm Bính Ngọ",
      invitationMessage: "Trong muôn vàn cuộc gặp gỡ giữa cuộc đời, chúng mình đã tìm thấy nhau. Trân trọng kính mời bạn và người thương đến nâng ly chúc phúc trong ngày hai đứa chính thức về chung một mái nhà.",
      thankYouMessage: "Sự hiện diện và tình cảm chân thành của mọi người là món quà cưới tuyệt vời nhất đối với chúng mình. Xin gửi lời cảm ơn sâu sắc nhất!",
      coverPhoto: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
      envelopeTitle: "Wedding Invitation",
      envelopeSubtitle: "Hoàng Nam & Minh Anh",
      heroSubtitle: "WE ARE GETTING MARRIED",

      themeColor: "champagne",
      fontStyle: "classic_serif",
      musicUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-113224.mp3",
      musicTitle: "Romantic Wedding Piano - Until I Found You",
      musicAutoPlay: false,
      showPetals: true,
      showCountdown: true,
      showTimeline: true,
      showGallery: true,
      showEvents: true,
      showRsvp: true,
      showWishes: true,
      showGiftBox: true,
      requireWishApproval: false,
    },
  });

  // 3. Events
  const existingEvents = await prisma.event.count({ where: { weddingId: wedding.id } });
  if (existingEvents === 0) {
    await prisma.event.createMany({
      data: [
        {
          weddingId: wedding.id,
          title: "Lễ Vu Quy (Nhà Gái)",
          date: "Thứ Sáu, 25 Tháng 12, 2026",
          time: "08:30 Sáng",
          venueName: "Tư Gia Nhà Gái",
          address: "Số 45 Phan Đình Phùng, Quán Thánh, Ba Đình, Hà Nội",
          mapUrl: "https://maps.google.com/?q=45+Phan+Dinh+Phung+Ba+Dinh+Ha+Noi",
          mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.863855881421!2d105.84117!3d21.03813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135aba6a5b03517%3A0x67db4eb77c570b54!2zNDUgUGhhbiDEkMOsbmggUGjDuW5nLCBRdcOhbiBUaMOhbmgsIEJhIMSQw6xuaCwgSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s",
          photo: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
          order: 1,
        },
        {
          weddingId: wedding.id,
          title: "Lễ Thành Hôn (Nhà Trai)",
          date: "Thứ Sáu, 25 Tháng 12, 2026",
          time: "10:30 Sáng",
          venueName: "Tư Gia Nhà Trai",
          address: "Số 18 Lý Thường Kiệt, Phan Chu Trinh, Hoàn Kiếm, Hà Nội",
          mapUrl: "https://maps.google.com/?q=18+Ly+Thuong+Kiet+Hoan+Kiem+Ha+Noi",
          mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.321855881421!2d105.85417!3d21.02313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abec6a5b0351%3A0x67db4eb77c570b54!2zMTggTMO9IFRoxrDhu51uZyBLaeG7h3QsIEhvw6BuIEtp4bq_bSwgSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s",
          photo: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop",
          order: 2,
        },
        {
          weddingId: wedding.id,
          title: "Tiệc Cưới Mừng Hạnh Phúc",
          date: "Thứ Sáu, 25 Tháng 12, 2026",
          time: "11:30 Trưa",
          venueName: "Trung Tâm Hội Nghị & Tiệc Cưới Trống Đồng Palace",
          address: "Số 65 Quán Sứ, Trần Hưng Đạo, Hoàn Kiếm, Hà Nội",
          mapUrl: "https://maps.google.com/?q=65+Quan+Su+Hoan+Kiem+Ha+Noi",
          mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.238855881421!2d105.84517!3d21.02613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab956a5b0351%3A0x67db4eb77c570b54!2zNjUgUXXDoW4gU-G7qSwgSG_DoG4gS2nhur9tLCBIw6AgTuG7mWk!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s",
          photo: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
          order: 3,
        },
      ],
    });
  }

  // 4. Timeline Milestones
  const existingTimeline = await prisma.timelineMilestone.count({ where: { weddingId: wedding.id } });
  if (existingTimeline === 0) {
    await prisma.timelineMilestone.createMany({
      data: [
        {
          weddingId: wedding.id,
          date: "15 Tháng 10, 2021",
          title: "Khoảnh Khắc Đầu Tiên Gặp Gỡ",
          description: "Một chiều thu Hà Nội lộng gió, hai tâm hồn tình cờ ngồi chung một chiếc bàn dài tại góc quán quen cạnh Hồ Tây.",
          photo: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop",
          order: 1,
        },
        {
          weddingId: wedding.id,
          date: "14 Tháng 02, 2022",
          title: "Lời Tỏ Tình Ngọt Ngào",
          description: "Dưới ánh đèn lung linh tại Đà Lạt ngập tràn hoa dã quỳ, chiếc lắc tay bạc cùng lời thì thầm: 'Hãy để anh chăm sóc em nhé!'",
          photo: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
          order: 2,
        },
        {
          weddingId: wedding.id,
          date: "20 Tháng 10, 2024",
          title: "Khoảnh Khắc Cầu Hôn - 'SHE SAID YES!'",
          description: "Giữa hoàng hôn rực rỡ bên bờ biển Phú Quốc, anh quỳ xuống trao chiếc nhẫn ước hẹn và nhận được cái gật đầu đẫm nước mắt hạnh phúc.",
          photo: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop",
          order: 3,
        },
        {
          weddingId: wedding.id,
          date: "25 Tháng 12, 2026",
          title: "Ngày Chung Đôi - Trọn Đời Bên Nhau",
          description: "Chúng mình chính thức nắm tay nhau bước vào lễ đường, cùng lời hứa trọn đời yêu thương và sẻ chia mọi buồn vui cuộc sống.",
          photo: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop",
          order: 4,
        },
      ],
    });
  }

  // 5. Gallery Photos
  const existingGallery = await prisma.galleryPhoto.count({ where: { weddingId: wedding.id } });
  if (existingGallery === 0) {
    await prisma.galleryPhoto.createMany({
      data: [
        {
          weddingId: wedding.id,
          url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
          caption: "Khoảnh khắc tuyệt đẹp ngày chung đôi",
          featured: true,
          order: 1,
        },
        {
          weddingId: wedding.id,
          url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop",
          caption: "Nụ cười rạng rỡ của cô dâu Minh Anh",
          featured: true,
          order: 2,
        },
        {
          weddingId: wedding.id,
          url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop",
          caption: "Ánh nhìn đong đầy yêu thương",
          featured: false,
          order: 3,
        },
        {
          weddingId: wedding.id,
          url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop",
          caption: "Cùng nhau bước đi trên con đường hạnh phúc",
          featured: false,
          order: 4,
        },
        {
          weddingId: wedding.id,
          url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200&auto=format&fit=crop",
          caption: "Nhẫn cưới - Tín vật của tình yêu vĩnh cửu",
          featured: false,
          order: 5,
        },
        {
          weddingId: wedding.id,
          url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop",
          caption: "Bình yên bên cạnh người mình thương",
          featured: false,
          order: 6,
        },
        {
          weddingId: wedding.id,
          url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop",
          caption: "Hòa nhịp đập con tim",
          featured: false,
          order: 7,
        },
        {
          weddingId: wedding.id,
          url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1200&auto=format&fit=crop",
          caption: "Trao nhau lời hứa trọn đời",
          featured: false,
          order: 8,
        },
      ],
    });
  }

  // 6. Wishes
  const existingWishes = await prisma.wish.count({ where: { weddingId: wedding.id } });
  if (existingWishes === 0) {
    await prisma.wish.createMany({
      data: [
        {
          weddingId: wedding.id,
          name: "Thùy Linh & Gia Bảo",
          relationship: "Bạn thời đại học",
          message: "Chúc hai bạn trăm năm hạnh phúc, răng long đầu bạc! Chúc gia đình nhỏ luôn ngập tràn tiếng cười và tình yêu thương vô bờ bến. Mãi mãi ngọt ngào như ngày đầu nhé! 🎉💐",
          emoji: "❤️",
          isApproved: true,
          isPinned: true,
          likes: 24,
        },
        {
          weddingId: wedding.id,
          name: "Anh Đức & Nhóm Kiến Trúc",
          relationship: "Đồng nghiệp chú rể",
          message: "Chúc mừng chú rể Nam đã rước được nàng về dinh! Chúc hai vợ chồng luôn đồng hành, thấu hiểu và cùng nhau tạo nên những công trình hạnh phúc rực rỡ nhất! 🥂✨",
          emoji: "🥂",
          isApproved: true,
          isPinned: true,
          likes: 18,
        },
        {
          weddingId: wedding.id,
          name: "Gia đình Bác Tuấn",
          relationship: "Người thân nhà gái",
          message: "Chúc hai cháu vạn sự như ý, sớm sinh quý tử, gia đình êm ấm thuận hòa. Bác rất tự hào về Minh Anh và Hoàng Nam!",
          emoji: "💐",
          isApproved: true,
          isPinned: false,
          likes: 12,
        },
        {
          weddingId: wedding.id,
          name: "Quỳnh Nga",
          relationship: "Bạn thân cô dâu",
          message: "Người bạn thân nhất của tôi hôm nay là cô dâu lộng lẫy nhất! Chúc Hoàng Nam luôn yêu thương, cưng chiều Minh Anh nhé. Yêu hai bạn rất nhiều! 💍🥰",
          emoji: "💍",
          isApproved: true,
          isPinned: false,
          likes: 31,
        },
      ],
    });
  }

  // 7. RSVPs
  const existingRsvps = await prisma.rsvp.count({ where: { weddingId: wedding.id } });
  if (existingRsvps === 0) {
    await prisma.rsvp.createMany({
      data: [
        {
          weddingId: wedding.id,
          name: "Nguyễn Văn Tuấn",
          phone: "0901234567",
          guestCount: 2,
          side: "groom",
          isAttending: true,
          notes: "Gia đình Tuấn chắc chắn sẽ đến chung vui cùng Nam và Minh Anh!",
        },
        {
          weddingId: wedding.id,
          name: "Lê Thị Thu Trang",
          phone: "0988776655",
          guestCount: 1,
          side: "bride",
          isAttending: true,
          notes: "Mình ăn chay nhé cô dâu ơi ❤️ Hẹn gặp ngày vui!",
        },
        {
          weddingId: wedding.id,
          name: "Trần Bảo Long",
          phone: "0912998877",
          guestCount: 2,
          side: "both",
          isAttending: true,
          notes: "Chúc hai bạn trăm năm hạnh phúc!",
        },
        {
          weddingId: wedding.id,
          name: "Phạm Hải Đăng",
          phone: "0934112233",
          guestCount: 1,
          side: "groom",
          isAttending: false,
          notes: "Tiếc quá đúng đợt công tác xa không về kịp, chúc hai bạn trăm năm hạnh phúc nhé!",
        },
      ],
    });
  }

  // 8. Sample Page Views for Analytics
  const existingViews = await prisma.pageView.count({ where: { weddingId: wedding.id } });
  if (existingViews === 0) {
    await prisma.pageView.createMany({
      data: [
        { weddingId: wedding.id, device: "mobile", userAgent: "iPhone iOS 17.4", referrer: "facebook.com" },
        { weddingId: wedding.id, device: "mobile", userAgent: "Samsung Android 14", referrer: "zalo.me" },
        { weddingId: wedding.id, device: "desktop", userAgent: "Windows 11 Chrome", referrer: "direct" },
        { weddingId: wedding.id, device: "mobile", userAgent: "iPhone iOS 18", referrer: "zalo.me" },
        { weddingId: wedding.id, device: "desktop", userAgent: "MacOS Safari", referrer: "direct" },
        { weddingId: wedding.id, device: "mobile", userAgent: "Xiaomi Android", referrer: "messenger.com" },
      ],
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
