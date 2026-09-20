import type { CoreObjectRef } from './organization';
export interface ScenarioDefinition { id: string; name: string; scenarioType: string; domainPackId: string; description: string; businessObjective: string; entities: CoreObjectRef[]; resources: CoreObjectRef[]; tasks: CoreObjectRef[]; ruleIds: string[]; constraintIds: string[]; events: Array<Record<string, unknown>>; parameters: Record<string, unknown>; state: string; objectiveIds: string[]; modelVersion: string; datasetVersion: string }
export interface ScenarioChange { type: string; targetId?: string; parameters: Record<string, unknown> }
