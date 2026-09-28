import { useEffect, useState } from 'react';
import { ArrowRight, Route } from 'lucide-react';
import { listScenarios, loadScenarioAnalysis } from './api';
import type { ScenarioAnalysis, ScenarioRecord } from './types';
import { ScenarioStatePanel } from './ScenarioStatePanel';
import { StateTransitionPanel } from './StateTransitionPanel';
import './ScenarioWorkspace.css';
import './ScenarioStatePanel.css';

export function ScenarioWorkspace({ onOpenOptimization }: { onOpenOptimization: () => void }) {
  const [scenarios, setScenarios] = useState<ScenarioRecord[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [analysis, setAnalysis] = useState<ScenarioAnalysis>();
  const [error, setError] = useState('');
  useEffect(() => { const controller = new AbortController(); listScenarios().then((rows) => { if (!controller.signal.aborted) { setScenarios(rows); setSelectedId(rows[0]?.scenarioId ?? ''); } }).catch((reason: unknown) => { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : '无法加载场景'); }); return () => controller.abort(); }, []);
  useEffect(() => { if (!selectedId) return; let active = true; setAnalysis(undefined); void loadScenarioAnalysis(selectedId).then((value) => { if (active) setAnalysis(value); }).catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : '无法加载场景状态'); }); return () => { active = false; }; }, [selectedId]);
  const selected = scenarios.find((item) => item.scenarioId === selectedId);
  return <div className="scenario-workspace">
    <header className="scenario-header"><div><div className="ws-eyebrow">Scenario & Simulation</div><h2>场景与推演</h2><p>以基础知识数据为只读基线，展示干预前后状态、迁移证据与关联优化运行。</p></div><span className="scenario-state">当前领域：{scenarios[0]?.domainName ?? '加载中'}</span></header>
    {error && <div className="opt-error">{error}</div>}
    <div className="scenario-layout"><aside className="scenario-list"><div className="ws-eyebrow" style={{marginBottom:10}}>场景目录 · {scenarios.length}</div>{scenarios.map((item) => <button className="scenario-item" data-active={item.scenarioId === selectedId} key={item.scenarioId} onClick={() => setSelectedId(item.scenarioId)}><strong>{item.label}</strong><span>{item.scenarioId} · {item.version}</span></button>)}</aside>
      <main className="scenario-detail">{selected ? <>
        <div className="ws-eyebrow">{selected.domainName} · {selected.scenarioType}</div><h3>{selected.label}</h3>
        <div className="scenario-meta"><div><span>场景版本</span><strong>{selected.version}</strong></div><div><span>父场景</span><strong>{analysis?.parentScenarioId ?? selected.parentScenario ?? '基础数据'}</strong></div><div><span>验证状态</span><strong>{selected.validation.conforms ? '通过' : `${selected.validation.violationCount} 项违反`}</strong></div></div>
        <div className="scenario-sections"><section className="scenario-section"><h4>业务目标</h4><pre>{selected.businessObjective}</pre><h4 style={{marginTop:12}}>场景变化 / Intervention</h4><pre>{selected.changes.length ? JSON.stringify(selected.changes, null, 2) : '无变化（基准场景）'}</pre></section><section className="scenario-section"><h4>领域与数据版本</h4><pre>Domain Pack: {selected.domainPackId}{'\n'}Provider: {selected.provider}{'\n'}Digest: {selected.effectiveDigest}</pre></section></div>
        {analysis ? <><div className="scenario-state-grid"><ScenarioStatePanel title="Baseline State" state={analysis.initialState}/><ScenarioStatePanel title="Current State" state={analysis.currentState}/></div><StateTransitionPanel transitions={analysis.transitions}/><section className="scenario-section scenario-runs"><h4>OptimizationRun · {analysis.optimizationRuns.length}</h4><pre>{analysis.optimizationRuns.length ? JSON.stringify(analysis.optimizationRuns, null, 2) : '当前场景暂无持久化优化运行。'}</pre></section></> : <div className="ws-empty">正在生成场景状态快照…</div>}
        <div className="scenario-flow"><span>Baseline</span><b>→</b><span>Intervention</span><b>→</b><span>Validate</span><b>→</b><span>State Transition</span><b>→</b><span>Optimize</span><b>→</b><span>Decision</span><b>→</b><span>Report</span></div><div className="scenario-actions"><button className="ws-btn ws-btn--primary" onClick={onOpenOptimization}>进入优化决策 <ArrowRight size={14}/></button></div>
      </> : <div className="ws-empty"><Route size={28}/><div className="ws-empty-title">正在加载场景</div></div>}</main></div>
  </div>;
}
