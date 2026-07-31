import { GoogleGenerativeAI } from "@google/generative-ai";
import { BaseProviderAdapter } from "./base.adapter";
import { ProviderId } from "../types";
import { env } from "@/lib/env";

export class GeminiAdapter extends BaseProviderAdapter {
  id: ProviderId = "gemini";
  name = "Google Gemini";
  private client: GoogleGenerativeAI | null = null;

  constructor() {
    super();
    if (this.isAvailable()) {
      this.client = new GoogleGenerativeAI(env.GEMINI_API_KEY!);
    }
  }

  isAvailable(): boolean {
    return !!env.GEMINI_API_KEY;
  }

  async generateJSON(prompt: string, modelId: string): Promise<string> {
    if (!this.client) throw new Error("Gemini is not configured");

    const model = this.client.getGenerativeModel({
      model: modelId,
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
      systemInstruction: "You are an expert AI software architect. You must strictly reply with valid JSON only. Do not include markdown formatting or conversational text."
    });

    const result = await model.generateContent(prompt);
    const content = result.response.text();
    if (!content) throw new Error("Empty response from Gemini");

    return this.extractJSON(content);
  }
}
