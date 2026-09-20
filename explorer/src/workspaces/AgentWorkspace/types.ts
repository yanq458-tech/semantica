export type AgentStatus = 'unconfigured' | 'ready' | 'running' | 'completed' | 'failed';

export type AgentKind =
  | 'modeling'
  | 'knowledge'
  | 'validation'
  | 'scenario'
  | 'optimization'
  | 'decision-analysis'
  | 'reporting';

export interface AgentDefinition {
  id: string;
  name: string;
  kind: AgentKind;
  responsibility: string;
  status: AgentStatus;
  currentTask: string | null;
  scenarioId: string | null;
  lastRunAt: string | null;
  inputs: string[];
  outputs: string[];
  apiCapability: string;
}

export interface AgentExecution {
  id: string;
  agentId: string;
  status: Exclude<AgentStatus, 'unconfigured' | 'ready'>;
  startedAt: string;
  completedAt: string | null;
  summary: string;
}
