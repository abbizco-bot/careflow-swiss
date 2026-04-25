
# ADR-031: Plan Evaluation and Learning Loop

## Status

Accepted

## Context

CareFlow should not only display operational deviations. It should help leadership understand how the monthly plan developed in reality and what can be learned for future planning.

The comparison between a released reference plan and a closed operational plan creates the basis for organisational learning.

This is important because deviations are not always negative. Some deviations indicate planning weakness, instability, or unresolved risk. Other deviations show successful leadership intervention, for example when a potential undercoverage risk was resolved before it became operationally critical.

CareFlow therefore needs a structured monthly evaluation concept.

## Decision

CareFlow will introduce a monthly plan evaluation.

The monthly evaluation compares the selected reference plan version with the corresponding monthly closing snapshot.

The evaluation identifies deviations, classifies them, and creates learning signals for future planning.

## Evaluation Formula

Conceptually, the monthly evaluation follows this logic:

```text
Monthly Evaluation = Closed Operational Plan - Reference Plan