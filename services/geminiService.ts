import { GoogleGenAI, Type } from "@google/genai";
import { Task } from "../types";

export const parseInstructionsWithGemini = async (instruction: string): Promise<Task[]> => {
  if (!process.env.API_KEY) {
    console.error("API Key is missing");
    return [];
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extract development tasks from the following user request. 
      The user wants to run commands in specific directories.
      Return a JSON array of objects with 'name' (short descriptive name), 'path' (absolute path or relative if implied), and 'command' (the command to execute).
      
      User Request:
      ${instruction}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "A short name for the window title" },
              path: { type: Type.STRING, description: "The working directory path" },
              command: { type: Type.STRING, description: "The command to execute" }
            },
            required: ["name", "path", "command"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];

    const parsedData = JSON.parse(text);
    
    return parsedData.map((item: any) => ({
      id: crypto.randomUUID(),
      name: item.name,
      path: item.path,
      command: item.command
    }));

  } catch (error) {
    console.error("Gemini parsing failed:", error);
    throw error;
  }
};