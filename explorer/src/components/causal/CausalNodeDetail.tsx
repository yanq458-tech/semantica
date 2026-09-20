import type { CausalEvidence, CausalMechanism, CausalNode } from './types';

export function CausalNodeDetail({ node, evidence, mechanism }: { node?: CausalNode; evidence: CausalEvidence[]; mechanism?: CausalMechanism | null }) {
  if (!node) return <div className="causal-empty">选择节点后查看来源、证据和关联信息。</div>;
  return <div className="causal-node-detail">
    <div><span>类型</span><strong>{node.type}</strong></div>
    <div><span>描述</span><strong>{node.description || '未提供'}</strong></div>
    <div><span>来源</span><strong>{node.source}</strong></div>
    <div><span>证据类型</span><strong>{node.evidenceType || '未提供'}</strong></div>
    <div><span>置信度</span><strong>{node.confidence == null ? '未提供' : node.confidence}</strong></div>
    <div><span>时间</span><strong>{node.occurredAt || '未提供'}</strong></div>
    <div><span>关联实体</span><strong>{node.entityRefs.join(', ') || '无'}</strong></div>
    <div><span>场景</span><strong>{node.scenarioRef || '未提供'}</strong></div>
    <div><span>输入</span><strong>{node.inputRefs.join(', ') || '无'}</strong></div>
    <div><span>输出</span><strong>{node.outputRefs.join(', ') || '无'}</strong></div>
    <details><summary>元数据</summary><pre>{JSON.stringify(node.metadata, null, 2)}</pre></details>
    <details><summary>证据（{evidence.length}）</summary><pre>{JSON.stringify(evidence, null, 2)}</pre></details>
    {mechanism && <details open><summary>机制详情</summary><pre>{JSON.stringify({ conditions: mechanism.conditions, causes: mechanism.causeRefs, effects: mechanism.effectRefs, rules: mechanism.ruleRefs, constraints: mechanism.constraintRefs, evidenceType: mechanism.source, confidence: mechanism.confidence ?? '未提供', version: mechanism.version }, null, 2)}</pre></details>}
  </div>;
}
