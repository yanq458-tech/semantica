import type { CausalGraph } from './types';

export function layoutCausalGraph(graph: CausalGraph): Map<string, { x: number; y: number }> {
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
