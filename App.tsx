
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Tenants from './pages/Tenants';
import Billing from './pages/Billing';
import AIAssistant from './pages/AIAssistant';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        
        <main className="flex-1 ml-64 p-8 bg-slate-50 min-h-screen">
          <header className="flex justify-between items-center mb-8">
            <div className="relative w-96">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm phòng, khách thuê, hóa đơn..." 
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                />
            </div>
            
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <button className="relative w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:text-indigo-600 transition-colors">
                    <i className="fas fa-bell"></i>
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                  </button>
                  <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:text-indigo-600 transition-colors">
                    <i className="fas fa-cog"></i>
                  </button>
                </div>
                
                <div className="h-10 w-px bg-gray-200"></div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">Minh Admin</p>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Gói Premium</p>
                  </div>
                  <img src="https://picsum.photos/40/40" alt="Avatar" className="w-10 h-10 rounded-xl border border-indigo-100 shadow-sm" />
                </div>
            </div>
          </header>

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/tenants" element={<Tenants />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
          </Routes>
        </main>
      </div>

      {/* Global CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </Router>
  );
};

export default App;
