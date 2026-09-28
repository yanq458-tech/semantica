export type DomainPackStatus = "enabled" | "planned" | "disabled";

export interface DomainPack {
  id: string;
  name: string;
  description: string;
  version: string;
  status: DomainPackStatus;
  entityTypes: string[];
  relationTypes: string[];
  scenarioTypes: string[];
  capabilities: string[];
  causalVariableTypes?: string[];
  mechanismTypes?: string[];
  scenarioTemplates?: string[];
  apiBase?: string;
  labels: Record<string, string>;
}

export interface DomainDescriptor {
  id: string;
  name: string;
  version: string;
  capabilities: readonly string[];
}
