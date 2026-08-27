export const STAGES = [
  { id: 0, label: "OL 취합", short: "영업계획", objective: "영업부서별 OL을 취합하고 기본 오류를 확인합니다." },
  { id: 1, label: "수요 확정", short: "수급회의", objective: "SFDC·Bulk Deal·Trend를 반영해 당월 수요를 확정합니다." },
  { id: 2, label: "재고·Open PO", short: "가용재고", objective: "전월 말 재고와 적기 입고 예정 Open PO를 확인합니다." },
  { id: 3, label: "기기 발주량", short: "MOQ·Flex", objective: "기기 수요, 재고, Lead Time, MOQ를 반영합니다." },
  { id: 4, label: "옵션 발주량", short: "BOM·장착율", objective: "BOM·장착율·필수품·Common품을 반영합니다." },
  { id: 5, label: "보고·승인", short: "사장 보고", objective: "발주금액과 전월·전년·OL 차이를 검토합니다." },
  { id: 6, label: "FX-LIVE", short: "FIX 검증", objective: "승인된 발주량을 FX-LIVE 입력 관점에서 검증합니다." },
  { id: 7, label: "입고·지급", short: "PO Match", objective: "선적·통관·입고·검수·PO Match·지급을 추적합니다." },
] as const;

export const stageName = (id: number) => STAGES.find((stage) => stage.id === id)?.label ?? "업무";
