import { useEffect, useState } from 'react';
import { ArrowRight, Route } from 'lucide-react';
import { listScenarios } from './api';
import type { ScenarioRecord } from './types';
import './ScenarioWorkspace.css';

export function ScenarioWorkspace({ onOpenOptimization }: { onOpenOptimization: () => void }) {
  const [scenarios, setScenarios] = useState<ScenarioRecord[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { const controller = new AbortController(); listScenarios().then((rows) => { if (!controller.signal.aborted) { setScenarios(rows); setSelectedId(rows[0]?.scenarioId ?? ''); } }).catch((reason: unknown) => { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : '无法加载场景'); }); return () => controller.abort(); }, []);
  const selected = scenarios.find((item) => item.scenarioId === selectedId);
  return <div className="scenario-workspace">
    <header className="scenario-header"><div><div className="ws-eyebrow">Scenario Workspace</div><h2>场景推演</h2><p>场景变化与基础知识数据分离；选择场景后进入现有优化链路独立验证和求解。</p></div><span className="scenario-state">真实铁路 API</span></header>
    {error && <div className="opt-error">{error}</div>}
    <div className="scenario-layout"><aside className="scenario-list"><div className="ws-eyebrow" style={{marginBottom:10}}>场景目录 · {scenarios.length}</div>{scenarios.map((item) => <button className="scenario-item" data-active={item.scenarioId === selectedId} key={item.scenarioId} onClick={() => setSelectedId(item.scenarioId)}><strong>{item.label}</strong><span>{item.scenarioId} · {item.version}</span></button>)}</aside>
      <main className="scenario-detail">{selected ? <><div className="ws-eyebrow">{selected.scenarioId}</div><h3>{selected.label}</h3><div className="scenario-meta"><div><span>当前版本</span><strong>{selected.version}</strong></div><div><span>父场景</span><strong>{selected.parentScenario ?? '基础数据'}</strong></div><div><span>验证状态</span><strong>{selected.validation.conforms ? '通过' : `${selected.validation.violationCount} 项违反`}</strong></div></div><div className="scenario-sections"><section className="scenario-section"><h4>具体变化</h4><pre>{selected.changes.length ? JSON.stringify(selected.changes, null, 2) : '无变化（基准场景）'}</pre></section><section className="scenario-section"><h4>数据指纹</h4><pre>{selected.effectiveDigest}</pre></section></div><div className="scenario-flow"><span>场景定义</span><b>→</b><span>组织体实例</span><b>→</b><span>规则验证</span><b>→</b><span>资源筛选</span><b>→</b><span>优化求解</span><b>→</b><span>方案生成</span><b>→</b><span>决策分析</span></div><div className="scenario-actions"><button className="ws-btn ws-btn--primary" onClick={onOpenOptimization}>进入优化决策 <ArrowRight size={14}/></button></div></> : <div className="ws-empty"><Route size={28}/><div className="ws-empty-title">正在加载场景</div></div>}</main></div>
  </div>;
}
