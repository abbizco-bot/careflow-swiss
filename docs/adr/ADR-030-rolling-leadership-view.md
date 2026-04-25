# ADR-030: Plan Snapshots and Monthly Closing

## Status

Accepted

## Context

The operational rolling plan changes continuously. This is useful for operational leadership, but it creates a challenge for monthly evaluation.

At the end of a planning period, CareFlow needs a stable record of what actually happened operationally during that period. Without a frozen operational state, the system cannot reliably compare the original reference plan with the operational reality of the month.

CareFlow therefore needs a monthly closing process that freezes the completed monthly section of the operational rolling plan.

## Decision

CareFlow will introduce plan snapshots and a monthly closing process.

At the end of each planning period, CareFlow creates a monthly closing snapshot.

The monthly closing snapshot freezes the operational state of the completed period.

This snapshot becomes the basis for evaluation against the corresponding reference plan version.

The operational rolling plan itself continues beyond the month boundary and is not stopped by the monthly closing.

## Definitions

### Operational Snapshot

A stored representation of the operational plan state at a defined point in time.

### Monthly Closing Snapshot

The frozen operational state of a completed calendar month or planning period.

### Closed Operational Plan

The completed and frozen operational plan section for a specific period.

### Evaluation Snapshot

A stored representation of the evaluation result derived from comparing the closed operational plan with the reference plan.

## Monthly Closing Rule

At the end of a planning period, CareFlow creates:

```text
Closed Operational Plan = Operational Rolling Plan section from period start to period end