import type { AgentDefinition } from '../../core/models/agent';

const entry = (type: string, name: string, description: string, capabilities: AgentDefinition['capabilities'], inputs: string[], outputs: string[]): AgentDefinition => ({
  id: `agent-${type}`, name, type, description, capabilities, domain: 'core', status: 'unconfigured', version: '1.0.0', currentTask: null, scenarioId: null, lastRunAt: null, inputs, outputs, apiCapability: `/api/agents/${type}`,
});

export const AGENT_CATALOG: AgentDefinition[] = [
  entry('modeling', '建模智能体', '识别业务对象、构建关系并辅助创建组织体模型和领域映射。', ['modeling'], ['业务问题', '业务数据', '领域规则'], ['组织体模型', '领域映射']),
  entry('knowledge', '知识智能体', '执行知识查询、关系发现、知识补充和组织体解释。', ['knowledge'], ['组织体模型', '知识数据'], ['查询结果', '候选关系']),
  entry('rule', '规则智能体', '解析规则和约束，执行一致性检查并定位异常原因。', ['rule-validation'], ['实例数据', '规则集', '约束集'], ['验证结果', '违反项']),
  entry('scenario', '场景智能体', '构建场景、装配参数和事件，并组织场景运行。', ['scenario'], ['基准场景', '场景变化', '事件'], ['有效场景', '运行任务']),
  entry('reasoning', '推演智能体', '执行状态推演、规则传播、影响分析和场景演化。', ['reasoning'], ['场景状态', '规则', '事件'], ['状态变化', '影响路径']),
  entry('optimization', '优化智能体', '组织变量、目标和约束，调用求解器生成候选方案。', ['optimization'], ['场景', '优化问题', '求解配置'], ['优化运行', '候选方案']),
  entry('decision-analysis', '决策智能体', '比较方案并分析指标、约束、风险和决策依据。', ['comparison', 'decision-analysis'], ['候选方案', '约束结果', '证据链'], ['方案比较', '决策解释']),
  entry('reporting', '报告智能体', '汇总模型、场景、求解、比较和决策依据形成报告草案。', ['reporting'], ['运行结果', '方案指标', '来源追溯'], ['结构化报告']),
];
