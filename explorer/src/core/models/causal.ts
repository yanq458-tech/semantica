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
  schemaVersion?: '1.0';
  chainId: string;
  question: string;
  scope: 'auditable_decision_evidence';
  source: string;
  stages: CausalStage[];
}

export type CausalEvidenceType =
  | 'observed'
  | 'rule_based'
  | 'model_derived'
  | 'optimization_derived'
  | 'expert_defined'
  | 'experimental';

export interface CausalEvidence {
  id: string;
  type: CausalEvidenceType;
  source: string;
  entityRef?: string;
  facts: Record<string, unknown>;
  timestamp?: string | null;
  provenanceRef?: string | null;
}

export type CausalNodeType =
  | 'observation'
  | 'state'
  | 'event'
  | 'action'
  | 'intervention'
  | 'constraint'
  | 'optimization'
  | 'solution'
  | 'decision'
  | 'outcome'
  | 'mechanism';

export interface CausalNode {
  id: string;
  type: CausalNodeType;
  stage?: CausalStageKind;
  label: string;
  description?: string | null;
  entityRefs: string[];
  scenarioRef?: string | null;
  evidenceRefs: string[];
  inputRefs: string[];
  outputRefs: string[];
  occurredAt?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  source: string;
  evidenceType?: CausalEvidenceType | null;
  confidence?: number | null;
  metadata: Record<string, unknown>;
}

export type CausalEdgeRelation =
  | 'observed_before'
  | 'changes'
  | 'affects'
  | 'constrains'
  | 'generates'
  | 'supports'
  | 'explains'
  | 'causes'
  | 'associated_with';

export interface CausalEdge {
  id: string;
  source: string;
  target: string;
  relation: CausalEdgeRelation;
  mechanismRef?: string | null;
  evidenceRefs: string[];
  direction: 'forward' | 'backward' | 'bidirectional';
  delay?: number | null;
  metadata: Record<string, unknown>;
}

export interface CausalMechanism {
  id: string;
  name: string;
  description: string;
  causeRefs: string[];
  effectRefs: string[];
  conditions: Array<Record<string, unknown>>;
  ruleRefs: string[];
  constraintRefs: string[];
  evidenceRefs: string[];
  domain: string;
  version: string;
  confidence?: number | null;
  source: Extract<CausalEvidenceType, 'rule_based' | 'expert_defined' | 'model_derived'> | 'explicit_business_logic';
}

export type ImpactType = 'state' | 'resource' | 'task' | 'constraint' | 'metric' | 'solution' | 'decision' | 'outcome';

export interface Impact {
  id: string;
  impactType: ImpactType;
  sourceRef: string;
  targetRef: string;
  before: unknown;
  after: unknown;
  delta?: number | null;
  direction: 'increase' | 'decrease' | 'changed' | 'unchanged' | 'unavailable';
  mechanismRef?: string | null;
  evidenceRefs: string[];
  metadata: Record<string, unknown>;
}

export interface Intervention {
  id: string;
  scenarioId: string;
  baselineScenarioId: string;
  changeRef: string;
  targetRef: string;
  variable: string;
  before: unknown;
  after: unknown;
  description: string;
  source: string;
}

export interface InterventionComparison {
  comparisonId: string;
  baselineScenario: string;
  interventionScenario: string;
  baselineRun?: string | null;
  interventionRun?: string | null;
  baselineSolution?: string | null;
  interventionSolution?: string | null;
  changedVariables: Intervention[];
  impacts: Impact[];
  metricChanges: Impact[];
  constraintChanges: Impact[];
  solutionChanges: Impact[];
  decisionChanges: Impact[];
  outcomeChanges: Impact[];
  comparabilityStatus: 'comparable' | 'not_comparable';
  comparabilityReasons: string[];
}

export interface CausalGraph {
  schemaVersion: '2.0';
  graphId: string;
  scope: 'auditable_decision_evidence' | 'impact_path';
  nodes: CausalNode[];
  edges: CausalEdge[];
  evidence: CausalEvidence[];
  mechanisms: CausalMechanism[];
  impacts: Impact[];
  rootNodes: string[];
  terminalNodes: string[];
}

export interface CausalTraversalResult {
  direction: 'forward' | 'backward';
  startNodeId: string;
  graph: CausalGraph;
  truncated: boolean;
  maxDepth: number;
  maxNodes: number;
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
