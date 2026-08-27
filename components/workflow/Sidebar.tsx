import { STAGES } from "../../lib/stages";
import type { StageState } from "../../lib/types";

export function Sidebar({ currentStage, states, onSelect, onHome, homeActive, collapsed, onToggle }: { currentStage: number | null; states: StageState[]; onSelect: (id: number) => void; onHome: () => void; homeActive: boolean; collapsed: boolean; onToggle: () => void }) {
  return <aside className={`sidebar ${collapsed ? "is-collapsed" : ""}`}>
    <div className="brand"><div className="brand-row"><div><small>AI · SCM OPERATIONS</small><h1>발주·입고관리</h1></div><button className="sidebar-toggle" onClick={onToggle} aria-label={collapsed ? "사이드바 열기" : "사이드바 접기"} title={collapsed ? "사이드바 열기" : "사이드바 접기"}>{collapsed ? "›" : "‹"}</button></div></div>
    <button className={`home-btn ${homeActive ? "active" : ""}`} onClick={onHome}><span className="home-icon">✦</span><span><strong>전체 현황</strong><small>Control center</small></span></button>
    <div className="rail-label">WORKFLOW</div><nav className="stage-list" aria-label="업무 단계">
      {STAGES.map((stage) => { const state = states[stage.id]; return <button key={stage.id} className={`stage-btn ${currentStage === stage.id ? "active" : ""} ${state === "complete" ? "done" : ""}`} onClick={() => onSelect(stage.id)}>
        <span className="stage-index">{state === "complete" ? "✓" : stage.id}</span><span><span className="stage-label">{stage.label}</span><span className="stage-sub">{stage.short}</span></span>
      </button>; })}
    </nav>
    <div className="sidebar-foot"><strong>프로토타입 모드</strong><br />샘플 데이터와 브라우저 저장소로 전체 업무 흐름을 확인합니다.</div>
  </aside>;
}
