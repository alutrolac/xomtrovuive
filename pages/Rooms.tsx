
import React, { useState } from 'react';
import { MOCK_ROOMS } from '../constants';
import { Room } from '../types';

const Rooms: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);

  const filteredRooms = filter === 'All' ? rooms : rooms.filter(r => r.status === filter);

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Occupied': return 'bg-green-100 text-green-700 border-green-200';
      case 'Available': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Maintenance': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'Occupied': return 'Đang thuê';
      case 'Available': return 'Còn trống';
      case 'Maintenance': return 'Bảo trì';
      default: return status;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Danh sách phòng</h2>
            <p className="text-gray-500 text-sm">Quản lý tình trạng và giá thuê các phòng</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 flex items-center gap-2 w-fit transition-all active:scale-95">
          <i className="fas fa-plus"></i> Thêm phòng mới
        </button>
      </div>

      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {['All', 'Available', 'Occupied', 'Maintenance'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === s 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
            }`}
          >
            {s === 'All' ? 'Tất cả' : getStatusText(s)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms.map((room) => (
          <div key={room.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden group">
            <div className="relative h-32 bg-indigo-50 flex items-center justify-center">
              <i className="fas fa-home text-4xl text-indigo-200 group-hover:scale-110 transition-transform"></i>
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(room.status)}`}>
                {getStatusText(room.status)}
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-800">{room.name}</h3>
                <span className="text-xs text-gray-400">Tầng {room.floor}</span>
              </div>
              <p className="text-sm text-gray-500 mb-4 line-clamp-1">{room.description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <div>
                  <p className="text-xs text-gray-400">Giá thuê</p>
                  <p className="text-md font-bold text-indigo-600">{room.price.toLocaleString('vi-VN')} đ</p>
                </div>
                <div className="flex gap-2">
                   <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Sửa">
                      <i className="fas fa-edit"></i>
                   </button>
                   <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                      <i className="fas fa-trash-alt"></i>
                   </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
