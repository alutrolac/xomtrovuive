
import { Tenant, Room, Invoice } from './types';
import { PRICING as PRICING_CONST } from './constants';

const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Đặng', 'Bùi', 'Đỗ'];
const middleNames = ['Văn', 'Thị', 'Minh', 'Hoàng', 'Anh', 'Ngọc', 'Đức', 'Xuân'];
const lastNames = ['An', 'Bình', 'Chi', 'Dũng', 'Em', 'Giang', 'Hà', 'Khang', 'Linh', 'Minh', 'Nam', 'Oanh', 'Phúc', 'Quân', 'Sơn', 'Tú', 'Uyên', 'Việt'];

const generateName = () => {
  const f = firstNames[Math.floor(Math.random() * firstNames.length)];
  const m = middleNames[Math.floor(Math.random() * middleNames.length)];
  const l = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${f} ${m} ${l}`;
};

export const generateMockData = () => {
  const tenants: Tenant[] = [];
  const rooms: Room[] = [];
  const invoices: Invoice[] = [];

  // Generate 100 rooms
  for (let i = 1; i <= 100; i++) {
    const roomNum = i.toString().padStart(3, '0');
    rooms.push({
      id: `room-${i}`,
      number: roomNum,
      price: PRICING_CONST.ROOM_RENT,
      status: i <= 85 ? 'occupied' : i <= 95 ? 'available' : 'maintenance'
    });
  }

  // Generate 85 active tenants for the occupied rooms
  for (let i = 1; i <= 85; i++) {
    const roomNum = rooms[i-1].number;
    const name = generateName();
    const id = `tenant-${i}`;
    tenants.push({
      id,
      name,
      phone: `09${Math.floor(Math.random() * 90000000 + 10000000)}`,
      idCard: `${Math.floor(Math.random() * 900000000 + 100000000)}`,
      email: `tenant${i}@gmail.com`,
      hometown: ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'][Math.floor(Math.random() * 5)],
      roomNumber: roomNum,
      startDate: '2023-01-15',
      status: 'active'
    });

    // Generate 3 months of invoices for each active tenant
    for (let m = 1; m <= 3; m++) {
      const elec = Math.floor(Math.random() * 100 + 50);
      const water = Math.floor(Math.random() * 10 + 2);
      const rent = PRICING_CONST.ROOM_RENT;
      const total = rent + (elec * PRICING_CONST.ELECTRICITY) + (water * PRICING_CONST.WATER);
      
      invoices.push({
        id: `inv-${id}-${m}`,
        tenantId: id,
        tenantName: name,
        roomNumber: roomNum,
        month: `${m}`,
        year: 2024,
        rentAmount: rent,
        electricityUnits: elec,
        electricityPrice: PRICING_CONST.ELECTRICITY,
        waterUnits: water,
        waterPrice: PRICING_CONST.WATER,
        total,
        status: m < 3 ? 'paid' : (Math.random() > 0.3 ? 'paid' : 'unpaid'),
        createdAt: `2024-0${m}-01`
      });
    }
  }

  return { tenants, rooms, invoices };
};
