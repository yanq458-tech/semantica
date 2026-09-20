import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import type { AssignmentExplanation } from '../types';
import type { CausalNode } from '../../../components/causal/types';
import { CausalChainView } from '../../../components/causal/CausalChainView';
import { CausalNodeDetail } from '../../../components/causal/CausalNodeDetail';
import './DecisionTracePanel.css';

export function DecisionTracePanel({ explanation, loading, onClose }: { explanation?: AssignmentExplanation; loading: boolean; onClose: () => void }) {
  const causal = explanation?.causalChain;
  const steps = causal?.stages ?? explanation?.evidenceChain.map((step, index) => ({ ...step, order: index + 1, stage: step.kind, label: step.kind })) ?? [];
  const [selectedNode, setSelectedNode] = useState<CausalNode>();
  const selectedEvidence = useMemo(() => explanation?.causalGraphV2?.evidence.filter((item) => selectedNode?.evidenceRefs.includes(item.id)) ?? [], [explanation?.causalGraphV2, selectedNode]);
  return <aside className="opt-trace">
    <div className="opt-trace-header"><div><div className="ws-eyebrow">决策依据与因果追溯</div><strong>{causal?.question ?? '资源分配方案解释'}</strong></div><button onClick={onClose} aria-label="关闭"><X size={16} /></button></div>
    <div className="opt-trace-body">
      {loading ? <div className="opt-muted">加载因果证据链…</div> : <>
        {causal && <div className="opt-causal-note"><strong>可审计业务因果链</strong><span>来源：{causal.source} · 仅展示显式事实、干预、规则和求解结果，不代表模型私有思维过程。</span></div>}
        <CausalChainView graph={explanation?.causalGraphV2} orderedChain={explanation?.orderedChainV2} legacyStages={steps} selectedNodeId={selectedNode?.id} onSelectNode={setSelectedNode} />
        {selectedNode && <div className="opt-causal-detail"><CausalNodeDetail node={selectedNode} evidence={selectedEvidence} /></div>}
      </>}
    </div>
  </aside>;
}
