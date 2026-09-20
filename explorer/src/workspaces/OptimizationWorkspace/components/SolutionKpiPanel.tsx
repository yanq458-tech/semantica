import type { Solution } from '../types';

const names: Record<string, string> = { objective_value: '目标函数', total_cost: '总成本', delay: '延误', resource_utilization: '资源利用率', assignment_changes: '分配变化', constraint_violations: '约束违反', robustness_score: '鲁棒性' };
export function SolutionKpiPanel({ solution }: { solution?: Solution }) {
  return <section><div className="opt-section-heading">方案指标</div><div className="opt-kpi-grid">{solution?.metrics.map((metric) => <div className="opt-kpi" key={metric.name}><span>{names[metric.name]}</span><strong>{metric.value == null ? 'N/A' : metric.value.toFixed(metric.unit === 'ratio' ? 2 : 0)}</strong><small>{metric.status === 'not_available' ? '尚无业务参数' : metric.unit}</small></div>) ?? <div className="opt-muted">运行完成后显示指标。</div>}</div></section>;
}
