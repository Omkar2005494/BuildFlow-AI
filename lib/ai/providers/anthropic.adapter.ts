import Anthropic from "@anthropic-ai/sdk";
import { BaseProviderAdapter } from "./base.adapter";
import { ProviderId } from "../types";
import { env } from "@/lib/env";

export class AnthropicAdapter extends BaseProviderAdapter {
  id: ProviderId = "anthropic";
  name = "Anthropic";
  private client: Anthropic | null = null;

  constructor() {
    super();
    if (this.isAvailable()) {
      this.client = new Anthropic({
        apiKey: env.ANTHROPIC_API_KEY,
        maxRetries: 2,
      });
    }
  }

  isAvailable(): boolean {
    return !!env.ANTHROPIC_API_KEY;
  }

  async generateJSON(prompt: string, modelId: string): Promise<string> {
    if (!this.client) throw new Error("Anthropic is not configured");

    const message = await this.client.messages.create({
      model: modelId,
      max_tokens: 8192,
      temperature: 0.2,
      system: "You are an expert AI software architect. You must strictly reply with valid JSON only. Do not include markdown formatting or conversational text.",
      messages: [
        { role: "user", content: prompt }
      ]
    });

    const content = message.content[0].type === "text" ? message.content[0].text : "";
    if (!content) throw new Error("Empty response from Anthropic");

    return this.extractJSON(content);
  }
}
