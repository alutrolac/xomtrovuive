
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  DoorOpen, 
  Receipt, 
  FileText, 
  Settings, 
  Search, 
  Plus, 
  TrendingUp, 
  AlertCircle,
  LogOut,
  Download,
  Printer,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { generateMockData, generateMockBills } from './mockData';
import { Room, Tenant, Bill, RoomStatus } from './types';
import { PRICING } from './constants';
import { getAIInsights } from './geminiService';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ title, value, subValue, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
    <div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
    </div>
    <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
      <Icon size={24} />
    </div>
  </div>
);

// --- Main App ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Bill | null>(null);

  useEffect(() => {
    const { rooms: r, tenants: t } = generateMockData();
    setRooms(r);
    setTenants(t);
    setBills(generateMockBills(r));
  }, []);

  const handleAiInsight = async () => {
    setIsAiLoading(true);
    const insight = await getAIInsights(bills, rooms);
    setAiAnalysis(insight);
    setIsAiLoading(false);
  };

  const revenueData = useMemo(() => {
    const paid = bills.filter(b => b.isPaid).reduce((sum, b) => sum + b.total, 0);
    const pending = bills.filter(b => !b.isPaid).reduce((sum, b) => sum + b.total, 0);
    return [
      { name: 'Đã thanh toán', value: paid },
      { name: 'Chưa thanh toán', value: pending },
    ];
  }, [bills]);

  const stats = {
    revenue: bills.filter(b => b.isPaid).reduce((sum, b) => sum + b.total, 0),
    pending: bills.filter(b => !b.isPaid).reduce((sum, b) => sum + b.total, 0),
    occupancy: (rooms.filter(r => r.status === RoomStatus.OCCUPIED).length / rooms.length) * 100,
    tenantsCount: tenants.length
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-6 sticky top-0 h-screen no-print">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <LayoutDashboard size={24} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Lantana
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Tổng quan" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={DoorOpen} label="Phòng trọ" active={activeTab === 'rooms'} onClick={() => setActiveTab('rooms')} />
          <SidebarItem icon={Users} label="Người thuê" active={activeTab === 'tenants'} onClick={() => setActiveTab('tenants')} />
          <SidebarItem icon={Receipt} label="Hóa đơn" active={activeTab === 'bills'} onClick={() => setActiveTab('bills')} />
          <SidebarItem icon={FileText} label="Hợp đồng" active={activeTab === 'contracts'} onClick={() => setActiveTab('contracts')} />
        </nav>

        <div className="mt-auto space-y-2">
          <SidebarItem icon={Settings} label="Cài đặt" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all">
            <LogOut size={20} />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="flex justify-between items-center mb-8 no-print">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === 'dashboard' && 'Bảng điều khiển'}
              {activeTab === 'rooms' && 'Danh sách phòng'}
              {activeTab === 'tenants' && 'Quản lý người thuê'}
              {activeTab === 'bills' && 'Quản lý hóa đơn'}
              {activeTab === 'contracts' && 'Mẫu hợp đồng'}
            </h1>
            <p className="text-gray-500">Hôm nay là {new Date().toLocaleDateString('vi-VN')}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm nhanh..." 
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-64 shadow-sm"
              />
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
              <Plus size={18} />
              Thêm mới
            </button>
          </div>
        </header>

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500 no-print">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Tổng doanh thu" value={`${stats.revenue.toLocaleString()}đ`} subValue="Tháng hiện tại" icon={TrendingUp} color="emerald" />
              <StatCard title="Tiền chưa thu" value={`${stats.pending.toLocaleString()}đ`} subValue="Từ 6 phòng" icon={AlertCircle} color="amber" />
              <StatCard title="Tỷ lệ lấp đầy" value={`${stats.occupancy}%`} subValue="20/20 phòng" icon={DoorOpen} color="indigo" />
              <StatCard title="Tổng người thuê" value={stats.tenantsCount} subValue="Hơn 100 khách hàng" icon={Users} color="violet" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-gray-800">Doanh thu & Công nợ</h3>
                  <select className="bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-1.5 focus:outline-none">
                    <option>6 tháng gần nhất</option>
                    <option>Năm nay</option>
                  </select>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                        {revenueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#f59e0b'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={24} />
                    <h3 className="font-bold text-lg">AI Insights</h3>
                  </div>
                  {aiAnalysis ? (
                    <div className="text-sm leading-relaxed opacity-90 whitespace-pre-wrap">
                      {aiAnalysis}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <p className="text-indigo-100 mb-4 italic text-sm">Sử dụng trí tuệ nhân tạo để phân tích tình hình kinh doanh của bạn.</p>
                      <button 
                        onClick={handleAiInsight}
                        disabled={isAiLoading}
                        className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-2"
                      >
                        {isAiLoading ? 'Đang phân tích...' : 'Bắt đầu phân tích'}
                      </button>
                    </div>
                  )}
                  {aiAnalysis && (
                    <button onClick={handleAiInsight} className="mt-4 text-xs font-medium text-indigo-100 hover:text-white underline underline-offset-4">
                      Cập nhật phân tích mới
                    </button>
                  )}
                </div>
                {/* Decorative blobs */}
                <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-20%] left-[-20%] w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        )}

        {/* Rooms View */}
        {activeTab === 'rooms' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 no-print">
            {rooms.map(room => (
              <div key={room.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-300 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{room.name}</h4>
                    <p className="text-xs text-gray-400 mt-1">Sức chứa: {room.currentTenants}/{room.capacity} người</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase ${
                    room.status === RoomStatus.OCCUPIED ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {room.status === RoomStatus.OCCUPIED ? 'Đang ở' : 'Trống'}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Giá thuê</span>
                    <span className="font-semibold">{room.price.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Số điện cuối</span>
                    <span className="font-semibold">{room.electricityMeter} kWh</span>
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                  <button className="flex-1 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all">Chi tiết</button>
                  <button className="flex-1 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all">Lập hóa đơn</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tenants View */}
        {activeTab === 'tenants' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden no-print">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Họ tên</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Phòng</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Quê quán</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày bắt đầu</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tenants.map(tenant => (
                  <tr key={tenant.id} className="hover:bg-gray-50 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                          {tenant.name.split(' ').pop()?.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{tenant.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">{tenant.roomId}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{tenant.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{tenant.hometown}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{tenant.startDate}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-bold">Chỉnh sửa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Bills View */}
        {activeTab === 'bills' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden no-print">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Phòng</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tháng</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tiền điện</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tiền nước</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tổng cộng</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bills.map(bill => (
                  <tr key={bill.id} className="hover:bg-gray-50 transition-all">
                    <td className="px-6 py-4 font-bold">{bill.roomId}</td>
                    <td className="px-6 py-4 text-sm">{bill.month}/{bill.year}</td>
                    <td className="px-6 py-4 text-sm">{(bill.elecUsage * bill.elecRate).toLocaleString()}đ</td>
                    <td className="px-6 py-4 text-sm">{(bill.waterUsage * bill.waterRate).toLocaleString()}đ</td>
                    <td className="px-6 py-4 font-bold text-indigo-600">{bill.total.toLocaleString()}đ</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        bill.isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {bill.isPaid ? 'Đã thu' : 'Chưa thu'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex gap-2 justify-end">
                      <button 
                        onClick={() => setSelectedInvoice(bill)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Xem hóa đơn">
                        <Printer size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-all" title="Tải xuống PDF">
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Invoice Modal */}
        {selectedInvoice && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative">
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-10 no-print"
              >
                <Plus className="rotate-45" />
              </button>

              <div id="invoice-content" className="p-10 space-y-8">
                <div className="flex justify-between items-start border-b pb-8">
                  <div>
                    <h2 className="text-2xl font-black text-indigo-600 uppercase tracking-tighter">Lantana Boarding House</h2>
                    <p className="text-sm text-gray-500 mt-1">123 Đường Sông Cầu, Quận 1, TP. HCM</p>
                    <p className="text-sm text-gray-500">Hotline: 0987 654 321</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-3xl font-bold text-gray-900 uppercase">Hóa Đơn</h3>
                    <p className="text-sm text-gray-500 mt-1">Số: {selectedInvoice.id.slice(0, 10)}</p>
                    <p className="text-sm text-gray-500">Ngày: {new Date(selectedInvoice.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 text-sm">
                  <div>
                    <h4 className="font-bold text-gray-400 uppercase tracking-widest text-[10px] mb-2">Đến: {selectedInvoice.roomId}</h4>
                    <p className="font-bold text-lg text-gray-900">Người đại diện thuê phòng</p>
                  </div>
                  <div className="text-right">
                    <h4 className="font-bold text-gray-400 uppercase tracking-widest text-[10px] mb-2">Kỳ thanh toán</h4>
                    <p className="font-bold text-lg text-gray-900">Tháng {selectedInvoice.month}/{selectedInvoice.year}</p>
                  </div>
                </div>

                <table className="w-full text-left text-sm border-t border-b py-4">
                  <thead>
                    <tr className="text-gray-400 uppercase text-[10px] tracking-widest border-b">
                      <th className="py-4">Mô tả dịch vụ</th>
                      <th className="py-4 text-center">Số lượng/Chỉ số</th>
                      <th className="py-4 text-right">Đơn giá</th>
                      <th className="py-4 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-4 font-medium">Tiền thuê phòng</td>
                      <td className="py-4 text-center">1 tháng</td>
                      <td className="py-4 text-right">{PRICING.RENT_PER_MONTH.toLocaleString()}đ</td>
                      <td className="py-4 text-right font-bold">{PRICING.RENT_PER_MONTH.toLocaleString()}đ</td>
                    </tr>
                    <tr>
                      <td className="py-4 font-medium">Tiền điện (Chỉ số: {selectedInvoice.elecUsage} kWh)</td>
                      <td className="py-4 text-center">{selectedInvoice.elecUsage} kWh</td>
                      <td className="py-4 text-right">{selectedInvoice.elecRate.toLocaleString()}đ</td>
                      <td className="py-4 text-right font-bold">{(selectedInvoice.elecUsage * selectedInvoice.elecRate).toLocaleString()}đ</td>
                    </tr>
                    <tr>
                      <td className="py-4 font-medium">Tiền nước (Chỉ số: {selectedInvoice.waterUsage} m³)</td>
                      <td className="py-4 text-center">{selectedInvoice.waterUsage} m³</td>
                      <td className="py-4 text-right">{selectedInvoice.waterRate.toLocaleString()}đ</td>
                      <td className="py-4 text-right font-bold">{(selectedInvoice.waterUsage * selectedInvoice.waterRate).toLocaleString()}đ</td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-end pt-4">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-gray-500">
                      <span>Tổng tiền chưa thuế:</span>
                      <span>{selectedInvoice.total.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Thuế (0%):</span>
                      <span>0đ</span>
                    </div>
                    <div className="flex justify-between text-xl font-black text-indigo-600 border-t pt-2">
                      <span>TỔNG CỘNG:</span>
                      <span>{selectedInvoice.total.toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t grid grid-cols-2 gap-8 text-center text-sm">
                  <div>
                    <p className="font-bold mb-10">Người nhận tiền</p>
                    <p className="text-gray-400 italic">(Ký và ghi rõ họ tên)</p>
                  </div>
                  <div>
                    <p className="font-bold mb-10">Khách hàng</p>
                    <p className="text-gray-400 italic">(Ký và ghi rõ họ tên)</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 flex justify-end gap-3 no-print">
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700"
                >
                  Đóng
                </button>
                <button 
                  onClick={() => window.print()}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 transition-all"
                >
                  <Printer size={16} />
                  In hóa đơn ngay
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contracts View (Placeholder Content) */}
        {activeTab === 'contracts' && (
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-center uppercase mb-10">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
            <p className="text-center font-bold">Độc lập - Tự do - Hạnh phúc</p>
            <h3 className="text-xl font-bold text-center mt-6">HỢP ĐỒNG THUÊ PHÒNG TRỌ</h3>
            
            <div className="space-y-4 text-sm leading-relaxed">
              <p>Hôm nay, ngày .... tháng .... năm 2024, chúng tôi gồm có:</p>
              
              <div>
                <p className="font-bold">BÊN CHO THUÊ (Bên A):</p>
                <p>Họ tên: ......................................................................... Năm sinh: .......................</p>
                <p>CMND/CCCD số: ............................................................ Cấp ngày: .......................</p>
              </div>

              <div>
                <p className="font-bold">BÊN THUÊ (Bên B):</p>
                <p>Họ tên: ......................................................................... Năm sinh: .......................</p>
                <p>CMND/CCCD số: ............................................................ Cấp ngày: .......................</p>
              </div>

              <div>
                <p className="font-bold">ĐIỀU 1: NỘI DUNG HỢP ĐỒNG</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Bên A đồng ý cho Bên B thuê phòng số tại Lantana Boarding House.</li>
                  <li>Giá thuê phòng cố định: <span className="font-bold">1.500.000 VNĐ / tháng</span>.</li>
                  <li>Tiền điện: <span className="font-bold">4.000 VNĐ / kWh</span>.</li>
                  <li>Tiền nước: <span className="font-bold">20.000 VNĐ / m³</span>.</li>
                </ul>
              </div>

              <div>
                <p className="font-bold">ĐIỀU 2: THỜI HẠN THUÊ</p>
                <p>- Thời hạn thuê là .... tháng tính từ ngày ..../..../2024.</p>
              </div>
            </div>

            <div className="flex justify-end no-print pt-10">
              <button onClick={() => window.print()} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2">
                <Printer size={20} /> In mẫu hợp đồng
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
