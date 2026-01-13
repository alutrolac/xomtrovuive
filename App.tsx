
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RoomList from './components/RoomList';
import Invoices from './components/Invoices';
import TenantList from './components/TenantList';
import AIAssistant from './components/AIAssistant';
import { ViewType } from './types';
import { Bell, Search, User, LogIn, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('DASHBOARD');
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock login for demo
    if (loginData.username === 'admin' && loginData.password === 'admin') {
      setIsLoggedIn(true);
    } else {
      alert('Sử dụng admin/admin để đăng nhập bản demo!');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background blobs for luxury feel */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600 rounded-full blur-[128px] opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600 rounded-full blur-[128px] opacity-20 translate-x-1/2 translate-y-1/2"></div>
        
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-in zoom-in duration-500">
          <div className="bg-indigo-600 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto flex items-center justify-center mb-4 backdrop-blur-md">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold">LuxRental Pro</h1>
            <p className="text-indigo-100 text-sm mt-1 opacity-80">Hệ thống quản lý bất động sản cao cấp</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tài khoản quản trị</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={loginData.username}
                    onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                    placeholder="Nhập tài khoản" 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mật khẩu</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    placeholder="••••••••" 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-xs text-slate-500 font-medium group-hover:text-slate-700 transition-colors">Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Quên mật khẩu?</a>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <LogIn size={20} />
              Đăng nhập hệ thống
            </button>
            
            <p className="text-center text-xs text-slate-400">
              Chưa có tài khoản? <a href="#" className="text-indigo-600 font-bold">Đăng ký bản dùng thử</a>
            </p>
          </form>
          
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center gap-4">
             <span className="text-[10px] text-slate-400 font-medium">Bảo mật SSL 256-bit</span>
             <span className="text-[10px] text-slate-400 font-medium">•</span>
             <span className="text-[10px] text-slate-400 font-medium">Hỗ trợ 24/7</span>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD': return <Dashboard />;
      case 'ROOMS': return <RoomList />;
      case 'TENANTS': return <TenantList />;
      case 'INVOICES': return <Invoices />;
      case 'AI_ASSISTANT': return <AIAssistant />;
      default: return (
        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center">
            <ShieldCheck size={40} />
          </div>
          <p className="font-bold uppercase tracking-widest text-xs">Tính năng đang phát triển</p>
        </div>
      );
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        onLogout={() => setIsLoggedIn(false)} 
      />
      
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8 bg-white/60 backdrop-blur-md sticky top-0 py-4 z-40 px-2 -mx-2">
          <div className="relative w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm nhanh thông tin..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-3 bg-white pl-1 pr-4 py-1 rounded-xl border border-slate-200">
               <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">AD</div>
               <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 leading-none">Admin User</p>
                  <p className="text-[10px] text-slate-500 mt-1 leading-none">Chủ hệ thống</p>
               </div>
            </div>
          </div>
        </header>

        <div className="pb-12">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
