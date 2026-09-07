import type { AssignmentExplanation, AssignmentRow, MetricName, OptimizationRun, ScenarioChange, ScenarioRequest, ScenarioSummary, Solution, SolutionComparison } from './types';

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const body = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }));
  if (!response.ok) throw new Error(typeof body.detail === 'string' ? body.detail : `HTTP ${response.status}`);
  return body as T;
}

function changeToWire(change: ScenarioChange): Record<string, unknown> {
  if (change.type === 'resource_unavailable') return { type: change.type, resource_id: change.resourceId };
  if (change.type === 'train_service_addition') return { type: change.type, train_no: change.trainNo, required_model: change.requiredModel, departure_time: change.departureTime, arrival_time: change.arrivalTime };
  return { type: change.type, train_service_id: change.trainServiceId, departure_time: change.departureTime, arrival_time: change.arrivalTime };
}

function requestBody(value: ScenarioRequest) {
  return JSON.stringify({ base_scenario_id: value.baseScenarioId, changes: value.changes.map(changeToWire) });
}

export function validateScenario(value: ScenarioRequest): Promise<ScenarioSummary> {
  return requestJson<Record<string, unknown>>('/api/railway/scenarios/validate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: requestBody(value) }).then((row) => ({
    scenarioId: String(row.scenario_id), scenarioUri: String(row.scenario_uri), label: String(row.label), version: String(row.version), parentScenario: row.parent_scenario ? String(row.parent_scenario) : null, effectiveDigest: String(row.effective_digest), changes: row.changes as Array<Record<string, unknown>>, validation: { conforms: Boolean((row.validation as Record<string, unknown>).conforms), violationCount: Number((row.validation as Record<string, unknown>).violation_count), messages: (row.validation as Record<string, unknown>).messages as string[] },
  }));
}

export function startOptimization(value: ScenarioRequest): Promise<OptimizationRun> {
  return requestJson<Record<string, unknown>>('/api/railway/optimization-runs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: requestBody(value) }).then(runFromWire);
}

function runFromWire(row: Record<string, unknown>): OptimizationRun {
  return { runId: String(row.run_id), scenarioId: String(row.scenario_id), lifecycleStatus: row.lifecycle_status as OptimizationRun['lifecycleStatus'], solverStatus: row.solver_status as OptimizationRun['solverStatus'], solver: row.solver ? String(row.solver) : null, startedAt: row.started_at ? String(row.started_at) : null, completedAt: row.completed_at ? String(row.completed_at) : null, durationSeconds: row.duration_seconds == null ? null : Number(row.duration_seconds), objectiveValue: row.objective_value == null ? null : Number(row.objective_value), versions: row.versions as Record<string, string> | null, error: row.error as OptimizationRun['error'] };
}

export function loadRun(runId: string): Promise<OptimizationRun> {
  return requestJson<Record<string, unknown>>(`/api/railway/optimization-runs/${encodeURIComponent(runId)}`).then(runFromWire);
}

export function loadSolutions(runId: string): Promise<Solution[]> {
  return requestJson<{ solutions: Array<Record<string, unknown>> }>(`/api/railway/optimization-runs/${encodeURIComponent(runId)}/solutions`).then(({ solutions }) => solutions.map((row) => ({ solutionId: String(row.solution_id), runId: String(row.run_id), status: String(row.status), feasible: Boolean(row.feasible), rank: row.rank == null ? null : Number(row.rank), metrics: Object.entries(row.metrics as Record<string, Record<string, unknown>>).map(([name, metric]) => ({ name: name as MetricName, value: metric.value == null ? null : Number(metric.value), unit: String(metric.unit), direction: metric.direction as 'minimize' | 'maximize', status: metric.status as 'available' | 'not_available' })) })));
}

export function loadAssignments(solutionId: string): Promise<AssignmentRow[]> {
  return requestJson<{ assignments: Array<Record<string, unknown>> }>(`/api/railway/solutions/${encodeURIComponent(solutionId)}/assignments`).then(({ assignments }) => assignments.map((row) => ({ assignmentId: String(row.assignment_id), resourceId: String(row.resource_id), resourceModel: String(row.resource_model), resourceStatus: String(row.resource_status), taskId: String(row.task_id), requiredModel: String(row.required_model), satisfied: Boolean(row.satisfied), explanationAvailable: Boolean(row.explanation_available) })));
}

export function compareSolutions(left: string, right: string): Promise<SolutionComparison> {
  return requestJson<Record<string, unknown>>(`/api/railway/solutions/compare?left=${encodeURIComponent(left)}&right=${encodeURIComponent(right)}`).then((row) => { const changes = row.assignment_changes as Record<string, unknown>; return { leftSolutionId: String(row.left_solution), rightSolutionId: String(row.right_solution), metricDeltas: row.metric_deltas as SolutionComparison['metricDeltas'], assignmentChanges: { count: Number(changes.count), addedTasks: changes.added_tasks as string[], removedTasks: changes.removed_tasks as string[], changedTasks: changes.changed_tasks as SolutionComparison['assignmentChanges']['changedTasks'] } }; });
}

export function loadExplanation(assignmentId: string): Promise<AssignmentExplanation> {
  return requestJson<{ assignment_id: string; evidence_chain: Array<{ kind: string; entity_id: string; facts: Record<string, unknown> }> }>(`/api/railway/assignments/${encodeURIComponent(assignmentId)}/explanation`).then((row) => ({ assignmentId: row.assignment_id, evidenceChain: row.evidence_chain.map((step) => ({ kind: step.kind, entityId: step.entity_id, facts: step.facts })) }));
}
