
import { api } from './api';

export const geminiService = {
  sendMessage: async (prompt: string, history: {role: string, content: string}[]) => {
    try {
      // NOW CALLING THE BACKEND API INSTEAD OF LOCAL SDK
      const response = await api.post('/ai/chat', { prompt, history });
      return response as string;
    } catch (error) {
      console.error("AI Error:", error);
      return "The backend AI service is temporarily unavailable.";
    }
  }
};
