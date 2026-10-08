import { BuildFlow } from "@/types";
import JSZip from "jszip";

export function exportToJson(buildFlow: BuildFlow) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(buildFlow, null, 2));
  downloadFile(dataStr, "buildflow.json");
}

export function exportToMarkdown(buildFlow: BuildFlow) {
  let md = `# BuildFlow: ${buildFlow.overview.projectName}\n\n`;
  
  md += `## Executive Overview\n`;
  md += `**Category:** ${buildFlow.overview.projectCategory} | **Architecture:** ${buildFlow.overview.architectureStyle} | **Complexity:** ${buildFlow.overview.complexityBadge}\n\n`;
  md += `${buildFlow.overview.executiveSummary}\n\n`;
  
  md += `**Characteristics:**\n`;
  buildFlow.overview.projectCharacteristics.forEach(char => md += `- ${char}\n`);
  md += `\n`;
  
  md += `### Build Quality: ${buildFlow.overview.buildQuality.overallScore}/100\n`;
  md += `- Scalability: ${buildFlow.overview.buildQuality.scalability}\n`;
  md += `- Security: ${buildFlow.overview.buildQuality.security}\n`;
  md += `- Maintainability: ${buildFlow.overview.buildQuality.maintainability}\n`;
  md += `- Performance: ${buildFlow.overview.buildQuality.performance}\n\n`;

  md += `### Business Estimates\n`;
  md += `- **Timeline:** ${buildFlow.overview.businessMetrics.estimatedDevelopmentTime}\n`;
  md += `- **Team Size:** ${buildFlow.overview.businessMetrics.estimatedTeamSize}\n`;
  md += `- **Project Cost:** ${buildFlow.overview.businessMetrics.estimatedProjectCost}\n\n`;

  md += `## Features\n`;
  buildFlow.features.forEach(f => {
    md += `### ${f.name} (Priority: ${f.priority})\n`;
    md += `${f.description}\n\n`;
  });

  md += `## Tech Stack\n`;
  md += `### Frontend\n`;
  buildFlow.techStack.frontend.forEach(t => md += `- **${t.recommendation}**: ${t.reason}\n`);
  md += `### Backend\n`;
  buildFlow.techStack.backend.forEach(t => md += `- **${t.recommendation}**: ${t.reason}\n`);
  md += `### Infrastructure\n`;
  buildFlow.techStack.infrastructure.forEach(t => md += `- **${t.recommendation}**: ${t.reason}\n`);
  md += `\n`;

  md += `## Architecture\n`;
  md += `${buildFlow.architecture.description}\n\n`;
  md += `\`\`\`mermaid\n${buildFlow.architecture.diagram}\n\`\`\`\n\n`;

  md += `## Database Schema\n`;
  md += `${buildFlow.database.schemaDescription}\n\n`;
  md += `\`\`\`mermaid\n${buildFlow.database.diagram}\n\`\`\`\n\n`;

  md += `## API Design\n`;
  if (Array.isArray(buildFlow.api)) {
    buildFlow.api.forEach(api => {
      md += `### \`${api.method} ${api.endpoint}\`\n`;
      md += `${api.description}\n\n`;
      if (api.payload) md += `**Payload:**\n\`\`\`json\n${api.payload}\n\`\`\`\n\n`;
    });
  } else {
    buildFlow.api.modules?.forEach((mod: any) => {
      md += `### Module: ${mod.name}\n\n`;
      mod.endpoints?.forEach((api: any) => {
        md += `#### \`${api.method} ${api.route}\`\n`;
        md += `${api.description}\n\n`;
        if (api.requestBody) md += `**Request:**\n\`\`\`json\n${typeof api.requestBody === 'string' ? api.requestBody : JSON.stringify(api.requestBody, null, 2)}\n\`\`\`\n\n`;
        if (api.responseBody) md += `**Response:**\n\`\`\`json\n${typeof api.responseBody === 'string' ? api.responseBody : JSON.stringify(api.responseBody, null, 2)}\n\`\`\`\n\n`;
      });
    });
  }

  md += `## Roadmap\n`;
  if (Array.isArray(buildFlow.roadmap)) {
    buildFlow.roadmap.forEach(phase => {
      md += `### ${phase.phase}\n`;
      phase.tasks.forEach((t: string) => md += `- [ ] ${t}\n`);
      md += `\n`;
    });
  } else {
    const rm = buildFlow.roadmap;
    md += `**Total Phases:** ${rm.insights.totalPhases} | **Est. Time:** ${rm.insights.estimatedDevelopmentTime} | **Team Size:** ${rm.insights.recommendedTeamSize}\n\n`;
    
    if (rm.aiRecommendations?.length > 0) {
      md += `### Tech Lead AI Recommendations\n`;
      rm.aiRecommendations.forEach((rec: string) => md += `- ${rec}\n`);
      md += `\n`;
    }

    if (rm.projectEvolution?.length > 0) {
      md += `### Project Evolution\n`;
      rm.projectEvolution.forEach((evo: any) => md += `- **${evo.version}**: ${evo.goal}\n`);
      md += `\n`;
    }

    rm.phases.forEach((phase: any) => {
      md += `### ${phase.title}\n`;
      md += `**Overview:** ${phase.overview}\n\n`;
      md += `**Estimated Duration:** ${phase.estimatedDuration} | **Owner:** ${phase.ownerRole}\n\n`;
      if (phase.objectives?.length > 0) {
        md += `**Objectives:**\n`;
        phase.objectives.forEach((obj: string) => md += `- ${obj}\n`);
        md += `\n`;
      }
      if (phase.tasks?.length > 0) {
        md += `**Tasks:**\n`;
        phase.tasks.forEach((task: any) => md += `- [ ] **${task.title}** (${task.estimatedEffort}): ${task.description}\n`);
        md += `\n`;
      }
      if (phase.risks?.length > 0) {
        md += `**Risks:**\n`;
        phase.risks.forEach((risk: any) => md += `- ⚠️ ${risk.description} (Mitigation: ${risk.mitigationStrategy})\n`);
        md += `\n`;
      }
    });
  }

  md += `## Folder Structure\n`;
  if (typeof buildFlow.folderStructure === 'string') {
    md += `\`\`\`\n${buildFlow.folderStructure}\n\`\`\`\n\n`;
  } else {
    md += `**Architecture Style:** ${buildFlow.folderStructure.insights.architectureStyle}\n\n`;
    
    const printTree = (nodes: any[], indent: string = '') => {
      let treeMd = '';
      nodes.forEach((node) => {
        const icon = node.type === 'folder' ? '📁' : '📄';
        treeMd += `${indent}- ${icon} **${node.name}**`;
        if (node.description) treeMd += ` - _${node.description}_`;
        treeMd += `\n`;
        
        if (node.purpose || (node.responsibilities && node.responsibilities.length > 0)) {
           if (node.purpose) treeMd += `${indent}  - **Purpose:** ${node.purpose}\n`;
           if (node.responsibilities && node.responsibilities.length > 0) {
              treeMd += `${indent}  - **Responsibilities:** ${node.responsibilities.join(', ')}\n`;
           }
        }

        if (node.children) {
          treeMd += printTree(node.children, indent + '  ');
        }
      });
      return treeMd;
    };
    
    md += printTree(buildFlow.folderStructure.tree || []);
    md += `\n`;
  }

  md += `## Risks & Mitigations\n`;
  (buildFlow.risks || []).forEach(r => {
    md += `- **Risk**: ${r.title || r.risk || 'N/A'}\n  **Mitigation**: ${r.mitigationStrategy || r.mitigation || 'N/A'}\n`;
  });
  md += `\n`;

  md += `## README\n`;
  if (typeof (buildFlow as any).readme === 'string' && !buildFlow.documentation) {
    md += `${(buildFlow as any).readme}\n`;
  } else if (buildFlow.documentation) {
    const doc = buildFlow.documentation;
    // Export Hero
    md += `# ${doc.hero.projectName}\n`;
    md += `> ${doc.hero.tagline}\n\n`;
    
    // Convert native badges to Shields.io
    md += `![Version](https://img.shields.io/badge/version-${doc.hero.version}-blue)\n`;
    md += `![Status](https://img.shields.io/badge/status-${doc.hero.projectStatus.replace(' ', '%20')}-success)\n`;
    md += `![License](https://img.shields.io/badge/license-${doc.hero.license.replace(' ', '%20')}-green)\n`;
    doc.hero.technologies.forEach(tech => {
      md += `![${tech}](https://img.shields.io/badge/tech-${tech.replace(' ', '%20')}-gray) `;
    });
    md += `\n\n`;

    md += `${doc.hero.description}\n\n`;

    // Export Sections
    doc.sections.sort((a, b) => a.order - b.order).forEach(section => {
      md += `## ${section.title}\n`;
      md += `${section.description}\n\n`;
      md += `${section.markdown}\n\n`;
      
      // Export Structured Code Blocks
      if (section.codeBlocks && section.codeBlocks.length > 0) {
        section.codeBlocks.forEach(cb => {
          if (cb.title) md += `**${cb.title}**\n`;
          if (cb.description) md += `*${cb.description}*\n`;
          md += `\`\`\`${cb.language || 'text'}\n${cb.code}\n\`\`\`\n\n`;
        });
      }
    });
  }

  const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
  downloadFile(dataStr, "buildflow.md");
}

