# CareFlow Roadmap: Communication and Long-Term Planning v0.1

Date: 2026-05-02  
Status: Draft / Roadmap Note  
Related ADRs: ADR-079, ADR-080, ADR-081, ADR-082, ADR-083

## Purpose

This roadmap note documents how CareFlow-Swiss will gradually develop its communication, rolling plan visibility, employee request, and long-term planning capabilities.

The related ADRs define the architectural direction. This roadmap note defines the staged product development path.

CareFlow-Swiss is not intended to become a generic chat system, ERP system, or classical duty planning application. It remains a leadership and decision layer for Swiss nursing homes and care institutions.

Communication in CareFlow means structured planning-relevant communication: events, requests, decisions, approvals, publications, confirmations, and summaries.

Long-term planning in CareFlow means that known or desired future absences and availability constraints are used to improve rolling operational planning, qualification visibility, and capacity forecasting.

## Strategic Product Direction

CareFlow will support several planning horizons:

1. Annual Forecast  
   Long-term known or desired absences, availability constraints, training absences, and future capacity risks.

2. Monthly Reference Plan  
   The official planning baseline, usually imported from an existing planning system, Excel, or CSV.

3. Rolling Operational Plan  
   The current operational planning window, typically covering the next three to four weeks.

4. Daily and Weekly Leadership View  
   The current operational leadership situation, including staffing coverage, qualification risks, open decisions, incidents, and plan deviations.

These planning horizons should be connected but not confused.

The annual forecast informs the monthly reference plan.  
The monthly reference plan provides the planning baseline.  
The rolling operational plan reflects current operational reality.  
The leadership view interprets the current situation for decision-making.

## Product Principle

CareFlow should minimize manual input for leadership.

Leadership should not be forced to re-enter the entire duty plan manually. Existing planning data should be imported wherever possible.

Manual leadership input should focus on:

- operational incidents,
- absences,
- decisions,
- approvals,
- escalations,
- plan publications,
- comments on critical situations.

Employees should be able to submit wishes, requests, absence information, availability changes, and confirmations. However, employees do not directly change the operational plan.

Plan changes become operationally effective only after leadership review, approval, or publication.

## Phase A: Pilot-Relevant Communication Baseline

Phase A defines the minimum communication logic required for a pilot-ready demonstrator.

### Goals

The goal is to make CareFlow usable as a simple leadership and communication layer around the rolling operational plan.

The first pilot should show that CareFlow can:

- display the current operational situation,
- show planning-relevant events,
- show employee requests or absence signals,
- support leadership review,
- distinguish approved from non-approved changes,
- publish relevant plan changes,
- show employees their own valid plan information.

### Scope

The pilot-relevant communication baseline includes:

- simple operational event visibility,
- basic employee request logic,
- leadership approval status,
- published rolling plan visibility,
- simple plan change status,
- basic employee-facing plan view,
- simple confirmation status where required.

### Out of Scope

The following items are not required for Phase A:

- native mobile app,
- push notifications,
- SMS notifications,
- full chat functionality,
- complex escalation workflows,
- automatic decision-making,
- AI-generated staffing recommendations,
- full HR integration,
- full annual planning module.

## Phase B: Employee Request Workflow

Phase B develops structured employee participation in planning communication.

### Goals

Employees should be able to submit planning-relevant inputs in a structured way.

Possible request types include:

- holiday request,
- absence request,
- shift swap request,
- availability message,
- willingness to take an additional shift,
- training absence notice,
- confirmation of a published plan change.

### Expected Workflow

A typical workflow is:

1. Employee submits a request.
2. CareFlow records the request.
3. The request appears in the leadership view.
4. Leadership reviews the request.
5. CareFlow shows possible impact on staffing and qualification.
6. Leadership approves, rejects, modifies, or postpones the request.
7. If approved, the plan can be adjusted.
8. If published, the affected employee is informed.
9. If required, the employee confirms receipt.

### Product Value

This phase makes CareFlow useful not only for leadership observation, but also for structured employee communication.

It reduces informal planning chaos and creates traceability.

## Phase C: Rolling Plan Publication and Version Visibility

Phase C strengthens the reliability of the rolling operational plan.

### Goals

CareFlow should distinguish between internal planning work and published plan states.

Leadership may work with drafts and open decisions. Employees should only see approved or published plan information.

### Core Concepts

CareFlow should support plan states such as:

- Draft
- In Review
- Approved
- Published
- Superseded
- Archived

German UI terms may include:

- Entwurf
- in Prüfung
- freigegeben
- veröffentlicht
- ersetzt
- archiviert

### Product Value

This phase prevents confusion.

Employees know which plan version is binding.  
Leadership can work on unresolved situations without prematurely exposing unstable changes.  
Plan changes become traceable.  
Communication status becomes visible.

## Phase D: Annual Availability Collection

Phase D introduces long-term planning input.

### Goals

