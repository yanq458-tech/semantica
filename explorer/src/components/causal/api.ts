import type {
  CausalChainResponse,
  CausalEdge,
  CausalEvidence,
  CausalGraph,
  CausalMechanism,
  CausalNode,
  CausalNodeResponse,
  CausalTraversalResult,
  Impact,
  Intervention,
  InterventionComparison,
} from './types';

type Json = Record<string, unknown>;

async function readJson(url: string): Promise<Json> {
  const response = await fetch(url);
  const body = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }));
  if (!response.ok) throw new Error(typeof body.detail === 'string' ? body.detail : `HTTP ${response.status}`);
  return body as Json;
}

function mapEvidence(row: Json): CausalEvidence {
  return { id: String(row.id), type: row.type as CausalEvidence['type'], source: String(row.source), entityRef: row.entity_ref ? String(row.entity_ref) : undefined, facts: row.facts as Record<string, unknown>, timestamp: row.timestamp ? String(row.timestamp) : null, provenanceRef: row.provenance_ref ? String(row.provenance_ref) : null };
}

function mapNode(row: Json): CausalNode {
  return { id: String(row.id), type: row.type as CausalNode['type'], stage: row.stage as CausalNode['stage'], label: String(row.label), description: row.description ? String(row.description) : null, entityRefs: row.entity_refs as string[], scenarioRef: row.scenario_ref ? String(row.scenario_ref) : null, evidenceRefs: row.evidence_refs as string[], inputRefs: row.input_refs as string[], outputRefs: row.output_refs as string[], occurredAt: row.occurred_at ? String(row.occurred_at) : null, validFrom: row.valid_from ? String(row.valid_from) : null, validTo: row.valid_to ? String(row.valid_to) : null, source: String(row.source), evidenceType: row.evidence_type as CausalNode['evidenceType'], confidence: row.confidence == null ? null : Number(row.confidence), metadata: row.metadata as Record<string, unknown> };
}

function mapEdge(row: Json): CausalEdge {
  return { id: String(row.id), source: String(row.source), target: String(row.target), relation: row.relation as CausalEdge['relation'], mechanismRef: row.mechanism_ref ? String(row.mechanism_ref) : null, evidenceRefs: row.evidence_refs as string[], direction: row.direction as CausalEdge['direction'], delay: row.delay == null ? null : Number(row.delay), metadata: row.metadata as Record<string, unknown> };
}

function mapMechanism(row: Json): CausalMechanism {
  return { id: String(row.id), name: String(row.name), description: String(row.description), causeRefs: row.cause_refs as string[], effectRefs: row.effect_refs as string[], conditions: row.conditions as Array<Record<string, unknown>>, ruleRefs: row.rule_refs as string[], constraintRefs: row.constraint_refs as string[], evidenceRefs: row.evidence_refs as string[], domain: String(row.domain), version: String(row.version), confidence: row.confidence == null ? null : Number(row.confidence), source: row.source as CausalMechanism['source'] };
}

function mapImpact(row: Json): Impact {
  return { id: String(row.id), impactType: row.impact_type as Impact['impactType'], sourceRef: String(row.source_ref), targetRef: String(row.target_ref), before: row.before, after: row.after, delta: row.delta == null ? null : Number(row.delta), direction: row.direction as Impact['direction'], mechanismRef: row.mechanism_ref ? String(row.mechanism_ref) : null, evidenceRefs: row.evidence_refs as string[], metadata: row.metadata as Record<string, unknown> };
}

function mapGraph(row: Json): CausalGraph {
  const nodes = (row.nodes as Json[]).map(mapNode);
  const edges = (row.edges as Json[]).map(mapEdge);
  const incoming = new Set(edges.map((edge) => edge.target));
  const outgoing = new Set(edges.map((edge) => edge.source));
  return {
    schemaVersion: '2.0', graphId: String(row.graph_id), scope: row.scope as CausalGraph['scope'],
    nodes, edges, evidence: (row.evidence as Json[]).map(mapEvidence),
    mechanisms: (row.mechanisms as Json[]).map(mapMechanism), impacts: (row.impacts as Json[]).map(mapImpact),
    rootNodes: Array.isArray(row.root_nodes) ? row.root_nodes.map(String) : nodes.filter((node) => !incoming.has(node.id)).map((node) => node.id),
    terminalNodes: Array.isArray(row.terminal_nodes) ? row.terminal_nodes.map(String) : nodes.filter((node) => !outgoing.has(node.id)).map((node) => node.id),
  };
}

