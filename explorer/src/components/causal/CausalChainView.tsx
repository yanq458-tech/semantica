import type { CausalGraph, CausalNode, LegacyCausalStage } from './types';
import './causal.css';

interface Props {
  graph?: CausalGraph;
  orderedChain?: string[];
  legacyStages?: LegacyCausalStage[];
  selectedNodeId?: string;
  onSelectNode?: (node: CausalNode) => void;
}

export function CausalChainView({ graph, orderedChain, legacyStages, selectedNodeId, onSelectNode }: Props) {
  const byId = new Map(graph?.nodes.map((node) => [node.id, node]));
  const nodes = orderedChain?.map((id) => byId.get(id)).filter((node): node is CausalNode => Boolean(node)) ?? graph?.nodes ?? [];
  if (!nodes.length && !legacyStages?.length) return <div className="causal-empty">暂无可展示的因果证据。</div>;
  return <div className="causal-chain-view">
    {nodes.map((node, index) => <div className="causal-chain-row" key={node.id}>
      <button className={`causal-node-card${selectedNodeId === node.id ? ' causal-node-card--selected' : ''}`} onClick={() => onSelectNode?.(node)}>
        <span className="causal-node-order">{index + 1}</span><span><small>{node.type}</small><strong>{node.label}</strong><em>{node.id}</em></span>
      </button>
      {index < nodes.length - 1 && <span className="causal-chain-edge">{graph?.edges.find((edge) => edge.source === node.id && edge.target === nodes[index + 1]?.id)?.relation ?? '→'}</span>}
    </div>)}
    {!nodes.length && legacyStages?.map((stage, index) => <div className="causal-chain-row" key={`${stage.order}-${stage.entityId}`}>
      <div className="causal-node-card"><span className="causal-node-order">{stage.order}</span><span><small>{stage.stage}</small><strong>{stage.label}</strong><em>{stage.entityId}</em><pre>{JSON.stringify(stage.facts, null, 2)}</pre></span></div>
      {index < legacyStages.length - 1 && <span className="causal-chain-edge">→</span>}
    </div>)}
  </div>;
}
