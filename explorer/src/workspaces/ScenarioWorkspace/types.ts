export interface ScenarioRecord {
  scenarioId: string;
  scenarioUri: string;
  label: string;
  version: string;
  parentScenario: string | null;
  effectiveDigest: string;
  changes: Array<Record<string, unknown>>;
  validation: { conforms: boolean; violationCount: number; messages: string[] };
}
