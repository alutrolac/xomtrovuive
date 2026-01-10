
import { Room, Tenant, RoomStatus, Bill } from './types';
import { PRICING, ROOM_COUNT, TENANT_COUNT, VIETNAMESE_NAMES, HOMETOWNS } from './constants';

export const generateMockData = () => {
  const rooms: Room[] = [];
  const tenants: Tenant[] = [];

  // Generate 20 Rooms
  for (let i = 1; i <= ROOM_COUNT; i++) {
    rooms.push({
      id: `R${i}`,
      name: `Phòng ${i < 10 ? '0' + i : i}`,
      price: PRICING.RENT_PER_MONTH,
      status: RoomStatus.OCCUPIED, // Initial fill
      capacity: 6,
      currentTenants: 5,
      electricityMeter: Math.floor(Math.random() * 500) + 100,
      waterMeter: Math.floor(Math.random() * 50) + 10,
    });
  }

  // Generate 100 Tenants (5 per room)
  let tenantId = 1;
  rooms.forEach(room => {
    for (let j = 0; j < 5; j++) {
      const nameIndex = Math.floor(Math.random() * VIETNAMESE_NAMES.length);
      tenants.push({
        id: `T${tenantId}`,
        name: `${VIETNAMESE_NAMES[nameIndex]} ${tenantId}`,
        phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
        idCard: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        roomId: room.id,
        startDate: '2024-01-01',
        hometown: HOMETOWNS[Math.floor(Math.random() * HOMETOWNS.length)]
      });
      tenantId++;
    }
  });

  return { rooms, tenants };
};

export const generateMockBills = (rooms: Room[]): Bill[] => {
  return rooms.map(room => {
    const elecUsage = Math.floor(Math.random() * 100) + 50;
    const waterUsage = Math.floor(Math.random() * 10) + 5;
    const total = room.price + (elecUsage * PRICING.ELECTRICITY_RATE) + (waterUsage * PRICING.WATER_RATE);
    
    return {
      id: `B-${room.id}-${Date.now()}`,
      roomId: room.id,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      roomRent: room.price,
      elecUsage,
      elecRate: PRICING.ELECTRICITY_RATE,
      waterUsage,
      waterRate: PRICING.WATER_RATE,
      total,
      isPaid: Math.random() > 0.3,
      createdAt: new Date().toISOString(),
    };
  });
};
