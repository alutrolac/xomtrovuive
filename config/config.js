// Cấu hình đăng nhập và nguồn dữ liệu
const AUTH_CONFIG = {
  username: "admin",
  password: "admin123"
};

// Chế độ dữ liệu mặc định: "local" hoặc "sheets"
const DEFAULT_DATA_MODE = "local";

// Nếu dùng Google Sheets: dán URL CSV "Publish to web" vào đây
// Mỗi sheet tương ứng một URL CSV
const SHEET_CSV_URLS = {
  tenants: "",  // ví dụ: "https://docs.google.com/spreadsheets/d/e/.../pub?gid=0&single=true&output=csv"
  rooms: "",
  settings: ""
};

// Biểu phí mặc định (fallback nếu chưa có settings)
const DEFAULT_FEES = {
  electricPerKwh: 4000,
  waterPerM3: 20000,
  roomPerMonth: 1500000
};

// Mốc tháng hiện tại để tính hoá đơn (đơn giản, có thể mở rộng)
const BILLING_CONTEXT = {
  monthLabel: "Tháng hiện tại"
};
