import type { DisturbanceKind, ScenarioRequest } from '../types';

function requestFor(kind: DisturbanceKind): ScenarioRequest {
  if (kind === 'resource_unavailable') return { baseScenarioId: 'Scenario_A', changes: [{ type: kind, resourceId: 'EMU_001' }] };
  if (kind === 'train_service_addition') return { baseScenarioId: 'Scenario_A', changes: [{ type: kind, trainNo: 'G102', requiredModel: 'CR400AF', departureTime: '2026-08-29T10:00:00', arrivalTime: '2026-08-29T11:20:00' }] };
  if (kind === 'service_time_change') return { baseScenarioId: 'Scenario_A', changes: [{ type: kind, trainServiceId: 'SERVICE_G101', departureTime: '2026-08-29T08:30:00', arrivalTime: '2026-08-29T09:50:00' }] };
  return { baseScenarioId: 'Scenario_A', changes: [] };
}

export function DisturbanceEditor({ kind, onKindChange, onApply, busy }: { kind: DisturbanceKind; onKindChange: (value: DisturbanceKind) => void; onApply: (request: ScenarioRequest) => void; busy: boolean }) {
  const request = requestFor(kind);
  const change = request.changes[0];
  return <section className="opt-card">
    <div className="opt-section-title">输入扰动参数</div>
    <label className="ws-label" htmlFor="disturbance-kind">扰动类型</label>
    <select id="disturbance-kind" className="ws-input" value={kind} onChange={(event) => onKindChange(event.target.value as DisturbanceKind)}>
      <option value="baseline">正常开行</option><option value="resource_unavailable">动车组不可用</option><option value="train_service_addition">新增开行任务</option><option value="service_time_change">开行时间改变</option>
    </select>
    <div className="opt-parameters">
      {change?.type === 'resource_unavailable' && <label>动车组<input className="ws-input" value={change.resourceId} readOnly /></label>}
      {change?.type === 'train_service_addition' && <><label>车次<input className="ws-input" value={change.trainNo} readOnly /></label><label>车型<input className="ws-input" value={change.requiredModel} readOnly /></label><label>始发时间<input className="ws-input" value={change.departureTime} readOnly /></label><label>到达时间<input className="ws-input" value={change.arrivalTime} readOnly /></label></>}
      {change?.type === 'service_time_change' && <><label>任务<input className="ws-input" value={change.trainServiceId} readOnly /></label><label>新始发时间<input className="ws-input" value={change.departureTime} readOnly /></label><label>新到达时间<input className="ws-input" value={change.arrivalTime} readOnly /></label></>}
      {!change && <div className="opt-muted">不施加扰动，使用基准数据。</div>}
    </div>
    <button className="ws-btn ws-btn--ghost opt-full-button" disabled={busy} onClick={() => onApply(request)}>应用并校验</button>
  </section>;
}
