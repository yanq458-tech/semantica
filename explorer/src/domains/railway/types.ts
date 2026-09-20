export type RailwayDisturbanceKind = 'baseline' | 'resource_unavailable' | 'train_service_addition' | 'service_time_change';
export type RailwayScenarioChange =
  | { type: 'resource_unavailable'; resourceId: string }
  | { type: 'train_service_addition'; trainNo: string; requiredModel: string; departureTime: string; arrivalTime: string }
  | { type: 'service_time_change'; trainServiceId: string; departureTime: string; arrivalTime: string };
export interface RailwayScenarioRequest { baseScenarioId: 'Scenario_A'; changes: RailwayScenarioChange[] }
