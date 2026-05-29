import { CatalogEntryName } from "@/shared/lib/CatalogEntryName";

import type { AtlasLayer } from "./AtlasLayer";

export class AtlasNodeId {
  private constructor(
    readonly layer: AtlasLayer,
    private readonly slug: string,
  ) {}

  static fromCatalogEntryName(name: CatalogEntryName): AtlasNodeId {
    return new AtlasNodeId(name.tone(), name.toSlug().toString());
  }

  toString(): string {
    return `${this.layer}:${this.slug}`;
  }

  equals(other: AtlasNodeId): boolean {
    return this.layer === other.layer && this.slug === other.slug;
  }
}
