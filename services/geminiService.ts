
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Difficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const fetchGEDQuestions = async (
  count: number = 10, 
  difficulty: Difficulty = 'medium',
  history: string[] = []
): Promise<Question[]> => {
  try {
    const historyContext = history.length > 0 
      ? `Avoid repeating the following specific questions or exact scenarios: ${history.join(" | ")}.` 
      : "";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${count} GED Mathematics practice questions specifically for the New York GED exam. 
      Difficulty level: ${difficulty.toUpperCase()}.
      
      Requirements:
      - Topics should include: Basic Algebra, Quantitative Problem Solving, Geometry, and Statistics.
      - ${historyContext}
      - Each question must be unique and different from typical textbook examples.
      - Each question must include 4 options, the correct index (0-3), and a detailed step-by-step pedagogical explanation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              topic: { type: Type.STRING },
              difficulty: { type: Type.STRING }
            },
            required: ["id", "question", "options", "correctIndex", "explanation", "topic", "difficulty"]
          }
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};
