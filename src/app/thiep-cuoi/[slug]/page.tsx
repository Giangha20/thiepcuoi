import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import WeddingInvitationPage from "@/components/wedding/WeddingInvitationPage";
import { WeddingData } from "@/lib/types";
import Link from "next/link";
import { Settings } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const wedding = await prisma.wedding.findUnique({
    where: { slug: params.slug },
  });

  if (!wedding) {
    return {
      title: "Thiệp Cưới Online",
      description: "Trân trọng kính mời quý khách đến tham dự lễ cưới.",
    };
  }

  return {
    title: `${wedding.groomName} & ${wedding.brideName} | Thiệp Cưới Online`,
    description: `Trân trọng kính mời quý bạn bè và người thân đến tham dự lễ thành hôn của ${wedding.groomFullName} và ${wedding.brideFullName}.`,
    openGraph: {
      title: `Thiệp Cưới: ${wedding.groomName} & ${wedding.brideName}`,
      description: `Trân trọng kính mời bạn đến chung vui trong ngày trọng đại của chúng mình.`,
      images: [wedding.coverPhoto || wedding.groomPhoto || "/og-image.jpg"],
    },
  };
}

export default async function WeddingSlugPage({ params }: Props) {
  const wedding = await prisma.wedding.findUnique({
    where: { slug: params.slug },
    include: {
      events: { orderBy: { order: "asc" } },
      timeline: { orderBy: { order: "asc" } },
      gallery: { orderBy: { order: "asc" } },
      wishes: {
        where: { isApproved: true },
        orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!wedding) {
    return notFound();
  }

  return (
    <>
      <WeddingInvitationPage wedding={wedding as unknown as WeddingData} />

      {/* Floating Admin Quick Access Link */}
      <Link
        href="/admin"
        title="Trang quản trị thiệp cưới"
        className="fixed bottom-5 left-5 z-40 p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-[#B88E5B] shadow-md border border-[#DFC5A8]/50 backdrop-blur-sm transition-all hover:scale-108"
      >
        <Settings className="w-4 h-4" />
      </Link>
    </>
  );
}
