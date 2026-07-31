import OpenAI from "openai";
import { BaseProviderAdapter } from "./base.adapter";
import { ProviderId } from "../types";
import { env } from "@/lib/env";

export class NvidiaAdapter extends BaseProviderAdapter {
  id: ProviderId = "nvidia";
  name = "NVIDIA NIM";
  private client: OpenAI | null = null;

  constructor() {
    super();
    if (this.isAvailable()) {
      this.client = new OpenAI({
        apiKey: env.NVIDIA_API_KEY,
        baseURL: 'https://integrate.api.nvidia.com/v1',
        maxRetries: 2,
      });
    }
  }

  isAvailable(): boolean {
    return !!env.NVIDIA_API_KEY;
  }

  async generateJSON(prompt: string, modelId: string): Promise<string> {
    if (!this.client) throw new Error("NVIDIA NIM is not configured");

    const completion = await this.client.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert AI software architect. You must strictly reply with valid JSON only." },
        { role: "user", content: prompt }
      ],
      model: modelId,
      temperature: 0.2,
      max_tokens: 8192
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Empty response from NVIDIA");

    return this.extractJSON(content);
  }
}
