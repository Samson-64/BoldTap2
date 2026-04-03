"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NfcBusinessCardView from "@/components/NfcBusinessCardView";
import { usePublicNfcCard } from "@/features/public-cards/usePublicNfcCard";

interface PublicNfcCardPageClientProps {
  slug: string;
}

export default function PublicNfcCardPageClient({
  slug,
}: PublicNfcCardPageClientProps) {
  const [shareUrl, setShareUrl] = useState("");
  const data = usePublicNfcCard(slug);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  if (data === undefined) {
    return (
      <div className="min-h-screen bg-[#f5f0ee] flex items-center justify-center">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="min-h-screen bg-[#f5f0ee] flex flex-col items-center justify-center px-4">
        <p className="text-gray-800 font-semibold mb-2">Card not found</p>
        <p className="text-gray-600 text-sm text-center max-w-sm">
          This link is invalid or expired.
        </p>
        <Link href="/" className="mt-6 text-sm text-black underline">
          BoldTap home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0ee] py-8 px-4 pb-12">
      <NfcBusinessCardView
        profile={data.profile}
        fallbackName={data.fallbackName}
        fallbackEmail={data.fallbackEmail}
        shareUrl={shareUrl}
        showFooterCta
      />
      <p className="text-center text-xs text-gray-500 mt-6 max-w-md mx-auto">
        <Link href="/" className="underline hover:text-gray-700">
          Create your own card
        </Link>
      </p>
    </div>
  );
}
