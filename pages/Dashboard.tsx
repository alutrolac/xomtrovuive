
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MOCK_ROOMS, MOCK_INVOICES } from '../constants';
import { getSmartInsights } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const [aiInsights, setAiInsights] = useState<string>('Đang tải phân tích thông minh...');

  useEffect(() => {
    const fetchInsights = async () => {
      const insight = await getSmartInsights(MOCK_ROOMS, MOCK_INVOICES);
      setAiInsights(insight || '');
    };
    fetchInsights();
  }, []);

  const totalRooms = MOCK_ROOMS.length;
  const occupiedRooms = MOCK_ROOMS.filter(r => r.status === 'Occupied').length;
  const availableRooms = MOCK_ROOMS.filter(r => r.status === 'Available').length;
  const maintenanceRooms = MOCK_ROOMS.filter(r => r.status === 'Maintenance').length;

  const revenueData = [
    { name: 'T8', value: 45000000 },
    { name: 'T9', value: 52000000 },
    { name: 'T10', value: 48000000 },
    { name: 'T11', value: 61000000 },
    { name: 'T12', value: 55000000 },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h2>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm text-gray-500 border border-gray-100">
          <i className="fas fa-calendar-alt mr-2 text-indigo-500"></i>
          Hôm nay: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">
              <i className="fas fa-door-open"></i>
            </div>
            <span className="text-green-500 text-xs font-bold">+12%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Tổng số phòng</h3>
          <p className="text-2xl font-bold text-gray-800">{totalRooms}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center text-xl">
              <i className="fas fa-user-check"></i>
            </div>
            <span className="text-gray-400 text-xs font-bold">Lấp đầy</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Phòng đang thuê</h3>
          <p className="text-2xl font-bold text-gray-800">{occupiedRooms}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center text-xl">
              <i className="fas fa-clock"></i>
            </div>
            <span className="text-red-500 text-xs font-bold">Cảnh báo</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Hóa đơn chưa thu</h3>
          <p className="text-2xl font-bold text-gray-800">5</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center text-xl">
              <i className="fas fa-wallet"></i>
            </div>
            <span className="text-green-500 text-xs font-bold">+5.4%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Doanh thu tháng này</h3>
          <p className="text-2xl font-bold text-gray-800">125.5M</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Biểu đồ doanh thu (6 tháng gần nhất)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? '#4f46e5' : '#c7d2fe'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Smart Insights */}
        <div className="bg-indigo-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="fas fa-lightbulb"></i>
            </div>
            <h3 className="text-lg font-bold">Phân tích từ AI</h3>
          </div>
          <div className="text-indigo-100 text-sm leading-relaxed whitespace-pre-line">
            {aiInsights}
          </div>
          <button className="mt-6 w-full py-2 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-colors">
            Xem báo cáo chi tiết
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Trạng thái phòng</h3>
                <span className="text-xs text-indigo-600 font-bold cursor-pointer hover:underline">Xem tất cả</span>
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-600">Đang thuê</span>
                    </div>
                    <span className="font-bold">{occupiedRooms} phòng</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-gray-600">Còn trống</span>
                    </div>
                    <span className="font-bold">{availableRooms} phòng</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-sm text-gray-600">Đang bảo trì</span>
                    </div>
                    <span className="font-bold">{maintenanceRooms} phòng</span>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Hoạt động gần đây</h3>
            </div>
            <div className="p-6 space-y-4">
                <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-check text-xs"></i>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800">Hóa đơn P.101 đã thanh toán</p>
                        <p className="text-xs text-gray-400">2 giờ trước</p>
                    </div>
                </div>
                <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-user-plus text-xs"></i>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800">Khách thuê mới - Nguyễn Văn C (P.202)</p>
                        <p className="text-xs text-gray-400">5 giờ trước</p>
                    </div>
                </div>
                <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-exclamation-triangle text-xs"></i>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800">Cảnh báo bảo trì vòi nước P.202</p>
                        <p className="text-xs text-gray-400">1 ngày trước</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
