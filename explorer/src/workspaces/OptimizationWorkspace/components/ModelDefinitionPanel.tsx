import { Braces, Database, Goal, ShieldCheck } from 'lucide-react';
import type { OptimizationRun } from '../types';

export function ModelDefinitionPanel({ run }: { run?: OptimizationRun }) {
  return <section className="opt-definition-grid">
    <article className="opt-card"><div className="opt-section-title"><Database size={14}/>问题与输入</div><div className="opt-muted">铁路开行任务—动车组资源分配</div><dl className="opt-definition-list"><div><dt>任务集合 J</dt><dd>TrainService</dd></div><div><dt>资源集合 I</dt><dd>EMUSet</dd></div><div><dt>决策变量</dt><dd>xᵢⱼ ∈ {'{0,1}'}</dd></div></dl></article>
    <article className="opt-card"><div className="opt-section-title"><ShieldCheck size={14}/>约束条件</div><ul className="opt-rule-list"><li>每个任务分配一个动车组</li><li>时间冲突任务不得重复使用资源</li><li>动车组车型必须匹配</li><li>动车组必须处于可用状态</li></ul></article>
    <article className="opt-card"><div className="opt-section-title"><Goal size={14}/>目标与验证</div><div className="opt-muted">当前 V1.0 是可行性分配模型。</div><dl className="opt-definition-list"><div><dt>目标</dt><dd>minimize 0</dd></div><div><dt>结果验证</dt><dd>约束满足 + RDF 回写</dd></div></dl></article>
    <article className="opt-card"><div className="opt-section-title"><Braces size={14}/>求解与版本</div><dl className="opt-definition-list"><div><dt>求解器</dt><dd>{run?.solver ?? '运行后返回'}</dd></div><div><dt>模型版本</dt><dd>{run?.versions?.optimization_model ?? run?.versions?.optimization_model_version ?? '运行后返回'}</dd></div><div><dt>数据版本</dt><dd>{run?.versions?.dataset ?? run?.versions?.dataset_version ?? '运行后返回'}</dd></div></dl></article>
  </section>;
}
