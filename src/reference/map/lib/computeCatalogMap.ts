import { collectCrossReferences, type CatalogSnapshot } from "@/shared/lib/collectCrossReferences";
import type { CrossReferenceChip } from "@/shared/lib/RelationshipGroup";
import type { CatalogEntry } from "@/shared/lib/CatalogEntry";
import type { CatalogEntryName } from "@/shared/lib/CatalogEntryName";

export interface CatalogMapBridge {
  readonly source: CrossReferenceChip;
  readonly destination: CrossReferenceChip;
}

export interface RankedEntry {
  readonly chip: CrossReferenceChip;
  readonly outboundCount: number;
  readonly inboundCount: number;
  readonly totalCount: number;
}

export interface CatalogMap {
  readonly crossBookBridges: readonly CatalogMapBridge[];
  readonly kerievskyWithoutDestination: readonly CrossReferenceChip[];
  readonly mostConnectedEntries: readonly RankedEntry[];
  readonly sparsestEntries: readonly RankedEntry[];
}

const MOST_CONNECTED_LIMIT = 10;
const SPARSEST_LIMIT = 5;

export function computeCatalogMap(snapshot: CatalogSnapshot): CatalogMap {
  const entriesByHref = indexEntriesByHref(snapshot);
  const ranked = rankEntriesByConnections(snapshot, entriesByHref);
  return {
    crossBookBridges: collectCrossBookBridges(snapshot, entriesByHref),
    kerievskyWithoutDestination: collectKerievskyWithoutDestination(snapshot, entriesByHref),
    mostConnectedEntries: ranked.slice(0, MOST_CONNECTED_LIMIT),
    sparsestEntries: takeSparsest(ranked, SPARSEST_LIMIT),
  };
}

function indexEntriesByHref(snapshot: CatalogSnapshot): ReadonlyMap<string, CatalogEntry> {
  const lookup = new Map<string, CatalogEntry>();
  for (const entry of [...snapshot.smells, ...snapshot.refactorings, ...snapshot.patterns]) {
    lookup.set(entry.name.toCatalogHref(), entry);
  }
  return lookup;
}

function collectCrossBookBridges(
  snapshot: CatalogSnapshot,
  entriesByHref: ReadonlyMap<string, CatalogEntry>,
): readonly CatalogMapBridge[] {
  return snapshot.patterns.flatMap((pattern) => {
    const destination = pattern.destinationPattern;
    if (destination === undefined) return [];
    return [
      {
        source: chipWithCrossReferences(pattern.name, snapshot, entriesByHref),
        destination: chipWithCrossReferences(destination, snapshot, entriesByHref),
      },
    ];
  });
}

function collectKerievskyWithoutDestination(
  snapshot: CatalogSnapshot,
  entriesByHref: ReadonlyMap<string, CatalogEntry>,
): readonly CrossReferenceChip[] {
  return snapshot.patterns
    .filter((pattern) => pattern.book === "kerievsky" && pattern.destinationPattern === undefined)
    .map((pattern) => chipWithCrossReferences(pattern.name, snapshot, entriesByHref));
}

function rankEntriesByConnections(
  snapshot: CatalogSnapshot,
  entriesByHref: ReadonlyMap<string, CatalogEntry>,
): readonly RankedEntry[] {
  const inboundCounts = countInbound(snapshot);
  const allEntries = [...snapshot.smells, ...snapshot.refactorings, ...snapshot.patterns];
  return allEntries
    .map((entry) => toRankedEntry(entry, inboundCounts, snapshot, entriesByHref))
    .sort((first, second) => second.totalCount - first.totalCount);
}

function toRankedEntry(
  entry: CatalogEntry,
  inboundCounts: ReadonlyMap<string, number>,
  snapshot: CatalogSnapshot,
  entriesByHref: ReadonlyMap<string, CatalogEntry>,
): RankedEntry {
  const chip = chipWithCrossReferences(entry.name, snapshot, entriesByHref);
  const outboundCount = entry.nemeses.length + (entry.destinationPattern ? 1 : 0);
  const inboundCount = inboundCounts.get(entry.name.toCatalogHref()) ?? 0;
  return {
    chip,
    outboundCount,
    inboundCount,
    totalCount: outboundCount + inboundCount,
  };
}

function countInbound(snapshot: CatalogSnapshot): ReadonlyMap<string, number> {
  const counts = new Map<string, number>();
  for (const entry of [...snapshot.refactorings, ...snapshot.smells, ...snapshot.patterns]) {
    for (const nemesis of entry.nemeses) {
      bump(counts, nemesis.toCatalogHref());
    }
    if (entry.destinationPattern) {
      bump(counts, entry.destinationPattern.toCatalogHref());
    }
  }
  return counts;
}

function bump(counts: Map<string, number>, key: string): void {
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

function takeSparsest(ranked: readonly RankedEntry[], limit: number): readonly RankedEntry[] {
  return [...ranked].sort((first, second) => first.totalCount - second.totalCount).slice(0, limit);
}

function chipWithCrossReferences(
  name: CatalogEntryName,
  snapshot: CatalogSnapshot,
  entriesByHref: ReadonlyMap<string, CatalogEntry>,
): CrossReferenceChip {
  const entry = entriesByHref.get(name.toCatalogHref());
  return {
    label: name.toString(),
    href: name.toCatalogHref(),
    tone: name.tone(),
    crossReferences: entry ? collectCrossReferences(entry, snapshot) : undefined,
  };
}
