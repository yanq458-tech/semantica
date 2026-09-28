import type {
  CausalEdge,
  CausalEvidence,
  CausalGraph,
  CausalMechanism,
  CausalNode,
  CausalTraversalResult,
  Impact,
  Intervention,
  InterventionComparison,
} from '../../core/models';

export interface LegacyCausalStage {
  order: number;
  stage: string;
  label: string;
  entityId: string;
  facts: Record<string, unknown>;
}

export interface CausalChainResponse {
  decisionId: string;
  schemaVersion: '2.0';
  orderedChain: string[];
  graph: CausalGraph;
  observedOperationalOutcome: { status: 'unavailable' | 'available' };
}

export interface CausalNodeResponse {
  node: CausalNode;
  evidence: CausalEvidence[];
  mechanism: CausalMechanism | null;
}

export type {
  CausalEdge,
  CausalEvidence,
  CausalGraph,
  CausalMechanism,
  CausalNode,
  CausalTraversalResult,
  Impact,
  Intervention,
  InterventionComparison,
};
