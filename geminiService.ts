
import { GoogleGenAI } from "@google/genai";
import { Bill, Room } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIInsights = async (bills: Bill[], rooms: Room[]) => {
  const totalIncome = bills.filter(b => b.isPaid).reduce((sum, b) => sum + b.total, 0);
  const pendingIncome = bills.filter(b => !b.isPaid).reduce((sum, b) => sum + b.total, 0);
  const occupancyRate = (rooms.filter(r => r.status === 'OCCUPIED').length / rooms.length) * 100;

  const prompt = `
    Dưới đây là tóm tắt tình hình kinh doanh nhà trọ:
    - Tổng doanh thu thực tế tháng này: ${totalIncome.toLocaleString()} VNĐ
    - Tiền chưa thu: ${pendingIncome.toLocaleString()} VNĐ
    - Tỷ lệ lấp đầy: ${occupancyRate}%
    - Tổng số phòng: ${rooms.length}

    Hãy đưa ra 3 lời khuyên ngắn gọn (trong 150 từ) để tối ưu hóa doanh thu và quản lý khách hàng chuyên nghiệp hơn.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Không thể tải phân tích AI lúc này.";
  }
};
