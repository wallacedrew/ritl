"use client";

import { createContext, useMemo, type ReactNode } from "react";

import { HttpSnippetSource } from "@/shared/adapters/HttpSnippetSource";
import type { SnippetSource } from "@/shared/lib/SnippetSource";

export const SnippetSourceContext = createContext<SnippetSource | null>(null);

interface SnippetSourceProviderProps {
  children: ReactNode;
  source?: SnippetSource;
}

function defaultSource(): SnippetSource {
  return new HttpSnippetSource();
}

export function SnippetSourceProvider({ children, source }: SnippetSourceProviderProps) {
  const value = useMemo<SnippetSource>(() => source ?? defaultSource(), [source]);

  return <SnippetSourceContext.Provider value={value}>{children}</SnippetSourceContext.Provider>;
}
