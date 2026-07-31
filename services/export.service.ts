import { BuildFlow } from "@/types";

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
