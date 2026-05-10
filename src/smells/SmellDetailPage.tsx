import { notFound } from "next/navigation";

import { slugify } from "@/shared/lib/slugify";

import SmellDetail from "./components/SmellDetail";
import { loadSmells } from "./lib/loadSmells";

interface SmellDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SmellDetailPage({ params }: SmellDetailPageProps) {
  const { slug } = await params;
  const smell = loadSmells().find((candidate) => slugify(candidate.name) === slug);

  if (!smell) {
    notFound();
  }

  return <SmellDetail smell={smell} />;
}

export function generateStaticParams() {
  return loadSmells().map((smell) => ({ slug: slugify(smell.name) }));
}
