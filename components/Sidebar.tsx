
import React from 'react';
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  Receipt, 
  FileText, 
  BarChart3, 
  Sparkles,
  LogOut
} from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout }) => {
  const menuItems = [
    { id: 'DASHBOARD', icon: <LayoutDashboard size={20} />, label: 'Tổng quan' },
    { id: 'ROOMS', icon: <Home size={20} />, label: 'Quản lý phòng' },
    { id: 'TENANTS', icon: <Users size={20} />, label: 'Khách thuê' },
    { id: 'INVOICES', icon: <Receipt size={20} />, label: 'Hóa đơn' },
    { id: 'CONTRACTS', icon: <FileText size={20} />, label: 'Hợp đồng' },
    { id: 'REPORTS', icon: <BarChart3 size={20} />, label: 'Báo cáo' },
    { id: 'AI_ASSISTANT', icon: <Sparkles size={20} />, label: 'AI Assistant', premium: true },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen flex flex-col text-slate-300 fixed left-0 top-0 shadow-2xl">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
          L
        </div>
        <span className="text-white font-bold text-xl tracking-tight">LuxRental <span className="text-indigo-400">Pro</span></span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as ViewType)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentView === item.id 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
              : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className={`${currentView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`}>
              {item.icon}
            </span>
            <span className="font-medium text-sm">{item.label}</span>
            {item.premium && (
              <span className="ml-auto text-[10px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/30 font-bold uppercase">AI</span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
