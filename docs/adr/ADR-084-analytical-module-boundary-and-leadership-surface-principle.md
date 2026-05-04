# ADR-084: Analytical Module Boundary and Leadership Surface Principle

## Status

Accepted

## Date

2026-05-04

## Context

CareFlow-Swiss is evolving from a minimal operational planning interpretation layer into a broader leadership and decision-support system for Swiss elderly care and nursing homes.

During the development of the analytical module roadmap, multiple potential modules were identified, including:

- Rolling Leadership View
- Reference Plan Comparison
- Data Quality
- Import and Mapping
- Plan Stability
- Plan Resilience
- Fairness and Workload Distribution
- Communication and Interaction
- Decision Log
- Pattern Recognition
- Early Warning
- Organisational Diagnosis
- Compliance
- Audit and Traceability
- Localization and Multilingual Rendering

These modules create significant strategic value. However, there is a product risk that CareFlow may become overloaded if each analytical module is exposed as a separate dashboard or user-facing screen.

CareFlow-Swiss must remain aligned with its core positioning:

CareFlow-Swiss is not a classical duty planning tool, ERP system, payroll system, communication platform or generic dashboard system. It is a leadership and decision layer that interprets planning and operational data and makes leadership-relevant deviations, risks, tensions and patterns visible.

The visible product surface must therefore remain calm, focused, editorial and leadership-oriented.

## Decision

CareFlow analytical modules shall primarily operate as backend interpretation layers.

They shall feed a limited number of calm leadership views rather than being exposed as separate dashboards by default.

The central architectural principle is:

Many analytical modules in the backend, few calm leadership views in the frontend.

The frontend shall not automatically mirror the internal module structure.

Analytical complexity shall be aggregated, interpreted and translated into leadership-relevant views, such as:

- Rolling Leadership View
- Leadership Day View
- Leadership Week View
- Leadership Month View
- Planning Comparison View
- Future Situation / Decision View

A new analytical module does not automatically justify a new dashboard, screen or navigation item.

## Consequences

CareFlow may contain many analytical modules internally, but the user-facing experience shall remain simple and leadership-oriented.

Backend modules may calculate, classify, compare and interpret data. The frontend shall present only the leadership-relevant meaning.

New modules should first be designed as read-only analytical services unless a separate ADR explicitly decides otherwise.

The preferred implementation sequence for new modules is:

1. Clarify module boundary through ADR or roadmap entry.
2. Define domain types and stable codes.
3. Implement read-only service logic.
4. Add tests.
5. Extend API response if necessary.
6. Integrate into existing leadership aggregation layer.
7. Extend frontend only minimally and calmly.

CareFlow shall avoid feature sprawl and dashboard proliferation.

## Non-Goals

This ADR does not define the detailed implementation of each analytical module.

This ADR does not prevent future dedicated screens where they are justified.

This ADR does not prevent a later advanced analytics area for administrators, consultants or management roles.

This ADR does not require immediate refactoring of existing views.

## Product Principle

CareFlow shall not confront leadership users with analytical complexity.

CareFlow shall show the situation, not the machinery behind the situation.

## Implementation Guidance

For Phase 10, the focus remains the first pilot-ready Rolling Leadership View frontend.

The following modules may feed or contextualise Phase 10:

- Rolling Leadership View
- Reference Plan Comparison
- Data Quality
- Import and Mapping
- Basic Stability Signals

The following modules are documented but not implemented in Phase 10:

- Fairness and Workload Distribution
- Resilience
- Scenario and Alternatives
- Decision Log
- Organisational Diagnosis
- Pattern Recognition
- Compliance
- Audit and Traceability

## Relationship to Other ADRs

This ADR provides an architectural boundary for all future analytical modules.

It is related to:

- ADR-079 Communication and Visibility Model
- ADR-080 Employee Requests and Leadership Approval Workflow
- ADR-081 Rolling Plan Publication and Version Visibility
- ADR-084 Analytical Module Boundary and Leadership Surface Principle
- ADR-085 Communication and Interaction Module Boundary
- ADR-086 Multilingual Rendering and Swiss Localization
- ADR-087 Fairness and Workload Distribution Signals

## Summary

CareFlow may grow in analytical depth, but the product surface must remain calm.

The system shall be modular in the backend and focused in the frontend.

The guiding phrase is:

Many modules in the backend, few calm leadership views in the frontend.