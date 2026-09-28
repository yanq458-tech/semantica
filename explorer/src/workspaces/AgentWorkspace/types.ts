export type { AgentCapability, AgentDefinition, AgentExecution, AgentStatus, AgentTask } from '../../core/models/agent';
export type AgentKind = 'modeling' | 'knowledge' | 'rule' | 'scenario' | 'causal-analysis' | 'optimization' | 'decision-analysis' | 'reporting';

export interface AgentPreview {
  agentId: string;
  agentType: string;
  mode: 'read_only_analysis';
  status: string;
  scenarioRef: string;
  solutionRef: string | null;
  evidenceRefs: string[];
  provenanceRefs: string[];
  output: unknown;
  limitations: string[];
}
