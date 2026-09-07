import { Activity, LoaderCircle, Play } from 'lucide-react';
import type { OptimizationRun } from '../types';

const labels: Record<string, string> = { queued: '排队', applying_changes: '应用扰动', validating: '校验', optimizing: '求解', writing_back: '回写知识图谱', completed: '完成', failed: '失败' };
export function RunStatusPanel({ run, onRun, disabled }: { run?: OptimizationRun; onRun: () => void; disabled: boolean }) {
  const active = run && !['completed', 'failed'].includes(run.lifecycleStatus);
  return <section className="opt-card opt-run-card">
    <div><div className="opt-section-title"><Activity size={15} />OptimizationRun</div><div className="opt-muted opt-mono">{run?.runId ?? '尚未运行'}</div></div>
    {run && <div className="opt-run-summary"><span className={`ws-pill ${run.lifecycleStatus === 'failed' ? 'ws-pill--amber' : 'ws-pill--accent'}`}>{active && <LoaderCircle className="opt-spin" size={11} />}{labels[run.lifecycleStatus]}</span><span>Solver: {run.solverStatus ?? '—'}</span><span>耗时: {run.durationSeconds == null ? '—' : `${run.durationSeconds.toFixed(3)}s`}</span></div>}
    <button className="ws-btn ws-btn--primary" onClick={onRun} disabled={disabled || Boolean(active)}><Play size={14} />运行优化</button>
    {run?.error && <div className="opt-error">{run.error.message}</div>}
  </section>;
}
