import type { StateTransition } from './types';

export function StateTransitionPanel({ transitions }: { transitions: StateTransition[] }) {
  if (!transitions.length) return <section className="scenario-transition"><h4>状态迁移</h4><p>基准场景没有干预，前后状态一致。</p></section>;
  return <div className="scenario-transition-list">{transitions.map((item) => <section className="scenario-transition" key={item.id}>
    <div className="ws-eyebrow">State Transition</div><h4>{item.interventionRef}</h4>
    <div className="scenario-transition-flow"><span>{item.fromState}</span><b>→</b><span>{item.toState}</span></div>
    <dl><dt>事件</dt><dd>{item.eventRef ?? '未提供'}</dd><dt>因果机制</dt><dd>{item.mechanismRefs.join(', ')}</dd><dt>影响</dt><dd>{item.impactRefs.join(', ')}</dd><dt>时间</dt><dd>{item.timestamp ?? '未提供'}</dd></dl>
    <details><summary>证据与变化</summary><pre>{JSON.stringify({ evidence_refs: item.evidenceRefs, change: item.change }, null, 2)}</pre></details>
  </section>)}</div>;
}
