import type { ScenarioRecord } from './types';
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
