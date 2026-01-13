
export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';

export interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  status: RoomStatus;
  floor: number;
  tenantId?: string;
}

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  email: string;
  identityCard: string;
  joinDate: string;
  roomId: string;
}

export interface Invoice {
  id: string;
  roomId: string;
  month: string;
  year: number;
  rentAmount: number;
  electricityCost: number;
  waterCost: number;
  serviceCost: number;
  total: number;
  status: 'PAID' | 'UNPAID' | 'OVERDUE';
  createdAt: string;
}

export interface Contract {
  id: string;
  tenantId: string;
  roomId: string;
  startDate: string;
  endDate: string;
  deposit: number;
  terms: string;
}

export type ViewType = 'DASHBOARD' | 'ROOMS' | 'TENANTS' | 'INVOICES' | 'CONTRACTS' | 'REPORTS' | 'AI_ASSISTANT';
