export type CoreObjectKind = 'organization' | 'entity' | 'resource' | 'task' | 'activity' | 'service' | 'agent' | 'rule' | 'constraint' | 'scenario' | 'event' | 'state' | 'objective' | 'metric' | 'model' | 'solution' | 'decision' | 'report' | 'evidence';

export interface CoreObjectRef { id: string; kind: CoreObjectKind; label: string; domainType?: string }
export interface OrganizationModel { id: string; name: string; domainPackId: string; version: string; status: string; objects: CoreObjectRef[] }
