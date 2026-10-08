import { ProviderAdapter, ProviderId } from "../types";
import http from "http";

export class OllamaAdapter implements ProviderAdapter {
  id: ProviderId = "ollama";
  name = "Local Ollama";

  async generateJSON(prompt: string, modelId: string = "llama3.2:3b"): Promise<string> {
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify({
        model: modelId,
        messages: [{ role: "user", content: prompt }],
        stream: false,
        format: "json",
        options: {
          temperature: 0.2,
          num_ctx: 16000
        }
      });

      const req = http.request(
        {
          hostname: "127.0.0.1",
          port: 11434,
          path: "/api/chat",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(payload)
          },
          timeout: 600000 // 10 minutes timeout for local hardware
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              try {
                const parsed = JSON.parse(data);
                resolve(parsed.message?.content || "");
              } catch (e: any) {
                reject(new Error(`Ollama JSON parse failed: ${e.message}`));
              }
            } else {
              reject(new Error(`Ollama Error: HTTP ${res.statusCode} ${data}`));
            }
          });
        }
      );

      req.on("error", (err) => {
        reject(new Error(`Local Llama connection failed: ${err.message}`));
      });

      req.on("timeout", () => {
        req.destroy();
        reject(new Error("Local Llama request timed out after 10 minutes"));
      });

      req.write(payload);
      req.end();
    });
  }

  isAvailable(): boolean {
    return true;
  }
}
