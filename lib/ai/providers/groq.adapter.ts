import Groq from "groq-sdk";
import { BaseProviderAdapter } from "./base.adapter";
import { ProviderId } from "../types";
import { env } from "@/lib/env";

export class GroqAdapter extends BaseProviderAdapter {
  id: ProviderId = "groq";
  name = "Groq";
  private client: Groq | null = null;

  constructor() {
    super();
    if (this.isAvailable()) {
      this.client = new Groq({
        apiKey: env.GROQ_API_KEY,
        maxRetries: 2,
        timeout: 300000, // 5 minutes instead of 30 seconds
      });
    }
  }

  isAvailable(): boolean {
    return !!env.GROQ_API_KEY;
  }

  async generateJSON(prompt: string, modelId: string): Promise<string> {
    if (!this.client) throw new Error("Groq is not configured");

    const completion = await this.client.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert AI software architect. You must strictly reply with valid JSON only." },
        { role: "user", content: prompt }
      ],
      model: modelId,
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Empty response from Groq");

    return this.extractJSON(content);
  }
}
