import type { ReportDraft, ReportKind } from './types';
import { ACTIVE_DOMAIN_PACK } from '../../domains';

export const REPORT_NAMES: Record<ReportKind, string> = {
  organization: '复杂组织体建模报告', scenario: '场景分析报告', optimization: '优化求解报告', decision: '决策分析报告', comparison: '方案对比报告', validation: '规则验证报告', version: '版本变更报告',
};

async function readJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} 返回 HTTP ${response.status}`);
  return response.json();
}

export async function buildReportDraft(kind: ReportKind): Promise<ReportDraft> {
  const source = await readJson(`${ACTIVE_DOMAIN_PACK.apiBase}/reports/analysis?scenario_id=Scenario_A`) as { sections: Array<{ title: string; facts: unknown }>; evidence_refs: string[]; provenance_refs: string[] };
  const now = new Date();
  return {
    id: `report-${now.toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}`,
    kind, name: REPORT_NAMES[kind], generatedAt: now.toISOString(), status: 'session-draft',
    sections: [
      ...source.sections.map((section) => ({ title: section.title, facts: section.facts, lines: [] })),
      { title: '来源与限制', lines: [`Evidence：${source.evidence_refs.join(', ') || '不可用'}`, `Provenance：${source.provenance_refs.join(', ') || '不可用'}`, `当前领域包：${ACTIVE_DOMAIN_PACK.name} v${ACTIVE_DOMAIN_PACK.version}`, '状态：只读结构化报告预览；不宣称自主决策或严格反事实推断。'] },
    ],
  };
}

export function reportMarkdown(report: ReportDraft): string {
  return [`# ${report.name}`, '', `- 报告编号：${report.id}`, `- 生成时间：${report.generatedAt}`, '- 状态：当前会话草案', '', ...report.sections.flatMap((section) => [`## ${section.title}`, '', ...section.lines.map((line) => `- ${line}`), ...(section.facts === undefined ? [] : ['```json', JSON.stringify(section.facts, null, 2), '```']), ''])].join('\n');
}
