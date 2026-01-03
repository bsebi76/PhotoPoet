
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { PoemStyle } from "../types";

const API_KEY = process.env.API_KEY || "";

export const generateInspiration = async (
  base64Data: string,
  mimeType: string
): Promise<string> => {
  if (!API_KEY) throw new Error("API Key is not configured.");
  const genAI = new GoogleGenAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze this photo. Provide a short, evocative summary (2-3 sentences) of the salient visual details, colors, textures, and the overall mood you perceive. 
    Speak as a poetic observer. Do not mention "the image" or "the photo" directly if possible, focus on the essence of the scene.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ inlineData: { mimeType, data: base64Data } }, { text: prompt }],
      },
      config: { temperature: 0.7, thinkingConfig: { thinkingBudget: 1000 } },
    });
    return response.text?.trim() || "A silent moment captured in light.";
  } catch (error: any) {
    console.error("Inspiration Error:", error);
    throw new Error("Could not glean inspiration from this image.");
  }
};

export const generatePoemFromImage = async (
  base64Data: string,
  mimeType: string,
  style: PoemStyle
): Promise<string> => {
  if (!API_KEY) throw new Error("API Key is not configured.");
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Based on the visual elements of this photograph, compose a beautiful and unique poem.
    Strictly follow the structure of a "${style}".
    Ensure the poem captures the colors, textures, and mood of the scene.
    Return only the poem text with appropriate line breaks.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ inlineData: { mimeType, data: base64Data } }, { text: prompt }],
      },
      config: { 
        temperature: 0.9, 
        thinkingConfig: { thinkingBudget: 2000 } 
      },
    });

    return response.text?.trim() || "";
  } catch (error: any) {
    console.error("Poem Error:", error);
    throw new Error("The muses are silent. Please try again.");
  }
};
