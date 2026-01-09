// ===== Utilities =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const toast = (msg) => {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
};

const fmtVND = (n) =>
  (n || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const todayISO = () => new Date().toISOString().slice(0, 10);
const monthKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

// ===== Data store (localStorage) =====
const STORE_KEY = 'boarding_house_app_v1';

const defaultConfig = {
  electricPrice: 4000,
  waterPrice: 20000,
  defaultRoomPrice: 1500000,
};

const db = {
  rooms: [],
  tenants: [],
  invoices: [],
  config: { ...defaultConfig },
};

function saveDB() {
  localStorage.setItem(STORE_KEY, JSON.stringify(db));
}
function loadDB() {
  const raw = localStorage.getItem(STORE_KEY);
  if (raw) {
    const parsed = JSON.parse(raw);
    Object.assign(db, parsed);
  } else {
    seedSampleData();
    saveDB();
  }
}

// ===== Sample data =====
function seedSampleData() {
  // 40 rooms
  db.rooms = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    code: `P${String(i + 1).padStart(2, '0')}`,
    capacity: 3,
    price: defaultConfig.defaultRoomPrice,
    active: true,
  }));

  // 100 tenants distributed across rooms
  db.tenants = Array.from({ length: 100 }, (_, i) => {
    const roomId = (i % 40) + 1;
    const start = new Date();
    start.setMonth(start.getMonth() - Math.floor(Math.random() * 6));
    return {
      id: i + 1,
      name: `Khách ${i + 1}`,
      phone: `09${String(1000000 + i).slice(-7)}`,
      roomId,
      startDate: start.toISOString().slice(0, 10),
      active: true,
    };
  });

  // Empty invoices initially
  db.invoices = [];
  db.config = { ...defaultConfig };
}

// ===== Navigation =====
function initNav() {
  $$('.sidebar li').forEach((li) => {
    li.addEventListener('click', () => {
      $$('.sidebar li').forEach((x) => x.classList.remove('active'));
      li.classList.add('active');
      const view = li.getAttribute('data-view');
      $$('.view').forEach((v) => v.classList.remove('active'));
      $(`#view-${view}`).classList.add('active');
      renderAll();
    });
  });
}

