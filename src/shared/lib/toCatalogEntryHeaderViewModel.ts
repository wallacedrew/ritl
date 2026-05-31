import type { CatalogEntryTone } from "./CatalogEntry";
import type { CatalogEntryName } from "./CatalogEntryName";
import type { CatalogNeighbors } from "./CatalogNeighbors";
import type { CatalogEntryHeaderViewModel, DetailChip } from "./CatalogDetailViewModel";

function toDetailChip(name: CatalogEntryName): DetailChip {
  return { label: name.toString(), href: name.toCatalogHref(), tone: name.tone() };
}

function nemesesLabelForTone(tone: CatalogEntryTone): string {
  switch (tone) {
    case "fowler-refactoring":
      return "Removes smells";
    case "smell":
      return "Apply refactorings";
    case "kerievsky-refactoring":
    case "pattern":
      return "Triggered by";
  }
}

export interface CatalogEntryHeaderArgs {
  readonly name: CatalogEntryName;
  readonly number: number;
  readonly relatedNames: readonly CatalogEntryName[];
  readonly destinationPattern?: CatalogEntryName;
  readonly incomingSourceNames?: readonly CatalogEntryName[];
  readonly inboundPatternNames?: readonly CatalogEntryName[];
  readonly neighbors?: CatalogNeighbors;
}

export function toCatalogEntryHeaderViewModel(
  args: CatalogEntryHeaderArgs,
): CatalogEntryHeaderViewModel {
  return {
    title: args.name.toString(),
    number: args.number,
    nemesesLabel: nemesesLabelForTone(args.name.tone()),
    relatedChips: args.relatedNames.map(toDetailChip),
    destinationChip:
      args.destinationPattern === undefined ? undefined : toDetailChip(args.destinationPattern),
    incomingSourceChips: args.incomingSourceNames?.map(toDetailChip),
    inboundPatternChips: args.inboundPatternNames?.map(toDetailChip),
    neighbors: args.neighbors,
  };
}
