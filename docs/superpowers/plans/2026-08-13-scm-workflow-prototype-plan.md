# SCM Workflow Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with review checkpoints.

**Goal:** Build a local Next.js prototype that lets a single user walk through the complete SCM workflow from OL collection through PO Match/payment tracking, using sample data and LocalStorage.

**Architecture:** A single Next.js App Router page hosts the workflow shell and stage views. Domain types, sample data, stage metadata, validation, and LocalStorage persistence live in focused modules so the later Supabase repository can replace only the storage boundary. This first slice emphasizes end-to-end navigation and visible workflow state; detailed calculation and integration behaviors remain clearly marked as next-phase work.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, browser LocalStorage.

## Global Constraints

- Run locally on Windows with `npm run dev` on port `3000`.
- Use single-user mode; no authentication or role-based permissions.
- Start with sample data and direct screen editing; do not implement Excel upload or external system APIs.
- Persist workflow state in LocalStorage under `scm-workflow-cycles-v1`.
- The UI must expose stages 0 through 7 in order and show the current stage, completion state, and validation summary.
- Do not claim detailed calculation or integration support in this prototype; show those areas as prototype summaries until the approval gate.

---

### Task 1: Scaffold the local Next.js application

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `app/page.tsx`

**Interfaces:**
- Produces a runnable Next.js app at `/`.
- Keeps all UI code client-compatible because LocalStorage will be used by the workflow page.

- [ ] Create the package scripts and dependencies for Next.js, React, TypeScript, Tailwind, and Lucide icons.
- [ ] Add the root layout with Korean metadata and a full-height application body.
- [ ] Add Tailwind configuration and a neutral blue SCM visual language.
- [ ] Add a minimal page placeholder that renders the workflow app shell.
- [ ] Run `npm run build` and confirm the app compiles.

### Task 2: Add domain types, sample data, and LocalStorage repository

**Files:**
- Create: `lib/types.ts`
- Create: `lib/stages.ts`
- Create: `lib/sample-data.ts`
- Create: `lib/repository.ts`

**Interfaces:**
- `WorkflowCycle` is the top-level persisted object.
- `STAGES` contains stage ids 0 through 7, labels, descriptions, and status mapping.
- `createSampleCycle()` returns a complete sample Cycle.
- `loadCycle()`, `saveCycle()`, and `resetCycle()` manage `scm-workflow-cycles-v1`.

- [ ] Define types for cycle metadata, OL rows, demand rows, inventory rows, device/option summaries, approval, FX-LIVE, inbound, and audit logs.
- [ ] Create realistic sample rows for each stage so every stage has visible content.
- [ ] Implement browser-safe LocalStorage helpers with a fallback to sample data when no saved cycle exists.
- [ ] Add stage completion state and a small validation summary to the Cycle type.
- [ ] Add a focused unit-testable helper for updating a stage and appending audit logs.

### Task 3: Build the workflow shell and stage navigation

**Files:**
- Create: `components/workflow/WorkflowApp.tsx`
- Create: `components/workflow/Sidebar.tsx`
- Create: `components/workflow/Header.tsx`
- Create: `components/workflow/ProgressBar.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- `WorkflowApp` owns the current stage and persisted Cycle state.
- `Sidebar` receives `stages`, `currentStage`, and `onSelectStage`.
- `Header` receives the current Cycle and save status.

- [ ] Make `app/page.tsx` a client entry that renders `WorkflowApp`.
- [ ] Add the left stage rail for stages 0 through 7 with current/completed/blocked visual states.
- [ ] Add a header with Cycle name, base month, save status, reset action, and progress percentage.
- [ ] Add stage navigation that allows viewing all stages in prototype mode but highlights the sequential route.
- [ ] Add bottom navigation buttons with previous, save, and next actions.

### Task 4: Add stage summary views for the complete flow

**Files:**
- Create: `components/workflow/StageView.tsx`
- Create: `components/workflow/StageHeader.tsx`
- Create: `components/workflow/StageTable.tsx`
- Create: `components/workflow/ValidationPanel.tsx`
- Create: `components/workflow/stage-config.ts`

**Interfaces:**
- `StageView` receives `stageId`, `cycle`, and `onUpdate`.
- `stage-config.ts` maps each stage to title, objective, KPI cards, table columns, and next-action copy.
- `ValidationPanel` displays blocking errors, warnings, and informational messages.

- [ ] Render each of the eight stages with its own title, objective, KPI cards, and representative table.
- [ ] Show editable-looking rows and clear “sample data” labels without pretending that detailed CRUD is complete.
- [ ] Show the actual sample data for OL, demand, inventory, device recommendations, option recommendations, approval, FX-LIVE, and inbound/PO Match.
- [ ] Add stage-specific prototype notices where detailed behavior is intentionally deferred.
- [ ] Add validation examples that visibly demonstrate blocking error, warning, and information states.

### Task 5: Implement stage completion and persistence behavior

**Files:**
- Modify: `components/workflow/WorkflowApp.tsx`
- Modify: `components/workflow/StageView.tsx`
- Modify: `lib/repository.ts`

**Interfaces:**
- `completeStage(stageId)` updates the Cycle status and audit log.
- `getStageValidation(stageId, cycle)` returns `{ errors, warnings, info }`.

- [ ] Implement automatic LocalStorage saving after Cycle changes with a visible timestamp.
- [ ] Implement stage completion when there are no blocking sample validation errors.
- [ ] Prevent moving forward when a blocking error is present; show the target row/field.
- [ ] Mark later stages for review when an earlier stage is changed.
- [ ] Add reset confirmation and restore the original sample Cycle.

### Task 6: Verify the local prototype and stop for user approval

**Files:**
- Create: `README.md`
- Modify: `app/globals.css` if visual fixes are required.

- [ ] Run `npm run build`.
- [ ] Run the local server with `npm run dev`.
- [ ] Open the local page and verify the full 0→7 flow visually.
- [ ] Verify refresh persistence and sample reset.
- [ ] Verify at least one blocking validation message and one warning message.
- [ ] Stop implementation after this prototype and ask the user to approve the flow before adding detailed calculations, CRUD, reports, FX-LIVE integration, and PO Match logic.

