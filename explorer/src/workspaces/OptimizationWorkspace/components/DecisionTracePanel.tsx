import { X } from 'lucide-react';
import type { AssignmentExplanation } from '../types';
import './DecisionTracePanel.css';

export function DecisionTracePanel({ explanation, loading, onClose }: { explanation?: AssignmentExplanation; loading: boolean; onClose: () => void }) {
  const causal = explanation?.causalChain;
  const steps = causal?.stages ?? explanation?.evidenceChain.map((step, index) => ({ ...step, order: index + 1, stage: step.kind, label: step.kind })) ?? [];
  return <aside className="opt-trace">
    <div className="opt-trace-header"><div><div className="ws-eyebrow">决策依据与因果追溯</div><strong>{causal?.question ?? '资源分配方案解释'}</strong></div><button onClick={onClose} aria-label="关闭"><X size={16} /></button></div>
    <div className="opt-trace-body">
      {loading ? <div className="opt-muted">加载因果证据链…</div> : <>
        {causal && <div className="opt-causal-note"><strong>可审计业务因果链</strong><span>来源：{causal.source} · 仅展示显式事实、干预、规则和求解结果，不代表模型私有思维过程。</span></div>}
        {steps.map((step) => <div className={`opt-evidence opt-evidence-${step.stage}`} key={`${step.order}-${step.entityId}`}><span>{step.order}</span><div><small>{step.label}</small><strong>{step.entityId}</strong><pre>{JSON.stringify(step.facts, null, 2)}</pre></div></div>)}
        {!steps.length && <div className="opt-muted">暂无可用的决策证据。</div>}
      </>}
    </div>
  </aside>;
}
