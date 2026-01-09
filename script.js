// Dữ liệu mẫu ban đầu
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
