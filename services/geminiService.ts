
import { GoogleGenAI } from "@google/genai";
import { Room, Tenant, Invoice } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSmartInsights = async (rooms: Room[], invoices: Invoice[]) => {
  const prompt = `
    Dưới đây là dữ liệu quản lý nhà trọ:
    Rooms: ${JSON.stringify(rooms)}
    Invoices: ${JSON.stringify(invoices)}
    
    Hãy phân tích tình hình kinh doanh này và đưa ra 3 lời khuyên ngắn gọn để tối ưu hóa doanh thu hoặc vận hành. 
    Trả về dưới dạng các gạch đầu dòng ngắn gọn bằng tiếng Việt.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Không thể tải phân tích AI lúc này.";
  }
};

export const generateContract = async (room: Room, tenant: Tenant) => {
  const prompt = `
    Soạn thảo một bản hợp đồng thuê nhà ngắn gọn, chuyên nghiệp dựa trên thông tin sau:
    Khách thuê: ${tenant.name}, CMND: ${tenant.idCard}, SĐT: ${tenant.phone}
    Phòng: ${room.name}, Giá thuê: ${room.price.toLocaleString('vi-VN')} VNĐ/tháng.
    Ngày bắt đầu: ${tenant.startDate}.
    
    Bản hợp đồng cần đầy đủ các điều khoản cơ bản: Thời hạn, Tiền cọc, Quyền và nghĩa vụ. Trình bày chuyên nghiệp bằng tiếng Việt.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Contract Generation Error:", error);
    return "Lỗi khi tạo hợp đồng.";
  }
};

export const chatWithAssistant = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "Bạn là một chuyên gia quản lý bất động sản và nhà trọ tại Việt Nam. Bạn hỗ trợ chủ trọ giải đáp các thắc mắc về pháp lý, tối ưu doanh thu và xử lý tình huống với khách thuê.",
      }
    });
    
    // We send history in a simplified way or just current message for basic implementation
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "Xin lỗi, tôi gặp sự cố khi kết nối.";
  }
};
