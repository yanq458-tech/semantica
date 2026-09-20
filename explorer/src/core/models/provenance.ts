export interface EvidenceReference { id: string; kind: string; source: string; version?: string }
export interface ProvenanceReference { entityId: string; generatedBy?: string; derivedFrom: string[]; evidence: EvidenceReference[] }
