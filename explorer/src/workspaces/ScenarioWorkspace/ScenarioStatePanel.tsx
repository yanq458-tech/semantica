import type { ScenarioState } from './types';

const value = (input: unknown) => input == null ? '不可用' : String(input);

export function ScenarioStatePanel({ title, state }: { title: string; state: ScenarioState }) {
  return <section className="scenario-state-panel"><div className="scenario-state-head"><div><small>{state.phase}</small><h4>{title}</h4></div><span>{state.timestamp ?? '未提供时间'}</span></div>
    <div className="scenario-state-metrics">{Object.entries(state.metrics).map(([name, metric]) => <div key={name}><span>{name}</span><strong>{metric}</strong></div>)}</div>
    <details><summary>资源状态 · {state.resourceStates.length}</summary><div className="scenario-record-list">{state.resourceStates.map((item) => <div key={String(item.entity_id)}><strong>{value(item.entity_id)}</strong><span>{value(item.model)} · {value(item.status)}</span></div>)}</div></details>
    <details><summary>任务状态 · {state.taskStates.length}</summary><div className="scenario-record-list">{state.taskStates.map((item) => <div key={String(item.entity_id)}><strong>{value(item.train_no ?? item.entity_id)}</strong><span>{value(item.required_model)}</span></div>)}</div></details>
    <details><summary>规则与约束 · {state.constraintStates.length}</summary><div className="scenario-record-list">{state.constraintStates.map((item) => <div key={String(item.entity_id)}><strong>{value(item.label)}</strong><span>{value(item.status)} · {value(item.evaluation)}</span></div>)}</div></details>
    <div className="scenario-source">{state.stateId}<br/>{state.sourceGraph}</div>
  </section>;
}
