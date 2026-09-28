import type { CausalMechanism } from './types';

const list = (values: string[]) => values.length ? values.join(', ') : '无';

export function CausalMechanismDetail({ mechanism }: { mechanism?: CausalMechanism | null }) {
  if (!mechanism) return <div className="causal-empty">当前节点没有可核查的因果机制。</div>;
  return <div className="causal-node-detail">
    <div><span>机制</span><strong>{mechanism.name}</strong></div><div><span>描述</span><strong>{mechanism.description}</strong></div>
    <div><span>原因</span><strong>{list(mechanism.causeRefs)}</strong></div><div><span>结果</span><strong>{list(mechanism.effectRefs)}</strong></div>
    <div><span>业务规则</span><strong>{list(mechanism.ruleRefs)}</strong></div><div><span>数学约束</span><strong>{list(mechanism.constraintRefs)}</strong></div>
    <div><span>证据</span><strong>{list(mechanism.evidenceRefs)}</strong></div><div><span>来源</span><strong>{mechanism.source}</strong></div>
    <div><span>版本</span><strong>{mechanism.version}</strong></div><div><span>置信度</span><strong>{mechanism.confidence == null ? '未提供' : mechanism.confidence}</strong></div>
    <details><summary>适用条件</summary><pre>{JSON.stringify(mechanism.conditions, null, 2)}</pre></details>
  </div>;
}
