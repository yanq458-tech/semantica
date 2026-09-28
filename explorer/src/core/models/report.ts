export type CoreReportKind =
  | "organization"
  | "model-analysis"
  | "scenario"
  | "validation"
  | "simulation"
  | "optimization"
  | "comparison"
  | "decision"
  | "provenance"
  | "version";

export interface ReportContext {
  domainPackId: string;
  organizationId?: string;
  scenarioId?: string;
  runId?: string;
  solutionIds?: string[];
  versionRefs: Record<string, string>;
}
