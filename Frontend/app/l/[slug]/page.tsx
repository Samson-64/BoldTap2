import dynamic from "next/dynamic";

const PublicLoyaltyPageClient = dynamic(
  () => import("@/features/public-cards/PublicLoyaltyPageClient"),
  {
    loading: () => (
      <div className="min-h-screen bg-[#f5f0ee] flex items-center justify-center">
        <p className="text-gray-600">Loading…</p>
      </div>
    ),
  },
);

type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function PublicLoyaltyPage({ params }: PageProps) {
  const { slug } = await params;

  return <PublicLoyaltyPageClient slug={slug ?? ""} />;
}
