
import React from 'react';
import { Home, Plus, Search, Filter, MoreVertical, LayoutGrid, List } from 'lucide-react';
import { MOCK_ROOMS } from '../constants';
import { RoomStatus, Room } from '../types';

// Fix: Using React.FC to properly type the component and its props, including the React 'key' attribute.
const RoomCard: React.FC<{ room: Room }> = ({ room }) => {
  const getStatusStyle = (status: RoomStatus) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'OCCUPIED': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'MAINTENANCE': return 'bg-rose-50 text-rose-600 border-rose-100';
    }
  };

  const getStatusLabel = (status: RoomStatus) => {
    switch (status) {
      case 'AVAILABLE': return 'Còn trống';
      case 'OCCUPIED': return 'Đang ở';
      case 'MAINTENANCE': return 'Sửa chữa';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors`}>
          <Home size={24} />
        </div>
        <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50">
          <MoreVertical size={20} />
        </button>
      </div>
      <div>
        <h4 className="text-lg font-bold text-slate-900">{room.name}</h4>
        <p className="text-xs text-slate-500 font-medium mb-3">{room.type} • Tầng {room.floor}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-bold text-slate-900">{room.price.toLocaleString()}đ</span>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(room.status)}`}>
            {getStatusLabel(room.status)}
          </span>
        </div>
      </div>
      <div className="mt-5 pt-5 border-t border-slate-50 flex gap-2">
        <button className="flex-1 text-xs font-bold py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">Xem chi tiết</button>
        {room.status === 'AVAILABLE' && (
          <button className="flex-1 text-xs font-bold py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Tạo hợp đồng</button>
        )}
      </div>
    </div>
  );
};

const RoomList: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý phòng</h1>
          <p className="text-slate-500">Tổng cộng {MOCK_ROOMS.length} phòng trong danh sách</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 px-5 py-2.5 rounded-xl text-white font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all self-start">
          <Plus size={18} />
          Thêm phòng mới
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm phòng theo tên, loại..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            Lọc
          </button>
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button className="p-1.5 bg-white shadow-sm rounded-lg text-indigo-600"><LayoutGrid size={18} /></button>
            <button className="p-1.5 text-slate-500 hover:text-slate-700"><List size={18} /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_ROOMS.map(room => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default RoomList;
