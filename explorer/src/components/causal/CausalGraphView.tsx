import { useMemo } from 'react';
import { Background, Controls, MarkerType, ReactFlow, type Edge, type Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { CausalGraph, CausalNode } from './types';
import './causal.css';
import './causalGraph.css';

const COLORS: Record<CausalNode['type'], string> = {
  observation: '#38bdf8', state: '#a78bfa', event: '#f59e0b', action: '#22c55e',
  intervention: '#fb7185', constraint: '#fbbf24', optimization: '#60a5fa',
  solution: '#4ade80', decision: '#c084fc', outcome: '#2dd4bf', mechanism: '#f97316',
};

function positions(graph: CausalGraph): Map<string, { x: number; y: number }> {
  const incoming = new Map(graph.nodes.map((node) => [node.id, 0]));
  const adjacency = new Map<string, string[]>();
  graph.edges.forEach((edge) => {
    if (!incoming.has(edge.source) || !incoming.has(edge.target)) return;
    incoming.set(edge.target, (incoming.get(edge.target) ?? 0) + 1);
    adjacency.set(edge.source, [...(adjacency.get(edge.source) ?? []), edge.target]);
  });
  const depth = new Map<string, number>();
  const queue = graph.nodes.filter((node) => (incoming.get(node.id) ?? 0) === 0).map((node) => node.id);
  queue.forEach((id) => depth.set(id, 0));
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const current = queue[cursor];
    for (const target of adjacency.get(current) ?? []) {
      depth.set(target, Math.max(depth.get(target) ?? 0, (depth.get(current) ?? 0) + 1));
      incoming.set(target, (incoming.get(target) ?? 1) - 1);
      if (incoming.get(target) === 0) queue.push(target);
    }
  }
  graph.nodes.forEach((node) => { if (!depth.has(node.id)) depth.set(node.id, 0); });
  const layers = new Map<number, string[]>();
  graph.nodes.forEach((node) => layers.set(depth.get(node.id) ?? 0, [...(layers.get(depth.get(node.id) ?? 0) ?? []), node.id]));
  const result = new Map<string, { x: number; y: number }>();
  layers.forEach((ids, level) => ids.forEach((id, index) => result.set(id, { x: level * 250, y: (index - (ids.length - 1) / 2) * 115 })));
  return result;
}

export function CausalGraphView({ graph, selectedNodeId, onSelectNode }: { graph: CausalGraph; selectedNodeId?: string; onSelectNode?: (node: CausalNode) => void }) {
  const model = useMemo(() => {
    const layout = positions(graph);
    const nodes: Node[] = graph.nodes.map((node) => ({
      id: node.id, position: layout.get(node.id) ?? { x: 0, y: 0 },
      data: { label: <span className="causal-graph-label"><small>{node.type}</small><strong>{node.label}</strong></span> },
      style: { borderColor: COLORS[node.type], borderWidth: selectedNodeId === node.id ? 3 : 1, background: '#101927', color: '#e8f1fb', width: 190, borderRadius: 10 },
    }));
    const edges: Edge[] = graph.edges.map((edge) => ({
      id: edge.id, source: edge.source, target: edge.target, label: edge.relation,
      markerEnd: { type: MarkerType.ArrowClosed }, animated: Boolean(edge.mechanismRef),
      style: { stroke: edge.mechanismRef ? '#f97316' : '#4aa3ff' }, labelStyle: { fill: '#9fb0c4', fontSize: 9 },
    }));
    return { nodes, edges };
  }, [graph, selectedNodeId]);
  if (!graph.nodes.length) return <div className="causal-empty">暂无可展示的因果图。</div>;
  return <div className="causal-graph-view" aria-label="因果图">
    <ReactFlow nodes={model.nodes} edges={model.edges} fitView minZoom={0.25} maxZoom={1.8} nodesDraggable={false} nodesConnectable={false} onNodeClick={(_, item) => { const node = graph.nodes.find((value) => value.id === item.id); if (node) onSelectNode?.(node); }}>
      <Background color="rgba(74,163,255,0.08)" gap={22}/><Controls/>
    </ReactFlow>
  </div>;
}
