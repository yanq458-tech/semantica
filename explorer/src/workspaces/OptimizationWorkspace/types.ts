import type { RailwayDisturbanceKind, RailwayScenarioChange, RailwayScenarioRequest } from '../../domains/railway/types';
export type DisturbanceKind = RailwayDisturbanceKind;
export type ScenarioChange = RailwayScenarioChange;
export type ScenarioRequest = RailwayScenarioRequest;

export interface ScenarioSummary {
  scenarioId: string;
  scenarioUri: string;
  label: string;
  version: string;
  parentScenario: string | null;
  effectiveDigest: string;
  changes: Array<Record<string, unknown>>;
  validation: { conforms: boolean; violationCount: number; messages: string[] };
}

export type RunLifecycleStatus = 'queued' | 'applying_changes' | 'validating' | 'optimizing' | 'writing_back' | 'completed' | 'failed';
export type SolverStatus = 'OPTIMAL' | 'FEASIBLE' | 'INFEASIBLE' | 'UNKNOWN' | 'MODEL_INVALID' | null;

export interface OptimizationRun {
  runId: string;
  scenarioId: string;
  lifecycleStatus: RunLifecycleStatus;
  solverStatus: SolverStatus;
  solver: string | null;
  startedAt: string | null;
  completedAt: string | null;
  durationSeconds: number | null;
  objectiveValue: number | null;
  versions: Record<string, string> | null;
  error: { code: string; message: string } | null;
}

export type MetricName = 'objective_value' | 'total_cost' | 'delay' | 'resource_utilization' | 'assignment_changes' | 'constraint_violations' | 'robustness_score';
export interface SolutionMetric { name: MetricName; value: number | null; unit: string; direction: 'minimize' | 'maximize'; status: 'available' | 'not_available' }
export interface Solution { solutionId: string; runId: string; status: string; feasible: boolean; rank: number | null; metrics: SolutionMetric[] }

export interface AssignmentRow {
  assignmentId: string;
  resourceId: string;
  resourceModel: string;
  resourceStatus: string;
  taskId: string;
  requiredModel: string;
  satisfied: boolean;
  explanationAvailable: boolean;
}

export interface SolutionComparison {
  leftSolutionId: string;
  rightSolutionId: string;
  metricDeltas: Partial<Record<MetricName, number | null>>;
  assignmentChanges: { count: number; addedTasks: string[]; removedTasks: string[]; changedTasks: Array<{ task: string; leftResource: string; rightResource: string }> };
}

export interface EvidenceStep { kind: string; entityId: string; facts: Record<string, unknown> }
export interface AssignmentExplanation { assignmentId: string; evidenceChain: EvidenceStep[] }
