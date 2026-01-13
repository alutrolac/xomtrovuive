
import { GoogleGenAI } from "@google/genai";

// Fix: Ensure that GoogleGenAI is initialized correctly with process.env.API_KEY and inside the function call
// as per the @google/genai best practices to handle dynamic API keys correctly.
export const getAIInsights = async (prompt: string, context: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Bạn là trợ lý ảo cao cấp dành cho chủ nhà trọ. Dựa trên dữ liệu sau: ${JSON.stringify(context)}, hãy trả lời câu hỏi: ${prompt}. Trả lời ngắn gọn, chuyên nghiệp, bằng tiếng Việt.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    // Access the .text property directly as it is a getter, not a method.
    return response.text || "Xin lỗi, tôi không thể xử lý yêu cầu lúc này.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.";
  }
};
