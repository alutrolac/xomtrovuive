// Utility
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const currency = (v) => (v || 0).toLocaleString("vi-VN") + " VND";

// State
const state = {
  auth: { loggedIn: false },
  mode: DEFAULT_DATA_MODE,
  fees: { ...DEFAULT_FEES },
  tenants: [],
  rooms: []
};

// ---- Auth ----
function initAuth() {
  const form = $("#loginForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const u = $("#username").value.trim();
    const p = $("#password").value.trim();
    if (u === AUTH_CONFIG.username && p === AUTH_CONFIG.password) {
      state.auth.loggedIn = true;
      $("#authContainer").style.display = "none";
      $("#mainLayout").style.display = "grid";
      initApp();
    } else {
      alert("Sai tài khoản hoặc mật khẩu.");
    }
  });
  $("#logoutBtn").addEventListener("click", () => {
    state.auth.loggedIn = false;
    location.reload();
  });
}

// ---- Data generation (local) ----
function randomName(i) {
  const fn = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Võ", "Đặng", "Bùi", "Đỗ", "Huỳnh"];
  const ln = ["An", "Bình", "Châu", "Duy", "Giang", "Hà", "Hưng", "Khánh", "Long", "Minh", "Nam", "Phúc", "Quân", "Tâm", "Trang"];
  return `${fn[i % fn.length]} ${ln[i % ln.length]} ${i}`;
}
function generateLocalData(baseTenants, baseRooms) {
  const rooms = [];
  // Ensure 40 rooms: 101-140
  for (let r = 101; r <= 140; r++) {
    const occupied = Math.random() < 0.7; // 70% occupancy
    rooms.push({
      room: String(r),
      status: occupied ? "occupied" : "vacant",
      electricKwh: occupied ? Math.floor(50 + Math.random() * 60) : 0,
      waterM3: occupied ? Math.floor(3 + Math.random() * 6) : 0
    });
  }
  // Merge base rooms
  if (Array.isArray(baseRooms)) {
    baseRooms.forEach(br => {
      const idx = rooms.findIndex(x => x.room === String(br.room));
      if (idx >= 0) rooms[idx] = { ...rooms[idx], ...br };
    });
  }

  const tenants = [];
  // Ensure 100 tenants assigned to occupied rooms
  const occRooms = rooms.filter(r => r.status === "occupied").map(r => r.room);
  for (let i = 0; i < 100; i++) {
    const room = occRooms[i % occRooms.length];
    tenants.push({
      name: randomName(i + 1),
      phone: "09" + Math.floor(10000000 + Math.random() * 89999999),
      email: `user${i + 1}@example.com`,
      room: room,
      moveIn: new Date(2024, Math.floor(Math.random() * 12), Math.floor(1 + Math.random() * 27))
        .toISOString().slice(0, 10)
    });
  }
  // Merge base tenants
  if (Array.isArray(baseTenants)) {
    baseTenants.forEach(bt => tenants.unshift(bt));
  }

  return { tenants, rooms };
}

// ---- Google Sheets CSV fetch ----
async function fetchCSV(url) {
  const res = await fetch(url);
  const text = await res.text();
  // Simple CSV to array of objects
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(",").map(h => h.trim());
  const rows = lines.map(line => {
    const cols = line.split(",").map(c => c.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = cols[i]);
    return obj;
  });
  return rows;
}

async function loadData(mode) {
  if (mode === "sheets" && SHEET_CSV_URLS.tenants && SHEET_CSV_URLS.rooms && SHEET_CSV_URLS.settings) {
    try {
      const [tenants, rooms, settings] = await Promise.all([
        fetchCSV(SHEET_CSV_URLS.tenants),
        fetchCSV(SHEET_CSV_URLS.rooms),
        fetchCSV(SHEET_CSV_URLS.settings)
      ]);
      state.tenants = tenants.map(t => ({
        name: t.name || t["Họ tên"] || "",
        phone: t.phone || t["Điện thoại"] || "",
        email: t.email || t["Email"] || "",
        room: String(t.room || t["Phòng"] || ""),
        moveIn: t.moveIn || t["Ngày vào"] || ""
      }));
      state.rooms = rooms.map(r => ({
        room: String(r.room || r["Phòng"] || ""),
        status: (r.status || r["Trạng thái"] || "occupied").toLowerCase(),
        electricKwh: Number(r.electricKwh || r["Điện(kWh)"] || 0),
        waterM3: Number(r.waterM3 || r["Nước(m3)"] || 0)
      }));
      state.fees = {
        electricPerKwh: Number(settings[0]?.electricPerKwh || settings[0]?.["Điện(VND/kWh)"] || DEFAULT_FEES.electricPerKwh),
        waterPerM3: Number(settings[0]?.waterPerM3 || settings[0]?.["Nước(VND/m3)"] || DEFAULT_FEES.waterPerM3),
        roomPerMonth: Number(settings[0]?.roomPerMonth || settings[0]?.["Phòng(VND/tháng)"] || DEFAULT_FEES.roomPerMonth)
      };
      return;
    } catch (e) {
      alert("Không tải được từ Google Sheets, dùng dữ liệu Local.");
    }
  }
  // Fallback Local: load samples + autogen
  const [baseTenants, baseRooms, baseFees] = await Promise.all([
    fetch("data/sample-tenants.json").then(r => r.json()),
    fetch("data/sample-rooms.json").then(r => r.json()),
    fetch("data/sample-bill-settings.json").then(r => r.json())
  ]);
  const generated = generateLocalData(baseTenants, baseRooms);
  state.tenants = generated.tenants;
  state.rooms = generated.rooms;
  state.fees = { ...DEFAULT_FEES, ...baseFees };
}