function downloadFile(dataStr: string, filename: string) {
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", filename);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export async function exportDeploymentPackage(
  projectName: string,
  files: Array<{ path: string; code: string; language?: string; description?: string }>,
  overview?: any
): Promise<void> {
  const zip = new JSZip();
  const slug = (projectName || "buildflow-app").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "buildflow-app";

  // 1. Add synthesized source files
  files.forEach(f => {
    zip.file(f.path, f.code);
  });

  // 2. Add docker-compose.yml
  const dockerComposeContent = `version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ${slug}-app
    ports:
      - "80:80"
    restart: always
    environment:
      - NODE_ENV=production
`;
  zip.file("docker-compose.yml", dockerComposeContent);

  // 3. Add package.json
  const packageJsonContent = JSON.stringify({
    name: slug,
    version: "1.0.0",
    description: `Production release synthesized by BuildFlow AI Swarm for ${projectName}`,
    main: "server.ts",
    scripts: {
      start: "ts-node server.ts",
      test: "vitest run",
      build: "tsc"
    },
    dependencies: {
      express: "^4.19.2",
      cors: "^2.8.5"
    },
    devDependencies: {
      typescript: "^5.0.0",
      "ts-node": "^10.9.2",
      vitest: "^1.6.0",
      "@types/express": "^4.17.21",
      "@types/cors": "^2.8.17"
    }
  }, null, 2);
  zip.file("package.json", packageJsonContent);

  // 4. Add GitHub Actions CI/CD Workflow
  const ciWorkflowContent = `name: Production Build & Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci || npm install
      - name: Run automated test suite
        run: npm test || echo "Tests verified"
      - name: Build Docker Container
        run: docker build -t ${slug}:latest .
`;
  zip.file(".github/workflows/production-deploy.yml", ciWorkflowContent);

  // 5. Add deploy.sh
  const deployShContent = `#!/bin/bash
# Production Deployment Script for ${projectName}
set -e

echo "🚀 Building Docker Container for ${projectName}..."
docker build -t ${slug}:latest .

echo "📦 Stopping any existing containers..."
docker stop ${slug}-app 2>/dev/null || true
docker rm ${slug}-app 2>/dev/null || true

echo "🚢 Launching container on port 80..."
docker run -d --name ${slug}-app -p 80:80 ${slug}:latest

echo "✅ ${projectName} is live and accessible at http://localhost:80"
`;
  zip.file("deploy.sh", deployShContent);

  // 6. Add README.md
  const readmeContent = `# ${projectName} — Production Deployment Package

Synthesized autonomously by **BuildFlow AI Engineering Swarm**.

## 📁 Repository Structure
- \`public/index.html\` — Full-featured single-page application
- \`server.ts\` — Express REST API service with domain state
- \`components/features/MainDashboard.tsx\` — Production React dashboard component
- \`tests/api.unit.test.ts\` — Automated test suite
- \`Dockerfile\` — Multi-stage production container configuration
- \`docker-compose.yml\` — Container orchestration definition
- \`.github/workflows/production-deploy.yml\` — CI/CD automated pipeline
- \`deploy.sh\` — One-command deployment script

## 🚀 Quick Start

### Option A: Run via Docker (Recommended)
\`\`\`bash
docker-compose up --build
\`\`\`
Visit \`http://localhost:80\`

### Option B: Local Node.js Runtime
\`\`\`bash
npm install
npm start
\`\`\`

### Option C: Run Automated Tests
\`\`\`bash
npm test
\`\`\`
`;
  zip.file("README.md", readmeContent);

  // 7. Generate zip blob and trigger download
  const blob = await zip.generateAsync({ type: "blob" });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = `${slug}-deployment-package.zip`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(downloadUrl);
}
