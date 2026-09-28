import type { Impact } from './types';

const value = (input: unknown) => input == null ? '不可用' : typeof input === 'object' ? JSON.stringify(input) : String(input);

export function CausalImpactView({ impacts }: { impacts: Impact[] }) {
  if (!impacts.length) return <div className="causal-empty">暂无可比较的影响变化。</div>;
  return <div className="causal-impact-list">{impacts.map((impact) => <div className="causal-impact-card" key={impact.id}>
    <div><small>{impact.impactType}</small><strong>{impact.targetRef}</strong></div>
    <div className="causal-impact-values"><span>{value(impact.before)}</span><b>→</b><span>{value(impact.after)}</span><em>{impact.direction === 'unavailable' ? 'Δ 不可用' : impact.delta == null ? impact.direction : `Δ ${impact.delta >= 0 ? '+' : ''}${impact.delta}`}</em></div>
  </div>)}</div>;
}
