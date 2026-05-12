"use client";

import { useContext } from "react";

import type { AnalyticsTracker } from "@/shared/lib/AnalyticsTracker";
import { NoOpAnalyticsTracker } from "@/shared/lib/NoOpAnalyticsTracker";
import { AnalyticsContext } from "@/shared/theme/AnalyticsProvider";

const fallbackTracker = new NoOpAnalyticsTracker();

export function useAnalytics(): AnalyticsTracker {
  return useContext(AnalyticsContext) ?? fallbackTracker;
}
