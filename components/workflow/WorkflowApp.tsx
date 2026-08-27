"use client";

import { useEffect, useMemo, useState } from "react";
import { STAGES } from "../../lib/stages";
import { loadCycle, resetCycle, saveCycle, withAudit } from "../../lib/repository";
import type { WorkflowCycle } from "../../lib/types";
import { Header } from "./Header";
import { ProgressBar } from "./ProgressBar";
import { Sidebar } from "./Sidebar";
import { StageView } from "./StageView";
import { Dashboard } from "./Dashboard";

export function WorkflowApp({ initialCycle }: { initialCycle: WorkflowCycle }) {
  const [cycle, setCycle] = useState(initialCycle); const [stageId, setStageId] = useState(initialCycle.currentStage); const [savedAt, setSavedAt] = useState(initialCycle.updatedAt); const [view, setView] = useState<"dashboard" | "stage">("dashboard"); const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const completed = cycle.stageStates.filter((state) => state === "complete").length;
  const progress = useMemo(() => Math.round(((completed + (stageId > 0 ? 1 : 0)) / STAGES.length) * 100), [completed, stageId]);
  useEffect(() => { saveCycle(cycle); setSavedAt(cycle.updatedAt); }, [cycle]);
  function updateCycle(next: WorkflowCycle) { const updated = { ...next, updatedAt: new Date().toISOString() }; setCycle(updated); setSavedAt(updated.updatedAt); }
  function completeAndNext() {
    if (stageId >= STAGES.length - 1) { updateCycle(withAudit(cycle, "전체 플로우 확인", "단계 7까지 확인")); return; }
    const states = [...cycle.stageStates]; states[stageId] = "complete"; states[stageId + 1] = "active";
    const next = withAudit({ ...cycle, currentStage: stageId + 1, stageStates: states }, `단계 ${stageId} 완료`, `${STAGES[stageId].label}에서 다음 단계로 이동`);
    updateCycle(next); setStageId(stageId + 1);
  }
  function selectStage(id: number) { setStageId(id); setView("stage"); updateCycle({ ...cycle, currentStage: id }); if (window.innerWidth <= 680) setSidebarCollapsed(true); }
  function goHome() { setView("dashboard"); if (window.innerWidth <= 680) setSidebarCollapsed(true); }
  function reset() { if (window.confirm("샘플 데이터로 초기화할까요? 현재 입력 내용은 사라집니다.")) { const next = resetCycle(); setCycle(next); setStageId(0); } }
  return <div className={`app ${sidebarCollapsed ? "sidebar-is-collapsed" : ""}`}><Sidebar currentStage={view === "stage" ? stageId : null} states={cycle.stageStates} onSelect={selectStage} onHome={goHome} homeActive={view === "dashboard"} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((value) => !value)} /><main className="main"><Header cycle={{ ...cycle, updatedAt: savedAt }} onReset={reset} /><div className="content">{view === "dashboard" ? <Dashboard cycle={cycle} onSelectStage={selectStage} /> : <><div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}><ProgressBar completed={completed} total={STAGES.length} /></div><StageView stageId={stageId} cycle={cycle} /><div className="actionbar"><div className="actionbar-left"><button className="btn" onClick={goHome}>전체 현황</button><span style={{ color: "#718091", fontSize: 11 }}>자동 저장됨 · {new Date(savedAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}</span></div><div className="actionbar-right"><button className="btn" disabled={stageId === 0} onClick={() => selectStage(Math.max(0, stageId - 1))}>이전 단계</button><button className="btn primary" onClick={completeAndNext}>{stageId === 7 ? "전체 플로우 확인 완료" : `${STAGES[stageId].label} 완료 후 다음 단계`}</button></div></div></>}</div></main><button className="floating-home" onClick={goHome} aria-label="전체 현황으로 이동" title="전체 현황"><span>⌂</span><small>전체 현황</small></button></div>;
}
