
import { Room, Tenant, Invoice, Contract } from './types';

export const MOCK_ROOMS: Room[] = [
  { id: '1', name: 'P.101', type: 'Studio', price: 3500000, status: 'OCCUPIED', floor: 1, tenantId: 'T1' },
  { id: '2', name: 'P.102', type: 'Studio', price: 3500000, status: 'AVAILABLE', floor: 1 },
  { id: '3', name: 'P.201', type: '1BR Full Interior', price: 5500000, status: 'OCCUPIED', floor: 2, tenantId: 'T2' },
  { id: '4', name: 'P.202', type: 'Studio', price: 3800000, status: 'MAINTENANCE', floor: 2 },
  { id: '5', name: 'P.301', type: 'Penthouse Mini', price: 8000000, status: 'OCCUPIED', floor: 3, tenantId: 'T3' },
  { id: '6', name: 'P.302', type: '1BR Full Interior', price: 5500000, status: 'AVAILABLE', floor: 3 },
];

export const MOCK_TENANTS: Tenant[] = [
  { id: 'T1', name: 'Nguyễn Văn An', phone: '0901234567', email: 'an.nguyen@gmail.com', identityCard: '0123456789', joinDate: '2023-01-15', roomId: '1' },
  { id: 'T2', name: 'Trần Thị Bình', phone: '0912345678', email: 'binh.tran@yahoo.com', identityCard: '9876543210', joinDate: '2023-05-20', roomId: '3' },
  { id: 'T3', name: 'Lê Hoàng Long', phone: '0987654321', email: 'long.le@outlook.com', identityCard: '4567891230', joinDate: '2024-02-10', roomId: '5' },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-001', roomId: '1', month: 'Tháng 10', year: 2024, rentAmount: 3500000, electricityCost: 450000, waterCost: 100000, serviceCost: 150000, total: 4200000, status: 'PAID', createdAt: '2024-10-01' },
  { id: 'INV-002', roomId: '3', month: 'Tháng 10', year: 2024, rentAmount: 5500000, electricityCost: 600000, waterCost: 120000, serviceCost: 150000, total: 6370000, status: 'UNPAID', createdAt: '2024-10-05' },
  { id: 'INV-003', roomId: '5', month: 'Tháng 10', year: 2024, rentAmount: 8000000, electricityCost: 850000, waterCost: 200000, serviceCost: 200000, total: 9250000, status: 'OVERDUE', createdAt: '2024-10-02' },
];

export const REVENUE_DATA = [
  { name: 'Tháng 5', revenue: 45000000 },
  { name: 'Tháng 6', revenue: 48000000 },
  { name: 'Tháng 7', revenue: 52000000 },
  { name: 'Tháng 8', revenue: 51000000 },
  { name: 'Tháng 9', revenue: 55000000 },
  { name: 'Tháng 10', revenue: 58000000 },
];
