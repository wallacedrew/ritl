"use client";

import { useCallback, useSyncExternalStore } from "react";

import { openPopoverStack } from "@/shared/lib/openPopoverStack";

export interface OpenPopoverHandle {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

export function useOpenPopover(id: string): OpenPopoverHandle {
  const isOpen = useSyncExternalStore(
    openPopoverStack.subscribe,
    () => openPopoverStack.isOpen(id),
    () => false,
  );

  const toggle = useCallback(() => {
    if (openPopoverStack.isOpen(id)) {
      openPopoverStack.close(id);
    } else {
      openPopoverStack.requestOpen(id);
    }
  }, [id]);

  const close = useCallback(() => {
    openPopoverStack.close(id);
  }, [id]);

  return { isOpen, toggle, close };
}
