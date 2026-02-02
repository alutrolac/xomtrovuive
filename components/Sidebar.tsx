
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: 'fa-chart-line', label: 'Tổng quan' },
    { path: '/rooms', icon: 'fa-door-open', label: 'Quản lý phòng' },
    { path: '/tenants', icon: 'fa-users', label: 'Khách thuê' },
    { path: '/billing', icon: 'fa-file-invoice-dollar', label: 'Hóa đơn' },
    { path: '/ai-assistant', icon: 'fa-robot', label: 'Trợ lý AI' },
  ];

  return (
    <div className="w-64 bg-indigo-900 text-white h-screen fixed left-0 top-0 shadow-xl z-20 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <i className="fas fa-hotel text-indigo-400"></i>
          HostelPro
        </h1>
        <p className="text-xs text-indigo-300 mt-1 uppercase tracking-widest font-semibold">Management System</p>
      </div>

      <nav className="mt-6 px-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all ${
              location.pathname === item.path
                ? 'bg-indigo-700 text-white shadow-lg'
                : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
            }`}
          >
            <i className={`fas ${item.icon} w-6`}></i>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-6 bg-indigo-950/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-lg font-bold">
            AD
          </div>
          <div>
            <p className="text-sm font-semibold">Admin</p>
            <p className="text-xs text-indigo-400">Quản lý cấp cao</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
