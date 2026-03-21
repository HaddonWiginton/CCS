export interface CleaningTask {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  unit: string; // 'each' | 'sqft' | 'hr' | 'visit' | 'pane'
}

export interface ServiceArea {
  id: string;
  name: string; // e.g. "Office Floor 1", "Warehouse", "Restrooms"
  tasks: CleaningTask[];
  scopeItems: string[];
  selectedAddons: string[];
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  propertyType: string; // Commercial, Industrial, Medical, Retail, etc.
  squareFootage: string;
  notes: string;
}

export interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
}

export interface ChangeOrder {
  id: string;
  description: string;
  reason: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Declined';
  createdAt: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customer: CustomerInfo;
  serviceAreas: ServiceArea[];
  discounts: Discount[];
  changeOrders: ChangeOrder[];
  laborRate: number;
  laborHours: number;
  suppliesCost: number;
  overheadPercent: number;
  marginPercent: number;
  sellingPrice: number;
  useCustomPrice: boolean;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Expired';
  serviceType: string;
  frequency: string;
  workOrder: string;
  projectManager: string;
  facilityContact: string;
  paymentTerms: string;
  createdAt: string;
  validUntil: string;
}

export type ViewMode = 'history' | 'builder' | 'preview';
