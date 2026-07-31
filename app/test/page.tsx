"use client";
import { env } from "@/lib/env";
import { useEffect, useState } from "react";

export default function TestPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      console.log("Firebase config:", {
        apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
      });
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  return (
    <div style={{ color: "white", padding: 50 }}>
      <h1>Test Page</h1>
      <pre>{JSON.stringify(env, null, 2)}</pre>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}
