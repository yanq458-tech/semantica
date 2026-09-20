import type { DecisionAnalysis } from './types';

const display = (value: unknown) => value == null ? '不可用' : String(value);

export function DecisionAnalysisSummary({ analysis }: { analysis: DecisionAnalysis }) {
  const overview = analysis.overview;
  return <div className="decision-analysis-summary">
    <section className="ws-card decision-overview"><h3>决策概览</h3><div className="decision-facts">{[
      ['当前场景', overview.scenarioId], ['Scenario Version', overview.scenarioVersion], ['Data Version', overview.datasetVersion],
      ['Model Version', overview.modelVersion], ['Optimization Run', overview.optimizationRunId], ['Solver', overview.solver],
      ['Candidate Solutions', overview.candidateSolutionCount], ['Feasible Solutions', overview.feasibleSolutionCount],
      ['当前选中方案', overview.selectedSolutionId], ['Decision Status', overview.decisionStatus], ['Generated At', overview.generatedAt],
    ].map(([label, value]) => <div key={String(label)}><span>{label}</span><strong>{display(value)}</strong></div>)}</div></section>
    <section className="ws-card"><h3>方案比较</h3><div className="decision-solution-table"><div className="head"><span>Solution</span><span>Feasible</span><span>Objective</span><span>Utilization</span><span>Violations</span></div>{analysis.candidateSolutions.map((solution) => <div key={solution.solution_id}><strong>{solution.solution_id}</strong><span>{String(solution.feasible)}</span><span>{display(solution.metrics.objective_value?.value)}</span><span>{display(solution.metrics.resource_utilization?.value)}</span><span>{display(solution.metrics.constraint_violations?.value)}</span></div>)}</div>{analysis.solutionComparison && <details><summary>两方案差异</summary><pre>{JSON.stringify(analysis.solutionComparison, null, 2)}</pre></details>}</section>
    <section className="ws-card"><h3>约束分析</h3><div className="decision-constraint-stats"><span>总数 <b>{analysis.constraintAnalysis.total}</b></span><span>满足 <b>{analysis.constraintAnalysis.satisfied}</b></span><span>违反 <b>{analysis.constraintAnalysis.violated}</b></span><span>Binding <b>{display(analysis.constraintAnalysis.binding)}</b></span></div><details><summary>约束与规则证据</summary><pre>{JSON.stringify({ constraints: analysis.constraintAnalysis.constraints, rules: analysis.constraintAnalysis.rules }, null, 2)}</pre></details></section>
    <section className="ws-card"><h3>方案解释</h3>{analysis.explanation.map((item) => <div className="decision-explanation" key={`${item.sourceRef}-${item.text}`}><p>{item.text}</p><small>来源：{item.sourceRef} · 证据：{item.evidenceRefs.join(', ')}</small></div>)}<div className="decision-provenance">Provenance: {analysis.provenanceRefs.join(' → ')}</div></section>
  </div>;
}
