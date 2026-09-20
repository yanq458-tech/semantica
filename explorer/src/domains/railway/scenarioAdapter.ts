import type { RailwayDisturbanceKind, RailwayScenarioChange, RailwayScenarioRequest } from './types';

export function railwayScenarioRequest(kind: RailwayDisturbanceKind): RailwayScenarioRequest {
  if (kind === 'resource_unavailable') return { baseScenarioId: 'Scenario_A', changes: [{ type: kind, resourceId: 'EMU_001' }] };
  if (kind === 'train_service_addition') return { baseScenarioId: 'Scenario_A', changes: [{ type: kind, trainNo: 'G102', requiredModel: 'CR400AF', departureTime: '2026-08-29T10:00:00', arrivalTime: '2026-08-29T11:20:00' }] };
  if (kind === 'service_time_change') return { baseScenarioId: 'Scenario_A', changes: [{ type: kind, trainServiceId: 'SERVICE_G101', departureTime: '2026-08-29T08:30:00', arrivalTime: '2026-08-29T09:50:00' }] };
  return { baseScenarioId: 'Scenario_A', changes: [] };
}

export function railwayChangeToWire(change: RailwayScenarioChange): Record<string, unknown> {
  if (change.type === 'resource_unavailable') return { type: change.type, resource_id: change.resourceId };
  if (change.type === 'train_service_addition') return { type: change.type, train_no: change.trainNo, required_model: change.requiredModel, departure_time: change.departureTime, arrival_time: change.arrivalTime };
  return { type: change.type, train_service_id: change.trainServiceId, departure_time: change.departureTime, arrival_time: change.arrivalTime };
}

export function railwayScenarioRequestBody(value: RailwayScenarioRequest): string {
  return JSON.stringify({ base_scenario_id: value.baseScenarioId, changes: value.changes.map(railwayChangeToWire) });
}
