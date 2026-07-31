import { ParsedDiagram, DiagramNode, DiagramEdge } from "./types";

/**
 * A fault-tolerant, lenient parser for Mermaid diagrams.
 * It ignores malformed syntax and extracts as much valid data as possible.
 * It never throws an error.
 */
export function parseDiagram(mermaidStr: string): ParsedDiagram | null {
  if (!mermaidStr) return null;

  try {
    // 1. Sanitize the string
    let chart = mermaidStr
      .replace(/```(?:mermaid)?/gi, "")
      .replace(/[–—]/g, "-") // Sanitize en/em dashes
      .replace(/[“”]/g, '"') // Sanitize smart quotes
      .replace(/[‘’]/g, "'") // Sanitize single quotes
      .replace(/[\u200B-\u200D\uFEFF]/g, "") // Remove zero-width spaces
      .trim();

    const isER = chart.toLowerCase().includes("erdiagram");

    if (isER) {
      return parseERDiagram(chart);
    } else {
      return parseFlowchart(chart);
    }
  } catch (error) {
    console.error("Failed to parse diagram string", error);
    return null; // Fallback handled by UI
  }
}

function parseERDiagram(chart: string): ParsedDiagram {
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  const nodeMap = new Map<string, DiagramNode>();

  const toTitleCase = (str: string) => {
    // Convert snake_case or camelCase to Title Case
    const spaced = str.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/-/g, ' ');
    return spaced.trim().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const getOrCreateNode = (id: string) => {
    const cleanId = id.trim().replace(/["']/g, "");
    if (!nodeMap.has(cleanId)) {
      const node: DiagramNode = {
        id: cleanId,
        label: toTitleCase(cleanId),
        type: "database",
        attributes: [],
      };
      nodeMap.set(cleanId, node);
      nodes.push(node);
    }
    return nodeMap.get(cleanId)!;
  };

  // Extract explicit entity blocks: Entity { type name ... }
  const entityRegex = /([A-Za-z0-9_]+)\s*\{([^}]*)\}/g;
  let match;
  while ((match = entityRegex.exec(chart)) !== null) {
    const entityName = match[1];
    const attributesBlock = match[2];
    const node = getOrCreateNode(entityName);

    // Extract attributes line by line
    const lines = attributesBlock.split("\n");
    for (const line of lines) {
      const cleanLine = line.trim().replace(/,$/, ""); // remove trailing comma
      if (!cleanLine) continue;

      // Extract parts by space but keeping quotes intact
      const parts = cleanLine.match(/(?:[^\s"]+|"[^"]*")+/g);
      if (!parts || parts.length < 2) continue;

      let type = parts[0];
      let name = parts[1];

      // Handle cases where AI wrote "name: type" instead
      if (type.endsWith(":")) {
        name = type.slice(0, -1);
        type = parts[1];
      } else if (name.includes(":")) {
        const split = name.split(":");
        if (split[0] === "") { name = type; type = split[1]; }
        else { type = split[1]; name = split[0]; }
      } else {
        // Detect if AI swapped name and type (i.e., wrote "name type")
        const knownTypes = ["uuid", "varchar", "int", "timestamp", "time", "date", "text", "bool", "decimal", "float", "json", "serial", "char", "numeric", "double"];
        const p0Lower = parts[0].toLowerCase();
        const p1Lower = parts[1].toLowerCase();
        const isPart1Type = knownTypes.some(t => p1Lower.startsWith(t)) || p1Lower.includes("[]");
        const isPart0Type = knownTypes.some(t => p0Lower.startsWith(t)) || p0Lower.includes("[]");

        if (isPart1Type && !isPart0Type) {
          type = parts[1];
          name = parts[0];
        }
      }

      // Check for constraints anywhere in the line
      const upperLine = cleanLine.toUpperCase();
      let isPrimaryKey = upperLine.includes(" PK") || upperLine.includes(" PRIMARY KEY");
      let isForeignKey = upperLine.includes(" FK") || upperLine.includes(" FOREIGN KEY");
      let isUnique = upperLine.includes(" UK") || upperLine.includes(" UNIQUE");
      let isNullable = upperLine.includes(" NULL") && !upperLine.includes(" NOT NULL");

      // Infer constraints from name heuristics if missing
      if (!isPrimaryKey && (name.toLowerCase() === "id" || name.toLowerCase() === `${entityName.toLowerCase()}_id`)) {
        isPrimaryKey = true;
      }
      if (!isForeignKey && name.toLowerCase().endsWith("_id") && name.toLowerCase() !== "id") {
        isForeignKey = true;
      }

      node.attributes!.push({ 
        name, 
        type,
        isPrimaryKey,
        isForeignKey,
        isUnique,
        isNullable
      });
    }

    // Fault tolerance: Ensure PK exists
    if (!node.attributes!.some(a => a.isPrimaryKey)) {
      node.attributes!.unshift({ name: "id", type: "UUID", isPrimaryKey: true });
    }

    // Fault tolerance: Ensure timestamps exist
    if (!node.attributes!.some(a => a.name === "created_at")) {
      node.attributes!.push({ name: "created_at", type: "TIMESTAMP", isNullable: false });
    }
    if (!node.attributes!.some(a => a.name === "updated_at")) {
      node.attributes!.push({ name: "updated_at", type: "TIMESTAMP", isNullable: false });
    }
  }

  // Extract relationships: Entity ||--o{ Entity : "label"
  // Arrow shapes:
  // 1:1 -> ||--||
  // 1:N -> ||--o{ or }o--||
  // N:N -> }o--o{
  const relationRegex = /([A-Za-z0-9_]+)\s*(\|[|o]|\}[|o])[-.]+(\|[|o]|[|o]\{?|o\|)\s*([A-Za-z0-9_]+)(?:\s*:\s*["']?([^"\n\r]+)["']?)?/g;
  while ((match = relationRegex.exec(chart)) !== null) {
    const source = match[1];
    const leftArrow = match[2];
    const rightArrow = match[3];
    const target = match[4];
    const label = match[5] || "";

    getOrCreateNode(source);
    getOrCreateNode(target);

    // Cardinality extraction
    let relationType: "1:1" | "1:N" | "N:N" = "1:N";
    const leftMany = leftArrow.includes("}");
    const rightMany = rightArrow.includes("{");
    
    if (leftMany && rightMany) relationType = "N:N";
    else if (!leftMany && !rightMany) relationType = "1:1";
    else relationType = "1:N";

    edges.push({
      id: `edge-${Math.random().toString(36).substring(2, 9)}`,
      source: source.replace(/["']/g, ""),
      target: target.replace(/["']/g, ""),
      label: label.trim(),
      relationType,
    });
  }

  return { nodes, edges, type: "database" };
}

function parseFlowchart(chart: string): ParsedDiagram {
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  const nodeMap = new Map<string, DiagramNode>();

  const getOrCreateNode = (id: string, label?: string) => {
    if (!nodeMap.has(id)) {
      const node: DiagramNode = {
        id,
        label: label || id,
        type: "architecture",
      };
      nodeMap.set(id, node);
      nodes.push(node);
    } else if (label && nodeMap.get(id)!.label === id) {
      nodeMap.get(id)!.label = label;
    }
    return nodeMap.get(id)!;
  };

  // 1. Extract all nodes globally
  // Allows hyphens in IDs to prevent "Client-side" splitting.
  const nodeRegex = /([A-Za-z0-9_-]+)\s*(?:\[\[?|\(\(?|\{)([^\}\)\]]+)(?:\]\]?|\)\)?|\})/g;
  let match;
  while ((match = nodeRegex.exec(chart)) !== null) {
    const id = match[1];
    let rawLabel = match[2].replace(/["']/g, "").trim();
    
    // Heuristic for AI hallucinating class diagram body
    if (rawLabel.includes('\n') && (rawLabel.includes('+') || rawLabel.includes('-') || rawLabel.includes('~'))) {
      rawLabel = id;
    }

    // Parse "Title | Subtitle | Tech" format
    const parts = rawLabel.split('|').map(p => p.trim());
    const label = parts[0] || id;
    const node = getOrCreateNode(id, label);

    if (parts.length > 1 && parts[1]) node.subtitle = parts[1];
    if (parts.length > 2 && parts[2]) node.tech = parts[2];
  }

  // 2. Extract all edges globally
  // Require at least two dashes to prevent matching hyphenated words like "Client-side"
  const edgeRegex = /([A-Za-z0-9_-]+)\s*(?:-[-.]+|==)[=>]?(?:\|([^|]+)\|)?\s*([A-Za-z0-9_-]+)/g;
  while ((match = edgeRegex.exec(chart)) !== null) {
    const source = match[1];
    const label = match[2] || "";
    const target = match[3];

    getOrCreateNode(source);
    getOrCreateNode(target);

    edges.push({
      id: `edge-${Math.random().toString(36).substring(2, 9)}`,
      source,
      target,
      label: label.trim(),
    });
  }

  // 3. Subgraph / Layer Extraction
  let hasAnyLayer = false;
  const subgraphRegex = /subgraph\s+([^\n\r]+)([\s\S]*?)end/gi;
  while ((match = subgraphRegex.exec(chart)) !== null) {
    const layerName = match[1].replace(/["']/g, "").trim();
    const body = match[2];

    nodes.forEach((node) => {
      // Look for the exact ID as a standalone word in the subgraph body
      // We allow hyphens in the ID now, so \b might be tricky if ID contains hyphen, 
      // but \b works for boundaries around words with hyphens in some engines.
      // A safer check is indexOf + boundary check, or just assume the AI formatted it with spaces/brackets.
      const idRegex = new RegExp(`(^|[^A-Za-z0-9_-])${node.id}([^A-Za-z0-9_-]|$)`);
      if (idRegex.test(body)) {
        node.layer = layerName;
        hasAnyLayer = true;
      }
    });
  }

  // 4. Heuristic Fallback if NO subgraphs were used or for unmapped nodes
  nodes.forEach((node) => {
    if (node.layer) return; // Skip if already assigned by subgraph

    const lbl = node.label.toLowerCase();
    const sub = (node.subtitle || "").toLowerCase();
    const fullText = lbl + " " + sub;

    if (fullText.includes("user") || fullText.includes("actor") || fullText.includes("patient") || fullText.includes("doctor") || fullText.includes("customer") || fullText.includes("driver") || fullText.includes("admin")) {
      node.layer = "Users / Actors";
    } else if (fullText.includes("web") || fullText.includes("app") || fullText.includes("ui") || fullText.includes("client") || fullText.includes("frontend") || fullText.includes("portal") || fullText.includes("browser")) {
      node.layer = "Client Layer";
    } else if (fullText.includes("api") || fullText.includes("gateway") || fullText.includes("graphql") || fullText.includes("router")) {
      node.layer = "API Gateway";
    } else if (fullText.includes("auth") || fullText.includes("login") || fullText.includes("identity") || fullText.includes("cognito") || fullText.includes("iam")) {
      node.layer = "Authentication";
    } else if (fullText.includes("db") || fullText.includes("database") || fullText.includes("sql") || fullText.includes("redis") || fullText.includes("cache") || fullText.includes("storage")) {
      node.layer = "Data Layer";
    } else if (fullText.includes("stripe") || fullText.includes("maps") || fullText.includes("mail") || fullText.includes("sms") || fullText.includes("push") || fullText.includes("payment") || fullText.includes("firebase")) {
      node.layer = "External Integrations";
    } else if (fullText.includes("monitor") || fullText.includes("analytic") || fullText.includes("metric") || fullText.includes("datadog") || fullText.includes("sentry")) {
      node.layer = "Monitoring & Analytics";
    } else if (fullText.includes("ai ") || fullText.includes("llm") || fullText.includes("model") || fullText.includes("gpt") || fullText.includes("openai") || fullText.includes("machine learning")) {
      node.layer = "AI Services";
    } else {
      node.layer = "Business Services"; // Default fallback
    }
  });

  return { nodes, edges, type: "architecture" };
}
