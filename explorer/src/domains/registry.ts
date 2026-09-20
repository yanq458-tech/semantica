import type { DomainPack } from './types';
import { railwayDomainPack } from './railway/domainPack';

const planned = (id: string, name: string): DomainPack => ({ id, name, version: 'planned', status: 'planned', description: '预留领域扩展，尚未接入真实模型或 API。', entityTypes: [], relationTypes: [], scenarioTypes: [], capabilities: [], labels: {} });
export const DOMAIN_PACKS: DomainPack[] = [railwayDomainPack, planned('manufacturing', '制造系统'), planned('maintenance', '设备运维'), planned('scheduling', '生产与人员排班'), planned('supply-chain', '供应链与物流')];
export const ACTIVE_DOMAIN_PACK = railwayDomainPack;
export function getDomainPack(id: string): DomainPack | undefined { return DOMAIN_PACKS.find((pack) => pack.id === id); }
