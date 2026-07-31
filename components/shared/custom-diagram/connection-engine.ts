import { useEffect, useState, RefObject } from "react";

interface Point {
  x: number;
  y: number;
}

export interface ConnectionPath {
  id: string;
  d: string;
  label?: string;
  sourcePoint: Point;
  targetPoint: Point;
  source: string;
  target: string;
  relationType?: "1:1" | "1:N" | "N:N";
}

export function useConnectionEngine(
  containerRef: RefObject<HTMLElement | null>,
  edges: { id: string; source: string; target: string; label?: string; relationType?: "1:1" | "1:N" | "N:N" }[],
  nodesReady: boolean
) {
  const [paths, setPaths] = useState<ConnectionPath[]>([]);

  useEffect(() => {
    if (!containerRef.current || !nodesReady || edges.length === 0) return;

    const container = containerRef.current;
    
    const calculatePaths = () => {
      const containerRect = container.getBoundingClientRect();
      const newPaths: ConnectionPath[] = [];

      edges.forEach((edge) => {
        const sourceNode = container.querySelector(`[data-node-id="${edge.source}"]`);
        const targetNode = container.querySelector(`[data-node-id="${edge.target}"]`);

        if (sourceNode && targetNode) {
          const sourceRect = sourceNode.getBoundingClientRect();
          const targetRect = targetNode.getBoundingClientRect();

          // Calculate center points relative to the container
          const sourcePoint: Point = {
            x: sourceRect.left - containerRect.left + sourceRect.width / 2,
            y: sourceRect.top - containerRect.top + sourceRect.height / 2,
          };

          const targetPoint: Point = {
            x: targetRect.left - containerRect.left + targetRect.width / 2,
            y: targetRect.top - containerRect.top + targetRect.height / 2,
          };

          // Determine connection points on the edges of the bounding boxes
          // Basic heuristic: if target is below, connect bottom to top. If target is right, connect right to left.
          const dx = targetPoint.x - sourcePoint.x;
          const dy = targetPoint.y - sourcePoint.y;
          
          let startX = sourcePoint.x;
          let startY = sourcePoint.y;
          let endX = targetPoint.x;
          let endY = targetPoint.y;

          // Mostly vertical relationship
          if (Math.abs(dy) > Math.abs(dx)) {
            startY = dy > 0 ? sourcePoint.y + sourceRect.height / 2 : sourcePoint.y - sourceRect.height / 2;
            endY = dy > 0 ? targetPoint.y - targetRect.height / 2 : targetPoint.y + targetRect.height / 2;
          } else {
            // Mostly horizontal relationship
            startX = dx > 0 ? sourcePoint.x + sourceRect.width / 2 : sourcePoint.x - sourceRect.width / 2;
            endX = dx > 0 ? targetPoint.x - targetRect.width / 2 : targetPoint.x + targetRect.width / 2;
          }

          // Calculate cubic bezier curve
          // Control points add some slack for a smooth curve
          const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
          // Slightly increased curvature for smoother S-curves across horizontal lanes
          const curvature = Math.min(distance * 0.5, 150);

          let cp1x = startX;
          let cp1y = startY;
          let cp2x = endX;
          let cp2y = endY;

          // Strongly prefer vertical routing (top-to-bottom flow)
          // If dy is significant at all (e.g., > 20px), use vertical S-curve
          if (Math.abs(dy) > 20) {
            cp1y += dy > 0 ? curvature : -curvature;
            cp2y -= dy > 0 ? curvature : -curvature;
          } else {
            cp1x += dx > 0 ? curvature : -curvature;
            cp2x -= dx > 0 ? curvature : -curvature;
          }

          const d = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;

          newPaths.push({
            id: edge.id,
            d,
            label: edge.label,
            sourcePoint: { x: startX, y: startY },
            targetPoint: { x: endX, y: endY },
            source: edge.source,
            target: edge.target,
            relationType: edge.relationType,
          });
        }
      });

      setPaths(newPaths);
    };

    // Calculate immediately
    calculatePaths();
    
    // Recalculate on resize
    const resizeObserver = new ResizeObserver(() => {
      // Use requestAnimationFrame to avoid ResizeObserver loop limit exceeded error
      requestAnimationFrame(calculatePaths);
    });

    resizeObserver.observe(container);

    // Also observe the children to recalculate if they resize
    const children = container.querySelectorAll('[data-node-id]');
    children.forEach(child => resizeObserver.observe(child));

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, edges, nodesReady]);

  return paths;
}
