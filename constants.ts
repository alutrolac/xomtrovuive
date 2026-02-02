
import { Room, Tenant, Invoice } from './types';

export const MOCK_ROOMS: Room[] = [
  { id: '1', name: 'P.101', type: 'Phòng đơn', price: 3500000, status: 'Occupied', floor: 1, description: 'Có gác lửng, cửa sổ thoáng' },
  { id: '2', name: 'P.102', type: 'Phòng đơn', price: 3500000, status: 'Available', floor: 1, description: 'Phòng mới sơn lại' },
  { id: '3', name: 'P.201', type: 'Phòng đôi', price: 5000000, status: 'Occupied', floor: 2, description: 'View mặt tiền, rộng rãi' },
  { id: '4', name: 'P.202', type: 'Phòng đơn', price: 3800000, status: 'Maintenance', floor: 2, description: 'Đang sửa vòi nước' },
  { id: '5', name: 'P.301', type: 'Phòng đôi', price: 5500000, status: 'Available', floor: 3, description: 'Đầy đủ nội thất' },
];

export const MOCK_TENANTS: Tenant[] = [
  { id: 't1', name: 'Nguyễn Văn A', phone: '0901234567', email: 'vana@gmail.com', roomId: '1', startDate: '2023-01-15', idCard: '123456789' },
  { id: 't2', name: 'Trần Thị B', phone: '0912345678', email: 'thib@gmail.com', roomId: '3', startDate: '2023-05-10', idCard: '987654321' },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'i1', roomId: '1', month: 10, year: 2023, rentAmount: 3500000, electricity: 450000, water: 100000, services: 50000, total: 4100000, status: 'Paid', dueDate: '2023-10-05' },
  { id: 'i2', roomId: '3', month: 10, year: 2023, rentAmount: 5000000, electricity: 600000, water: 150000, services: 50000, total: 5800000, status: 'Unpaid', dueDate: '2023-10-05' },
];
