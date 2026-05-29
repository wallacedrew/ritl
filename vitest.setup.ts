import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

import { openPopoverStack } from "@/shared/lib/openPopoverStack";

afterEach(() => {
  cleanup();
  openPopoverStack.__resetForTest();
});
