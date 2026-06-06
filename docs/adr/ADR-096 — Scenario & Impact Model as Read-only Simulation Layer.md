# ADR-096 — Scenario & Impact Model as Read-only Simulation Layer

## Status

Accepted

## Date

2026-05-21

## Context

CareFlow-Swiss is positioned as a leadership and decision-support layer for Swiss nursing homes. It does not replace existing duty planning systems, ERP systems, or workforce management solutions. Existing systems such as Polypoint remain leading for operational planning and data entry.

CareFlow currently provides leadership-oriented views based on planning data, shifts, assignments, absences, availability requests, qualification logic, gap interpretation, and severity classification. These views allow leadership roles to recognize whether the short-term staffing situation is stable, under attention, or critical.

As CareFlow evolves, there is a need to support leadership in understanding not only the current situation, but also how the situation may change under hypothetical operational events or leadership interventions.

Examples include:

- a qualified employee becomes unavailable at short notice;
- a planned absence affects an already tight day;
- a shift loses a critical qualification;
- an internal reassignment is considered;
- a pool employee becomes available;
- a daily function is reassigned;
- a staffing situation moves from attention to critical.

This capability is conceptually related to a lightweight domain-specific world model. However, CareFlow must not become an autonomous planning or optimization system. It must remain explainable, bounded, and aligned with its leadership-layer positioning.

## Decision

CareFlow will introduce a Scenario & Impact Model as a read-only simulation layer.

The Scenario & Impact Model simulates hypothetical events and possible leadership interventions on a temporary operational state snapshot. It recalculates the resulting operational situation using existing CareFlow logic, especially:

- coverage gap logic;
- qualification gap logic;
- effective gap interpretation;
- primary cause logic;
- signals;
- severity classification;
- leadership-oriented summary logic.

The simulation layer must not mutate productive operational data.

It must not create, modify, delete, or approve real shifts, assignments, absences, planning days, planning months, or employee records.

The purpose of the Scenario & Impact Model is to answer questions such as:

> What would happen to the leadership situation if this event occurred?

or:

> How would the situation change if this leadership option were considered?

It is not intended to answer:

> What is the optimal plan?

or:

> Which staffing decision should be executed automatically?

## Architectural Boundary

The Scenario & Impact Model is introduced as an internal CareFlow module, not as a separate application.

Suggested module name:

```text
src/modules/scenario-impact/