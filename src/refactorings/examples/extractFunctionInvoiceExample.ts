export interface InvoiceLine {
  qty: number;
  unitPrice: number;
}

export interface Invoice {
  lines: readonly InvoiceLine[];
  taxRate: number;
}

const BULK_DISCOUNT_THRESHOLD = 100;
const BULK_DISCOUNT_RATE = 0.05;

export function invoiceTotalBefore(invoice: Invoice): number {
  let total = 0;
  for (const line of invoice.lines) {
    total += line.qty * line.unitPrice;
    if (line.qty >= BULK_DISCOUNT_THRESHOLD) {
      total -= line.qty * line.unitPrice * BULK_DISCOUNT_RATE;
    }
  }
  total += total * invoice.taxRate;
  return Math.round(total * 100) / 100;
}

export function subtotalAfterBulkDiscount(invoice: Invoice): number {
  let subtotal = 0;
  for (const line of invoice.lines) {
    const lineTotal = line.qty * line.unitPrice;
    const discount = line.qty >= BULK_DISCOUNT_THRESHOLD ? lineTotal * BULK_DISCOUNT_RATE : 0;
    subtotal += lineTotal - discount;
  }
  return subtotal;
}

export function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}

export function invoiceTotalAfter(invoice: Invoice): number {
  const subtotal = subtotalAfterBulkDiscount(invoice);
  const withTax = subtotal * (1 + invoice.taxRate);
  return roundToCents(withTax);
}

export const SAMPLE_INVOICE: Invoice = {
  lines: [
    { qty: 150, unitPrice: 10 },
    { qty: 50, unitPrice: 4 },
  ],
  taxRate: 0.1,
};

export const EXPECTED_TOTAL = 1787.5;

export const CHARACTERIZATION_TEST_SOURCE = `const invoice = {
  lines: [
    { qty: 150, unitPrice: 10 },  // bulk discount applies
    { qty:  50, unitPrice:  4 },  // no discount
  ],
  taxRate: 0.1,
};

expect(invoiceTotal(invoice)).toBe(1787.5);`;
