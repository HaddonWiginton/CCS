import { Quote, ServiceArea, CustomerInfo, ChangeOrder } from './types';

export function generateId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function generateQuoteNumber(): string {
  const year = new Date().getFullYear();
  const id = generateId().substring(0, 4);
  return `CCS-${year}-${id}`;
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
    month: 'numeric', day: 'numeric', year: 'numeric',
  });
}

export function formatDateLong(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

export function calcServiceAreaTotal(area: ServiceArea): number {
  return area.tasks.reduce((sum, t) => sum + t.quantity * t.unitPrice, 0);
}

export function calcServicesTotal(quote: Quote): number {
  return quote.serviceAreas.reduce((sum, area) => sum + calcServiceAreaTotal(area), 0);
}

export function calcMaterialsTotal(quote: Quote): number {
  return calcServicesTotal(quote) + quote.suppliesCost;
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

export function calcApprovedChangeOrders(quote: Quote): number {
  return (quote.changeOrders || [])
    .filter(co => co.status === 'Approved')
    .reduce((sum, co) => sum + co.amount, 0);
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
  return calcGrossProfit(quote) + calcApprovedChangeOrders(quote);
}

export function createEmptyCustomer(): CustomerInfo {
  return {
    name: '', email: '', phone: '', address: '',
    city: '', state: '', zip: '',
    propertyType: 'Commercial Office', squareFootage: '', notes: '',
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
    changeOrders: [],
    laborRate: 28,
    laborHours: 0,
    suppliesCost: 0,
    overheadPercent: 10,
    marginPercent: 35,
    sellingPrice: 0,
    useCustomPrice: false,
    status: 'Draft',
    serviceType: 'Daily Janitorial',
    frequency: 'Monthly',
    workOrder: '',
    projectManager: '',
    facilityContact: '',
    paymentTerms: 'Net 30 — Invoice upon service completion. Payment due within 30 days of invoice date.',
    createdAt: now.toISOString(),
    validUntil: validUntil.toISOString(),
  };
}

// Preset tasks for commercial facility service areas
export const PRESET_TASKS: Record<string, { name: string; unitPrice: number; unit: string }[]> = {
  'Office Space': [
    { name: 'Vacuum all carpeted areas', unitPrice: 0.08, unit: 'sqft' },
    { name: 'Dust mop & wet mop hard floors', unitPrice: 0.06, unit: 'sqft' },
    { name: 'Empty waste receptacles & reline', unitPrice: 5, unit: 'each' },
    { name: 'Dust horizontal surfaces', unitPrice: 15, unit: 'each' },
    { name: 'Wipe & sanitize high-touch surfaces', unitPrice: 20, unit: 'each' },
    { name: 'Spot clean glass & partitions', unitPrice: 10, unit: 'each' },
  ],
  'Restrooms': [
    { name: 'Clean & sanitize toilets/urinals', unitPrice: 8, unit: 'each' },
    { name: 'Clean sinks, mirrors & counters', unitPrice: 12, unit: 'each' },
    { name: 'Mop & sanitize floors', unitPrice: 0.10, unit: 'sqft' },
    { name: 'Restock paper & soap dispensers', unitPrice: 15, unit: 'each' },
    { name: 'Clean partitions & fixtures', unitPrice: 10, unit: 'each' },
    { name: 'Empty & sanitize trash receptacles', unitPrice: 5, unit: 'each' },
  ],
  'Break Room / Kitchen': [
    { name: 'Wipe & sanitize counters & tables', unitPrice: 20, unit: 'each' },
    { name: 'Clean sink & faucets', unitPrice: 10, unit: 'each' },
    { name: 'Clean appliance exteriors', unitPrice: 8, unit: 'each' },
    { name: 'Sweep & mop floors', unitPrice: 0.08, unit: 'sqft' },
    { name: 'Empty trash & replace liners', unitPrice: 5, unit: 'each' },
    { name: 'Clean interior of microwave/fridge', unitPrice: 25, unit: 'each' },
  ],
  'Lobby / Common Areas': [
    { name: 'Vacuum / mop entryway', unitPrice: 0.08, unit: 'sqft' },
    { name: 'Clean glass entry doors', unitPrice: 8, unit: 'each' },
    { name: 'Dust & wipe furniture', unitPrice: 15, unit: 'each' },
    { name: 'Polish elevator doors & fixtures', unitPrice: 20, unit: 'each' },
    { name: 'Empty waste receptacles', unitPrice: 5, unit: 'each' },
    { name: 'Sanitize high-touch surfaces', unitPrice: 12, unit: 'each' },
  ],
  'Warehouse / Industrial': [
    { name: 'Sweep warehouse floor', unitPrice: 0.04, unit: 'sqft' },
    { name: 'Scrub warehouse floor', unitPrice: 0.12, unit: 'sqft' },
    { name: 'Clean loading dock area', unitPrice: 75, unit: 'each' },
    { name: 'Empty & reline dumpster area', unitPrice: 25, unit: 'each' },
    { name: 'Wipe & sanitize break stations', unitPrice: 15, unit: 'each' },
    { name: 'High dusting (above 10ft)', unitPrice: 0.15, unit: 'sqft' },
  ],
  'Conference Rooms': [
    { name: 'Vacuum / mop floors', unitPrice: 0.08, unit: 'sqft' },
    { name: 'Wipe table & chairs', unitPrice: 20, unit: 'each' },
    { name: 'Clean whiteboard', unitPrice: 8, unit: 'each' },
    { name: 'Dust AV equipment', unitPrice: 10, unit: 'each' },
    { name: 'Empty trash', unitPrice: 5, unit: 'each' },
    { name: 'Spot clean glass walls', unitPrice: 10, unit: 'each' },
  ],
  'Custom Area': [],
};

// Scope of work snippets for quick-add
export const SCOPE_SNIPPETS = [
  'Empty all waste receptacles, replace liners, and transport to dumpster area',
  'Vacuum all carpeted areas including edges and corners',
  'Dust mop and wet mop all hard surface floors',
  'Clean and sanitize all restroom fixtures, mirrors, and partitions',
  'Wipe and sanitize all high-touch surfaces (door handles, light switches, railings)',
  'Dust all horizontal surfaces within reach (desks, shelves, window sills)',
  'Clean and sanitize break room counters, sinks, and appliances (exterior)',
  'Spot clean glass entry doors and interior glass partitions',
  'Police exterior entrance and smoking areas for debris',
  'Restock paper products and soap dispensers as needed',
  'Perform quality inspection upon completion of each service visit',
  'Provide monthly service report with any noted facility concerns',
];

// Add-on options
export const ADDON_OPTIONS = [
  { id: 'add-001', name: 'Green Cleaning Program', price: 75 },
  { id: 'add-002', name: 'Touchpoint Disinfection Log', price: 0 },
  { id: 'add-003', name: 'Monthly Quality Inspection Report', price: 0 },
  { id: 'add-004', name: 'Emergency Response Cleaning (on-call)', price: 150 },
  { id: 'add-005', name: 'Matting / Floor Mat Service', price: 45 },
  { id: 'add-006', name: 'Consumable Restocking Service', price: 0 },
];

// LocalStorage helpers
const STORAGE_KEY = 'ccs-quotes';

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
