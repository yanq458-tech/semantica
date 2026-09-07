import { CheckCircle2, Database } from 'lucide-react';
import type { ScenarioSummary } from '../types';

export function ScenarioPanel({ scenario }: { scenario?: ScenarioSummary }) {
  return <section className="opt-card">
    <div className="opt-section-title"><Database size={15} />当前 Scenario</div>
    {!scenario ? <div className="opt-muted">等待场景校验…</div> : <>
      <div className="opt-scenario-name">{scenario.label}</div>
      <dl className="opt-detail-list">
        <div><dt>ID</dt><dd>{scenario.scenarioId}</dd></div>
        <div><dt>版本</dt><dd>{scenario.version}</dd></div>
        <div><dt>父场景</dt><dd>{scenario.parentScenario?.split('#').pop() ?? '无'}</dd></div>
        <div><dt>摘要</dt><dd title={scenario.effectiveDigest}>{scenario.effectiveDigest.slice(0, 12)}…</dd></div>
      </dl>
      <span className="ws-pill ws-pill--green"><CheckCircle2 size={11} />SHACL通过</span>
    </>}
  </section>;
}
