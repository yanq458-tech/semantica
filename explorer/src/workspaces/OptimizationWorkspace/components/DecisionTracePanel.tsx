import { X } from 'lucide-react';
import type { AssignmentExplanation } from '../types';

export function DecisionTracePanel({ explanation, loading, onClose }: { explanation?: AssignmentExplanation; loading: boolean; onClose: () => void }) {
  return <aside className="opt-trace"><div className="opt-trace-header"><div><div className="ws-eyebrow">决策依据与追溯</div><strong>资源分配方案解释</strong></div><button onClick={onClose} aria-label="关闭"><X size={16} /></button></div><div className="opt-trace-body">{loading ? <div className="opt-muted">加载证据链…</div> : explanation?.evidenceChain.map((step, index) => <div className="opt-evidence" key={`${step.kind}-${step.entityId}`}><span>{index + 1}</span><div><small>{step.kind}</small><strong>{step.entityId}</strong><pre>{JSON.stringify(step.facts, null, 2)}</pre></div></div>)}</div></aside>;
}
