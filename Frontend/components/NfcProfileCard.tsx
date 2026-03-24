import {
  Download,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Link2,
  Mail,
  Music2,
  Phone,
  Share2,
  Twitter,
  User,
} from "lucide-react";
import type { NfcProfileData, NfcSocialLink } from "@/contexts/lib/nfcProfile";

type CardProfile = Partial<NfcProfileData> | null | undefined;

interface NfcProfileCardProps {
  profile: CardProfile;
  fallbackName?: string;
  fallbackEmail?: string;
  className?: string;
  interactiveLinks?: boolean;
  onSaveContact?: () => void;
  onShare?: () => void;
}

const LEGACY_TITLE = "Senior Developer";
const LEGACY_COMPANY = "Tech Solutions Inc.";
const LEGACY_WEBSITE = "Add your website url";

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function cleanText(value?: string | null): string {
  const next = value?.trim() ?? "";
  if (!next || next === LEGACY_WEBSITE) return "";
  return next;
}

function normalizeProfile(profile: CardProfile, fallbackName?: string, fallbackEmail?: string) {
  const rawTitle = cleanText(profile?.title);
  const rawCompany = cleanText(profile?.company);
  const isLegacySeed = rawTitle === LEGACY_TITLE && rawCompany === LEGACY_COMPANY;

  const name = cleanText(profile?.name) || cleanText(fallbackName) || "Member";
  const title = isLegacySeed ? "" : rawTitle;
  const company = isLegacySeed ? "" : rawCompany;
  const about = cleanText(profile?.about);
  const phones = (profile?.phones ?? []).map((phone) => cleanText(phone)).filter(Boolean);
  const emails = [
    ...(profile?.emails ?? []).map((email) => cleanText(email)).filter(Boolean),
    ...(!profile?.emails?.some((email) => cleanText(email)) && fallbackEmail
      ? [cleanText(fallbackEmail)]
      : []),
  ];
  const website = cleanText(profile?.website);
  const socialLinks = (profile?.socialLinks ?? []).filter(
    (social): social is NfcSocialLink =>
      Boolean(cleanText(social.label) && cleanText(social.url)),
  );

  return {
    name,
    title,
    company,
    about,
    phones,
    emails,
    website,
    socialLinks,
  };
}

