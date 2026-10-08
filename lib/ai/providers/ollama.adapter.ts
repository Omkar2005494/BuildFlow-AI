import { ProviderAdapter, ProviderId } from "../types";

export class OllamaAdapter implements ProviderAdapter {
  id: ProviderId = "ollama";
  name = "Local Ollama";
  
  private baseUrl = "http://127.0.0.1:11434/api";

  async generateJSON(prompt: string, modelId: string = "llama3.2:3b"): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: "user", content: prompt }],
          stream: false,
          format: "json",
          options: {
            temperature: 0.2, // Low temp for more deterministic code/json
            num_ctx: 32000 // Huge context window for blueprints
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.message?.content || "";

    } catch (error: any) {
      console.error("[Ollama Adapter] Generation failed:", error);
      throw new Error(`Local Llama failed: ${error.message}`);
    }
  }

  isAvailable(): boolean {
    // In a real app we could ping the local API, but for now we assume true if explicitly chosen
    return true; 
  }
}
