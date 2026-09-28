import type { DomainPack } from "./types";
import { railwayDomainPack } from "./railway/domainPack";

const planned = (id: string, name: string): DomainPack => ({
  id,
  name,
  version: "planned",
  status: "planned",
  description: "预留领域扩展，尚未接入真实模型或 API。",
  entityTypes: [],
  relationTypes: [],
  scenarioTypes: [],
  capabilities: [],
  labels: {},
});

const registry = new Map<string, DomainPack>();

export function registerDomainPack(pack: DomainPack): void {
  registry.set(pack.id, pack);
}

export function getDomainPack(id: string): DomainPack | undefined {
  return registry.get(id);
}

export function listDomainPacks(): DomainPack[] {
  return Array.from(registry.values());
}

registerDomainPack(railwayDomainPack);
registerDomainPack(planned("manufacturing", "制造系统"));
registerDomainPack(planned("maintenance", "设备运维"));
registerDomainPack(planned("scheduling", "生产与人员排班"));
registerDomainPack(planned("supply-chain", "供应链与物流"));

export const DOMAIN_PACKS = listDomainPacks();
export let ACTIVE_DOMAIN_PACK = railwayDomainPack;

export function setActiveDomainPack(id: string): DomainPack {
  const pack = getDomainPack(id);
  if (!pack || pack.status !== "enabled") {
    throw new Error(`Domain pack is not enabled: ${id}`);
  }
  ACTIVE_DOMAIN_PACK = pack;
  return pack;
}
