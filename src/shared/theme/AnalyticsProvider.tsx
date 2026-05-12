"use client";

import { createContext, useMemo, type ReactNode } from "react";

import type { AnalyticsTracker } from "@/shared/lib/AnalyticsTracker";
import { NoOpAnalyticsTracker } from "@/shared/lib/NoOpAnalyticsTracker";

export const AnalyticsContext = createContext<AnalyticsTracker | null>(null);

interface AnalyticsProviderProps {
  children: ReactNode;
  tracker?: AnalyticsTracker;
}

export function AnalyticsProvider({ children, tracker }: AnalyticsProviderProps) {
  const value = useMemo<AnalyticsTracker>(() => tracker ?? new NoOpAnalyticsTracker(), [tracker]);

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}
