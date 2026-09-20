import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ACTIVE_DOMAIN_PACK } from '../../domains';
import { CausalChainView } from '../../components/causal/CausalChainView';
import { CausalImpactView } from '../../components/causal/CausalImpactView';
import { CausalNodeDetail } from '../../components/causal/CausalNodeDetail';
import { compareInterventions, loadBackwardExplanation, loadCausalChain, loadForwardImpact } from '../../components/causal/api';
import type { CausalChainResponse, CausalGraph, CausalNode, InterventionComparison } from '../../components/causal/types';

type Tab = 'chain' | 'impact' | 'comparison';

export function CausalAnalysisPanel({ decisionId, legacyFallback }: { decisionId: string; legacyFallback: ReactNode }) {
  const [tab, setTab] = useState<Tab>('chain');
  const [chain, setChain] = useState<CausalChainResponse>();
  const [selectedNode, setSelectedNode] = useState<CausalNode>();
  const [queryGraph, setQueryGraph] = useState<CausalGraph>();
  const [queryMessage, setQueryMessage] = useState('');
  const [scenarios, setScenarios] = useState<Array<{ id: string; parent: string | null }>>([]);
  const [baseline, setBaseline] = useState('');
  const [intervention, setIntervention] = useState('');
  const [comparison, setComparison] = useState<InterventionComparison>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setChain(undefined);
    setSelectedNode(undefined);
    void loadCausalChain(decisionId).then((value) => { if (active) setChain(value); }).catch(() => { /* Historical decisions use the legacy path. */ });
    return () => { active = false; };
  }, [decisionId]);

  useEffect(() => {
    let active = true;
    void fetch(`${ACTIVE_DOMAIN_PACK.apiBase}/scenarios`).then((response) => response.ok ? response.json() : Promise.reject()).then((body: { scenarios?: Array<Record<string, unknown>> }) => {
      if (!active) return;
      const values = (body.scenarios ?? []).map((item) => ({ id: String(item.scenario_id), parent: item.parent_scenario ? String(item.parent_scenario).split('#').at(-1) ?? null : null }));
      setScenarios(values);
      setBaseline(values.find((item) => !item.parent)?.id ?? values[0]?.id ?? '');
      setIntervention(values.find((item) => item.parent)?.id ?? values[1]?.id ?? '');
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  const activeGraph = queryGraph ?? chain?.graph;
  const selectedEvidence = useMemo(() => activeGraph?.evidence.filter((item) => selectedNode?.evidenceRefs.includes(item.id)) ?? [], [activeGraph, selectedNode]);

  async function traverse(direction: 'forward' | 'backward') {
    const start = selectedNode?.id ?? decisionId;
    setLoading(true);
    setQueryMessage('');
    try {
      const result = direction === 'forward' ? await loadForwardImpact(start) : await loadBackwardExplanation(start);
      setQueryGraph(result.graph);
      setQueryMessage(`${direction === 'forward' ? '正向影响' : '反向解释'}：${result.graph.nodes.length} 个节点${result.truncated ? '（已按边界截断）' : ''}；路径类型为 impact_path。`);
    } catch (error) {
      setQueryMessage(error instanceof Error ? error.message : '查询失败');
    } finally {
      setLoading(false);
    }
  }

  async function runComparison() {
    if (!baseline || !intervention) return;
    setLoading(true);
    try { setComparison(await compareInterventions(baseline, intervention)); }
    catch (error) { setQueryMessage(error instanceof Error ? error.message : '比较失败'); }
    finally { setLoading(false); }
  }

  return <div className="causal-analysis-panel">
    <div className="causal-tabs">
      <button className={tab === 'chain' ? 'active' : ''} onClick={() => setTab('chain')}>因果链</button>
      <button className={tab === 'impact' ? 'active' : ''} onClick={() => setTab('impact')}>影响分析</button>
      <button className={tab === 'comparison' ? 'active' : ''} onClick={() => setTab('comparison')}>干预比较</button>
    </div>
    {tab === 'chain' && (chain ? <div className="causal-split"><CausalChainView graph={chain.graph} orderedChain={chain.orderedChain} selectedNodeId={selectedNode?.id} onSelectNode={setSelectedNode}/><CausalNodeDetail node={selectedNode} evidence={selectedEvidence}/></div> : legacyFallback)}
    {tab === 'impact' && <div className="causal-analysis-body">
      <div className="causal-actions"><button className="ws-btn ws-btn--ghost" disabled={loading} onClick={() => void traverse('forward')}>正向影响</button><button className="ws-btn ws-btn--ghost" disabled={loading} onClick={() => void traverse('backward')}>反向解释</button><button className="ws-btn ws-btn--ghost" onClick={() => { setQueryGraph(undefined); setQueryMessage(''); }}>重置</button></div>
      {queryMessage && <div className="causal-query-note">{queryMessage}</div>}
      <CausalImpactView impacts={activeGraph?.impacts ?? []}/>
      {queryGraph && <CausalChainView graph={queryGraph} selectedNodeId={selectedNode?.id} onSelectNode={setSelectedNode}/>} 
    </div>}
    {tab === 'comparison' && <div className="causal-analysis-body">
      <div className="causal-compare-controls"><select value={baseline} onChange={(event) => setBaseline(event.target.value)}>{scenarios.map((item) => <option key={item.id} value={item.id}>{item.id}</option>)}</select><span>→</span><select value={intervention} onChange={(event) => setIntervention(event.target.value)}>{scenarios.map((item) => <option key={item.id} value={item.id}>{item.id}</option>)}</select><button className="ws-btn ws-btn--primary" disabled={loading || !baseline || !intervention || baseline === intervention} onClick={() => void runComparison()}>比较干预</button></div>
      {comparison && <><div className={`causal-query-note ${comparison.comparabilityStatus === 'comparable' ? 'ok' : 'warn'}`}>可比性：{comparison.comparabilityStatus}{comparison.comparabilityReasons.length ? ` · ${comparison.comparabilityReasons.join('；')}` : ''}</div><div className="causal-interventions">{comparison.changedVariables.map((item) => <div key={item.id}><strong>{item.variable}</strong><span>{String(item.before ?? '不可用')} → {String(item.after ?? '不可用')}</span></div>)}</div><CausalImpactView impacts={comparison.impacts}/></>}
    </div>}
  </div>;
}
