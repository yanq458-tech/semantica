import type { Impact } from './types';
import { CausalImpactView } from './CausalImpactView';
import './causalGraph.css';

export function CausalImpactPanel({ impacts }: { impacts: Impact[] }) {
  const groups = impacts.reduce<Partial<Record<Impact['impactType'], Impact[]>>>((result, impact) => {
    result[impact.impactType] = [...(result[impact.impactType] ?? []), impact];
    return result;
  }, {});
  return <div className="causal-impact-panel">{Object.entries(groups).map(([type, values]) => <section key={type}><h4>{type}</h4><CausalImpactView impacts={values}/></section>)}</div>;
}
