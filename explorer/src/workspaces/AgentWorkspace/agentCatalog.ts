import type { AgentDefinition } from './types';

export const AGENT_CATALOG: AgentDefinition[] = [
  ['modeling', '建模智能体', 'modeling', '根据业务场景、对象和规则辅助构建复杂组织体模型。', ['业务场景', '业务数据', '建模规则'], ['组织体模型', '实例草案'], '/api/agents/modeling'],
  ['knowledge', '知识智能体', 'knowledge', '执行知识查询、关系发现、知识补充和组织体解释。', ['组织体模型', '知识数据'], ['查询结果', '候选关系'], '/api/agents/knowledge'],
  ['validation', '规则验证智能体', 'validation', '检查组织体实例是否满足业务规则和约束。', ['实例数据', '规则集', '约束集'], ['验证结果', '违反项'], '/api/agents/validation'],
  ['scenario', '场景推演智能体', 'scenario', '根据场景参数组织变化应用、验证和推演任务。', ['基准场景', '场景变化'], ['有效场景', '推演任务'], '/api/agents/scenario'],
  ['optimization', '优化智能体', 'optimization', '调用已配置的优化模型和求解器生成候选方案。', ['场景', '优化模型', '求解器配置'], ['OptimizationRun', 'Solution'], '/api/agents/optimization'],
  ['decision-analysis', '决策分析智能体', 'decision-analysis', '比较候选方案并分析指标、约束、风险和决策依据。', ['候选方案', '约束结果', '证据链'], ['方案比较', '决策解释'], '/api/agents/decision-analysis'],
  ['reporting', '报告智能体', 'reporting', '汇总模型、场景、求解、比较和决策依据形成报告草案。', ['运行结果', '方案指标', '来源追溯'], ['分析报告'], '/api/agents/reporting'],
].map(([id, name, kind, responsibility, inputs, outputs, apiCapability]) => ({
  id: `agent-${id}`,
  name: String(name),
  kind: kind as AgentDefinition['kind'],
  responsibility: String(responsibility),
  status: 'unconfigured',
  currentTask: null,
  scenarioId: null,
  lastRunAt: null,
  inputs: inputs as string[],
  outputs: outputs as string[],
  apiCapability: String(apiCapability),
}));
