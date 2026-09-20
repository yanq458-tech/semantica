import { ACTIVE_DOMAIN_PACK } from '../../domains';
import type { AgentPreview } from './types';

export async function loadAgentPreview(agentType: string, scenarioId: string): Promise<AgentPreview> {
  const response = await fetch(`${ACTIVE_DOMAIN_PACK.apiBase}/agents/${encodeURIComponent(agentType)}/preview?scenario_id=${encodeURIComponent(scenarioId)}`);
  if (!response.ok) throw new Error(`智能体数据服务返回 HTTP ${response.status}`);
  const row = await response.json() as Record<string, unknown>;
  return {
    agentId: String(row.agent_id), agentType: String(row.agent_type), mode: 'read_only_analysis', status: String(row.status),
    scenarioRef: String(row.scenario_ref), solutionRef: row.solution_ref ? String(row.solution_ref) : null,
    evidenceRefs: row.evidence_refs as string[], provenanceRefs: row.provenance_refs as string[], output: row.output,
    limitations: row.limitations as string[],
  };
}
