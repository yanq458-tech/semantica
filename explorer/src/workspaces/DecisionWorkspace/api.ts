import { ACTIVE_DOMAIN_PACK } from '../../domains';
import type { CandidateSolution, DecisionAnalysis, DecisionOverview } from './types';

type Json = Record<string, unknown>;

export async function loadDecisionAnalysis(decisionId: string): Promise<DecisionAnalysis> {
  const response = await fetch(`${ACTIVE_DOMAIN_PACK.apiBase}/decisions/${encodeURIComponent(decisionId)}/analysis`);
  if (!response.ok) throw new Error(`决策分析服务返回 HTTP ${response.status}`);
  const row = await response.json() as Json;
  const overview = row.overview as Json;
  const mappedOverview: DecisionOverview = {
    scenarioId: String(overview.scenario_id), scenarioVersion: overview.scenario_version ? String(overview.scenario_version) : null,
    datasetVersion: overview.dataset_version ? String(overview.dataset_version) : null, modelVersion: overview.model_version ? String(overview.model_version) : null,
    constraintSetVersion: overview.constraint_set_version ? String(overview.constraint_set_version) : null,
    optimizationRunId: String(overview.optimization_run_id), solver: overview.solver ? String(overview.solver) : null,
    candidateSolutionCount: Number(overview.candidate_solution_count), feasibleSolutionCount: Number(overview.feasible_solution_count),
    selectedSolutionId: String(overview.selected_solution_id), decisionStatus: String(overview.decision_status), generatedAt: overview.generated_at ? String(overview.generated_at) : null,
  };
  return {
    decisionId: String(row.decision_id), overview: mappedOverview,
    selectedSolution: row.selected_solution as CandidateSolution | null, candidateSolutions: row.candidate_solutions as CandidateSolution[],
    solutionComparison: row.solution_comparison as DecisionAnalysis['solutionComparison'], constraintAnalysis: row.constraint_analysis as DecisionAnalysis['constraintAnalysis'],
    impacts: row.impacts as Array<Record<string, unknown>>, interventionComparisonStatus: String(row.intervention_comparison_status),
    explanation: (row.explanation as Json[]).map((item) => ({ text: String(item.text), sourceRef: String(item.source_ref), evidenceRefs: item.evidence_refs as string[] })),
    evidenceRefs: row.evidence_refs as string[], provenanceRefs: row.provenance_refs as string[],
  };
}
