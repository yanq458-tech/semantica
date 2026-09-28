export interface ScenarioRecord {
  scenarioId: string;
  scenarioUri: string;
  label: string;
  version: string;
  parentScenario: string | null;
  effectiveDigest: string;
  changes: Array<Record<string, unknown>>;
  validation: { conforms: boolean; violationCount: number; messages: string[] };
  domainPackId: string;
  domainName: string;
  scenarioType: string;
  businessObjective: string;
  provider: string;
}

export interface ScenarioState {
  scenarioId: string;
  stateId: string;
  phase: 'before' | 'after';
  timestamp: string | null;
  entityStates: Array<Record<string, unknown>>;
  resourceStates: Array<Record<string, unknown>>;
  taskStates: Array<Record<string, unknown>>;
  constraintStates: Array<Record<string, unknown>>;
  metrics: Record<string, number>;
  sourceGraph: string;
  digest: string;
}

export interface StateTransition {
  id: string;
  scenarioId: string;
  fromState: string;
  toState: string;
  eventRef: string | null;
  interventionRef: string;
  mechanismRefs: string[];
  impactRefs: string[];
  timestamp: string | null;
  evidenceRefs: string[];
  change: Record<string, unknown>;
}

export interface ScenarioAnalysis {
  schemaVersion: string;
  scenarioId: string;
  parentScenarioId: string | null;
  initialState: ScenarioState;
  currentState: ScenarioState;
  transitions: StateTransition[];
  interventions: Array<Record<string, unknown>>;
  events: Array<Record<string, unknown>>;
  optimizationRuns: Array<Record<string, unknown>>;
  versionRefs: Record<string, string>;
}
