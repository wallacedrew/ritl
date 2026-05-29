/**
 * Module-level singleton that bounds how many cross-reference popovers can
 * sit open on screen at once. Each ExpandableCatalogChip registers its
 * popover here when toggled open. When the cap is reached, the oldest open
 * popover is evicted (FIFO) so the new one can take its slot.
 *
 * The cap exists for user-comfort and resource-bounding reasons, not as a
 * security measure — this is a static site with no backend to protect.
 * A confused user (or a runaway script) who keeps clicking chevrons can
 * never accumulate more than `MAX_OPEN_POPOVERS` simultaneously open
 * dialogs.
 */

export const MAX_OPEN_POPOVERS = 7;

const openIds: string[] = [];
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

function evictOldest(): void {
  if (openIds.length === 0) return;
  openIds.shift();
}

export const openPopoverStack = {
  isOpen(id: string): boolean {
    return openIds.includes(id);
  },

  requestOpen(id: string): void {
    if (openIds.includes(id)) return;
    if (openIds.length >= MAX_OPEN_POPOVERS) {
      evictOldest();
    }
    openIds.push(id);
    notify();
  },

  close(id: string): void {
    const index = openIds.indexOf(id);
    if (index < 0) return;
    openIds.splice(index, 1);
    notify();
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  snapshot(): readonly string[] {
    return openIds;
  },

  /**
   * Test-only: clears all open popovers and resets the stack. Call from
   * vitest's afterEach so popover state never leaks between tests.
   */
  __resetForTest(): void {
    openIds.length = 0;
    notify();
  },
};
