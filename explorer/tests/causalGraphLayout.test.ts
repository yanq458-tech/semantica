import test from 'node:test';
import assert from 'node:assert/strict';
import { layoutCausalGraph } from '../src/components/causal/causalGraphLayout.ts';
import type { CausalGraph, CausalNode } from '../src/components/causal/types.ts';

const node = (id: string): CausalNode => ({ id, type: 'state', label: id, entityRefs: [], evidenceRefs: [], inputRefs: [], outputRefs: [], source: 'test', metadata: {} });
const graph = (edges: CausalGraph['edges']): CausalGraph => ({ schemaVersion: '2.0', graphId: 'test', scope: 'impact_path', nodes: ['A','B','C','D'].map(node), edges, evidence: [], mechanisms: [], impacts: [], rootNodes: ['A'], terminalNodes: ['D'] });

test('causal layout places branches before their merge target', () => {
  const positions = layoutCausalGraph(graph([
    { id: 'AB', source: 'A', target: 'B', relation: 'affects', evidenceRefs: [], direction: 'forward', metadata: {} },
    { id: 'AC', source: 'A', target: 'C', relation: 'affects', evidenceRefs: [], direction: 'forward', metadata: {} },
    { id: 'BD', source: 'B', target: 'D', relation: 'affects', evidenceRefs: [], direction: 'forward', metadata: {} },
    { id: 'CD', source: 'C', target: 'D', relation: 'affects', evidenceRefs: [], direction: 'forward', metadata: {} },
  ]));
  assert.equal(positions.size, 4);
  assert.ok(positions.get('A')!.x < positions.get('B')!.x);
  assert.equal(positions.get('B')!.x, positions.get('C')!.x);
  assert.ok(positions.get('D')!.x > positions.get('C')!.x);
});

test('causal layout terminates and retains nodes when a cycle exists', () => {
  const positions = layoutCausalGraph(graph([
    { id: 'AB', source: 'A', target: 'B', relation: 'affects', evidenceRefs: [], direction: 'forward', metadata: {} },
    { id: 'BC', source: 'B', target: 'C', relation: 'affects', evidenceRefs: [], direction: 'forward', metadata: {} },
    { id: 'CA', source: 'C', target: 'A', relation: 'affects', evidenceRefs: [], direction: 'forward', metadata: {} },
  ]));
  assert.equal(positions.size, 4);
  assert.ok([...positions.values()].every((position) => Number.isFinite(position.x) && Number.isFinite(position.y)));
});
