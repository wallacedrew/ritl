import { notFound } from "next/navigation";

import { Slug } from "@/shared/lib/Slug";

import SmellDetail from "./components/SmellDetail";
import { loadSmells } from "./lib/loadSmells";

interface SmellDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SmellDetailPage({ params }: SmellDetailPageProps) {
  const { slug: rawSlug } = await params;
  const requested = Slug.fromUrlPart(rawSlug);
  const smells = loadSmells();
  const index = smells.findIndex((candidate) => Slug.from(candidate.name).equals(requested));
  const smell = smells[index];

  if (!smell) {
    notFound();
  }

  return <SmellDetail smell={smell} number={index + 1} />;
}

export function generateStaticParams() {
  return loadSmells().map((smell) => ({ slug: Slug.from(smell.name).toString() }));
}
