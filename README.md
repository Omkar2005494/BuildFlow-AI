<div align="center">
  <img src="public/globe.svg" alt="BuildFlow AI Logo" width="100" />
  <h1>BuildFlow AI</h1>
  <p><strong>From Idea to Enterprise Architecture in Seconds</strong></p>
  <p>
    An intelligent platform that transforms natural language software ideas into complete, highly-detailed, and production-ready architectural blueprints.
  </p>
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#architecture-engine-v3">Architecture Engine</a>
  </p>
</div>

<br/>

## 🌟 Features

- **Instant Architecture Generation**: Type any software idea, and BuildFlow generates a complete software development lifecycle (SDLC) blueprint.
- **Dynamic Detail Scaling**: Toggle between **Standard Mode** (fast, concise, rate-limit friendly) and **Enterprise Mode** (massive, deeply detailed, complex scaling strategies).
- **Interactive Visualizations**: View AI-generated architectures and database schemas via interactive, fault-tolerant Mermaid graph visualizers.
- **Intelligent Orchestration (AI Platform V3)**: Uses a custom Provider Adapter pattern to route LLM requests (e.g., via Groq's `llama-3.3-70b-versatile`), handle timeouts, and cascade to fallback models gracefully.
- **Enterprise-Grade Blueprints**:
  - **Database Schemas**: Table structures, relationships, indexing, and scaling strategies.
  - **API Specs**: Detailed endpoint definitions with caching and rate limit recommendations.
  - **Folder Structures**: Deeply structured, framework-specific directory trees.
  - **Engineering Roadmaps**: Auto-generated agile sprint planning and execution phases.
  - **Risk Assessments & Future Scopes**: Anticipate technical debt and plan for V2 features.
- **Secure Authentication**: Integrated with Firebase Auth for secure user sessions.

## 🛠 Tech Stack

- **Frontend Framework**: [Next.js 15](https://nextjs.org/) (React 19, App Router)
- **Styling & Animation**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: Radix UI + Lucide React Icons
- **AI Backend Orchestrator**: Custom TypeScript Platform V3 (Groq SDK, Zod Validation)
- **Authentication**: Firebase Admin & Client SDKs
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A [Groq API Key](https://console.groq.com/keys)
- A [Firebase Project](https://firebase.google.com/) for authentication

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Omkar2005494/BuildFlow-AI.git
   cd BuildFlow-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your credentials:
   ```env
   # AI Provider
   GROQ_API_KEY=your_groq_api_key_here
   
   # Firebase Client (Frontend Auth)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   
   # Firebase Admin (Backend Verification)
   FIREBASE_PRIVATE_KEY="your_private_key"
   FIREBASE_CLIENT_EMAIL=your_client_email
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Start Generating:**
   Open [http://localhost:3000](http://localhost:3000) in your browser. Log in, select your generation scale on the homepage, and type your software idea!

## 🧠 Architecture Engine V3

BuildFlow's backend is powered by a robust **AI Platform V3 Orchestrator** designed for high reliability:
- **Strict JSON Mode**: Enforces `response_format: { type: "json_object" }` to guarantee structured blueprints matching our complex Zod schema.
- **Fault-Tolerant Mermaid Parser**: We built a custom parser capable of reading AI-generated Mermaid flowcharts and ER Diagrams, isolating nodes and edges, and rendering them beautifully on the frontend—even if the AI hallucinates minor syntax errors.
- **Error Surfacing**: Real-time aggregation of provider errors (like 429 Rate Limits or parsing failures) directly to the frontend for transparent debugging.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request if you'd like to add new AI providers (like OpenAI or Anthropic adapters), improve the UI, or add new diagram parsers.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