export async function loadCausalChain(decisionId: string): Promise<CausalChainResponse> {
  const row = await readJson(`/api/causal/chains/${encodeURIComponent(decisionId)}`);
  return { decisionId: String(row.decision_id), schemaVersion: '2.0', orderedChain: row.ordered_chain as string[], graph: mapGraph(row.graph as Json), observedOperationalOutcome: row.observed_operational_outcome as CausalChainResponse['observedOperationalOutcome'] };
}

export async function loadCausalNode(nodeId: string): Promise<CausalNodeResponse> {
  const row = await readJson(`/api/causal/nodes/${encodeURIComponent(nodeId)}`);
  return { node: mapNode(row.node as Json), evidence: (row.evidence as Json[]).map(mapEvidence), mechanism: row.mechanism ? mapMechanism(row.mechanism as Json) : null };
}

async function loadTraversal(direction: 'forward' | 'backward', nodeId: string, maxDepth = 5, maxNodes = 100): Promise<CausalTraversalResult> {
  const row = await readJson(`/api/causal/${direction}/${encodeURIComponent(nodeId)}?max_depth=${maxDepth}&max_nodes=${maxNodes}`);
  return { direction, startNodeId: String(row.start_node_id), graph: mapGraph(row.graph as Json), truncated: Boolean(row.truncated), maxDepth: Number(row.max_depth), maxNodes: Number(row.max_nodes) };
}

export const loadForwardImpact = (nodeId: string, maxDepth = 5, maxNodes = 100) => loadTraversal('forward', nodeId, maxDepth, maxNodes);
export const loadBackwardExplanation = (nodeId: string, maxDepth = 5, maxNodes = 100) => loadTraversal('backward', nodeId, maxDepth, maxNodes);

function mapIntervention(row: Json): Intervention {
  return { id: String(row.id), scenarioId: String(row.scenario_id), baselineScenarioId: String(row.baseline_scenario_id), changeRef: String(row.change_ref), targetRef: String(row.target_ref), variable: String(row.variable), before: row.before, after: row.after, description: String(row.description), source: String(row.source) };
}

export async function compareInterventions(baselineScenario: string, interventionScenario: string): Promise<InterventionComparison> {
  const row = await readJson(`/api/causal/interventions/compare?baseline_scenario=${encodeURIComponent(baselineScenario)}&intervention_scenario=${encodeURIComponent(interventionScenario)}`);
  return { comparisonId: String(row.comparison_id), baselineScenario: String(row.baseline_scenario), interventionScenario: String(row.intervention_scenario), baselineRun: row.baseline_run ? String(row.baseline_run) : null, interventionRun: row.intervention_run ? String(row.intervention_run) : null, baselineSolution: row.baseline_solution ? String(row.baseline_solution) : null, interventionSolution: row.intervention_solution ? String(row.intervention_solution) : null, changedVariables: (row.changed_variables as Json[]).map(mapIntervention), impacts: (row.impacts as Json[]).map(mapImpact), metricChanges: (row.metric_changes as Json[]).map(mapImpact), constraintChanges: (row.constraint_changes as Json[]).map(mapImpact), solutionChanges: (row.solution_changes as Json[]).map(mapImpact), decisionChanges: (row.decision_changes as Json[]).map(mapImpact), outcomeChanges: (row.outcome_changes as Json[]).map(mapImpact), comparabilityStatus: row.comparability_status as InterventionComparison['comparabilityStatus'], comparabilityReasons: row.comparability_reasons as string[] };
}
