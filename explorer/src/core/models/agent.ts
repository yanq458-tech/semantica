export type AgentStatus =
  | "unconfigured"
  | "ready"
  | "running"
  | "completed"
  | "failed";

export type AgentCapability =
  | "modeling"
  | "knowledge"
  | "rule-validation"
  | "scenario"
  | "reasoning"
  | "causal-analysis"
  | "optimization"
  | "comparison"
  | "decision-analysis"
  | "reporting";

export interface AgentDefinition {
  id: string;
  name: string;
  type: string;
  description: string;
  capabilities: AgentCapability[];
  domain: "core" | string;
  status: AgentStatus;
  version: string;
  currentTask?: string | null;
  scenarioId?: string | null;
  lastRunAt?: string | null;
  inputs?: string[];
  outputs?: string[];
  apiCapability?: string;
}

export interface AgentTask {
  taskId: string;
  agentId: string;
  scenarioId: string | null;
  input: Record<string, unknown>;
  status: AgentStatus;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

export interface AgentExecution {
  executionId: string;
  agentId: string;
  taskId: string;
  inputReference: string | null;
  outputReference: string | null;
  status: Exclude<AgentStatus, "unconfigured" | "ready">;
  logs: string[];
  evidence: string[];
  provenance: string[];
}
