export interface CatalogItem {
  kind: "smell" | "refactoring" | "pattern";
  number: number;
  name: string;
  href: string;
}
