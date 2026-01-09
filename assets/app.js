// ---------- Storage & State ----------
const KEY = 'boarding_house_app_v2';
const state = {
  rooms: [],
  tenants: [],
  payments: [],
  settings: { roomDefaultPrice: 1500000, elecRate: 4000, waterRate: 20000 },
  seq: { room: 1, tenant: 1, payment: 1 }
};

// ---------- Toast ----------
const toastEl = document.getElementById('toast');
function toast(msg, type = 'success') {
  toastEl.textContent = msg;
  toastEl.className = `toast show ${type}`;
  setTimeout(() => { toastEl.className = 'toast hidden'; }, 2000);
}

// ---------- Load/Save ----------
function load() {
  const raw = localStorage.getItem(KEY);
  if (raw) {
    const data = JSON.parse(raw);
    Object.assign(state, data);
  } else {
    seedSampleData();
    save(true);
  }
}
function save(silent = false) {
  localStorage.setItem(KEY, JSON.stringify(state));
  renderAll();
  if (!silent) toast('Lưu thành công');
}
function resetAll() {
  localStorage.removeItem(KEY);
  state.rooms = [];
  state.tenants = [];
  state.payments = [];
  state.settings = { roomDefaultPrice: 1500000, elecRate: 4000, waterRate: 20000 };
  state.seq = { room: 1, tenant: 1, payment: 1 };
  seedSampleData();
  save();
}

// ---------- Sample Data ----------
function seedSampleData() {
  for (let i = 1; i <= 40; i++) {
    state.rooms.push({
      id: state.seq.room++,
      name: 'P' + (100 + i),
      price: state.settings.roomDefaultPrice,
      status: 'vacant'
    });
  }
  const roomCapacity = {};
  for (let i = 1; i <= 100; i++) {
    const name = 'Khách ' + i;
    const phone = '09' + String(10000000 + i);
    let roomId = null;
    for (let attempt = 0; attempt < 200; attempt++) {
      const r = state.rooms[Math.floor(Math.random() * state.rooms.length)];
      const count = roomCapacity[r.id] || 0;
      if (count < 3) { roomId = r.id; roomCapacity[r.id] = count + 1; break; }
    }
    const today = new Date();
    const moveIn = new Date(today.getFullYear(), today.getMonth() - Math.floor(Math.random()*6), 1);
    const tenant = {
      id: state.seq.tenant++,
      name, phone, roomId,
      moveIn: moveIn.toISOString().slice(0,10),
      moveOut: ''
    };
    state.tenants.push(tenant);
  }
  const occupiedSet = new Set(state.tenants.map(t => t.roomId));
  state.rooms.forEach(r => { if (occupiedSet.has(r.id)) r.status = 'occupied'; });

  const today = new Date();
  const months = [];
  for (let m = 0; m < 3; m++) {
    const d = new Date(today.getFullYear(), today.getMonth() - m, 1);
    months.push(d.toISOString().slice(0,7));
  }
  state.tenants.slice(0, 60).forEach(t => {
    months.forEach(month => {
      const elec = Math.floor(Math.random()*50)+50;
      const water = Math.floor(Math.random()*10)+5;
      const room = state.rooms.find(r => r.id === t.roomId);
      const total = room.price + elec*state.settings.elecRate + water*state.settings.waterRate;
      state.payments.push({
        id: state.seq.payment++,
        tenantId: t.id,
        month,
        roomPrice: room.price,
        electricity: elec,
        water: water,
        elecRate: state.settings.elecRate,
        waterRate: state.settings.waterRate,
        total,
        paid: Math.random() < 0.6
      });
    });
  });
}

// ---------- Helpers ----------
function fmt(n) { return (n||0).toLocaleString('vi-VN'); }
function getRoomName(id) { const r = state.rooms.find(r => r.id === id); return r ? r.name : '-'; }
function getTenantName(id) { const t = state.tenants.find(t => t.id === id); return t ? t.name : '-'; }
function monthStr(dateStr) { return dateStr?.slice(0,7) || ''; }

// ---------- Tabs ----------
const tabs = document.getElementById('tabs').querySelectorAll('button');
tabs.forEach(btn => btn.addEventListener('click', () => {
  tabs.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('section.panel').forEach(s => s.classList.add('hidden'));
  const target = document.getElementById(btn.dataset.tab);
  target.classList.remove('hidden');
  target.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 180, easing: 'ease-out' });
}));

// ---------- Dashboard ----------
function renderDashboard() {
  document.getElementById('statRooms').textContent = state.rooms.length;
  const occupied = state.rooms.filter(r => r.status === 'occupied').length;
  document.getElementById('statOccupied').textContent = occupied;
  document.getElementById('statTenants').textContent = state.tenants.length;
  const unpaid = state.payments.filter(p => !p.paid).length;
  document.getElementById('statUnpaid').textContent = unpaid;
}

// Export/Import
document.getElementById('exportDataBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'boarding_house_data.json'; a.click();
  URL.revokeObjectURL(url);
  toast('Đã xuất dữ liệu', 'success');
});
document.getElementById('importDataInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      Object.assign(state, data);
      save();
      toast('Nhập dữ liệu thành công', 'success');
    } catch (err) {
      toast('File không hợp lệ', 'error');
    }
  };
  reader.readAsText(file);
});

// ---------- Rooms ----------
const roomName = document.getElementById('roomName');
const roomPrice = document.getElementById('roomPrice');
const roomsTableBody = document.querySelector('#roomsTable tbody');
const roomStatusFilter = document.getElementById('roomStatusFilter');
const roomSearch = document.getElementById('roomSearch');
const defaultRoomPriceQuick = document.getElementById('defaultRoomPriceQuick');

document.getElementById('addRoomBtn').addEventListener('click', () => {
  const name = roomName.value.trim();
  const price = parseInt(roomPrice.value || state.settings.roomDefaultPrice, 10);
  if (!name) { toast('Vui lòng nhập tên phòng', 'warn'); return; }
  state.rooms.push({ id: state.seq.room++, name, price, status: 'vacant' });
  roomName.value = ''; roomPrice.value = '';
  save();
});
document.getElementById('resetRoomFormBtn').addEventListener('click', () => {
  roomName.value = ''; roomPrice.value = '';
});
document.getElementById('applyDefaultPriceBtn').addEventListener('click', () => {
  const price = parseInt(defaultRoomPriceQuick.value || state.settings.roomDefaultPrice, 10);
  state.rooms.filter(r => r.status === 'vacant').forEach(r => r.price = price);
  save();
});

function renderRooms() {
  defaultRoomPriceQuick.value = state.settings.roomDefaultPrice;
  const status = roomStatusFilter.value;
  const q = roomSearch.value.trim().toLowerCase();
  const tenantsByRoom = {};
  state.tenants.forEach(t => {
    tenantsByRoom[t.roomId] = tenantsByRoom[t.roomId] || [];
    tenantsByRoom[t.roomId].push(t);
  });
  const rows = state.rooms
    .filter(r => !status || r.status === status)
   
