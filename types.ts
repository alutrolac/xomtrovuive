
export type RoomStatus = 'Available' | 'Occupied' | 'Maintenance';

export interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  status: RoomStatus;
  floor: number;
  description: string;
}

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  email: string;
  roomId: string;
  startDate: string;
  idCard: string;
}

export interface Invoice {
  id: string;
  roomId: string;
  month: number;
  year: number;
  rentAmount: number;
  electricity: number;
  water: number;
  services: number;
  total: number;
  status: 'Paid' | 'Unpaid';
  dueDate: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
