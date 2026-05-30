import { describe, expect, it } from "vitest";

import {
  EXPECTED_TOTAL,
  invoiceTotalAfter,
  invoiceTotalBefore,
  SAMPLE_INVOICE,
} from "@/refactorings/examples/extractFunctionInvoiceExample";

describe("Extract Function characterization test on the /plugin embed showcase", () => {
  it("invoiceTotalBefore returns the expected total on the sample invoice", () => {
    expect(invoiceTotalBefore(SAMPLE_INVOICE)).toBe(EXPECTED_TOTAL);
  });

  it("invoiceTotalAfter preserves invoiceTotalBefore's behavior on the sample invoice", () => {
    expect(invoiceTotalAfter(SAMPLE_INVOICE)).toBe(EXPECTED_TOTAL);
  });
});
