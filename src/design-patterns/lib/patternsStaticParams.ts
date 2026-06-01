import { generateCatalogStaticParams } from "@/shared/lib/generateCatalogStaticParams";

import { loadPatterns } from "./loadPatterns";

export function patternsStaticParams() {
  return generateCatalogStaticParams(loadPatterns());
}
