
import React from 'react';
import { 
  Users, 
  Home, 
  DollarSign, 
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { REVENUE_DATA, MOCK_ROOMS } from '../constants';

const StatCard = ({ title, value, icon, trend, trendValue, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trendValue}
      </div>
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const occupiedCount = MOCK_ROOMS.filter(r => r.status === 'OCCUPIED').length;
  const occupancyRate = Math.round((occupiedCount / MOCK_ROOMS.length) * 100);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Chào buổi sáng, Quản trị viên!</h1>
          <p className="text-slate-500">Hôm nay là ngày 24 tháng 10 năm 2024</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Tải báo cáo PDF</button>
          <button className="bg-indigo-600 px-4 py-2 rounded-lg text-white text-sm font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all">Thu tiền hàng loạt</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng doanh thu tháng" 
          value="58.200.000đ" 
          icon={<DollarSign size={24} />} 
          trend="up" 
          trendValue="+12.5%" 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Tỷ lệ lấp đầy" 
          value={`${occupancyRate}%`} 
          icon={<Home size={24} />} 
          trend="up" 
          trendValue="+2.1%" 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Số khách thuê" 
          value="42" 
          icon={<Users size={24} />} 
          trend="up" 
          trendValue="+4" 
          color="bg-amber-500" 
        />
        <StatCard 
          title="Hóa đơn chưa thu" 
          value="3" 
          icon={<AlertCircle size={24} />} 
          trend="down" 
          trendValue="-2" 
          color="bg-rose-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900">Doanh thu 6 tháng gần nhất</h3>
            <select className="bg-slate-50 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 outline-none">
              <option>Năm 2024</option>
              <option>Năm 2023</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: any) => [`${value.toLocaleString()}đ`, 'Doanh thu']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-900 mb-6">Trạng thái phòng</h3>
          <div className="flex-1 flex flex-col justify-center items-center">
             <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="80" stroke="#f1f5f9" strokeWidth="16" fill="transparent" />
                  <circle cx="96" cy="96" r="80" stroke="#4f46e5" strokeWidth="16" fill="transparent" 
                    strokeDasharray={502.4} 
                    strokeDashoffset={502.4 * (1 - occupancyRate/100)} 
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black text-slate-900">{occupancyRate}%</span>
                  <span className="text-xs text-slate-500 font-medium">Đang thuê</span>
                </div>
             </div>
             <div className="mt-8 space-y-3 w-full">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                    <span className="text-sm text-slate-600">Đang ở</span>
                  </div>
                  <span className="font-bold text-slate-900">{occupiedCount} phòng</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <span className="text-sm text-slate-600">Còn trống</span>
                  </div>
                  <span className="font-bold text-slate-900">{MOCK_ROOMS.length - occupiedCount} phòng</span>
                </div>
             </div>
          </div>
          <button className="mt-6 w-full py-3 bg-slate-50 rounded-xl text-indigo-600 text-sm font-bold hover:bg-indigo-50 transition-colors">Xem chi tiết phòng</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
