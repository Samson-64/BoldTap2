import PublicNfcCardPageClient from "@/features/public-cards/PublicNfcCardPageClient";

type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function PublicCardPage({ params }: PageProps) {
  const { slug } = await params;

  return <PublicNfcCardPageClient slug={slug ?? ""} />;
}
