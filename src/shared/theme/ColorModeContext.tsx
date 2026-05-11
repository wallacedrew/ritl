"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type ColorMode = "light" | "dark";

interface ColorModeContextValue {
  mode: ColorMode;
  toggleMode: () => void;
  setMode: (mode: ColorMode) => void;
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

const STORAGE_KEY = "ritl-color-mode";

function readStoredMode(): ColorMode | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // localStorage may be unavailable (private mode, SSR)
  }
  return null;
}

function persistMode(mode: ColorMode): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore
  }
}

interface ColorModeProviderProps {
  children: ReactNode;
  defaultMode?: ColorMode;
}

export function ColorModeProvider({ children, defaultMode = "dark" }: ColorModeProviderProps) {
  const [mode, setModeState] = useState<ColorMode>(defaultMode);

  useEffect(() => {
    // SSR can't read localStorage, so the first paint always uses
    // `defaultMode`. This effect upgrades to the persisted mode on
    // hydration — exactly the client-state-sync pattern useEffect is
    // designed for. The lint rule's "no setState in effect" guidance
    // doesn't apply when the effect's whole job is to sync from an
    // external (client-only) source.
    const stored = readStoredMode();
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModeState(stored);
    }
  }, []);

  const setMode = useCallback((next: ColorMode) => {
    setModeState(next);
    persistMode(next);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === "dark" ? "light" : "dark");
  }, [mode, setMode]);

  const value = useMemo(() => ({ mode, toggleMode, setMode }), [mode, toggleMode, setMode]);

  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
}

export function useColorMode(): ColorModeContextValue {
  const ctx = useContext(ColorModeContext);
  if (!ctx) {
    throw new Error("useColorMode must be used within a ColorModeProvider");
  }
  return ctx;
}
