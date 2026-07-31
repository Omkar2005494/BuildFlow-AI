<div align="center">
  <img src="public/globe.svg" alt="BuildFlow AI Logo" width="120" />
  <h1>BuildFlow AI</h1>
  <p><strong>From Idea to Enterprise Architecture in Seconds</strong></p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
  [![Groq](https://img.shields.io/badge/AI_Powered-Groq-f55036)](https://groq.com/)
  [![Firebase](https://img.shields.io/badge/Auth-Firebase-FFCA28?logo=firebase)](https://firebase.google.com/)
  
  <p>
    An intelligent, context-aware platform that transforms natural language software ideas into complete, highly-detailed, and production-ready architectural blueprints using Large Language Models.
  </p>
</div>

---

## 🌟 Overview

**BuildFlow AI** acts as your Principal Software Architect. Instead of spending weeks planning system design, database schemas, and engineering roadmaps, simply describe your software idea to BuildFlow. 

The platform utilizes a highly optimized LLM orchestration engine to generate a complete Software Development Life Cycle (SDLC) blueprint, outputting everything from microservice container strategies to granular REST API definitions.

## 🏗 System Architecture

BuildFlow-AI is built on a resilient, multi-tiered architecture powered by Next.js and a custom AI orchestration engine.

```mermaid
graph TD
    subgraph Client [Frontend UI - React 19]
        A[User Input & Settings] --> B[AiDashboard]
        B --> C[Interactive Visualizations]
    end

    subgraph Server [Next.js App Router]
        D[POST /api/generate]
        E[Firebase Admin Auth]
    end

    subgraph AI_Engine [AI Platform V3 Orchestrator]
        F{Model Router}
        G[Groq Adapter]
        H[OpenAI Adapter]
        I[Anthropic Adapter]
        J[Zod Schema Validator & Repair]
    end

    A -->|JWT Token| D
    D -->|Validate| E
    D -->|Idea + Parameters| F
    
    F -->|Priority 1| G
    F -.->|Fallback| H
    F -.->|Fallback| I
    
    G -->|Raw JSON| J
    J -->|Validated Blueprint| D
    D -->|Response| C
```

---

## ✨ Core Features

### 1. Dynamic Detail Scaling
Choose the exact level of architectural depth you need:
- **Standard Mode:** Perfect for rapid prototyping. Outputs concise, rate-limit friendly blueprints (~2,500 tokens).
- **Enterprise Mode:** Designed for massive scale. Outputs deep documentation, complex scaling strategies, and granular database indexing rules (~8,000 tokens).

### 2. Intelligent AI Orchestration (Platform V3)
BuildFlow doesn't just blindly call an API. It uses a **Cascade Routing System**:
- Automatically falls back to alternative models if a provider (e.g., Groq) hits a rate limit or times out.
- Enforces strict JSON formatting using `response_format: { type: "json_object" }`.
- Parses and repairs malformed schema structures dynamically.

### 3. Interactive Visualizations
BuildFlow parses AI-generated Mermaid graphs and renders them into beautiful, interactive React components:
- **Interactive ER Diagrams:** Visualizes databases with interactive hover states highlighting Primary/Foreign key relationships.
- **Architecture Flowcharts:** Maps out complex microservice communication layers.

### 4. Comprehensive SDLC Blueprints
Every generation provides:
- **Executive Overview:** Timeline, team size, and complexity scoring.
- **Database Architecture:** Tables, relationships, sharding strategies, and query optimizations.
- **API Specifications:** Granular route definitions, validation rules, and caching opportunities.
- **Engineering Roadmap:** Dynamic sprint planning with parallel workstreams.
- **Risk Assessment:** Anticipation of technical debt and security vulnerabilities.

---

## 📂 Project Structure

A high-level view of the repository's organization:

```text
BuildFlow-AI/
├── app/                      # Next.js 15 App Router pages & API endpoints
│   ├── (app)/                # Authenticated application routes (Dashboard, etc.)
│   ├── api/generate/         # AI Generation POST endpoint
│   └── page.tsx              # Landing page
├── components/               # Reusable React components
│   ├── dashboard/            # Blueprint visualization cards (Overview, API, etc.)
│   ├── landing/              # Hero, Navbar, Input components
│   └── shared/               # Custom Diagram renderer and UI library
├── lib/
│   ├── ai/                   # Core AI Platform V3 Orchestrator & Adapters
│   └── firebase/             # Authentication configuration (Client & Admin)
├── prompts/                  # LLM Prompt Engineering files (buildflow.prompt.ts)
├── store/                    # Zustand state management
└── types/                    # Zod schemas and TypeScript interfaces
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Groq API Key** (Get it [here](https://console.groq.com/keys))
- **Firebase Project** (For authentication setup)

### 1. Clone & Install

```bash
git clone https://github.com/Omkar2005494/BuildFlow-AI.git
cd BuildFlow-AI
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory. You will need your Firebase project credentials and your LLM provider keys.

```env
# AI Providers
GROQ_API_KEY="your_groq_api_key_here"
# OPENAI_API_KEY="optional_fallback_key"

# Firebase Client (Frontend Authentication)
NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"

# Firebase Admin (Backend Token Verification)
FIREBASE_PRIVATE_KEY="your_private_key"
FIREBASE_CLIENT_EMAIL="your_client_email"
```

### 3. Run the Development Server

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) in your browser. Log in, select your generation mode (Standard or Enterprise), and bring your software ideas to life!

---

## 🛠 Advanced Configuration

### Adding New AI Providers
BuildFlow's `AI Platform V3` uses a plug-and-play Adapter pattern. To add a new provider (e.g., Cohere):
1. Create `cohere.adapter.ts` in `lib/ai/providers/`.
2. Implement the `BaseAdapter` interface.
3. Register it in `lib/ai/platform.ts`: `this.registerAdapter(new CohereAdapter())`.

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
