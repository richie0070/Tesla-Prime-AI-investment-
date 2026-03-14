
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

let ai: GoogleGenAI | null = null;

function getAI() {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY || 'dummy_key_for_tests';
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}

const BASE_SYSTEM_INSTRUCTION = `
SYSTEM INSTRUCTIONS — TESLA PRIME AI INVESTMENT BROKER (v4.2)
Identity: Institutional Grade Algorithmic Trading Desk.
Tone: Professional, Neutral, Intelligent, High-Frequency Fintech Standard.
Rules: No emojis. Concise but accurate. Use financial terminology (Alpha, Beta, Volatility, Liquidity, Delta).
Context: You are providing insights to investors utilizing the Tesla Prime Terminal.
`;

export async function getMarketAnalysis(dataInput: any, riskLevel: string) {
  try {
    const prompt = `Perform institutional-grade analysis on this dataset: ${JSON.stringify(dataInput)}. Risk Profile: ${riskLevel}. Provide a 1-sentence strategic summary for a hedge fund dashboard. NO emojis.`;
    const response = await getAI().models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        temperature: 0.1,
      },
    });
    return response.text || "Stable volatility detected. Position scaling maintained.";
  } catch (error) {
    return "Alpha generation stable. Monitoring volatility spikes.";
  }
}

export async function getSearchIntelligence(query: string) {
  try {
    const response = await getAI().models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: `Provide an up-to-date institutional analysis on: ${query}. Focus on financial news and macro impact.`,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
      },
    });
    return { text: response.text, sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
  } catch (error) {
    throw new Error("Failed to bridge with search nodes.");
  }
}

export async function generateNeuralVisualization(marketTrend: string) {
  try {
    const response = await getAI().models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `A futuristic financial dashboard visualization for ${marketTrend}. Institutional blue and cyan glows, abstract 3D charts, high-tech interface, sharp 4K detail.` }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    throw new Error("Visualizer error.");
  } catch (error) {
    throw new Error("Projection failed.");
  }
}
