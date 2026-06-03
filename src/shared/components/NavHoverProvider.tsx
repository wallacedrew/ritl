"use client";

import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";

import type { CatalogView } from "@/shared/lib/CatalogView";

interface NavHoverContextValue {
  hoveredViews: ReadonlySet<CatalogView>;
  hover: (views: readonly CatalogView[]) => void;
  clear: () => void;
}

const EMPTY_HOVERED_VIEWS: ReadonlySet<CatalogView> = new Set();

const noopValue: NavHoverContextValue = {
  hoveredViews: EMPTY_HOVERED_VIEWS,
  hover: () => {},
  clear: () => {},
};

export const NavHoverContext = createContext<NavHoverContextValue>(noopValue);

interface NavHoverProviderProps {
  children: ReactNode;
}

export function NavHoverProvider({ children }: NavHoverProviderProps) {
  const [hoveredViews, setHoveredViews] = useState<ReadonlySet<CatalogView>>(EMPTY_HOVERED_VIEWS);

  const hover = useCallback((views: readonly CatalogView[]) => {
    setHoveredViews(new Set(views));
  }, []);

  const clear = useCallback(() => {
    setHoveredViews(EMPTY_HOVERED_VIEWS);
  }, []);

  const value = useMemo<NavHoverContextValue>(
    () => ({ hoveredViews, hover, clear }),
    [hoveredViews, hover, clear],
  );

  return <NavHoverContext.Provider value={value}>{children}</NavHoverContext.Provider>;
}
