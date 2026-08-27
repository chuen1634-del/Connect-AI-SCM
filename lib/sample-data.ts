import type { WorkflowCycle } from "./types";

const now = () => new Date().toISOString();
export function createSampleCycle(): WorkflowCycle {
  return {
    id: "cycle-2026-08", name: "2026년 8월 발주계획", baseMonth: "2026-08", currentStage: 0,
    updatedAt: now(), stageStates: ["active", "pending", "pending", "pending", "pending", "pending", "pending", "pending"],
    olRows: [
      { id: "ol-1", department: "영업1팀", productCode: "PRT-A3-001", productName: "A3 Printer", category: "기기", needMonth: "2026-09", olQty: 40, confirmedQty: 40, status: "검증완료" },
      { id: "ol-2", department: "영업1팀", productCode: "PRT-A4-001", productName: "A4 Printer", category: "기기", needMonth: "2026-09", olQty: 60, confirmedQty: 60, status: "검증완료" },
      { id: "ol-3", department: "영업2팀", productCode: "PRT-A3-001", productName: "A3 Printer", category: "기기", needMonth: "2026-10", olQty: 30, confirmedQty: 30, status: "검증완료" },
    ],
    demandRows: [
      { id: "demand-1", source: "OL", name: "확정 OL", customer: "다수 고객", productCode: "PRT-A3-001", needMonth: "2026-09", qty: 40, probability: 1, decision: "확정" },
      { id: "demand-2", source: "SFDC", name: "Pipeline-001", customer: "고객A", productCode: "PRT-A4-001", needMonth: "2026-09", qty: 15, probability: .8, decision: "조건부" },
      { id: "demand-3", source: "Bulk Deal", name: "Bulk-Deal-001", customer: "고객B", productCode: "PRT-A4-001", needMonth: "2026-10", qty: 30, probability: .6, decision: "검토" },
    ],
    inventoryRows: [
      { id: "inv-1", category: "기기", productCode: "PRT-A3-001", productName: "A3 Printer", supplier: "Supplier A", endingStock: 12, reserved: 2, openPo: 10, eta: "2026-08-25", available: 20, risk: "정상" },
      { id: "inv-2", category: "기기", productCode: "PRT-A4-001", productName: "A4 Printer", supplier: "Supplier B", endingStock: 25, reserved: 5, openPo: 20, eta: "2026-09-20", available: 45, risk: "납기 확인" },
      { id: "inv-3", category: "옵션", productCode: "OPT-FIN-001", productName: "Finisher", supplier: "Supplier C", endingStock: 3, reserved: 0, openPo: 5, eta: "2026-08-30", available: 8, risk: "정상" },
    ],
    deviceRecommendations: [
      { id: "dev-1", code: "PRT-A3-001", name: "A3 Printer", supplier: "Supplier A", needMonth: "2026-09", demand: 40, available: 20, orderQty: 20, amount: 20000000, result: "MOQ 조정" },
      { id: "dev-2", code: "PRT-A4-001", name: "A4 Printer", supplier: "Supplier B", needMonth: "2026-09", demand: 60, available: 45, orderQty: 20, amount: 13000000, result: "Flex 확인" },
      { id: "dev-3", code: "PRT-A3-001", name: "A3 Printer", supplier: "Supplier A", needMonth: "2026-10", demand: 30, available: 20, orderQty: 10, amount: 10000000, result: "정상" },
    ],
    optionRecommendations: [
      { id: "opt-1", code: "OPT-FIN-001", name: "Finisher", supplier: "Supplier C", needMonth: "2026-09", demand: 24, available: 8, orderQty: 20, amount: 5000000, result: "MOQ 조정" },
      { id: "opt-2", code: "OPT-TRAY-001", name: "Paper Tray", supplier: "Supplier C", needMonth: "2026-09", demand: 100, available: 30, orderQty: 100, amount: 8000000, result: "필수품 확인" },
      { id: "opt-3", code: "CON-TNR-001", name: "Toner", supplier: "Supplier D", needMonth: "2026-09", demand: 90, available: 80, orderQty: 50, amount: 1500000, result: "정상" },
    ],
    approval: { status: "대기", requestedAt: "2026-08-13T09:00:00.000Z", memo: "샘플 Cycle" },
    fxLive: { status: "대기", validation: "검증 전" },
    inboundRows: [
      { id: "po-1", poNumber: "PO-202608-001", supplier: "Supplier A", productCode: "PRT-A3-001", productName: "A3 Printer", orderedQty: 30, shippedQty: 0, eta: "2026-09-20", customs: "준비중", inboundQty: 0, inspection: "미검수", poMatch: "대기", payment: "대기" },
      { id: "po-2", poNumber: "PO-202608-002", supplier: "Supplier C", productCode: "OPT-FIN-001", productName: "Finisher", orderedQty: 20, shippedQty: 10, eta: "2026-10-05", customs: "대기", inboundQty: 0, inspection: "미검수", poMatch: "대기", payment: "대기" },
    ],
    auditLogs: [{ id: "log-1", action: "Cycle 생성", timestamp: now(), detail: "샘플 데이터로 시작" }],
  };
}
