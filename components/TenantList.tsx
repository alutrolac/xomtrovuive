
import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  CreditCard, 
  Calendar,
  X,
  Check
} from 'lucide-react';
import { MOCK_TENANTS, MOCK_ROOMS } from '../constants';
import { Tenant } from '../types';

const TenantList: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTenant, setNewTenant] = useState({
    name: '',
    phone: '',
    email: '',
    identityCard: '',
    roomId: '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `T${tenants.length + 1}`;
    const tenantToAdd: Tenant = { ...newTenant, id };
    setTenants([tenantToAdd, ...tenants]);
    setShowAddModal(false);
    setNewTenant({
      name: '',
      phone: '',
      email: '',
      identityCard: '',
      roomId: '',
      joinDate: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Khách thuê</h1>
          <p className="text-slate-500">Xem thông tin và quản lý hồ sơ cư dân</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 px-5 py-2.5 rounded-xl text-white font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all self-start"
        >
          <UserPlus size={18} />
          Thêm khách hàng
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <UserPlus size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Tổng khách thuê</p>
            <p className="text-xl font-bold text-slate-900">{tenants.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Check size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Hợp đồng hiệu lực</p>
            <p className="text-xl font-bold text-slate-900">{tenants.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Sắp hết hạn</p>
            <p className="text-xl font-bold text-slate-900">2</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm tên, số điện thoại, CCCD..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            Bộ lọc
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Họ tên khách hàng</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Liên hệ</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Số phòng</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày dời đến</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm">
                        {tenant.name.split(' ').pop()?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{tenant.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">CCCD: {tenant.identityCard}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Phone size={12} className="text-slate-400" />
                        {tenant.phone}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Mail size={12} className="text-slate-400" />
                        {tenant.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold border border-indigo-100">
                      P.{tenant.roomId}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {tenant.joinDate}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      Đang ở
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm Khách Hàng */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Thêm Khách Thuê Mới</h3>
                <p className="text-indigo-100 text-xs mt-1">Vui lòng điền chính xác thông tin hồ sơ khách hàng</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddTenant} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Họ và tên</label>
                    <input 
                      required
                      type="text" 
                      value={newTenant.name}
                      onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                      placeholder="Nguyễn Văn A" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Số điện thoại</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        required
                        type="tel" 
                        value={newTenant.phone}
                        onChange={(e) => setNewTenant({...newTenant, phone: e.target.value})}
                        placeholder="09xx xxx xxx" 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        required
                        type="email" 
                        value={newTenant.email}
                        onChange={(e) => setNewTenant({...newTenant, email: e.target.value})}
                        placeholder="example@gmail.com" 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Số CCCD / CMND</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        required
                        type="text" 
                        value={newTenant.identityCard}
                        onChange={(e) => setNewTenant({...newTenant, identityCard: e.target.value})}
                        placeholder="0123456789xx" 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Chọn phòng</label>
                    <select 
                      required
                      value={newTenant.roomId}
                      onChange={(e) => setNewTenant({...newTenant, roomId: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all appearance-none"
                    >
                      <option value="">-- Chọn phòng trống --</option>
                      {MOCK_ROOMS.filter(r => r.status === 'AVAILABLE').map(room => (
                        <option key={room.id} value={room.id}>Phòng {room.name} - {room.price.toLocaleString()}đ</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ngày dời đến</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        required
                        type="date" 
                        value={newTenant.joinDate}
                        onChange={(e) => setNewTenant({...newTenant, joinDate: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="flex-[2] px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus size={20} />
                  Lưu hồ sơ khách hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantList;
