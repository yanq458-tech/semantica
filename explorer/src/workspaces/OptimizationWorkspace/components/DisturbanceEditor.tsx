import type { DisturbanceKind, ScenarioRequest } from '../types';
import { railwayScenarioRequest } from '../../../domains/railway';

export function DisturbanceEditor({ kind, onKindChange, onApply, busy }: { kind: DisturbanceKind; onKindChange: (value: DisturbanceKind) => void; onApply: (request: ScenarioRequest) => void; busy: boolean }) {
  const request: ScenarioRequest = railwayScenarioRequest(kind);
  const change = request.changes[0];
  return <section className="opt-card">
    <div className="opt-section-title">领域场景参数 <span className="ws-pill">铁路案例</span></div>
    <label className="ws-label" htmlFor="disturbance-kind">扰动类型</label>
    <select id="disturbance-kind" className="ws-input" value={kind} onChange={(event) => onKindChange(event.target.value as DisturbanceKind)}>
      <option value="baseline">基准场景</option><option value="resource_unavailable">资源不可用</option><option value="train_service_addition">新增业务任务</option><option value="service_time_change">任务时间改变</option>
    </select>
    <div className="opt-parameters">
      {change?.type === 'resource_unavailable' && <label>资源对象<input className="ws-input" value={change.resourceId} readOnly /></label>}
      {change?.type === 'train_service_addition' && <><label>任务编号<input className="ws-input" value={change.trainNo} readOnly /></label><label>要求资源类型<input className="ws-input" value={change.requiredModel} readOnly /></label><label>开始时间<input className="ws-input" value={change.departureTime} readOnly /></label><label>结束时间<input className="ws-input" value={change.arrivalTime} readOnly /></label></>}
      {change?.type === 'service_time_change' && <><label>业务任务<input className="ws-input" value={change.trainServiceId} readOnly /></label><label>新开始时间<input className="ws-input" value={change.departureTime} readOnly /></label><label>新结束时间<input className="ws-input" value={change.arrivalTime} readOnly /></label></>}
      {!change && <div className="opt-muted">不施加扰动，使用基准数据。</div>}
    </div>
    <button className="ws-btn ws-btn--ghost opt-full-button" disabled={busy} onClick={() => onApply(request)}>应用并校验</button>
  </section>;
}
