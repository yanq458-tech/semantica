import { useState } from 'react';
import { Bot, Boxes, BrainCircuit, FileCheck2, FileText, GitCompareArrows, Route, Waypoints } from 'lucide-react';
import { AGENT_CATALOG } from './agentCatalog';
import { loadAgentPreview } from './api';
import type { AgentKind, AgentPreview } from './types';
import './AgentWorkspace.css';
import './AgentPreview.css';

const ICONS: Record<AgentKind, typeof Bot> = {
  modeling: Boxes,
  knowledge: BrainCircuit,
  rule: FileCheck2,
  scenario: Route,
  'causal-analysis': Waypoints,
  optimization: Bot,
  'decision-analysis': GitCompareArrows,
  reporting: FileText,
};

export function AgentWorkspace() {
  const [scenarioId, setScenarioId] = useState('Scenario_A');
  const [preview, setPreview] = useState<AgentPreview>();
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const connected = new Set(['scenario', 'causal-analysis', 'optimization', 'decision-analysis', 'reporting']);
  async function inspect(type: string) { setBusy(type); setError(''); try { setPreview(await loadAgentPreview(type, scenarioId)); } catch (reason) { setError(reason instanceof Error ? reason.message : '智能体数据读取失败'); } finally { setBusy(''); } }
  return <div className="agent-workspace">
    <header className="agent-header">
      <div><div className="ws-eyebrow">Agent Center</div><h2>智能体中心</h2><p>智能体服务于建模、验证、场景、优化、决策和报告流程。当前版本建立配置与接口边界，不声称已具备自主决策能力。</p></div>
      <div className="agent-notice">P1 已接入只读分析数据，不执行自主决策或现实操作。<select value={scenarioId} onChange={(event) => setScenarioId(event.target.value)}>{['Scenario_A','Scenario_B','Scenario_C','Scenario_D'].map((id) => <option key={id}>{id}</option>)}</select></div>
    </header>
    <section className="agent-grid" aria-label="智能体目录">
      {AGENT_CATALOG.map((agent) => { const Icon = ICONS[agent.type as AgentKind]; return <article className="agent-card" key={agent.id}>
        <div className="agent-card-head"><div className="agent-icon"><Icon size={17}/></div><div><div className="agent-name">{agent.name}</div><div className="ws-eyebrow">{agent.type} · v{agent.version}</div></div><span className="agent-status">{connected.has(agent.type) ? '只读数据已连接' : '未配置'}</span></div>
        <div className="agent-responsibility">{agent.description}</div>
        <div className="agent-io"><div><strong>输入</strong><span>{agent.inputs?.join(' · ')}</span></div><div><strong>输出</strong><span>{agent.outputs?.join(' · ')}</span></div></div>
        <div className="agent-api">能力：{agent.capabilities.join(' · ')}<br/>领域：{agent.domain} · 接口：{agent.apiCapability}</div>{connected.has(agent.type) && <button className="ws-btn ws-btn--ghost" disabled={busy === agent.type} onClick={() => void inspect(agent.type)}>{busy === agent.type ? '正在读取…' : '查看真实数据预览'}</button>}
      </article>; })}
    </section>
    {error && <div className="opt-error">{error}</div>}
    {preview && <section className="ws-card agent-preview"><div className="ws-eyebrow">{preview.agentId} · {preview.mode}</div><h3>{preview.scenarioRef} 分析预览</h3><p>Evidence: {preview.evidenceRefs.join(', ') || '由输出中的来源引用提供'}<br/>Provenance: {preview.provenanceRefs.join(', ') || '由输出中的来源引用提供'}</p><pre>{JSON.stringify(preview.output, null, 2)}</pre><div className="agent-notice">能力边界：{preview.limitations.join('；')}</div></section>}
    <section className="agent-flow"><h3>建议协同链路</h3><div className="agent-flow-row"><span>业务场景</span><b>→</b><span>建模智能体</span><b>→</b><span>规则智能体</span><b>→</b><span>场景/推演智能体</span><b>→</b><span>优化智能体</span><b>→</b><span>决策智能体</span><b>→</b><span>报告智能体</span></div><p className="agent-responsibility">任务与执行记录采用通用 AgentTask / AgentExecution 契约；真实执行后端尚未接入。</p></section>
  </div>;
}
