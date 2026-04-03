import PublicLoyaltyPageClient from "@/features/public-cards/PublicLoyaltyPageClient";

type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function PublicLoyaltyPage({ params }: PageProps) {
  const { slug } = await params;

  return <PublicLoyaltyPageClient slug={slug ?? ""} />;
}
