
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  FileText, 
  Receipt, 
  LogOut, 
  Menu, 
  X,
  Plus,
  Search,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Tenant, Room, Invoice, ViewType } from './types';
import { generateMockData } from './mockData';
import { MOCK_ADMIN, PRICING } from './constants';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Data State
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const data = generateMockData();
    setTenants(data.tenants);
    setRooms(data.rooms);
    setInvoices(data.invoices);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === MOCK_ADMIN.username && loginForm.password === MOCK_ADMIN.password) {
      setIsLoggedIn(true);
    } else {
      alert('Sai tài khoản hoặc mật khẩu!');
    }
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.roomNumber.includes(searchTerm)
  );

  const stats = useMemo(() => {
    const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((acc, curr) => acc + curr.total, 0);
    const unpaidRevenue = invoices.filter(inv => inv.status === 'unpaid').reduce((acc, curr) => acc + curr.total, 0);
    const occupancyRate = (rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100;
    
    // Revenue by month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const chartData = months.map((m, idx) => ({
      name: m,
      revenue: invoices
        .filter(inv => parseInt(inv.month) === idx + 1 && inv.status === 'paid')
        .reduce((sum, i) => sum + i.total, 0)
    })).filter(d => d.revenue > 0);

    return { totalRevenue, unpaidRevenue, occupancyRate, chartData };
  }, [invoices, rooms]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-900 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-blue-100 rounded-xl mb-4 text-blue-600">
              <Home size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Quản Lý Nhà Trọ Pro</h1>
            <p className="text-slate-500">Đăng nhập để tiếp tục quản lý</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tài khoản</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={loginForm.username}
                onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                placeholder="123"
              />
            </div>
            <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
              Đăng nhập
            </button>
          </form>
          <div className="mt-6 text-center text-xs text-slate-400 uppercase tracking-widest font-bold">
            © 2024 Smart Living Solutions
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col fixed inset-y-0 z-50`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Home size={20} />
          </div>
          {sidebarOpen && <span className="font-bold text-lg whitespace-nowrap">QL Nhà Trọ</span>}
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <NavItem active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} icon={<LayoutDashboard size={20}/>} label="Tổng quan" collapsed={!sidebarOpen} />
          <NavItem active={currentView === 'tenants'} onClick={() => setCurrentView('tenants')} icon={<Users size={20}/>} label="Khách thuê" collapsed={!sidebarOpen} />
          <NavItem active={currentView === 'rooms'} onClick={() => setCurrentView('rooms')} icon={<Home size={20}/>} label="Phòng trọ" collapsed={!sidebarOpen} />
          <NavItem active={currentView === 'invoices'} onClick={() => setCurrentView('invoices')} icon={<Receipt size={20}/>} label="Hóa đơn" collapsed={!sidebarOpen} />
          <NavItem active={currentView === 'contracts'} onClick={() => setCurrentView('contracts')} icon={<FileText size={20}/>} label="Hợp đồng" collapsed={!sidebarOpen} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 p-8`}>
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
              <Menu size={20} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
              {currentView === 'dashboard' && 'Bảng điều khiển'}
              {currentView === 'tenants' && 'Quản lý khách thuê'}
              {currentView === 'rooms' && 'Quản lý phòng trọ'}
              {currentView === 'invoices' && 'Hệ thống hóa đơn'}
              {currentView === 'contracts' && 'Hợp đồng điện tử'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm nhanh..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
              AD
            </div>
          </div>
        </header>

        {/* View Content */}
        {currentView === 'dashboard' && <DashboardView stats={stats} rooms={rooms} invoices={invoices} />}
        {currentView === 'tenants' && <TenantsView tenants={filteredTenants} />}
        {currentView === 'rooms' && <RoomsView rooms={rooms} />}
        {currentView === 'invoices' && <InvoicesView invoices={invoices} />}
        {currentView === 'contracts' && <ContractsView tenants={tenants} />}
      </main>
    </div>
  );
};

const NavItem: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string, collapsed: boolean}> = ({active, onClick, icon, label, collapsed}) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all duration-200 ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
  >
    {icon}
    {!collapsed && <span className="font-medium">{label}</span>}
  </button>
);

const StatCard: React.FC<{label: string, value: string, icon: React.ReactNode, color: string}> = ({label, value, icon, color}) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between overflow-hidden relative">
    <div className="relative z-10">
      <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
    <div className={`p-4 rounded-xl ${color} text-white shadow-lg`}>
      {icon}
    </div>
  </div>
);

