import { afterEach, describe, expect, it } from "vitest";

import { MAX_OPEN_POPOVERS, openPopoverStack } from "@/shared/lib/openPopoverStack";

afterEach(() => {
  openPopoverStack.__resetForTest();
});

describe("openPopoverStack", () => {
  it("starts empty", () => {
    expect(openPopoverStack.snapshot()).toEqual([]);
    expect(openPopoverStack.isOpen("anything")).toBe(false);
  });

  it("records each requested-open id and reports it as open", () => {
    openPopoverStack.requestOpen("alpha");
    openPopoverStack.requestOpen("beta");

    expect(openPopoverStack.isOpen("alpha")).toBe(true);
    expect(openPopoverStack.isOpen("beta")).toBe(true);
    expect(openPopoverStack.snapshot()).toEqual(["alpha", "beta"]);
  });

  it("is idempotent on requestOpen of an already-open id", () => {
    openPopoverStack.requestOpen("alpha");
    openPopoverStack.requestOpen("alpha");

    expect(openPopoverStack.snapshot()).toEqual(["alpha"]);
  });

  it("removes an id on close", () => {
    openPopoverStack.requestOpen("alpha");
    openPopoverStack.requestOpen("beta");

    openPopoverStack.close("alpha");

    expect(openPopoverStack.isOpen("alpha")).toBe(false);
    expect(openPopoverStack.snapshot()).toEqual(["beta"]);
  });

  it("evicts the oldest id (FIFO) when opening past the cap", () => {
    expect(MAX_OPEN_POPOVERS).toBe(7);

    for (let i = 1; i <= 7; i++) {
      openPopoverStack.requestOpen(`chip-${i}`);
    }
    expect(openPopoverStack.snapshot()).toHaveLength(7);
    expect(openPopoverStack.isOpen("chip-1")).toBe(true);

    openPopoverStack.requestOpen("chip-8");

    expect(openPopoverStack.snapshot()).toHaveLength(7);
    expect(openPopoverStack.isOpen("chip-1")).toBe(false);
    expect(openPopoverStack.isOpen("chip-8")).toBe(true);
  });

  it("notifies subscribers on open and close", () => {
    let notifications = 0;
    const unsubscribe = openPopoverStack.subscribe(() => {
      notifications += 1;
    });

    openPopoverStack.requestOpen("alpha");
    openPopoverStack.close("alpha");

    expect(notifications).toBe(2);

    unsubscribe();
    openPopoverStack.requestOpen("beta");
    expect(notifications).toBe(2);
  });
});