function normalizeUrl(url: string): string {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function websiteLabel(url: string): string {
  const href = normalizeUrl(url);
  try {
    const host = new URL(href).hostname.replace(/^www\./i, "");
    return host || url;
  } catch {
    return url.replace(/^https?:\/\//i, "");
  }
}

function socialIcon(label: string) {
  const value = label.toLowerCase();
  if (value.includes("linkedin")) return Linkedin;
  if (value.includes("instagram")) return Instagram;
  if (value.includes("facebook")) return Facebook;
  if (value.includes("twitter") || value.includes("x")) return Twitter;
  if (value.includes("tiktok")) return Music2;
  if (value.includes("mail")) return Mail;
  return Link2;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (parts.length === 0) return "";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export default function NfcProfileCard({
  profile,
  fallbackName,
  fallbackEmail,
  className,
  interactiveLinks = false,
  onSaveContact,
  onShare,
}: NfcProfileCardProps) {
  const data = normalizeProfile(profile, fallbackName, fallbackEmail);
  const websiteHref = data.website ? normalizeUrl(data.website) : "";
  const websiteText = data.website ? websiteLabel(data.website) : "";
  const avatarInitials = initials(data.name);

  return (
    <div
      className={cx(
        "mx-auto w-full max-w-[390px] overflow-hidden rounded-[2rem] border border-black/10 bg-[#f4edf3] shadow-[0_20px_55px_rgba(15,23,42,0.18)]",
        className,
      )}
    >
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1d8bc8_0%,#2c6d9f_28%,#344a5d_58%,#101722_100%)]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.38),transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-16 h-20 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.18),transparent_70%)]" />
        <div className="absolute inset-x-10 top-10 h-24 rounded-t-[1.5rem] bg-[linear-gradient(180deg,#4a423f_0%,#342f2c_100%)] shadow-[0_10px_18px_rgba(0,0,0,0.18)]" />
        <div className="absolute left-1/2 top-[4.1rem] h-36 w-12 -translate-x-1/2 bg-[linear-gradient(180deg,#5a5553_0%,#2b2626_100%)] shadow-[0_10px_25px_rgba(0,0,0,0.28)]" />
        <div className="absolute left-1/2 top-[2.55rem] h-6 w-6 -translate-x-1/2 rounded-full bg-[#f2cd67] shadow-[0_0_18px_rgba(255,218,120,0.8)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent_0%,rgba(244,237,243,0.75)_58%,#f4edf3_100%)]" />
      </div>

      <div className="relative px-6 pb-7 text-center">
        <div className="-mt-16 mx-auto flex h-32 w-32 items-center justify-center rounded-full border-[6px] border-[#f4edf3] bg-[radial-gradient(circle_at_35%_30%,#ffffff_0%,#d4d8e3_55%,#a4acbc_100%)] shadow-[0_10px_28px_rgba(15,23,42,0.28)]">
          {avatarInitials ? (
            <span className="text-3xl font-semibold tracking-wide text-slate-800">
              {avatarInitials}
            </span>
          ) : (
            <User className="h-10 w-10 text-slate-700" />
          )}
        </div>

        <div className="mt-4 space-y-1">
          <h1 className="text-[1.85rem] font-medium tracking-[0.01em] text-slate-900">
            {data.name}
          </h1>
          {data.title ? (
            <p className="text-base font-medium text-slate-700">{data.title}</p>
          ) : null}
          {data.company ? (
            <p className="text-sm tracking-[0.14em] uppercase text-slate-500">
              {data.company}
            </p>
          ) : null}
        </div>

        {websiteHref ? (
          <div className="relative my-7 flex items-center justify-center">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/25" />
            {interactiveLinks ? (
              <a
                href={websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex max-w-[82%] items-center gap-3 rounded-2xl border border-black bg-white px-5 py-4 text-sm font-semibold text-slate-900 shadow-[0_8px_18px_rgba(15,23,42,0.12)]"
              >
                <Globe className="h-5 w-5 shrink-0" />
                <span className="truncate">{websiteText}</span>
              </a>
            ) : (
              <div className="relative inline-flex max-w-[82%] items-center gap-3 rounded-2xl border border-black bg-white px-5 py-4 text-sm font-semibold text-slate-900 shadow-[0_8px_18px_rgba(15,23,42,0.12)]">
                <Globe className="h-5 w-5 shrink-0" />
                <span className="truncate">{websiteText}</span>
              </div>
            )}
          </div>
        ) : null}

        {data.about ? (
          <section className="mt-6 space-y-2">
            <h2 className="text-[1.35rem] font-medium text-slate-900">About</h2>
            <p className="mx-auto max-w-[290px] text-sm leading-7 text-slate-700">
              {data.about}
            </p>
          </section>
        ) : null}

        {data.phones.length > 0 || data.emails.length > 0 ? (
          <div className="mt-7 space-y-2">
            {data.phones[0] ? (
              <a
                href={interactiveLinks ? `tel:${data.phones[0].replace(/\s+/g, "")}` : undefined}
                className={cx(
                  "flex items-center justify-center gap-2 text-lg font-medium text-slate-900",
                  interactiveLinks && "hover:text-slate-700",
                )}
              >
                <Phone className="h-4 w-4" />
                <span>{data.phones[0]}</span>
              </a>
            ) : null}
            {data.emails[0] ? (
              <a
                href={interactiveLinks ? `mailto:${data.emails[0]}` : undefined}
                className={cx(
                  "flex items-center justify-center gap-2 text-sm text-slate-700",
                  interactiveLinks && "hover:text-slate-900",
                )}
              >
                <Mail className="h-4 w-4" />
                <span className="break-all">{data.emails[0]}</span>
              </a>
            ) : null}
          </div>
        ) : null}

        {data.socialLinks.length > 0 ? (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            {data.socialLinks.map((social) => {
              const Icon = socialIcon(social.label);
              const href = normalizeUrl(social.url);
              const iconButton = (
                <>
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{social.label}</span>
                </>
              );

              if (interactiveLinks) {
                return (
                  <a
                    key={social.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#1e1e24] text-white shadow-[0_10px_16px_rgba(15,23,42,0.24)] transition-transform hover:-translate-y-0.5"
                    aria-label={social.label}
                    title={social.label}
                  >
                    {iconButton}
                  </a>
                );
              }

              return (
                <div
                  key={social.id}
                  className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#1e1e24] text-white shadow-[0_10px_16px_rgba(15,23,42,0.24)]"
                  aria-label={social.label}
                  title={social.label}
                >
                  {iconButton}
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onSaveContact}
            disabled={!onSaveContact}
            className={cx(
              "inline-flex min-h-14 items-center gap-3 rounded-2xl bg-[#1e1e24] px-6 text-sm font-semibold text-white shadow-[0_10px_18px_rgba(15,23,42,0.24)]",
              !onSaveContact && "opacity-85",
            )}
          >
            <Download className="h-5 w-5" />
            <span>Save Contact</span>
          </button>
          <button
            type="button"
            onClick={onShare}
            disabled={!onShare}
            className={cx(
              "flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1e1e24] text-white shadow-[0_10px_18px_rgba(15,23,42,0.24)]",
              !onShare && "opacity-85",
            )}
            aria-label="Share profile"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
