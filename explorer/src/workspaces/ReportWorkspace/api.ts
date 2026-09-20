import type { ReportDraft, ReportKind } from './types';

export const REPORT_NAMES: Record<ReportKind, string> = {
  organization: '复杂组织体建模报告', scenario: '场景分析报告', optimization: '优化求解报告', decision: '决策分析报告', comparison: '方案对比报告', validation: '规则验证报告', version: '版本变更报告',
};

async function readJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} 返回 HTTP ${response.status}`);
  return response.json();
}

export async function buildReportDraft(kind: ReportKind): Promise<ReportDraft> {
  const [statsResult, scenariosResult, decisionsResult] = await Promise.allSettled([
    readJson('/api/graph/stats'), readJson('/api/railway/scenarios'), readJson('/api/decisions'),
  ]);
  const stats = statsResult.status === 'fulfilled' ? statsResult.value as Record<string, unknown> : {};
  const scenarioBody = scenariosResult.status === 'fulfilled' ? scenariosResult.value as { scenarios?: unknown[] } : {};
  const decisions = decisionsResult.status === 'fulfilled' && Array.isArray(decisionsResult.value) ? decisionsResult.value : [];
  const now = new Date();
  return {
    id: `report-${now.toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}`,
    kind, name: REPORT_NAMES[kind], generatedAt: now.toISOString(), status: 'session-draft',
    sections: [
      { title: '组织体概览', lines: [`对象数量：${stats.node_count ?? stats.nodes ?? '未返回'}`, `关系数量：${stats.edge_count ?? stats.edges ?? '未返回'}`, '验证对象：铁路开行复杂组织体 V1.0'] },
      { title: '场景与决策', lines: [`可用场景：${scenarioBody.scenarios?.length ?? '未返回'}`, `决策记录：${decisions.length}`, '运行结果：报告中心尚未提供 OptimizationRun 列表接口，不在此推断'] },
      { title: '智能体执行情况', lines: ['业务智能体后端尚未接入，本报告没有智能体执行结果。'] },
      { title: '来源与限制', lines: ['数据来源：当前 ContextGraph、铁路 Scenario API、Decision API', '状态：浏览器当前会话草案，尚未持久化', '结论仅汇总可验证事实，不宣称候选方案已被自动证明为全局最优。'] },
    ],
  };
}

export function reportMarkdown(report: ReportDraft): string {
  return [`# ${report.name}`, '', `- 报告编号：${report.id}`, `- 生成时间：${report.generatedAt}`, '- 状态：当前会话草案', '', ...report.sections.flatMap((section) => [`## ${section.title}`, '', ...section.lines.map((line) => `- ${line}`), ''])].join('\n');
}
