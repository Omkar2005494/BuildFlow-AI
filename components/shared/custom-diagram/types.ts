export type NodeType = "database" | "architecture" | "api";

export interface NodeAttribute {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  isUnique?: boolean;
  isNullable?: boolean;
}

export interface DiagramNode {
  id: string;
  label: string;
  type: NodeType;
  attributes?: NodeAttribute[];
  description?: string;
  layer?: string;
  subtitle?: string;
  tech?: string;
}

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  relationType?: "1:1" | "1:N" | "N:N";
}

export interface ParsedDiagram {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  type: NodeType;
}
