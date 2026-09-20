export interface DomainPack {
  id: string;
  name: string;
  description: string;
  version: string;
  status: 'enabled' | 'planned';
  entityTypes: string[];
  relationTypes: string[];
  scenarioTypes: string[];
  capabilities: string[];
  apiBase?: string;
  labels: Record<string, string>;
}