// ---- Renderers ----
function renderNav() {
  $$(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".nav-item").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const v = btn.dataset.view;
      $$(".view").forEach(s => s.style.display = "none");
      $("#view-" + v).style.display = "block";
    });
  });
}

function renderDashboard() {
  $("#statRooms").textContent = String(state.rooms.length);
  const occupied = state.rooms.filter(r => r.status === "occupied").length;
  $("#statOccupied").textContent = String(occupied);
  $("#statTenants").textContent = String(state.tenants.length);

  const estRevenue = occupied * state.fees.roomPerMonth
    + state.rooms.reduce((sum, r) => sum + (r.electricKwh * state.fees.electricPerKwh + r.waterM3 * state.fees.waterPerM3), 0);
  $("#statRevenue").textContent = currency(estRevenue);

  $("#feeElectric").textContent = String(state.fees.electricPerKwh);
  $("#feeWater").textContent = String(state.fees.waterPerM3);
  $("#feeRoom").textContent = String(state.fees.roomPerMonth);
}

function renderTenants() {
  const body = $("#tenantsTableBody");
  body.innerHTML = "";
  const q = $("#globalSearch").value.trim().toLowerCase();
  state.tenants
    .filter(t => !q || [t.name, t.phone, t.email, t.room, t.moveIn].some(x => String(x).toLowerCase().includes(q)))
    .forEach(t => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${t.name}</td>
        <td>${t.phone}</td>
        <td>${t.email}</td>
        <td>${t.room}</td>
        <td>${t.moveIn}</td>
        <td>
          <button class="btn" data-action="edit">Sửa</button>
          <button class="btn" data-action="remove">Xóa</button>
        </td>
      `;
      tr.querySelector('[data-action="remove"]').addEventListener("click", () => {
        state.tenants = state.tenants.filter(x => x !== t);
        renderTenants();
        renderDashboard();
      });
      body.appendChild(tr);
    });

  $("#addTenantBtn").onclick = () => {
    const name = prompt("Họ tên:");
    if (!name) return;
    const phone = prompt("Điện thoại:");
    const email = prompt("Email:");
    const room = prompt("Phòng (vd: 101):");
    const moveIn = prompt("Ngày vào (YYYY-MM-DD):");
    state.tenants.push({ name, phone, email, room, moveIn });
    renderTenants();
    renderRooms();
    renderDashboard();
  };
}

function renderRooms() {
  const body = $("#roomsTableBody");
  body.innerHTML = "";
  const q = $("#globalSearch").value.trim().toLowerCase();
  state.rooms
    .filter(r => !q || [r.room, r.status, r.electricKwh, r.waterM3].some(x => String(x).toLowerCase().includes(q)))
    .forEach(r => {
      const tenantsInRoom = state.tenants.filter(t => t.room === r.room).map(t => t.name).join(", ");
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.room}</td>
        <td>${r.status === "occupied" ? "Đang ở" : "Trống"}</td>
        <td>${tenantsInRoom || "-"}</td>
        <td>${r.electricKwh}</td>
        <td>${r.waterM3}</td>
        <td>
          <button class="btn" data-action="toggle">${r.status === "occupied" ? "Chuyển trống" : "Cho thuê"}</button>
          <button class="btn" data-action="meter">Cập nhật số điện/nước</button>
        </td>
      `;
      tr.querySelector('[data-action="toggle"]').addEventListener("click", () => {
        r.status = r.status === "occupied" ? "vacant" : "occupied";
        if (r.status === "vacant") {
          // remove tenants from this room
          state.tenants = state.tenants.filter(t => t.room !== r.room);
          r.electricKwh = 0; r.waterM3 = 0;
        }
        renderRooms(); renderTenants(); renderDashboard();
      });
      tr.querySelector('[data-action="meter"]').addEventListener("click", () => {
        const e = Number(prompt("Số điện (kWh):", r.electricKwh));
        const w = Number(prompt("Số nước (m³):", r.waterM3));
        if (!Number.isNaN(e)) r.electricKwh = e;
        if (!Number.isNaN(w)) r.waterM3 = w;
        renderRooms(); renderDashboard();
      });
      body.appendChild(tr);
    });

  $("#addRoomBtn").onclick = () => {
    const room = prompt("Số phòng:");
    if (!room) return;
    const status = prompt("Trạng thái (occupied/vacant):", "vacant");
    const electricKwh = Number(prompt("Điện kWh:", "0")) || 0;
    const waterM3 = Number(prompt("Nước m³:", "0")) || 0;
    state.rooms.push({ room: String(room), status, electricKwh, waterM3 });
    renderRooms(); renderDashboard();
  };
}

