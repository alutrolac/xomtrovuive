// Dữ liệu mẫu ban đầu
// Dữ liệu mẫu (Backend giả lập lưu tại LocalStorage)
const initialData = [
    { id: 101, tenant: "Nguyễn Văn A", oldElec: 120, newElec: 155, oldWater: 10, newWater: 15, status: "Đã thanh toán" },
    { id: 102, tenant: "Trần Thị B", oldElec: 200, newElec: 280, oldWater: 25, newWater: 32, status: "Chưa thanh toán" }
];

const CONFIG = {
    PRICE_ELEC: 4000,
    PRICE_WATER: 20000,
    PRICE_ROOM: 1500000
};

// Khởi tạo DB
if (!localStorage.getItem('nhatro_db')) {
    localStorage.setItem('nhatro_db', JSON.stringify(initialData));
}

function renderRooms() {
    const rooms = JSON.parse(localStorage.getItem('nhatro_db'));
    const tableBody = document.getElementById('room-table-body');
    tableBody.innerHTML = '';

    rooms.forEach(room => {
        const elecUsed = room.newElec - room.oldElec;
        const waterUsed = room.newWater - room.oldWater;
        const total = CONFIG.PRICE_ROOM + (elecUsed * CONFIG.PRICE_ELEC) + (waterUsed * CONFIG.PRICE_WATER);
        
        tableBody.innerHTML += `
            <tr class="border-b hover:bg-slate-50 transition" id="room-${room.id}">
                <td class="p-4 font-bold text-indigo-600">P.${room.id}</td>
                <td class="p-4 font-medium">${room.tenant}</td>
                <td class="p-4 text-sm text-slate-500">
                    Điện: ${elecUsed} kWh | Nước: ${waterUsed} m3
                </td>
                <td class="p-4 font-bold text-slate-800">${total.toLocaleString()}đ</td>
                <td class="p-4 text-center">
                    <button onclick="exportInvoice(${room.id})" class="bg-emerald-500 text-white px-4 py-1 rounded-lg hover:bg-emerald-600 shadow-sm transition">
                        <i class="fas fa-file-pdf mr-1"></i> In hóa đơn
                    </button>
                </td>
            </tr>
        `;
    });
}

// Hàm xuất hóa đơn PDF "sang chảnh"
async function exportInvoice(roomId) {
    const rooms = JSON.parse(localStorage.getItem('nhatro_db'));
    const r = rooms.find(i => i.id === roomId);
    const elecMoney = (r.newElec - r.oldElec) * CONFIG.PRICE_ELEC;
    const waterMoney = (r.newWater - r.oldWater) * CONFIG.PRICE_WATER;
    const total = CONFIG.PRICE_ROOM + elecMoney + waterMoney;

    const element = document.createElement('div');
    element.innerHTML = `
        <div style="padding: 40px; font-family: Arial, sans-serif; border: 2px solid #333;">
            <h1 style="text-align: center; color: #1e3a8a;">HÓA ĐƠN TIỀN TRỌ</h1>
            <p style="text-align: center;">Tháng 01/2026</p>
            <hr>
            <p><strong>Phòng:</strong> ${r.id} - <strong>Khách thuê:</strong> ${r.tenant}</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr style="background: #f3f4f6;">
                    <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Khoản mục</th>
                    <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Thành tiền</th>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 10px;">Tiền phòng cố định</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${CONFIG.PRICE_ROOM.toLocaleString()}đ</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 10px;">Tiền điện (${r.newElec - r.oldElec} kWh x 4k)</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${elecMoney.toLocaleString()}đ</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 10px;">Tiền nước (${r.newWater - r.oldWater} m3 x 20k)</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${waterMoney.toLocaleString()}đ</td>
                </tr>
                <tr style="font-weight: bold; font-size: 1.2em;">
                    <td style="border: 1px solid #ddd; padding: 10px;">TỔNG CỘNG</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: right; color: #e11d48;">${total.toLocaleString()}đ</td>
                </tr>
            </table>
            <p style="margin-top: 30px; font-style: italic;">Cảm ơn quý khách đã tin tưởng!</p>
        </div>
    `;

    // Cần thêm thư viện này vào index.html để chạy
    const opt = {
        margin: 1,
        filename: `HoaDon_Phong_${r.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    // Sử dụng thư viện html2pdf (cần thêm script ở bước dưới)
    html2pdf().set(opt).from(element).save();
}

window.onload = renderRooms;
const initialData = [
    { id: 101, tenant: "Nguyễn Văn A", oldElec: 120, newElec: 155, oldWater: 10, newWater: 15, status: "Đã thanh toán" },
    { id: 102, tenant: "Trần Thị B", oldElec: 200, newElec: 280, oldWater: 25, newWater: 32, status: "Chưa thanh toán" },
    { id: 103, tenant: "Lê Văn C", oldElec: 50, newElec: 90, oldWater: 5, newWater: 8, status: "Đang nợ" }
];

const PRICE_ELEC = 4000;
const PRICE_WATER = 20000;
const PRICE_ROOM = 1500000;

// Khởi tạo database local
if (!localStorage.getItem('nhatro_db')) {
    localStorage.setItem('nhatro_db', JSON.stringify(initialData));
}

function calculateTotal(room) {
    const elecMoney = (room.newElec - room.oldElec) * PRICE_ELEC;
    const waterMoney = (room.newWater - room.oldWater) * PRICE_WATER;
    return PRICE_ROOM + elecMoney + waterMoney;
}

function renderRooms() {
    const rooms = JSON.parse(localStorage.getItem('nhatro_db'));
    const tableBody = document.getElementById('room-table-body');
    tableBody.innerHTML = '';

    rooms.forEach(room => {
        const total = calculateTotal(room);
        const statusColor = room.status === "Đã thanh toán" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100";
        
        tableBody.innerHTML += `
            <tr class="border-b hover:bg-slate-50 transition">
                <td class="p-4 font-bold text-indigo-600">P.${room.id}</td>
                <td class="p-4">${room.tenant}</td>
                <td class="p-4 text-sm text-slate-500">
                    Sô điện: ${room.newElec - room.oldElec} kWh<br>
                    Số nước: ${room.newWater - room.oldWater} m3
                </td>
                <td class="p-4 font-bold text-slate-800">${total.toLocaleString()}đ</td>
                <td class="p-4">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusColor}">${room.status}</span>
                </td>
                <td class="p-4 text-center">
                    <button class="text-indigo-600 hover:text-indigo-900 mx-2"><i class="fas fa-edit"></i></button>
                    <button class="text-red-600 hover:text-red-900 mx-2"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

// Chạy hàm render khi web tải xong
window.onload = renderRooms;
