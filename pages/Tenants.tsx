
import React from 'react';
import { MOCK_TENANTS, MOCK_ROOMS } from '../constants';

const Tenants: React.FC = () => {
  const getRoomName = (roomId: string) => {
    return MOCK_ROOMS.find(r => r.id === roomId)?.name || 'N/A';
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Danh sách khách thuê</h2>
            <p className="text-gray-500 text-sm">Quản lý thông tin liên hệ và hợp đồng khách thuê</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 flex items-center gap-2 transition-all active:scale-95">
          <i className="fas fa-user-plus"></i> Thêm khách thuê
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Họ tên</th>
                <th className="px-6 py-4 font-semibold">Phòng</th>
                <th className="px-6 py-4 font-semibold">Số điện thoại</th>
                <th className="px-6 py-4 font-semibold">Ngày bắt đầu</th>
                <th className="px-6 py-4 font-semibold">Tình trạng</th>
                <th className="px-6 py-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_TENANTS.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                        {tenant.name.split(' ').pop()?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{tenant.name}</p>
                        <p className="text-xs text-gray-400">ID: {tenant.idCard}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100">
                      {getRoomName(tenant.roomId)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{tenant.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(tenant.startDate).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-xs text-green-600 font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      Đang ở
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button className="text-gray-400 hover:text-indigo-600 transition-colors" title="Chi tiết">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="text-gray-400 hover:text-indigo-600 transition-colors" title="Tạo hợp đồng (AI)">
                        <i className="fas fa-file-contract"></i>
                      </button>
                      <button className="text-gray-400 hover:text-red-600 transition-colors" title="Xóa">
                        <i className="fas fa-trash-alt"></i>
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

export default Tenants;
