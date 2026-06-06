# ADR-099 — Future Learning Layer and World Model Boundary

## Status

Accepted

## Date

2026-05-21

## Context

The long-term evolution of CareFlow-Swiss may include forecasting, pattern recognition, probabilistic risk indicators, and later AI-supported world-model capabilities.

Possible future use cases include:

- forecasting absence risks;
- identifying recurring staffing risk patterns;
- comparing simulated scenarios with actual outcomes;
- learning which operational signals tend to precede critical situations;
- estimating whether a situation is likely to deteriorate without intervention;
- supporting leadership with evidence-based early-warning indicators.

These capabilities are conceptually related to a CareFlow world model: a model that represents operational states and possible transitions between them.

However, introducing learning models too early would create significant risks:

- insufficient data quality;
- insufficient pilot data volume;
- unclear accountability;
- overclaiming predictive accuracy;
- loss of explainability;
- confusion between leadership support and automated decision-making;
- strategic drift toward autonomous planning or optimization.

CareFlow must therefore define a clear boundary between its current deterministic Scenario & Impact Model and any future learning layer.

## Decision

CareFlow will treat learning-based forecasting, probabilistic risk estimation, and AI-supported world-model capabilities as future extensions, not as part of the initial Scenario & Impact Model.

The initial Scenario & Impact Model remains:

- deterministic;
- rule-based;
- explainable;
- read-only;
- side-effect-free;
- based on explicit scenario assumptions;
- bounded by existing CareFlow gap and severity logic.

A future learning layer may only be introduced after sufficient pilot experience, data availability, governance review, and explicit architectural decision.

## World Model Boundary

The term "world model" may be used internally as a long-term architectural concept.

In the current CareFlow architecture, it means:

> a structured representation of operational states and possible state transitions within the leadership-relevant staffing context of a nursing home.

It does not mean:

- a general artificial intelligence system;
- an autonomous planning system;
- a self-learning staffing decision engine;
- a replacement for human leadership judgment;
- a replacement for existing planning systems;
- a black-box optimizer.

The first concrete implementation of this concept is the Scenario & Impact Model described in ADR-096 and the Operational State Snapshot described in ADR-097.

## Future Learning Layer

A future learning layer may be considered only for clearly bounded purposes, such as:

- recognizing recurring operational risk patterns;
- comparing predicted impacts with actual outcomes;
- calibrating severity thresholds;
- generating probabilistic early-warning indicators;
- identifying repeated causes of staffing instability;
- supporting pilot evaluation and management reporting.

It must not automatically execute or enforce staffing decisions.

## Possible Future Phases

### Phase A — Deterministic Scenario & Impact Model

Rule-based simulation on temporary operational snapshots.

This is the current accepted direction.

### Phase B — Historical Snapshot Storage

Selected operational state snapshots and scenario outcomes may be stored for later comparison.

This requires a separate decision.

### Phase C — Forecast vs Actual Comparison

CareFlow may compare simulated expectations with observed outcomes.

This requires sufficient data and careful governance.

### Phase D — Pattern Recognition

CareFlow may identify recurring risk patterns across time.

This may use statistical or machine-learning methods, but only if explainability and data governance are adequate.

### Phase E — Probabilistic Risk Indicators

CareFlow may show estimated risk developments, for example:

```text
The likelihood of a critical qualification gap increases if no intervention is made.