CareFlow should support the annual collection of known or desired absences and availability constraints for the following year.

Example:

Employees are asked to submit known or desired absences for 2027 by 30 September 2026.

Possible input categories include:

- holiday wishes,
- training absences,
- maternity or parental leave,
- military service,
- civil service,
- unpaid leave,
- sabbatical,
- known long-term absence,
- availability restrictions,
- expected employment percentage changes.

### Status Logic

Long-term absence inputs should not automatically become approved absences.

Possible statuses include:

- Submitted
- In Review
- Tentative
- Approved
- Rejected
- Modified
- Confirmed
- Confidential

### Confidentiality

CareFlow should separate planning relevance from confidential personal information.

For planning purposes, the relevant data is usually:

- person,
- time period,
- availability impact,
- approval status,
- planning certainty,
- affected department or role.

Sensitive reasons should only be visible to authorized roles.

### Product Value

This phase extends CareFlow from short-term operational visibility to proactive workforce planning.

It allows leadership to see future risk periods early.

## Phase E: Qualification-Based Capacity Forecasting

Phase E develops the long-term analytical value of CareFlow.

### Goals

CareFlow should not only count available employees. It should forecast whether the right qualifications will be available at the right time.

Future staffing risks should be evaluated by:

- qualification,
- department,
- time period,
- shift relevance,
- approval status,
- planning certainty,
- operational impact.

### Forecast Examples

CareFlow should be able to show:

- future weeks with too many absences,
- qualification gaps in specific departments,
- holiday clusters affecting FAGE or HF availability,
- training clusters affecting staffing stability,
- possible need for external staffing,
- recurring structural capacity risks.

### Forecast States

Possible forecast states:

- Stable
- Watch
- At Risk
- Critical

German UI terms:

- stabil
- beobachten
- angespannt
- kritisch

### Product Value

This phase turns CareFlow into a proactive leadership instrument.

It allows earlier HR action, better vacation coordination, better rolling planning, and better management reporting.

## Phase F: Management and Stakeholder Information

Phase F develops aggregated reporting for leadership beyond the daily operational level.

### Target Roles

Relevant roles include:

- department leads,
- nursing management,
- home management,
- HR,
- quality management,
- governing bodies or external stakeholders.

### Information Levels

Department leads need unit-level operational information.

Nursing management needs cross-unit risks and staffing stability.

Home management needs management summaries.

HR needs absence, qualification, and future capacity information.

Quality management needs risk documentation and audit-relevant traces.

External stakeholders should only see aggregated, non-personal information.

### Product Value

This phase strengthens CareFlow as a leadership and governance tool.

It supports not only daily decisions but also organizational learning and strategic workforce planning.

## Recommended Implementation Order

The recommended order is:

1. Stabilize the current leadership view and rolling planning logic.
2. Add basic communication objects or request status fields.
3. Add simple employee request visibility.
4. Add leadership approval workflow.
5. Add published rolling plan visibility.
6. Add basic employee-facing plan view.
7. Add planned absence data for future periods.
8. Add annual availability collection.
9. Add qualification-based forecast views.
10. Add management summaries and stakeholder reporting.

This order keeps the product focused and avoids overloading the MVP.

## Pilot Recommendation

For the first pilot, CareFlow should demonstrate:

- reference plan versus operational situation,
- rolling operational plan,
- visible staffing and qualification risks,
- basic operational events,
- simple employee requests,
- leadership approval,
- published plan changes,
- role-based visibility,
- basic management summary.

The annual forecast and qualification-based capacity forecasting should be presented as future-oriented product extensions, unless the pilot partner explicitly needs them early.

## Later SaaS Requirements

Before CareFlow becomes a mature SaaS product, the following additional capabilities will be required:

- authentication,
- role and permission model,
- tenant separation,
- secure employee access,
- audit logs,
- backup and recovery,
- monitoring,
- privacy and data protection documentation,
- import/export strategy,
- deployment model,
- support process,
- onboarding process,
- pricing and contract model.

These requirements are outside the scope of this roadmap note but must be considered before production deployment.

## Open Questions

The following questions remain open:

- Should employees access CareFlow through a web portal, PWA, or native app?
- Which notification channels should be supported first?
- How much team plan visibility should employees have?
- Which roles approve annual absence wishes?
- How configurable should annual deadlines be?
- Should qualification-based forecasts be rule-based, AI-supported, or both?
- Which data should be exported to HR or payroll systems?
- Which forecast indicators are most understandable for nursing home leadership?

## Summary

CareFlow will develop communication and long-term planning step by step.

The immediate focus remains the pilot-ready leadership and rolling planning view.

The next layer is structured employee request and leadership approval.

The following layer is published rolling plan visibility.

The later strategic layer is annual availability collection and qualification-based capacity forecasting.

Together, these capabilities strengthen CareFlow's position as a leadership and decision layer for Swiss nursing homes and care institutions.