// ===== Renderers =====
function renderDashboard() {
  $('#statRooms').textContent = db.rooms.length;
  const occupiedRoomIds = new Set(db.tenants.filter(t => t.active).map(t => t.roomId));
  $('#statOccupied').textContent = occupiedRoomIds.size;
  $('#statTenants').textContent = db.tenants.filter(t => t.active).length;

  // Revenue = sum of paid invoices in current month
  const mk = monthKey();
  const revenue = db.invoices
    .filter(inv => inv.month === mk && inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
  $('#statRevenue').textContent = fmtVND(revenue);

  // Recent invoices (last 10)
  const recent = [...db.invoices].slice(-10).reverse();
  const tbody = $('#recentInvoices');
  tbody.innerHTML = recent.map(inv => `
    <tr>
      <td>${roomById(inv.roomId)?.code || '-'}</td>
      <td>${inv.month}</td>
      <td>${fmtVND(inv.roomPrice)}</td>
      <td>${fmtVND(inv.electric * db.config.electricPrice)}</td>
      <td>${fmtVND(inv.water * db.config.waterPrice)}</td>
      <td>${fmtVND(inv.total)}</td>
      <td>${inv.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
    </tr>
  `).join('');
}

function renderRooms() {
  const tbody = $('#roomsTable');
  const tenantsByRoom = groupTenantsByRoom();
  tbody.innerHTML = db.rooms.map(r => {
    const count = (tenantsByRoom[r.id] || []).filter(t => t.active).length;
    const status = r.active ? (count > 0 ? 'Đang thuê' : 'Trống') : 'Ngưng hoạt động';
    return `
      <tr>
        <td>${r.code}</td>
        <td>${r.capacity}</td>
        <td>${count}</td>
        <td>${fmtVND(r.price)}</td>
        <td>${status}</td>
        <td>
          <button data-action="edit" data-id="${r.id}">Sửa</button>
          <button class="secondary" data-action="toggle" data-id="${r.id}">
            ${r.active ? 'Tắt' : 'Bật'}
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // actions
  tbody.querySelectorAll('button').forEach(btn => {
    const id = Number(btn.getAttribute('data-id'));
    const action = btn.getAttribute('data-action');
    btn.addEventListener('click', () => {
      if (action === 'edit') openRoomModal(id);
      if (action === 'toggle') {
        const room = roomById(id);
        room.active = !room.active;
        saveDB(); renderRooms(); toast('Đã cập nhật trạng thái phòng');
      }
    });
  });

  $('#btnAddRoom').onclick = () => openRoomModal();
}

function renderTenants() {
  const tbody = $('#tenantsTable');
  tbody.innerHTML = db.tenants.map(t => `
    <tr>
      <td>${t.name}</td>
      <td>${t.phone}</td>
      <td>${roomById(t.roomId)?.code || '-'}</td>
      <td>${t.startDate}</td>
      <td>${t.active ? 'Đang ở' : 'Đã rời'}</td>
      <td>
        <button data-action="edit" data-id="${t.id}">Sửa</button>
        <button class="secondary" data-action="toggle" data-id="${t.id}">
          ${t.active ? 'Cho rời' : 'Cho ở lại'}
        </button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('button').forEach(btn => {
    const id = Number(btn.getAttribute('data-id'));
    const action = btn.getAttribute('data-action');
    btn.addEventListener('click', () => {
      if (action === 'edit') openTenantModal(id);
      if (action === 'toggle') {
        const t = tenantById(id);
        t.active = !t.active;
        saveDB(); renderTenants(); toast('Đã cập nhật trạng thái khách');
      }
    });
  });

  // populate room select
  const sel = $('#tenantRoom');
  sel.innerHTML = db.rooms.filter(r => r.active).map(r => `
    <option value="${r.id}">${r.code}</option>
  `).join('');

  $('#btnAddTenant').onclick = () => openTenantModal();
}

function renderPayments() {
  const tbody = $('#paymentsTable');
  tbody.innerHTML = db.invoices.map(inv => `
    <tr>
      <td>${roomById(inv.roomId)?.code || '-'}</td>
      <td>${inv.month}</td>
      <td>${fmtVND(inv.roomPrice)}</td>
      <td>${inv.electric}</td>
      <td>${inv.water}</td>
      <td>${fmtVND(inv.total)}</td>
      <td>${inv.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
      <td>
        <button data-action="edit" data-id="${inv.id}">Sửa</button>
        <button class="secondary" data-action="toggle" data-id="${inv.id}">
          ${inv.status === 'paid' ? 'Đánh dấu chưa' : 'Đánh dấu đã'}
        </button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('button').forEach(btn => {
    const id = Number(btn.getAttribute('data-id'));
    const action = btn.getAttribute('data-action');
    btn.addEventListener('click', () => {
      const inv = invoiceById(id);
      if (action === 'edit') openInvoiceModal(inv);
      if (action === 'toggle') {
        inv.status = inv.status === 'paid' ? 'unpaid' : 'paid';
        saveDB(); renderPayments(); renderDashboard();
        toast('Đã cập nhật trạng thái hóa đơn');
      }
    });
  });

  $('#btnGenerateInvoices').onclick = () => {
    const mk = monthKey();
    const existing = new Set(db.invoices.filter(i => i.month === mk).map(i => i.roomId));
    const activeRooms = db.rooms.filter(r => r.active);
    const tenantsByRoom = groupTenantsByRoom();

    activeRooms.forEach(r => {
      if (existing.has(r.id)) return;
      const hasTenant = (tenantsByRoom[r.id] || []).some(t => t.active);
      const electric = hasTenant ? randInt(30, 120) : 0;
      const water = hasTenant ? randInt(3, 12) : 0;
      const roomPrice = r.price;
      const total = roomPrice + electric * db.config.electricPrice + water * db.config.waterPrice;
      db.invoices.push({
        id: nextId(db.invoices),
        roomId: r.id,
        month: mk,
        roomPrice,
        electric,
        water,
        total,
        note: '',
        status: 'unpaid',
      });
    });
    saveDB(); renderPayments(); renderDashboard();
    toast('Đã tạo hóa đơn tháng hiện tại');
  };
}

function renderReports() {
  $('#btnRunReport').onclick = () => {
    const m = $('#reportMonth').value || monthKey();
    const invs = db.invoices.filter(i => i.month === m);
    const total = invs.reduce((s, i) => s + i.total, 0);
    const paid = invs.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
    const unpaid = total - paid;
    $('#reportResult').innerHTML = `
      <div class="cards">
        <div class="card"><div class="card-title">Tổng hóa đơn</div><div class="card-value">${fmtVND(total)}</div></div>
        <div class="card"><div class="card-title">Đã thanh toán</div><div class="card-value">${fmtVND(paid)}</div></div>
        <div class="card"><div class="card-title">Chưa thanh toán</div><div class="card-value">${fmtVND(unpaid)}</div></div>
      </div>
      <div class="panel" style="margin-top:12px">
        <h3>Chi tiết hóa đơn tháng ${m}</h3>
        <table>
          <thead>
            <tr><th>Phòng</th><th>Tiền phòng</th><th>Điện</th><th>Nước</th><th>Tổng</th><th>Trạng thái</th></tr>
          </thead>
          <tbody>
            ${invs.map(i => `
              <tr>
                <td>${roomById(i.roomId)?.code || '-'}</td>
                <td>${fmtVND(i.roomPrice)}</td>
                <td>${fmtVND(i.electric * db.config.electricPrice)}</td>
                <td>${fmtVND(i.water * db.config.waterPrice)}</td>
                <td>${fmtVND(i.total)}</td>
                <td>${i.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  };
}

function renderSettings() {
  $('#cfgElectric').value = db.config.electricPrice;
  $('#cfgWater').value = db.config.waterPrice;
  $('#cfgRoomPrice').value = db.config.defaultRoomPrice;

  $('#btnSaveSettings').onclick = () => {
    db.config.electricPrice = Number($('#cfgElectric').value) || 0;
    db.config.waterPrice = Number($('#cfgWater').value) || 0;
    db.config.defaultRoomPrice = Number($('#cfgRoomPrice').value) || 0;
    saveDB(); renderDashboard(); renderPayments();
    toast('Đã lưu cấu hình');
  };
}

function renderAll() {
  renderDashboard();
  renderRooms();
  renderTenants();
  renderPayments();
  renderReports();
  renderSettings();
}

// ===== Helpers =====
function nextId(arr) {
  return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1;
}
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function roomById(id) { return db.rooms.find(r => r.id === id); }
function tenantById(id) { return db.tenants.find(t => t.id === id); }
function invoiceById(id) { return db.invoices.find(i => i.id === id); }
function groupTenantsByRoom() {
  const map = {};
  db.tenants.forEach(t => {
    map[t.roomId] = map[t.roomId] || [];
    map[t.roomId].push(t);
  });
  return map;
}

// ===== Modals =====
function openRoomModal(id) {
  const modal = $('#roomModal');
  const title = $('#roomModalTitle');
  const code = $('#roomCode');
  const cap = $('#roomCapacity');
  const price = $('#roomPrice');

  if (id) {
    const r = roomById(id);
    title.textContent = `Sửa phòng ${r.code}`;
    code.value = r.code;
    cap.value = r.capacity;
    price.value = r.price;
  } else {
    title.textContent = 'Thêm phòng';
    code.value = '';
    cap.value = 2;
    price.value = db.config.defaultRoomPrice;
  }

  modal.classList.add('show');

  $('#saveRoom').onclick = () => {
    const payload = {
      code: code.value.trim(),
      capacity: Number(cap.value) || 1,
      price: Number(price.value) || 0,
    };
    if (!payload.code) return toast('Vui lòng nhập mã phòng');

    if (id) {
      const r = roomById(id);
      Object.assign(r, payload);
    } else {
      db.rooms.push({ id: nextId(db.rooms), active: true, ...payload });
    }
    saveDB(); modal.classList.remove('show'); renderRooms(); renderDashboard();
    toast('Đã lưu phòng');
  };
  $('#closeRoomModal').onclick = () => modal.classList.remove('show');
}

function openTenantModal(id) {
  const modal = $('#tenantModal');
  const title = $('#tenantModalTitle');
  const name = $('#tenantName');
  const phone = $('#tenantPhone');
  const roomSel = $('#tenantRoom');
  const start = $('#tenantStart');

  if (id) {
    const t = tenantById(id);
    title.textContent = `Sửa khách ${t.name}`;
    name.value = t.name;
    phone.value = t.phone;
    roomSel.value = t.roomId;
    start.value = t.startDate;
  } else {
    title.textContent = 'Thêm khách';
    name.value = '';
    phone.value = '';
    start.value = todayISO();
  }

  modal.classList.add('show');

  $('#saveTenant').onclick = () => {
    const payload = {
      name: name.value.trim(),
      phone: phone.value.trim(),
      roomId: Number(roomSel.value),
      startDate: start.value || todayISO(),
      active: true,
    };
    if (!payload.name || !payload.roomId) return toast('Vui lòng nhập đủ thông tin');

    if (id) {
      const t = tenantById(id);
      Object.assign(t, payload);
    } else {
      db.tenants.push({ id: nextId(db.tenants), ...payload });
    }
    saveDB(); modal.classList.remove('show'); renderTenants(); renderDashboard();
    toast('Đã lưu khách trọ');
  };
  $('#closeTenantModal').onclick = () => modal.classList.remove('show');
}

let currentInvoiceId = null;
function openInvoiceModal(inv) {
  currentInvoiceId = inv.id;
  $('#invElectric').value = inv.electric;
  $('#invWater').value = inv.water;
  $('#invNote').value = inv.note || '';
  $('#invoiceModal').classList.add('show');

  $('#saveInvoice').onclick = () => {
    const i = invoiceById(currentInvoiceId);
    i.electric = Number($('#invElectric').value) || 0;
    i.water = Number($('#invWater').value) || 0;
    i.note = $('#invNote').value || '';
    i.total = i.roomPrice + i.electric * db.config.electricPrice + i.water * db.config.waterPrice;
    saveDB(); $('#invoiceModal').classList.remove('show'); renderPayments(); renderDashboard();
    toast('Đã lưu hóa đơn');
  };
  $('#closeInvoiceModal').onclick = () => $('#invoiceModal').classList.remove('show');
}

// ===== Import/Export/Reset =====
function initImportExport() {
  $('#btnExport').onclick = () => {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boarding_house_${monthKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Đã export dữ liệu');
  };

  $('#btnImport').onclick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          Object.assign(db, data);
          saveDB(); renderAll();
          toast('Đã import dữ liệu');
        } catch {
          toast('File không hợp lệ');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  $('#btnReset').onclick = () => {
    if (!confirm('Reset dữ liệu về mặc định?')) return;
    localStorage.removeItem(STORE_KEY);
    loadDB(); renderAll();
    toast('Đã reset dữ liệu');
  };
}

// ===== Init =====
window.addEventListener('DOMContentLoaded', () => {
  loadDB();
  initNav();
  initImportExport();
  renderAll();
});
