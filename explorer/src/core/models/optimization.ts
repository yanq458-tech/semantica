export interface OptimizationProblem {
  id: string;
  name: string;
  problemType: string;
  domainPackId: string;
  decisionVariables: string[];
  resourceIds: string[];
  taskIds: string[];
  constraintIds: string[];
  objectives: Array<{
    id: string;
    label: string;
    sense: "minimize" | "maximize";
  }>;
  solver: string | null;
  parameters: Record<string, unknown>;
}

export interface ResourceAssignment {
  id: string;
  resourceId: string;
  taskId: string;
  satisfied: boolean;
  domainFields: Record<string, unknown>;
}
