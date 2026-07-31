import OpenAI from "openai";
import { BaseProviderAdapter } from "./base.adapter";
import { ProviderId } from "../types";
import { env } from "@/lib/env";

export class OpenAIAdapter extends BaseProviderAdapter {
  id: ProviderId = "openai";
  name = "OpenAI";
  private client: OpenAI | null = null;

  constructor() {
    super();
    if (this.isAvailable()) {
      this.client = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
        maxRetries: 2,
      });
    }
  }

  isAvailable(): boolean {
    return !!env.OPENAI_API_KEY;
  }

  async generateJSON(prompt: string, modelId: string): Promise<string> {
    if (!this.client) throw new Error("OpenAI is not configured");

    const completion = await this.client.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert AI software architect. You must strictly reply with valid JSON only." },
        { role: "user", content: prompt }
      ],
      model: modelId,
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Empty response from OpenAI");

    return this.extractJSON(content);
  }
}
