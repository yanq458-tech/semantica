export type CausalViewMode = 'chain' | 'graph';
import './causalGraph.css';

export function CausalViewSwitcher({ mode, onChange }: { mode: CausalViewMode; onChange: (mode: CausalViewMode) => void }) {
  return <div className="causal-view-switcher" role="group" aria-label="因果视图模式">
    <button className={mode === 'chain' ? 'active' : ''} onClick={() => onChange('chain')}>链视图</button>
    <button className={mode === 'graph' ? 'active' : ''} onClick={() => onChange('graph')}>图视图</button>
  </div>;
}
