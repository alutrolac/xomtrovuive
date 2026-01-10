
export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE'
}

export interface Room {
  id: string;
  name: string;
  price: number;
  status: RoomStatus;
  capacity: number;
  currentTenants: number;
  electricityMeter: number;
  waterMeter: number;
}

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  idCard: string;
  roomId: string;
  startDate: string;
  hometown: string;
}

export interface Bill {
  id: string;
  roomId: string;
  month: number;
  year: number;
  roomRent: number;
  elecUsage: number;
  elecRate: number;
  waterUsage: number;
  waterRate: number;
  total: number;
  isPaid: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  pendingAmount: number;
  occupiedRooms: number;
  totalTenants: number;
}
