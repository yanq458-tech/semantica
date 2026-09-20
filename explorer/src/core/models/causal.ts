export type CausalStageKind =
  | 'observation'
  | 'intervention'
  | 'constraint_impact'
  | 'optimization_run'
  | 'solution'
  | 'decision'
  | 'observed_outcome';

export interface CausalStage {
  order: number;
  stage: CausalStageKind;
  label: string;
  entityId: string;
  facts: Record<string, unknown>;
}

export interface CausalEvidenceChain {
  chainId: string;
  question: string;
  scope: 'auditable_decision_evidence';
  source: string;
  stages: CausalStage[];
}

export interface InterventionDefinition {
  scenarioId: string;
  changeIds: string[];
  parameters: Record<string, unknown>;
}

export interface ObservedOutcome {
  id: string;
  decisionId: string;
  accepted: boolean;
  facts: Record<string, unknown>;
}
