import PatternsAgentPage, { patternsAgentStaticParams } from "@/patterns/PatternsAgentPage";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: RouteProps) {
  return PatternsAgentPage({ params, book: "kerievsky" });
}

export function generateStaticParams() {
  return patternsAgentStaticParams("kerievsky");
}
