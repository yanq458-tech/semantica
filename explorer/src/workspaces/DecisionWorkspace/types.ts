export interface DecisionOverview {
  scenarioId: string;
  scenarioVersion: string | null;
  datasetVersion: string | null;
  modelVersion: string | null;
  constraintSetVersion: string | null;
  optimizationRunId: string;
  solver: string | null;
  candidateSolutionCount: number;
  feasibleSolutionCount: number;
  selectedSolutionId: string;
  decisionStatus: string;
  generatedAt: string | null;
}

export interface CandidateSolution {
  solution_id: string;
  status: string;
  feasible: boolean;
  metrics: Record<string, { value: number | null; unit?: string | null; status?: string }>;
}

export interface DecisionAnalysis {
  decisionId: string;
  overview: DecisionOverview;
  selectedSolution: CandidateSolution | null;
  candidateSolutions: CandidateSolution[];
  solutionComparison: { metric_deltas: Record<string, number | null>; assignment_changes: Record<string, unknown> } | null;
  constraintAnalysis: { total: number; satisfied: number; violated: number; binding: number | null; constraints: Array<Record<string, unknown>>; rules: Array<Record<string, unknown>> };
  impacts: Array<Record<string, unknown>>;
  interventionComparisonStatus: string;
  explanation: Array<{ text: string; sourceRef: string; evidenceRefs: string[] }>;
  evidenceRefs: string[];
  provenanceRefs: string[];
}
