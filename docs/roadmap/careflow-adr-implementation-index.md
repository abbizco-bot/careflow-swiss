# CareFlow ADR Implementation Index

Date: 2026-05-02  
Status: Living Roadmap Support Document

## Purpose

This document helps decide when accepted ADRs should be considered during implementation.

ADRs are not implemented automatically.  
They become implementation-relevant when a development phase touches the feature area governed by the ADR.

Before starting a new development phase, the relevant ADRs should be reviewed.

## Implementation Status Values

- Accepted: ADR exists and is architecturally binding.
- Consider in next phase: ADR should influence near-term implementation.
- Partially implemented: Some aspects are implemented, but not the full scope.
- Deferred: ADR is accepted but not yet implementation-relevant.
- Implemented: ADR has been substantially implemented in code, tests, and documentation.

## ADR-079: Communication and Visibility Model

Status: Accepted  
Implementation timing: Consider in next UI and workflow phases  
Roadmap relevance: Pilot / Post-pilot

### Trigger

Review this ADR when implementing:

- operational events,
- communication status,
- role-based visibility,
- employee-facing views,
- leadership notifications,
- management summaries,
- stakeholder reports.

### Near-term expectation

For the pilot, implement only a simple communication baseline.

Possible first steps:

- show operational events in leadership view,
- distinguish open decisions from resolved decisions,
- avoid unstructured chat features,
- keep communication planning-relevant.

## ADR-080: Employee Requests and Leadership Approval Workflow

Status: Accepted  
Implementation timing: Consider in next request/workflow phase  
Roadmap relevance: Pilot / MVP extension

### Trigger

Review this ADR when implementing:

- employee requests,
- absence requests,
- holiday wishes,
- shift swap requests,
- availability messages,
- leadership approval,
- request status,
- employee request history.

### Near-term expectation

This is likely relevant for an early pilot extension.

Possible first steps:

- create basic request object,
- support submitted/in review/approved/rejected states,
- show requests in leadership view,
- prevent direct employee modification of the operational plan.

## ADR-081: Rolling Plan Publication and Version Visibility

Status: Accepted  
Implementation timing: Consider when employee plan visibility begins  
Roadmap relevance: Pilot / Post-pilot

### Trigger

Review this ADR when implementing:

- published rolling plan,
- employee-visible plan,
- plan approval,
- plan versioning,
- plan change confirmations,
- internal draft versus published state.

### Near-term expectation

For the pilot, keep this simple.

Possible first steps:

- distinguish internal operational plan from published plan,
- add basic publication status,
- show only approved/published changes to employees,
- postpone full version history until later.

## ADR-082: Annual Availability Collection and Long-Term Absence Forecast

Status: Accepted  
Implementation timing: Deferred, but data model should not contradict it  
Roadmap relevance: Post-pilot / strategic extension

### Trigger

Review this ADR when implementing:

- annual planning cycles,
- long-term absences,
- future holiday wishes,
- training absence planning,
- maternity or military absence planning,
- annual employee availability collection.

### Near-term expectation

Do not implement a full annual planning module in the first pilot unless explicitly required.

Possible first steps:

- ensure absence data can represent future periods,
- include status and approval logic,
- separate planning relevance from confidential details.

## ADR-083: Qualification-Based Capacity Forecasting

Status: Accepted  
Implementation timing: Deferred, with early conceptual consideration  
Roadmap relevance: Post-pilot / strategic extension

### Trigger

Review this ADR when implementing:

- long-term capacity forecast,
- qualification forecast,
- future risk weeks,
- holiday cluster analysis,
- external staffing forecast,
- HR or management reporting.

### Near-term expectation

Do not build a complex forecasting engine in the first pilot.

Possible first steps:

- relate future absences to employee qualification,
- show simple future qualification warnings,
- keep advanced prediction and simulation for later.

## Phase Guidance

### Next pilot-oriented work should primarily consider:

- ADR-079
- ADR-080
- ADR-081

### Later long-term planning work should primarily consider:

- ADR-082
- ADR-083

## Codex Instruction

Before implementing any new feature, Codex should check whether the feature touches one of the ADR areas listed in this document.

If yes, Codex should:

1. read the relevant ADR;
2. summarize which constraints apply;
3. implement only the phase-appropriate subset;
4. avoid implementing deferred future scope too early;
5. update this index if implementation status changes.