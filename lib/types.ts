export type Severity = "error" | "warn" | "info";
export type StageState = "pending" | "active" | "complete" | "review";

export type OlRow = { id: string; department: string; productCode: string; productName: string; category: string; needMonth: string; olQty: number; confirmedQty: number; status: string };
export type DemandRow = { id: string; source: string; name: string; customer: string; productCode: string; needMonth: string; qty: number; probability: number; decision: string };
export type InventoryRow = { id: string; category: string; productCode: string; productName: string; supplier: string; endingStock: number; reserved: number; openPo: number; eta: string; available: number; risk: string };
export type Recommendation = { id: string; code: string; name: string; supplier: string; needMonth: string; demand: number; available: number; orderQty: number; amount: number; result: string };
export type ApprovalRecord = { status: string; requestedAt: string; approvedAt?: string; approver?: string; memo?: string };
export type FxLiveRecord = { status: string; fixedAt?: string; poNumber?: string; validation: string };
export type InboundRow = { id: string; poNumber: string; supplier: string; productCode: string; productName: string; orderedQty: number; shippedQty: number; eta: string; customs: string; inboundQty: number; inspection: string; poMatch: string; payment: string };
export type AuditLog = { id: string; action: string; timestamp: string; detail: string };
export type ValidationMessage = { severity: Severity; message: string; field?: string };

export type WorkflowCycle = {
  id: string; name: string; baseMonth: string; currentStage: number; updatedAt: string;
  stageStates: StageState[]; olRows: OlRow[]; demandRows: DemandRow[]; inventoryRows: InventoryRow[];
  deviceRecommendations: Recommendation[]; optionRecommendations: Recommendation[];
  approval: ApprovalRecord; fxLive: FxLiveRecord; inboundRows: InboundRow[]; auditLogs: AuditLog[];
};
