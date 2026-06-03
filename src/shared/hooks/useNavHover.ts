"use client";

import { useContext } from "react";

import { NavHoverContext } from "@/shared/components/NavHoverProvider";

export function useNavHover() {
  return useContext(NavHoverContext);
}
