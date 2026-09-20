import type { ScenarioRecord } from './types';

function fromWire(row: Record<string, unknown>): ScenarioRecord {
  const validation = row.validation as Record<string, unknown>;
  return {
    scenarioId: String(row.scenario_id), scenarioUri: String(row.scenario_uri), label: String(row.label),
    version: String(row.version), parentScenario: row.parent_scenario ? String(row.parent_scenario) : null,
    effectiveDigest: String(row.effective_digest), changes: row.changes as Array<Record<string, unknown>>,
    validation: { conforms: Boolean(validation.conforms), violationCount: Number(validation.violation_count), messages: validation.messages as string[] },
  };
}

export async function listScenarios(): Promise<ScenarioRecord[]> {
  const response = await fetch('/api/railway/scenarios');
  if (!response.ok) throw new Error(`场景服务返回 HTTP ${response.status}`);
  const body = await response.json() as { scenarios: Array<Record<string, unknown>> };
  return body.scenarios.map(fromWire);
}
