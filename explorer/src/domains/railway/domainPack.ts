import type { DomainPack } from '../types';

export const railwayDomainPack: DomainPack = {
  id: 'railway', name: '铁路运输', version: '1.1', status: 'enabled', apiBase: '/api/railway',
  description: 'COE 的第一个领域案例，提供铁路开行资源分配、场景验证、优化求解和决策追溯。',
  entityTypes: ['TrainService', 'EMUSet', 'Station', 'Route', 'TimeWindow', 'ConstraintRule'],
  relationTypes: ['departsFrom', 'arrivesAt', 'usesRoute', 'assignedTo', 'constrainedBy'],
  scenarioTypes: ['resource-assignment', 'resource-unavailable', 'task-addition', 'task-time-change'],
  capabilities: ['scenario-validation', 'optimization', 'solution-comparison', 'assignment-explanation', 'provenance', 'causal-analysis-v2', 'causal-graph', 'scenario-simulation', 'decision-analysis', 'reporting', 'intervention-comparison', 'bounded-impact-traversal'],
  causalVariableTypes: ['resource_status', 'task_set', 'time_window', 'constraint_status', 'solution_metric'],
  mechanismTypes: ['resource_availability_capacity', 'task_set_expansion', 'time_window_conflict'],
  scenarioTemplates: ['baseline', 'resource_unavailable', 'task_addition', 'task_time_change'],
  labels: { resource: '动车组', task: '开行任务', resourceType: '车型', assignment: '动车组分配', domainCase: '铁路开行' },
};
