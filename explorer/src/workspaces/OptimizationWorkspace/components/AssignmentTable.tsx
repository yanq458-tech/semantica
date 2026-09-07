import { GitBranch } from 'lucide-react';
import type { AssignmentRow } from '../types';

export function AssignmentTable({ rows, onTrace }: { rows: AssignmentRow[]; onTrace: (id: string) => void }) {
  return <section><div className="opt-section-heading">资源—任务 Assignment</div><div className="opt-table-wrap"><table className="opt-table"><thead><tr><th>动车组</th><th>车型/状态</th><th>开行任务</th><th>要求车型</th><th>约束</th><th>操作</th></tr></thead><tbody>{rows.length ? rows.map((row) => <tr key={row.assignmentId}><td>{row.resourceId}</td><td>{row.resourceModel} · {row.resourceStatus}</td><td>{row.taskId.replace('SERVICE_', '')}</td><td>{row.requiredModel}</td><td><span className="ws-pill ws-pill--green">{row.satisfied ? '满足' : '不满足'}</span></td><td><button className="opt-link-button" onClick={() => onTrace(row.assignmentId)}><GitBranch size={12} />为什么？</button></td></tr>) : <tr><td colSpan={6} className="opt-empty-cell">暂无分配结果</td></tr>}</tbody></table></div></section>;
}
