import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API
// Ideally this comes from import.meta.env.VITE_GEMINI_API_KEY
// For now, we'll expect the variable to be present.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);

export interface VideoScene {
  text: string;
  backgroundColor: string; // Hex code or CSS color
  textColor: string;
  duration: number; // in seconds
  animation: "fade" | "slide-up" | "pop";
}

export interface VideoScript {
  topic: string;
  scenes: VideoScene[];
  backgroundMusic?: string; // Optional suggestion
}

export const generateVideoScript = async (topic: string): Promise<VideoScript> => {
  const prompt = `
    Create a script for a viral 15-second TikTok video about: "${topic}".
    The video will be generated programmatically using text overlays on solid/gradient backgrounds.
    
    Return ONLY a valid JSON object with the following structure:
    {
      "topic": "${topic}",
      "scenes": [
        {
          "text": "Short punchy text for this scene",
          "backgroundColor": "#hexcode or gradient css",
          "textColor": "#hexcode",
          "duration": 3,
          "animation": "pop"
        }
      ]
    }
    
    Rules:
    - Total duration should be around 15 seconds.
    - Texts must be short (max 10 words per scene).
    - Use vibrant, high-contrast colors (e.g., #FF0050, #00F2EA, Black, White).
    - Animations can be: "fade", "slide-up", "pop".
    - Provide 4-6 scenes.
    - Return RAW JSON. No markdown formatting.
  `;

  try {
    // Use local proxy to avoid browser-side SDK issues
    const response = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`Server API Error: ${response.status}`);
    }

    const data = await response.json();
    // Extract text from REST format
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("No content returned from Gemini");

    // Clean up if Gemini returns markdown code blocks
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(cleanText) as VideoScript;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Falha ao gerar roteiro com Gemini.");
  }
};