function renderBilling() {
  const body = $("#billingTableBody");
  body.innerHTML = "";
  const occupiedRooms = state.rooms.filter(r => r.status === "occupied");
  occupiedRooms.forEach(r => {
    const roomFee = state.fees.roomPerMonth;
    const elecFee = r.electricKwh * state.fees.electricPerKwh;
    const waterFee = r.waterM3 * state.fees.waterPerM3;
    const total = roomFee + elecFee + waterFee;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.room}</td>
      <td>${currency(roomFee)}</td>
      <td>${currency(elecFee)}</td>
      <td>${currency(waterFee)}</td>
      <td>${currency(total)}</td>
      <td>${BILLING_CONTEXT.monthLabel}</td>
    `;
    body.appendChild(tr);
  });

  $("#generateBillsBtn").onclick = () => {
    alert(`Đã tạo hóa đơn cho ${occupiedRooms.length} phòng. Bạn có thể xuất CSV bằng cách copy bảng.`);
  };
}

function renderSettings() {
  $("#inputElectricFee").value = state.fees.electricPerKwh;
  $("#inputWaterFee").value = state.fees.waterPerM3;
  $("#inputRoomFee").value = state.fees.roomPerMonth;

  $("#saveFeesBtn").onclick = () => {
    const e = Number($("#inputElectricFee").value);
    const w = Number($("#inputWaterFee").value);
    const r = Number($("#inputRoomFee").value);
    if ([e, w, r].some(v => Number.isNaN(v) || v < 0)) {
      alert("Giá trị không hợp lệ");
      return;
    }
    state.fees = { electricPerKwh: e, waterPerM3: w, roomPerMonth: r };
    renderDashboard(); renderBilling();
    alert("Đã lưu biểu phí.");
  };

  $("#testSheetsBtn").onclick = async () => {
    if (!SHEET_CSV_URLS.tenants || !SHEET_CSV_URLS.rooms || !SHEET_CSV_URLS.settings) {
      alert("Chưa cấu hình URL CSV cho Google Sheets.");
      return;
    }
    try {
      const tenants = await fetchCSV(SHEET_CSV_URLS.tenants);
      alert(`Kết nối OK. Đọc được ${tenants.length} dòng từ sheet Tenants.`);
    } catch {
      alert("Không đọc được CSV từ Sheets.");
    }
  };
}

// ---- Global search ----
function initGlobalSearch() {
  $("#globalSearch").addEventListener("input", () => {
    const currentView = document.querySelector(".nav-item.active").dataset.view;
    if (currentView === "tenants") renderTenants();
    else if (currentView === "rooms") renderRooms();
    else if (currentView === "billing") renderBilling();
  });
}

// ---- Data mode controls ----
function initDataControls() {
  $("#dataMode").value = state.mode;
  $("#dataMode").addEventListener("change", (e) => {
    state.mode = e.target.value;
  });
  $("#reloadData").addEventListener("click", async () => {
    await loadData(state.mode);
    renderAll();
  });
}

// ---- Init app ----
async function initApp() {
  renderNav();
  initGlobalSearch();
  initDataControls();
  await loadData(state.mode);
  renderAll();
}

function renderAll() {
  renderDashboard();
  renderTenants();
  renderRooms();
  renderBilling();
  renderSettings();
}

// Boot
document.addEventListener("DOMContentLoaded", initAuth);
