
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, Loader2, Info } from 'lucide-react';
import { getAIInsights } from '../services/geminiService';
import { MOCK_ROOMS, MOCK_INVOICES, MOCK_TENANTS } from '../constants';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Chào bạn! Tôi là LuxAI, trợ lý quản lý phòng trọ của bạn. Tôi có thể giúp bạn phân tích doanh thu, gợi ý giá phòng hoặc trả lời các thắc mắc về khách thuê. Bạn muốn hỏi gì hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    const context = {
      rooms: MOCK_ROOMS,
      invoices: MOCK_INVOICES,
      tenants: MOCK_TENANTS,
      stats: {
        totalRevenue: 58200000,
        unpaidInvoices: 3
      }
    };

    const response = await getAIInsights(userMessage, context);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="text-amber-500" />
          LuxAI Assistant
        </h1>
        <p className="text-slate-500">Sử dụng trí tuệ nhân tạo để tối ưu hóa việc kinh doanh của bạn</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-xl flex flex-col overflow-hidden">
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Bot size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">LuxAI Pro v1.0</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span className="text-[10px] text-slate-500 font-medium uppercase">Hệ thống sẵn sàng</span>
              </div>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <Info size={18} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 shrink-0">
                  <Bot size={16} />
                </div>
              )}
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-700 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start items-start gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 shrink-0 animate-pulse">
                <Bot size={16} />
              </div>
              <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-none text-slate-400 text-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Đang phân tích dữ liệu...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Hỏi về doanh thu, khách thuê hoặc gợi ý tăng giá..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Doanh thu tháng này?', 'Phòng nào đang trống?', 'Top khách thuê nợ tiền?'].map(q => (
              <button 
                key={q}
                onClick={() => setInput(q)}
                className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
