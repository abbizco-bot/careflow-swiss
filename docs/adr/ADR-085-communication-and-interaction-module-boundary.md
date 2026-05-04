# ADR-085: Communication and Interaction Module Boundary

## Status

Accepted

## Date

2026-05-04

## Context

CareFlow-Swiss already includes architectural decisions around communication, visibility, employee requests and plan publication.

Relevant earlier decisions include:

- ADR-079 Communication and Visibility Model
- ADR-080 Employee Requests and Leadership Approval Workflow
- ADR-081 Rolling Plan Publication and Version Visibility

The analytical module roadmap identified the need to treat communication not merely as a secondary feature, but as an explicit module.

In elderly care and nursing homes, many operational problems do not arise only from staffing shortages, but also from unclear communication:

- a plan was changed but not everyone noticed;
- an employee request was submitted but no clear feedback was given;
- leadership sees a risk, while team leaders still operate from an older plan state;
- a sickness absence is known informally but has not yet affected the visible operational situation;
- plan changes are communicated through phone calls, paper plans, WhatsApp, Beekeeper, Teams, email or verbal messages;
- employees and leadership may not share the same understanding of whether a plan is final, changed, provisional or confirmed.

CareFlow must therefore support structured communication around planning states, plan changes, requests, approvals and leadership-relevant events.

However, CareFlow must not become a generic messaging system or employee chat platform.

CareFlow is not a replacement for WhatsApp, Teams, Beekeeper, email or internal staff communication tools.

## Decision

CareFlow shall include a Communication and Interaction Module as a product and architecture concept.

This module shall support structured, plan-related, role-aware and leadership-governed communication.

CareFlow communication shall remain connected to planning, operational situations, employee requests, approval states, publication states, version visibility and leadership decisions.

CareFlow shall not become a generic chat or messaging system.

The central principle is:

CareFlow communicates plan-related states, changes, requests and decisions — not arbitrary messages.

## Scope

The Communication and Interaction Module may cover the following areas:

### Visibility Logic

Define who can see which information.

Examples:

- Heimleitung sees aggregated operational and risk situations.
- Pflegedienstleitung sees operational details and leadership-relevant deviations.
- Teamleitung sees team-related plans, changes and operational risks.
- Employees see their own published shifts, requests and relevant confirmed changes.
- Geschäftsführung may see aggregated situation and risk indicators.

### Publication Logic

Represent whether a plan or plan state is:

- draft;
- checked;
- approved;
- published;
- changed;
- updated;
- confirmed;
- archived.

CareFlow shall distinguish between reference plan, published plan and operational reality.

### Request and Feedback Logic

Support structured employee-related requests and their leadership response.

Examples:

- holiday request;
- free-day request;
- shift change request;
- availability request;
- absence notification;
- training absence;
- change acknowledgement.

Possible states:

- submitted;
- under review;
- approved;
- rejected;
- included in plan;
- not plannable due to minimum coverage or qualification requirements.

### Event-Related Notification Logic

Support structured communication around operational events.

Examples:

- sickness absence;
- short-term staffing gap;
- qualification gap;
- critical day;
- plan change;
- external staff requested;
- leadership informed;
- change requires acknowledgement.

## Non-Goals

CareFlow shall not provide a general chat function.

CareFlow shall not become a social communication platform.

CareFlow shall not replace existing employee communication systems.

CareFlow shall not allow uncontrolled peer-to-peer shift changes without leadership approval.

CareFlow shall not automatically communicate sensitive information to all roles.

CareFlow shall not blur the distinction between leadership visibility and employee visibility.

## Product Principle

CareFlow communication shall be:

- structured;
- plan-related;
- role-aware;
- state-based;
- leadership-governed;
- auditable where necessary;
- calm and professional in wording.

Communication in CareFlow shall reduce ambiguity around planning states and operational changes.

## Consequences

Future implementation must clearly separate:

- message or event type;
- affected planning object;
- affected role or user;
- visibility scope;
- publication status;
- acknowledgement status;
- approval status;
- communication log or trace.

Potential backend concepts include:

- roles;
- permissions;
- visibility scopes;
- publication states;
- request states;
- approval workflow;
- notification events;
- change records;
- acknowledgement records;
- communication log.

Potential frontend concepts include:

- plan status display;
- change visibility;
- employee request form;
- request approval or rejection;
- change confirmation;
- role-specific information view;
- structured notification area.

## Phase 10 Boundary

Phase 10 shall not implement the full Communication and Interaction Module.

For Phase 10, the module may be represented only through limited concepts such as:

- reference plan versus operational state;
- request counts;
- publication or version hints;
- visible leadership context;
- no employee-facing communication flow.

The module is architecturally relevant but not a Phase 10 implementation scope.

## Relationship to Other ADRs

This ADR builds on:

- ADR-079 Communication and Visibility Model
- ADR-080 Employee Requests and Leadership Approval Workflow
- ADR-081 Rolling Plan Publication and Version Visibility

It is also related to:

- ADR-084 Analytical Module Boundary and Leadership Surface Principle
- ADR-086 Multilingual Rendering and Swiss Localization
- ADR-087 Fairness and Workload Distribution Signals

## Summary

CareFlow shall support communication, but only in a structured and plan-related way.

The guiding phrase is:

CareFlow is not a messenger. CareFlow is a structured communication layer for planning states, leadership decisions and operational changes.