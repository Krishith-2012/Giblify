import { GoogleGenAI } from "@google/genai";

// Helper to convert File to Base64 string (stripping the data URL prefix for the API if needed, 
// though the new SDK often handles standard base64 strings well, we usually pass raw base64 data)
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Extract the raw base64 data (remove "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateGhibliStyle = async (imageFile: File): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const imagePart = await fileToGenerativePart(imageFile);

    // Prompt engineering for Ghibli style
    const prompt = `
      Redraw this image in the artistic style of Studio Ghibli. 
      Keep the composition and subject matter the same, but change the art style.
      Key characteristics:
      - Hand-painted aesthetic with visible brushstrokes for backgrounds.
      - Vibrant, lush colors (especially greens and blues).
      - Soft, natural lighting with fluffy cumulus clouds if sky is visible.
      - Anime-style character features (if people are present) with expressive eyes.
      - Whimsical, peaceful atmosphere.
      - High resolution, detailed.
      Output ONLY the image.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          imagePart,
          { text: prompt }
        ]
      }
    });

    // Extract the image from the response
    // The structure for image generation response usually contains parts with inlineData
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated in the response.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};