"use client";

import { useEffect, useMemo, useState } from "react";
import { WorkflowApp } from "../components/workflow/WorkflowApp";
import { loadCycle } from "../lib/repository";
import { createSampleCycle } from "../lib/sample-data";
import type { WorkflowCycle } from "../lib/types";

export default function Home() {
  const [cycle, setCycle] = useState<WorkflowCycle | null>(null);
  useEffect(() => setCycle(loadCycle()), []);
  const initial = useMemo(() => cycle ?? createSampleCycle(), [cycle]);
  if (!cycle) return <div style={{ padding: 40 }}>SCM 업무 Cycle을 불러오는 중입니다…</div>;
  return <WorkflowApp initialCycle={initial} />;
}
