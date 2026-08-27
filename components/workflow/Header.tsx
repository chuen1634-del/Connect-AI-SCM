import type { WorkflowCycle } from "../../lib/types";

export function Header({ cycle, onReset }: { cycle: WorkflowCycle; onReset: () => void }) {
  const saved = new Date(cycle.updatedAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  return <header className="topbar"><div><div className="eyebrow">MONTHLY PROCUREMENT CYCLE</div><div className="cycle-title">{cycle.name}</div></div><div className="top-actions"><span><span className="save-dot" />자동 저장 {saved}</span><button className="btn" onClick={onReset}>샘플 초기화</button></div></header>;
}
