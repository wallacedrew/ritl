"use client";

import { useContext } from "react";

import { HttpSnippetSource } from "@/shared/adapters/HttpSnippetSource";
import type { SnippetSource } from "@/shared/lib/SnippetSource";
import { SnippetSourceContext } from "@/shared/theme/SnippetSourceProvider";

const fallbackSource = new HttpSnippetSource();

export function useSnippetSource(): SnippetSource {
  return useContext(SnippetSourceContext) ?? fallbackSource;
}
