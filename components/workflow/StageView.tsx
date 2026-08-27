import { STAGES } from "../../lib/stages";
import type { ValidationMessage, WorkflowCycle } from "../../lib/types";
import { getStageData } from "./stage-config";
import { StageTable } from "./StageTable";
import { ValidationPanel } from "./ValidationPanel";

function messages(stageId: number, cycle: WorkflowCycle): ValidationMessage[] {
  if (stageId === 0) return [{ severity: "info", message: "샘플 OL 3건이 준비되어 있습니다. 실제 영업부서별 OL은 다음 개발 단계에서 직접 추가·수정합니다." }, { severity: "warn", message: "현재 단계는 프로토타입 화면입니다. 입력 검증과 행 편집은 다음 승인 후 구현합니다." }];
  if (stageId === 1) return [{ severity: "warn", message: "Bulk Deal-001은 수주가능성 60%로 수급회의 결정이 필요합니다.", field: "Bulk-Deal-001" }, { severity: "info", message: "수급회의 결과와 과거 Trend 비교영역의 흐름을 확인할 수 있습니다." }];
  if (stageId === 2) return [{ severity: "warn", message: "A4 Printer Open PO의 입고예정일이 필요월도 이후인지 확인이 필요합니다.", field: "PRT-A4-001" }];
  if (stageId === 3) return [{ severity: "warn", message: "Flexibility Rule 초과 및 MOQ 조정 항목이 있어 담당자 검토가 필요합니다." }, { severity: "info", message: "상세 산식과 수동 조정은 다음 단계에서 구현합니다." }];
  if (stageId === 4) return [{ severity: "warn", message: "Paper Tray는 필수품으로 별도 확보 검토가 필요합니다.", field: "OPT-TRAY-001" }, { severity: "info", message: "BOM·장착율·Common품 요약 흐름을 확인할 수 있습니다." }];
  if (stageId === 5) return [{ severity: "warn", message: `현재 승인상태는 ${cycle.approval.status}입니다. 보고자료 상세 편집은 다음 단계에서 구현합니다.` }];
  if (stageId === 6) return [{ severity: "info", message: "FX-LIVE 실연계 전 단계로, 입력필드 검증 화면만 제공합니다." }];
  return [{ severity: "info", message: "선적·통관·입고·검수·PO Match·지급의 전체 상태를 한 화면에서 확인합니다." }];
}

export function StageView({ stageId, cycle }: { stageId: number; cycle: WorkflowCycle }) {
  const stage = STAGES[stageId]; const data = getStageData(stageId, cycle); const validation = messages(stageId, cycle);
  const totals = stageId === 3 ? cycle.deviceRecommendations.reduce((a, x) => a + x.amount, 0) : stageId === 4 ? cycle.optionRecommendations.reduce((a, x) => a + x.amount, 0) : 0;
  return <>
    <div className="stage-heading"><div><div className="eyebrow">STAGE {stage.id} · {stage.short}</div><h2>{stage.label}</h2><p>{stage.objective}</p></div><span className="sample-pill">SAMPLE DATA</span></div>
    <div className="grid">
      <div className="card"><div className="metric-label">현재 단계 상태</div><div className="metric-value" style={{ fontSize: 18 }}>프로토타입</div><div className="metric-note">전체 플로우 확인용</div></div>
      <div className="card"><div className="metric-label">주요 데이터 건수</div><div className="metric-value">{data.rows.length}</div><div className="metric-note">현재 단계 표시 행</div></div>
      <div className="card"><div className="metric-label">발주금액 요약</div><div className="metric-value">{totals ? `${totals.toLocaleString("ko-KR")}원` : "-"}</div><div className="metric-note">계산 상세는 다음 승인 후 구현</div></div>
      <div className="card"><div className="metric-label">다음 업무</div><div className="metric-value" style={{ fontSize: 17 }}>{stageId === 7 ? "업무 종료" : STAGES[stageId + 1].label}</div><div className="metric-note">단계형 진행</div></div>
    </div>
    <div className="two-col"><div className="panel"><div className="panel-head"><h3>{stage.label} 핵심 데이터</h3><span>샘플 {data.rows.length}건</span></div><StageTable rows={data.rows} columns={data.columns} /></div><ValidationPanel messages={validation} /></div>
  </>;
}
