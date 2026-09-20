import type { DomainPack } from '../types';

export const railwayDomainPack: DomainPack = {
  id: 'railway', name: '铁路运输', version: '1.1', status: 'enabled', apiBase: '/api/railway',
  description: 'COE 的第一个领域案例，提供铁路开行资源分配、场景验证、优化求解和决策追溯。',
  entityTypes: ['TrainService', 'EMUSet', 'Station', 'Route', 'TimeWindow', 'ConstraintRule'],
  relationTypes: ['departsFrom', 'arrivesAt', 'usesRoute', 'assignedTo', 'constrainedBy'],
  scenarioTypes: ['resource-assignment', 'resource-unavailable', 'task-addition', 'task-time-change'],
  capabilities: ['scenario-validation', 'optimization', 'solution-comparison', 'assignment-explanation', 'provenance', 'causal-analysis-v2', 'intervention-comparison', 'bounded-impact-traversal'],
  labels: { resource: '动车组', task: '开行任务', resourceType: '车型', assignment: '动车组分配', domainCase: '铁路开行' },
};
