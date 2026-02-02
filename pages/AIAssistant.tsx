
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '../services/geminiService';
import { Message } from '../types';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Xin chào! Tôi là trợ lý quản lý nhà trọ của bạn. Bạn cần tôi giúp soạn hợp đồng, tư vấn pháp lý hay phân tích doanh thu hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatWithAssistant([], userMessage);
      setMessages(prev => [...prev, { role: 'model', text: response || 'Lỗi kết nối AI.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Rất tiếc, đã có lỗi xảy ra.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      <div className="bg-indigo-600 p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
            <i className="fas fa-robot"></i>
          </div>
          <div>
            <h2 className="text-lg font-bold">Smart Manager AI</h2>
            <p className="text-xs text-indigo-100 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Trực tuyến
            </p>
          </div>
        </div>
        <div className="text-xs text-indigo-100 max-w-[200px] text-right">
          Sử dụng trí tuệ nhân tạo Gemini để hỗ trợ quản lý vận hành.
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm text-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
            }`}>
              <div className="whitespace-pre-line leading-relaxed">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-none shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Đặt câu hỏi về quản lý nhà trọ..."
            className="flex-1 bg-transparent px-4 py-2 outline-none text-sm"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-indigo-600 text-white w-10 h-10 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
           {["Viết hợp đồng thuê", "Tư vấn đòi nợ", "Cách tăng giá thuê"].map((suggestion) => (
             <button 
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="text-[10px] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100 hover:bg-indigo-100 whitespace-nowrap"
             >
               {suggestion}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
