import type { CausalEvidenceType } from './causal';

export interface EvidenceReference { id: string; kind: string; source: string; version?: string; evidenceType?: CausalEvidenceType; timestamp?: string | null; provenanceRef?: string | null }
export interface ProvenanceReference { entityId: string; generatedBy?: string; derivedFrom: string[]; evidence: EvidenceReference[] }
