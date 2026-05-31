"use client";

import { createContext, useMemo, type ReactNode } from "react";

import type { AnalyticsTracker } from "@/shared/lib/AnalyticsTracker";
import { BeaconAnalyticsTracker } from "@/shared/adapters/BeaconAnalyticsTracker";
import { NoOpAnalyticsTracker } from "@/shared/adapters/NoOpAnalyticsTracker";

export const AnalyticsContext = createContext<AnalyticsTracker | null>(null);

interface AnalyticsProviderProps {
  children: ReactNode;
  tracker?: AnalyticsTracker;
}

function selectDefaultTracker(): AnalyticsTracker {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true") {
    return new BeaconAnalyticsTracker();
  }
  return new NoOpAnalyticsTracker();
}

export function AnalyticsProvider({ children, tracker }: AnalyticsProviderProps) {
  const value = useMemo<AnalyticsTracker>(() => tracker ?? selectDefaultTracker(), [tracker]);

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}
