"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  MessageCircle,
  Globe,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { getPublicCardBySlug } from "@/contexts/lib/nfcProfile";
import type { NfcProfileData } from "@/contexts/lib/nfcProfile";

function socialIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes("linkedin")) return Linkedin;
  if (l.includes("instagram")) return Instagram;
  if (l.includes("facebook")) return Facebook;
  if (l.includes("twitter") || l.includes("x")) return Twitter;
  return Globe;
}

export default function PublicCardPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [data, setData] = useState<
    | {
        profile: NfcProfileData | null;
        fallbackName: string;
        fallbackEmail: string;
      }
    | null
    | undefined
  >(undefined);

  useEffect(() => {
    if (!slug) {
      setData(null);
      return;
    }
    setData(getPublicCardBySlug(slug));
  }, [slug]);

  if (data === undefined) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
        <p className="text-gray-800 font-semibold mb-2">Card not found</p>
        <p className="text-gray-600 text-sm text-center max-w-sm">
          This link is invalid or expired. Each NFC card uses a unique link
          — contact the card owner if you expected a profile here.
        </p>
        <Link href="/" className="mt-6 text-sm text-black underline">
          BoldTap home
        </Link>
      </div>
    );
  }

  const p = data.profile;
  const name = p?.name || data.fallbackName || "Member";
  const title = p?.title || "";
  const company = p?.company || "";
  const emails = p?.emails?.filter(Boolean) ?? [];
  const phones = p?.phones?.filter(Boolean) ?? [];
  const website = p?.website && !p.website.startsWith("Add your") ? p.website : "";
  const socialLinks = p?.socialLinks?.filter((s) => s.url) ?? [];

  const primaryEmail = emails[0] || data.fallbackEmail || "";
  const primaryPhone = phones[0] || "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
            <span className="text-sm font-semibold tracking-wide">BoldTap</span>
            <CreditCard className="w-5 h-5 opacity-80" />
          </div>
          <div className="p-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center shrink-0">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black leading-tight">{name}</h1>
                {title ? <p className="text-gray-600 mt-1">{title}</p> : null}
                {company ? (
                  <p className="text-gray-500 text-sm mt-0.5">{company}</p>
                ) : null}
              </div>
            </div>

            {!p && (
              <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-6">
                Profile details haven&apos;t been published yet. Check back
                later.
              </p>
            )}

            <div className="space-y-3 text-sm">
              {primaryEmail ? (
                <a
                  href={`mailto:${primaryEmail}`}
                  className="flex items-center space-x-3 text-gray-800 hover:text-black"
                >
                  <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                  <span className="break-all">{primaryEmail}</span>
                </a>
              ) : null}
              {primaryPhone ? (
                <a
                  href={`tel:${primaryPhone.replace(/\s/g, "")}`}
                  className="flex items-center space-x-3 text-gray-800 hover:text-black"
                >
                  <MessageCircle className="w-4 h-4 text-gray-500 shrink-0" />
                  <span>{primaryPhone}</span>
                </a>
              ) : null}
              {website ? (
                <a
                  href={website.startsWith("http") ? website : `https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-800 hover:text-black"
                >
                  <Globe className="w-4 h-4 text-gray-500 shrink-0" />
                  <span className="break-all">{website}</span>
                </a>
              ) : null}
            </div>

            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-100">
                {socialLinks.map((s) => {
                  const Icon = socialIcon(s.label);
                  const href = s.url.startsWith("http") ? s.url : `https://${s.url}`;
                  return (
                    <a
                      key={s.id}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-3 py-2 rounded-full bg-gray-100 text-gray-800 text-xs font-medium hover:bg-gray-200 transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{s.label}</span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-6">
          <Link href="/" className="underline hover:text-gray-700">
            Create your own card
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
