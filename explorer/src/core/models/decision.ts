export interface DecisionContext {
  id: string;
  scenarioId: string | null;
  candidateSolutionIds: string[];
  selectedSolutionId: string | null;
  metricIds: string[];
  constraintIds: string[];
  risks: Array<Record<string, unknown>>;
  evidenceIds: string[];
  explanation: string | null;
}