const DashboardView: React.FC<{stats: any, rooms: Room[], invoices: Invoice[]}> = ({stats, rooms, invoices}) => {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];
  const roomStatusData = [
    { name: 'Đang ở', value: rooms.filter(r => r.status === 'occupied').length },
    { name: 'Trống', value: rooms.filter(r => r.status === 'available').length },
    { name: 'Sửa chữa', value: rooms.filter(r => r.status === 'maintenance').length },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Tổng doanh thu" value={`${stats.totalRevenue.toLocaleString()} đ`} icon={<TrendingUp size={24}/>} color="bg-blue-600" />
        <StatCard label="Chưa thanh toán" value={`${stats.unpaidRevenue.toLocaleString()} đ`} icon={<AlertCircle size={24}/>} color="bg-rose-500" />
        <StatCard label="Tỷ lệ lấp đầy" value={`${stats.occupancyRate.toFixed(1)}%`} icon={<Users size={24}/>} color="bg-emerald-500" />
        <StatCard label="Số phòng trống" value={`${rooms.filter(r => r.status === 'available').length} phòng`} icon={<Home size={24}/>} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <CreditCard size={20} className="text-blue-500" />
            Biểu đồ doanh thu 3 tháng gần nhất
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Room Status */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Trạng thái phòng</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roomStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {roomStatusData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[idx]}}></div>
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Hóa đơn mới nhất</h3>
          <button className="text-blue-600 font-medium text-sm hover:underline">Xem tất cả</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                <th className="px-6 py-4">Phòng</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Tháng</th>
                <th className="px-6 py-4 text-right">Tổng tiền</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.slice(-5).reverse().map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-700">P.{inv.roomNumber}</td>
                  <td className="px-6 py-4 text-slate-600">{inv.tenantName}</td>
                  <td className="px-6 py-4 text-slate-500">Tháng {inv.month}/{inv.year}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800">{inv.total.toLocaleString()} đ</td>
                  <td className="px-6 py-4 flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${inv.status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                      {inv.status === 'paid' ? 'Đã thu' : 'Chưa thu'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TenantsView: React.FC<{tenants: Tenant[]}> = ({tenants}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Danh sách khách thuê</h3>
        <p className="text-slate-500 text-sm">Quản lý thông tin chi tiết {tenants.length} khách thuê</p>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors">
        <Plus size={18} /> Thêm khách mới
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
            <th className="px-6 py-4">Phòng</th>
            <th className="px-6 py-4">Họ và tên</th>
            <th className="px-6 py-4">Số điện thoại</th>
            <th className="px-6 py-4">Quê quán</th>
            <th className="px-6 py-4">Ngày bắt đầu</th>
            <th className="px-6 py-4 text-center">Tùy chọn</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tenants.map((t) => (
            <tr key={t.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4"><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold text-sm">P.{t.roomNumber}</span></td>
              <td className="px-6 py-4 font-semibold text-slate-800">{t.name}</td>
              <td className="px-6 py-4 text-slate-600">{t.phone}</td>
              <td className="px-6 py-4 text-slate-600">{t.hometown}</td>
              <td className="px-6 py-4 text-slate-500">{t.startDate}</td>
              <td className="px-6 py-4 text-center">
                <button className="text-blue-600 hover:text-blue-800 font-medium px-2">Sửa</button>
                <button className="text-rose-600 hover:text-rose-800 font-medium px-2">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const RoomsView: React.FC<{rooms: Room[]}> = ({rooms}) => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {rooms.map((room) => (
      <div 
        key={room.id} 
        className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg ${
          room.status === 'occupied' 
            ? 'border-blue-200 bg-blue-50 text-blue-700' 
            : room.status === 'available' 
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700' 
              : 'border-slate-200 bg-slate-100 text-slate-500'
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold uppercase">Phòng</span>
          {room.status === 'occupied' ? <CheckCircle size={14}/> : <AlertCircle size={14}/>}
        </div>
        <h4 className="text-2xl font-black">{room.number}</h4>
        <p className="text-[10px] mt-2 font-bold uppercase tracking-wider">
          {room.status === 'occupied' ? 'Đã thuê' : room.status === 'available' ? 'Trống' : 'Sửa chữa'}
        </p>
      </div>
    ))}
  </div>
);

const InvoicesView: React.FC<{invoices: Invoice[]}> = ({invoices}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Quản lý hóa đơn</h3>
          <div className="flex gap-2">
             <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
              Ghi chỉ số điện nước
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                <th className="px-6 py-4">Phòng</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Tháng/Năm</th>
                <th className="px-6 py-4 text-right">Thành tiền</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-700">P.{inv.roomNumber}</td>
                  <td className="px-6 py-4 text-slate-600">{inv.tenantName}</td>
                  <td className="px-6 py-4 text-slate-500">T{inv.month}/{inv.year}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800">{inv.total.toLocaleString()} đ</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${inv.status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {inv.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedInvoice(inv)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal Simulation */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <button 
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600"
            >
              <X size={20} />
            </button>
            
            <div className="border-b pb-6 mb-6">
              <h2 className="text-3xl font-black text-slate-900 uppercase">Hóa Đơn Tiền Phòng</h2>
              <p className="text-slate-500 mt-1 italic">Mã hóa đơn: {selectedInvoice.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400 mb-2">Người thuê:</p>
                <p className="text-lg font-bold text-slate-800">{selectedInvoice.tenantName}</p>
                <p className="text-slate-600">Phòng: {selectedInvoice.roomNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase text-slate-400 mb-2">Thời gian:</p>
                <p className="text-lg font-bold text-slate-800">Tháng {selectedInvoice.month} Năm {selectedInvoice.year}</p>
                <p className="text-slate-600">Ngày xuất: {selectedInvoice.createdAt}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-dashed">
                <span className="text-slate-600">Tiền thuê phòng</span>
                <span className="font-bold">{selectedInvoice.rentAmount.toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-dashed">
                <div className="flex flex-col">
                  <span className="text-slate-600">Tiền điện</span>
                  <span className="text-xs text-slate-400">{selectedInvoice.electricityUnits} kWh x {selectedInvoice.electricityPrice}đ</span>
                </div>
                <span className="font-bold">{(selectedInvoice.electricityUnits * selectedInvoice.electricityPrice).toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-dashed">
                <div className="flex flex-col">
                  <span className="text-slate-600">Tiền nước</span>
                  <span className="text-xs text-slate-400">{selectedInvoice.waterUnits} m³ x {selectedInvoice.waterPrice}đ</span>
                </div>
                <span className="font-bold">{(selectedInvoice.waterUnits * selectedInvoice.waterPrice).toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between items-center py-6 bg-slate-50 px-6 rounded-2xl mt-8">
                <span className="text-xl font-bold text-slate-900">TỔNG CỘNG</span>
                <span className="text-2xl font-black text-blue-600">{selectedInvoice.total.toLocaleString()} đ</span>
              </div>
            </div>

            <div className="mt-8 flex gap-4 no-print">
              <button 
                onClick={() => window.print()}
                className="flex-1 bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
              >
                <FileText size={18}/> In hóa đơn
              </button>
              <button 
                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all"
              >
                Xác nhận thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ContractsView: React.FC<{tenants: Tenant[]}> = ({tenants}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-500">
    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
      <h3 className="text-xl font-bold text-slate-800">Quản lý hợp đồng</h3>
    </div>
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      {tenants.slice(0, 5).map(tenant => (
        <div key={tenant.id} className="border-4 border-slate-900 p-8 rounded-lg relative overflow-hidden bg-slate-50">
          <div className="absolute top-0 right-0 bg-slate-900 text-white px-6 py-2 font-bold uppercase text-xs tracking-widest">
            HỢP ĐỒNG THUÊ NHÀ
          </div>
          
          <div className="text-center mb-10">
            <h4 className="text-2xl font-black uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
            <p className="font-bold">Độc lập - Tự do - Hạnh phúc</p>
            <div className="w-32 h-0.5 bg-slate-900 mx-auto mt-2"></div>
          </div>

          <div className="space-y-6 text-slate-800">
            <p className="font-bold text-lg mb-4">I. CÁC BÊN GIAO KẾT</p>
            <div className="space-y-2 pl-4">
              <p><span className="font-bold uppercase">Bên A (Chủ nhà):</span> Nguyễn Văn Admin - ID: 123456789</p>
              <p><span className="font-bold uppercase">Bên B (Khách thuê):</span> {tenant.name} - ID: {tenant.idCard}</p>
            </div>

            <p className="font-bold text-lg mb-4 mt-8">II. NỘI DUNG HỢP ĐỒNG</p>
            <div className="space-y-4 pl-4 leading-relaxed">
              <p>1. Bên A đồng ý cho bên B thuê phòng số: <span className="font-bold">P.{tenant.roomNumber}</span>.</p>
              <p>2. Giá thuê cố định hàng tháng: <span className="font-bold">{PRICING.ROOM_RENT.toLocaleString()} đ</span>.</p>
              <p>3. Tiền điện: <span className="font-bold">{PRICING.ELECTRICITY.toLocaleString()} đ/kWh</span>. Tiền nước: <span className="font-bold">{PRICING.WATER.toLocaleString()} đ/m³</span>.</p>
              <p>4. Ngày bắt đầu hợp đồng: <span className="font-bold">{tenant.startDate}</span>.</p>
            </div>

            <div className="grid grid-cols-2 gap-12 mt-16 text-center">
              <div>
                <p className="font-bold mb-20 uppercase">ĐẠI DIỆN BÊN A</p>
                <p className="italic text-slate-400">(Ký và ghi rõ họ tên)</p>
              </div>
              <div>
                <p className="font-bold mb-20 uppercase">ĐẠI DIỆN BÊN B</p>
                <p className="italic text-slate-400">(Ký và ghi rõ họ tên)</p>
                <p className="font-bold mt-4">{tenant.name}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t flex justify-end no-print">
            <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors">
              In bản sao hợp đồng
            </button>
          </div>
        </div>
      ))}
      <div className="text-center py-4 text-slate-400 text-sm">
        Hiển thị mẫu 5 hợp đồng đầu tiên.
      </div>
    </div>
  </div>
);

export default App;
