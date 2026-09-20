import { Bot, Boxes, BrainCircuit, FileCheck2, FileText, GitCompareArrows, Route } from 'lucide-react';
import { AGENT_CATALOG } from './agentCatalog';
import type { AgentKind } from './types';
import './AgentWorkspace.css';

const ICONS: Record<AgentKind, typeof Bot> = {
  modeling: Boxes,
  knowledge: BrainCircuit,
  validation: FileCheck2,
  scenario: Route,
  optimization: Bot,
  'decision-analysis': GitCompareArrows,
  reporting: FileText,
};

export function AgentWorkspace() {
  return <div className="agent-workspace">
    <header className="agent-header">
      <div><div className="ws-eyebrow">Agent Center</div><h2>智能体中心</h2><p>智能体服务于建模、验证、场景、优化、决策和报告流程。当前版本建立配置与接口边界，不声称已具备自主决策能力。</p></div>
      <div className="agent-notice">真实 Agent 后端尚未接入。以下条目均为可扩展配置，当前不能执行任务。</div>
    </header>
    <section className="agent-grid" aria-label="智能体目录">
      {AGENT_CATALOG.map((agent) => { const Icon = ICONS[agent.kind]; return <article className="agent-card" key={agent.id}>
        <div className="agent-card-head"><div className="agent-icon"><Icon size={17}/></div><div><div className="agent-name">{agent.name}</div><div className="ws-eyebrow">{agent.kind}</div></div><span className="agent-status">未配置</span></div>
        <div className="agent-responsibility">{agent.responsibility}</div>
        <div className="agent-io"><div><strong>输入</strong><span>{agent.inputs.join(' · ')}</span></div><div><strong>输出</strong><span>{agent.outputs.join(' · ')}</span></div></div>
        <div className="agent-api">预留接口：{agent.apiCapability}</div>
      </article>; })}
    </section>
    <section className="agent-flow"><h3>建议协同链路</h3><div className="agent-flow-row"><span>业务场景</span><b>→</b><span>建模智能体</span><b>→</b><span>规则验证智能体</span><b>→</b><span>优化智能体</span><b>→</b><span>决策分析智能体</span><b>→</b><span>报告智能体</span></div></section>
  </div>;
}
