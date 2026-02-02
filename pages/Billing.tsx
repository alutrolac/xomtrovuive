
import React from 'react';
import { MOCK_INVOICES, MOCK_ROOMS } from '../constants';

const Billing: React.FC = () => {
  const getRoomName = (roomId: string) => {
    return MOCK_ROOMS.find(r => r.id === roomId)?.name || 'N/A';
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Quản lý hóa đơn</h2>
            <p className="text-gray-500 text-sm">Theo dõi thu phí phòng, điện, nước hàng tháng</p>
        </div>
        <div className="flex gap-4">
            <button className="bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
                <i className="fas fa-download"></i> Xuất báo cáo
            </button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 flex items-center gap-2 transition-all active:scale-95">
                <i className="fas fa-file-invoice"></i> Lập hóa đơn
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Phòng</th>
                <th className="px-6 py-4 font-semibold">Tháng/Năm</th>
                <th className="px-6 py-4 font-semibold">Tổng tiền</th>
                <th className="px-6 py-4 font-semibold">Hạn thanh toán</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_INVOICES.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-800">{getRoomName(invoice.roomId)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{invoice.month}/{invoice.year}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-indigo-600">{invoice.total.toLocaleString('vi-VN')} đ</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(invoice.dueDate).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      invoice.status === 'Paid' 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-red-100 text-red-700 border-red-200'
                    }`}>
                      {invoice.status === 'Paid' ? 'Đã thu' : 'Chưa thu'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button className="text-gray-400 hover:text-indigo-600 transition-colors" title="Gửi thông báo (Zalo/SMS)">
                        <i className="fas fa-paper-plane"></i>
                      </button>
                      <button className="text-gray-400 hover:text-indigo-600 transition-colors" title="In hóa đơn">
                        <i className="fas fa-print"></i>
                      </button>
                      <button className="text-indigo-600 font-bold text-xs hover:underline">
                        Xác nhận thu
                      </button>
                    </div>
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

export default Billing;
