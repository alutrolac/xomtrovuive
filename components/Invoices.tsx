
import React from 'react';
import { 
  Plus, 
  Search, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';
import { MOCK_INVOICES } from '../constants';

const Invoices: React.FC = () => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-emerald-50 text-emerald-600';
      case 'UNPAID': return 'bg-amber-50 text-amber-600';
      case 'OVERDUE': return 'bg-rose-50 text-rose-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <CheckCircle2 size={14} />;
      case 'UNPAID': return <Clock size={14} />;
      case 'OVERDUE': return <AlertCircle size={14} />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PAID': return 'Đã thanh toán';
      case 'UNPAID': return 'Chờ thanh toán';
      case 'OVERDUE': return 'Quá hạn';
      default: return status;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hóa đơn & Thanh toán</h1>
          <p className="text-slate-500">Quản lý các khoản thu hàng tháng của tòa nhà</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl text-slate-700 font-bold text-sm border border-slate-200 hover:bg-slate-50 transition-all">
            <Download size={18} />
            Xuất báo cáo
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 px-5 py-2.5 rounded-xl text-white font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all">
            <Plus size={18} />
            Tạo hóa đơn lẻ
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo mã hóa đơn, số phòng..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-sm"
            />
          </div>
          <div className="flex gap-2 shrink-0">
             <select className="bg-white border border-slate-200 text-sm px-4 py-2 rounded-xl text-slate-600 outline-none">
                <option>Tất cả trạng thái</option>
                <option>Đã thanh toán</option>
                <option>Chưa thanh toán</option>
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã HĐ</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Phòng</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kỳ hóa đơn</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng cộng</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_INVOICES.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">{inv.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">Phòng {inv.roomId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{inv.month}, {inv.year}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-indigo-600">{inv.total.toLocaleString()}đ</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500">{inv.createdAt}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(inv.status)}`}>
                      {getStatusIcon(inv.status)}
                      {getStatusLabel(inv.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="In hóa đơn">
                        <Printer size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-50 flex justify-between items-center">
          <p className="text-xs text-slate-500">Hiển thị {MOCK_INVOICES.length} hóa đơn</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs disabled:opacity-50" disabled>Trước</button>
            <button className="px-3 py-1 bg-indigo-600 text-white border border-indigo-600 rounded text-xs">1</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs">2</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
