import { createSampleCycle } from "./sample-data";
import type { AuditLog, WorkflowCycle } from "./types";

export const STORAGE_KEY = "scm-workflow-cycles-v1";

export function loadCycle(): WorkflowCycle {
  if (typeof window === "undefined") return createSampleCycle();
  try { const raw = window.localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) as WorkflowCycle : createSampleCycle(); } catch { return createSampleCycle(); }
}

export function saveCycle(cycle: WorkflowCycle) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cycle));
}

export function resetCycle() {
  const cycle = createSampleCycle();
  saveCycle(cycle);
  return cycle;
}

export function withAudit(cycle: WorkflowCycle, action: string, detail: string): WorkflowCycle {
  const log: AuditLog = { id: `log-${Date.now()}`, action, detail, timestamp: new Date().toISOString() };
  return { ...cycle, updatedAt: log.timestamp, auditLogs: [log, ...cycle.auditLogs] };
}
