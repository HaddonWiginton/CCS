export interface CleaningTask {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  unit: string; // 'each' | 'sqft' | 'hr'
}

export interface ServiceArea {
  id: string;
  name: string; // e.g. "Kitchen", "Living Room", "Bathrooms (x3)"
  tasks: CleaningTask[];
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  propertyType: string; // Residential, Commercial, etc.
  squareFootage: string;
  notes: string;
}

export interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customer: CustomerInfo;
  serviceAreas: ServiceArea[];
  discounts: Discount[];
  laborRate: number; // per hour
  laborHours: number;
  suppliesCost: number;
  overheadPercent: number;
  marginPercent: number;
  sellingPrice: number;
  useCustomPrice: boolean;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined';
  serviceType: string;
  frequency: string;
  workOrder: string;
  paymentTerms: string;
  createdAt: string;
  validUntil: string;
}

export type ViewMode = 'history' | 'builder' | 'preview';
