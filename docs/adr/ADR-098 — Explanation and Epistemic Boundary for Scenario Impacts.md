# ADR-098 — Explanation and Epistemic Boundary for Scenario Impacts

## Status

Accepted

## Date

2026-05-21

## Context

CareFlow-Swiss is designed to support leadership interpretation, not to automate operational decisions. As the system evolves toward scenario simulation and impact analysis, it becomes increasingly important that simulated outputs remain understandable, bounded, and epistemically transparent.

A scenario simulation may show that a situation changes from stable to attention, or from attention to critical. However, such a result must never appear as an unexplained technical verdict.

Leadership users need to understand:

- what data the simulation used;
- what assumption was introduced;
- which rule or interpretation logic was applied;
- what changed compared to the baseline;
- what remains uncertain;
- what the system is not claiming.

Without an explicit explanation and epistemic boundary, simulation features could create false authority, overconfidence, or the impression that CareFlow is making staffing decisions.

## Decision

Every Scenario & Impact result must include an Explanation and Epistemic Boundary.

This means that simulation outputs must clearly distinguish between:

1. baseline data;
2. hypothetical scenario assumptions;
3. deterministic rule-based calculations;
4. interpreted operational signals;
5. leadership-oriented summaries;
6. uncertainty or incomplete data;
7. non-claims and system boundaries.

CareFlow must not return a simulated severity change without an explanation of why the change occurred.

The explanation layer is a mandatory part of the Scenario & Impact Model.

## Required Explanation Elements

A scenario impact result should include at least the following elements:

### 1. Baseline Summary

A short description of the situation before the simulated event or intervention.

Example:

```text
Before simulation, the early shift on 2026-06-15 was under attention but not critical.