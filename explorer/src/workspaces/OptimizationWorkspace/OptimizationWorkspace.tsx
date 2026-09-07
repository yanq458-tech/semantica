import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Boxes, ChevronDown } from 'lucide-react';
import { compareSolutions, loadAssignments, loadExplanation, loadRun, loadSolutions, startOptimization, validateScenario } from './api';
import { AssignmentTable } from './components/AssignmentTable';
import { DecisionTracePanel } from './components/DecisionTracePanel';
import { DisturbanceEditor } from './components/DisturbanceEditor';
import { RunStatusPanel } from './components/RunStatusPanel';
import { ScenarioPanel } from './components/ScenarioPanel';
import { SolutionComparisonPanel } from './components/SolutionComparisonPanel';
import { SolutionKpiPanel } from './components/SolutionKpiPanel';
import type { DisturbanceKind, ScenarioRequest } from './types';
import './OptimizationWorkspace.css';

const BASELINE: ScenarioRequest = { baseScenarioId: 'Scenario_A', changes: [] };

export function OptimizationWorkspace() {
  const [kind, setKind] = useState<DisturbanceKind>('baseline');
  const [appliedRequest, setAppliedRequest] = useState<ScenarioRequest>(BASELINE);
  const [runId, setRunId] = useState('');
  const [selectedSolution, setSelectedSolution] = useState('');
  const [leftSolution, setLeftSolution] = useState('');
  const [rightSolution, setRightSolution] = useState('');
  const [traceAssignment, setTraceAssignment] = useState('');

  const scenarioQuery = useQuery({ queryKey: ['railway-scenario', appliedRequest], queryFn: () => validateScenario(appliedRequest), retry: false });
  const runMutation = useMutation({ mutationFn: startOptimization, onSuccess: (run) => { setRunId(run.runId); setSelectedSolution(''); } });
  const runQuery = useQuery({ queryKey: ['railway-run', runId], queryFn: () => loadRun(runId), enabled: Boolean(runId), refetchInterval: (query) => { const status = query.state.data?.lifecycleStatus; return status && !['completed', 'failed'].includes(status) ? 1000 : false; } });
  const completed = runQuery.data?.lifecycleStatus === 'completed';
  const solutionsQuery = useQuery({ queryKey: ['railway-solutions', runId], queryFn: () => loadSolutions(runId), enabled: completed });
  const solutions = solutionsQuery.data ?? [];
  const activeSolution = selectedSolution || solutions[0]?.solutionId || '';
  const activeLeft = leftSolution || solutions[0]?.solutionId || '';
  const activeRight = rightSolution || solutions[1]?.solutionId || '';

  const assignmentsQuery = useQuery({ queryKey: ['railway-assignments', activeSolution], queryFn: () => loadAssignments(activeSolution), enabled: Boolean(activeSolution) });
  const comparisonQuery = useQuery({ queryKey: ['railway-comparison', activeLeft, activeRight], queryFn: () => compareSolutions(activeLeft, activeRight), enabled: Boolean(activeLeft && activeRight && activeLeft !== activeRight) });
  const explanationQuery = useQuery({ queryKey: ['railway-explanation', traceAssignment], queryFn: () => loadExplanation(traceAssignment), enabled: Boolean(traceAssignment) });

  const error = scenarioQuery.error ?? runMutation.error ?? runQuery.error ?? solutionsQuery.error ?? assignmentsQuery.error;
  return <div className="opt-workspace">
    <div className="opt-sidebar">
      <ScenarioPanel scenario={scenarioQuery.data} />
      <DisturbanceEditor kind={kind} onKindChange={setKind} onApply={setAppliedRequest} busy={scenarioQuery.isFetching} />
    </div>
    <main className="opt-main">
      <div className="opt-heading"><div className="opt-heading-icon"><Boxes size={20} /></div><div><div className="ws-eyebrow">Verified-MBSE Railway</div><h2>铁路优化与情景推演</h2></div></div>
      {error && <div className="opt-error">{error instanceof Error ? error.message : '请求失败'}</div>}
      <RunStatusPanel run={runQuery.data ?? runMutation.data} onRun={() => runMutation.mutate(appliedRequest)} disabled={!scenarioQuery.data?.validation.conforms || runMutation.isPending} />
      <div className="opt-solution-toolbar"><span>当前 Solution</span><div className="opt-select-wrap"><select value={activeSolution} onChange={(event) => setSelectedSolution(event.target.value)} disabled={!solutions.length}>{solutions.map((solution) => <option key={solution.solutionId} value={solution.solutionId}>{solution.solutionId}</option>)}{!solutions.length && <option>暂无方案</option>}</select><ChevronDown size={13} /></div></div>
      <SolutionKpiPanel solution={solutions.find((item) => item.solutionId === activeSolution)} />
      <AssignmentTable rows={assignmentsQuery.data ?? []} onTrace={setTraceAssignment} />
      <SolutionComparisonPanel solutions={solutions} left={activeLeft} right={activeRight} onLeft={setLeftSolution} onRight={setRightSolution} comparison={comparisonQuery.data} />
    </main>
    {traceAssignment && <DecisionTracePanel explanation={explanationQuery.data} loading={explanationQuery.isFetching} onClose={() => setTraceAssignment('')} />}
  </div>;
}
