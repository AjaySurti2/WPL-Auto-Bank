import { GoogleGenAI, Type } from "@google/genai";
import { GeminiAnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeStatementSummary = async (statementText: string): Promise<GeminiAnalysisResult> => {
  if (!apiKey) {
    console.warn("API Key not found. Returning mock analysis.");
    return {
      summary: "API Key missing. This is a mock summary of your spending patterns.",
      spendingTrends: [{ category: "Mock Food", amount: 150 }, { category: "Mock Transport", amount: 50 }],
      anomalies: ["Unusual transaction detected at 'Mock Store'"]
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following bank statement summary text and provide a structured JSON response with a textual summary, spending trends (category and amount), and any potential anomalies or high-value warnings. Text: ${statementText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            spendingTrends: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                }
              }
            },
            anomalies: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as GeminiAnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};