import type { CoreObjectRef } from "./organization";

export interface ScenarioDefinition {
  id: string;
  name: string;
  scenarioType: string;
  domainPackId: string;
  description: string;
  businessObjective: string;
  entities: CoreObjectRef[];
  resources: CoreObjectRef[];
  tasks: CoreObjectRef[];
  ruleIds: string[];
  constraintIds: string[];
  events: Array<Record<string, unknown>>;
  parameters: Record<string, unknown>;
  state: string;
  objectiveIds: string[];
  modelVersion: string;
  datasetVersion: string;
}

export interface ScenarioChange {
  type: string;
  targetId?: string;
  parameters: Record<string, unknown>;
}

export interface ScenarioState {
  id: string;
  scenarioId: string;
  phase: "before" | "after" | string;
  timestamp?: string | null;
  facts: Record<string, unknown>;
  sourceRef?: string | null;
}

export interface StateTransition {
  id: string;
  scenarioId: string;
  fromStateId: string;
  toStateId: string;
  interventionRef?: string | null;
  mechanismRefs: string[];
  impactRefs: string[];
  evidenceRefs: string[];
  timestamp?: string | null;
}
