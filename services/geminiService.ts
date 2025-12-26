
import { GoogleGenAI, Type } from "@google/genai";
import { AdRequest, AdResponse, Platform } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateAdCopy = async (params: AdRequest, feedback?: string): Promise<AdResponse> => {
  const model = 'gemini-3-flash-preview';

  const prompt = `
    Generate high-converting advertisement copy for the following product/service:
    - Product/Service Name: ${params.productName}
    - Target Audience: ${params.targetAudience}
    - Tone: ${params.tone}
    - Key Features: ${params.features}
    - Target Language: ${params.language}
    - Selected Platforms: ${params.platforms.join(', ')}
    ${feedback ? `- Additional Feedback/Refinement: ${feedback}` : ''}

    Rules:
    1. Create distinct variations for EACH selected platform.
    2. Ensure the content is optimized for the specific platform's character limits and style.
    3. Use persuasive marketing techniques (e.g., AIDA framework).
    4. Provide catchy headlines and strong Calls to Action (CTA).
    5. The output MUST be in ${params.language}.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          variations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                platform: { type: Type.STRING },
                headline: { type: Type.STRING },
                content: { type: Type.STRING },
                cta: { type: Type.STRING },
              },
              required: ["id", "platform", "headline", "content", "cta"]
            }
          }
        },
        required: ["variations"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return data as AdResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Invalid response format from AI");
  }
};
