import type { ScenarioAnalysis, ScenarioRecord, ScenarioState, StateTransition } from './types';
import { ACTIVE_DOMAIN_PACK } from '../../domains';

function fromWire(row: Record<string, unknown>): ScenarioRecord {
  const validation = row.validation as Record<string, unknown>;
  return {
    scenarioId: String(row.scenario_id), scenarioUri: String(row.scenario_uri), label: String(row.label),
    version: String(row.version), parentScenario: row.parent_scenario ? String(row.parent_scenario) : null,
    effectiveDigest: String(row.effective_digest), changes: row.changes as Array<Record<string, unknown>>,
    validation: { conforms: Boolean(validation.conforms), violationCount: Number(validation.violation_count), messages: validation.messages as string[] },
    domainPackId: ACTIVE_DOMAIN_PACK.id, domainName: ACTIVE_DOMAIN_PACK.name,
    scenarioType: (row.changes as unknown[])?.length ? 'Resource Assignment Change' : 'Resource Assignment Baseline',
    businessObjective: '在规则和约束条件下形成可行的资源—任务分配方案',
    provider: `${ACTIVE_DOMAIN_PACK.id}:scenario-provider`,
  };
}

export async function listScenarios(): Promise<ScenarioRecord[]> {
  const response = await fetch(`${ACTIVE_DOMAIN_PACK.apiBase}/scenarios`);
  if (!response.ok) throw new Error(`场景服务返回 HTTP ${response.status}`);
  const body = await response.json() as { scenarios: Array<Record<string, unknown>> };
  return body.scenarios.map(fromWire);
}

function stateFromWire(row: Record<string, unknown>): ScenarioState {
  return {
    scenarioId: String(row.scenario_id), stateId: String(row.state_id), phase: row.phase as ScenarioState['phase'],
    timestamp: row.timestamp ? String(row.timestamp) : null,
    entityStates: row.entity_states as Array<Record<string, unknown>>, resourceStates: row.resource_states as Array<Record<string, unknown>>,
    taskStates: row.task_states as Array<Record<string, unknown>>, constraintStates: row.constraint_states as Array<Record<string, unknown>>,
    metrics: row.metrics as Record<string, number>, sourceGraph: String(row.source_graph), digest: String(row.digest),
  };
}

function transitionFromWire(row: Record<string, unknown>): StateTransition {
  return {
    id: String(row.id), scenarioId: String(row.scenario_id), fromState: String(row.from_state), toState: String(row.to_state),
    eventRef: row.event_ref ? String(row.event_ref) : null, interventionRef: String(row.intervention_ref),
    mechanismRefs: row.mechanism_refs as string[], impactRefs: row.impact_refs as string[], timestamp: row.timestamp ? String(row.timestamp) : null,
    evidenceRefs: row.evidence_refs as string[], change: row.change as Record<string, unknown>,
  };
}

export async function loadScenarioAnalysis(scenarioId: string): Promise<ScenarioAnalysis> {
  const response = await fetch(`${ACTIVE_DOMAIN_PACK.apiBase}/scenarios/${encodeURIComponent(scenarioId)}/analysis`);
  if (!response.ok) throw new Error(`场景分析服务返回 HTTP ${response.status}`);
  const row = await response.json() as Record<string, unknown>;
  return {
    schemaVersion: String(row.schema_version), scenarioId: String(row.scenario_id), parentScenarioId: row.parent_scenario_id ? String(row.parent_scenario_id) : null,
    initialState: stateFromWire(row.initial_state as Record<string, unknown>), currentState: stateFromWire(row.current_state as Record<string, unknown>),
    transitions: (row.transitions as Array<Record<string, unknown>>).map(transitionFromWire),
    interventions: row.interventions as Array<Record<string, unknown>>, events: row.events as Array<Record<string, unknown>>,
    optimizationRuns: row.optimization_runs as Array<Record<string, unknown>>, versionRefs: row.version_refs as Record<string, string>,
  };
}
