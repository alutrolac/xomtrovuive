
export interface Tenant {
  id: string;
  name: string;
  phone: string;
  idCard: string;
  email: string;
  hometown: string;
  roomNumber: string;
  startDate: string;
  status: 'active' | 'inactive';
}

export interface Room {
  id: string;
  number: string;
  price: number;
  status: 'available' | 'occupied' | 'maintenance';
}

export interface Invoice {
  id: string;
  tenantId: string;
  tenantName: string;
  roomNumber: string;
  month: string;
  year: number;
  rentAmount: number;
  electricityUnits: number;
  electricityPrice: number;
  waterUnits: number;
  waterPrice: number;
  total: number;
  status: 'paid' | 'unpaid';
  createdAt: string;
}

export interface Contract {
  id: string;
  tenantId: string;
  roomNumber: string;
  startDate: string;
  endDate: string;
  deposit: number;
  terms: string;
}

export type ViewType = 'dashboard' | 'tenants' | 'rooms' | 'invoices' | 'contracts';
