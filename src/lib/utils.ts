import { Quote, ServiceArea, CustomerInfo } from './types';

export function generateId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function generateQuoteNumber(): string {
  const year = new Date().getFullYear();
  const id = generateId().substring(0, 4);
  return `CL-${year}-${id}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateLong(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function calcServiceAreaTotal(area: ServiceArea): number {
  return area.tasks.reduce((sum, t) => sum + t.quantity * t.unitPrice, 0);
}

export function calcMaterialsTotal(quote: Quote): number {
  return quote.serviceAreas.reduce((sum, area) => sum + calcServiceAreaTotal(area), 0) + quote.suppliesCost;
}

export function calcLaborTotal(quote: Quote): number {
  return quote.laborRate * quote.laborHours;
}

export function calcSubtotal(quote: Quote): number {
  return calcMaterialsTotal(quote) + calcLaborTotal(quote);
}

export function calcOverhead(quote: Quote): number {
  return calcSubtotal(quote) * (quote.overheadPercent / 100);
}

export function calcTotalCost(quote: Quote): number {
  return calcSubtotal(quote) + calcOverhead(quote);
}

export function calcDiscountsTotal(quote: Quote): number {
  const subtotal = calcTotalCost(quote);
  return quote.discounts.reduce((sum, d) => {
    if (d.type === 'percentage') return sum + subtotal * (d.value / 100);
    return sum + d.value;
  }, 0);
}

export function calcSellingPrice(quote: Quote): number {
  if (quote.useCustomPrice) return quote.sellingPrice;
  const cost = calcTotalCost(quote);
  if (quote.marginPercent >= 100) return cost * 10;
  return cost / (1 - quote.marginPercent / 100);
}

export function calcGrossProfit(quote: Quote): number {
  return calcSellingPrice(quote) - calcTotalCost(quote) - calcDiscountsTotal(quote);
}

export function calcGPPercent(quote: Quote): number {
  const sp = calcSellingPrice(quote);
  if (sp === 0) return 0;
  return (calcGrossProfit(quote) / sp) * 100;
}

export function calcNetProfit(quote: Quote): number {
  return calcGrossProfit(quote);
}

export function createEmptyCustomer(): CustomerInfo {
  return {
    name: '', email: '', phone: '', address: '',
    city: '', state: '', zip: '',
    propertyType: 'Residential', squareFootage: '', notes: '',
  };
}

export function createNewQuote(): Quote {
  const now = new Date();
  const validUntil = new Date(now);
  validUntil.setDate(validUntil.getDate() + 30);

  return {
    id: generateId(),
    quoteNumber: generateQuoteNumber(),
    customer: createEmptyCustomer(),
    serviceAreas: [],
    discounts: [],
    laborRate: 35,
    laborHours: 0,
    suppliesCost: 0,
    overheadPercent: 10,
    marginPercent: 40,
    sellingPrice: 0,
    useCustomPrice: false,
    status: 'Draft',
    serviceType: 'Standard Cleaning',
    frequency: 'One-time',
    workOrder: '',
    paymentTerms: '50% deposit required to schedule service. Remaining balance due upon completion. Customer satisfaction guaranteed or we will re-clean at no additional charge.',
    createdAt: now.toISOString(),
    validUntil: validUntil.toISOString(),
  };
}

// LocalStorage helpers
const STORAGE_KEY = 'cleaning-quotes';

export function loadQuotes(): Quote[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = window.localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function saveQuotes(quotes: Quote[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}
