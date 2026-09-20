import { GitBranch } from 'lucide-react';
import type { AssignmentRow } from '../types';

export function AssignmentTable({ rows, onTrace }: { rows: AssignmentRow[]; onTrace: (id: string) => void }) {
  return <section><div className="opt-section-heading">资源分配</div><div className="opt-table-wrap"><table className="opt-table"><thead><tr><th>资源对象</th><th>类型/状态</th><th>业务任务</th><th>要求类型</th><th>约束</th><th>操作</th></tr></thead><tbody>{rows.length ? rows.map((row) => <tr key={row.assignmentId}><td>{row.resourceId}</td><td>{row.resourceModel} · {row.resourceStatus}</td><td>{row.taskId}</td><td>{row.requiredModel}</td><td><span className="ws-pill ws-pill--green">{row.satisfied ? '满足' : '不满足'}</span></td><td><button className="opt-link-button" onClick={() => onTrace(row.assignmentId)}><GitBranch size={12} />查看解释</button></td></tr>) : <tr><td colSpan={6} className="opt-empty-cell">暂无资源分配结果</td></tr>}</tbody></table></div></section>;
}
