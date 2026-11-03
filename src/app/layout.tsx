import type { Metadata } from "next";
import { Cormorant_Garamond, Playfair_Display, Great_Vibes, Montserrat } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-greatvibes",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thiệp Cưới Online Cao Cấp | Hoàng Nam & Minh Anh",
  description: "Trân trọng kính mời quý khách đến tham dự lễ thành hôn của Hoàng Nam & Minh Anh. Xem chi tiết thiệp cưới, gửi lời chúc và xác nhận tham dự.",
  openGraph: {
    title: "Thiệp Cưới Online Cao Cấp | Hoàng Nam & Minh Anh",
    description: "Trân trọng kính mời quý khách đến tham dự lễ thành hôn của Hoàng Nam & Minh Anh.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${cormorant.variable} ${playfair.variable} ${greatVibes.variable} ${montserrat.variable} font-sans antialiased bg-[#FAF7F2] text-[#2D2A26]`}
      >
        {children}
      </body>
    </html>
  );
}
