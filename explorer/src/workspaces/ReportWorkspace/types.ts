export type ReportKind = 'organization' | 'scenario' | 'optimization' | 'decision' | 'comparison' | 'validation' | 'version';

export interface ReportSection { title: string; lines: string[] }

export interface ReportDraft {
  id: string;
  kind: ReportKind;
  name: string;
  generatedAt: string;
  status: 'session-draft';
  sections: ReportSection[];
}
