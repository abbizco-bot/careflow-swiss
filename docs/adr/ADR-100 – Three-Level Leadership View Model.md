# ADR-100 – Three-Level Leadership View Model

**Status:** Proposed
**Date:** 2026-06-06
**Project:** CareFlow-Swiss
**Decision Area:** Leadership visibility, aggregation logic, organisational steering
**Related ADRs:** ADR-079, ADR-081, ADR-088, ADR-097, ADR-098

---

## Context

CareFlow-Swiss is evolving from a demo of operational planning visibility into a leadership-oriented support system for care organisations. The current demo already includes operational views such as the rolling overview, day view, week view, deviations, interventions, staff overview, employee perspective, residential unit view and QM situation view.

As the system matures, it must clarify which leadership levels it supports and how operational data is translated into different degrees of visibility, aggregation and decision support.

Care organisations do not operate on one leadership level only. A residential unit manager needs a different view from a home manager. A multi-site operational director needs a different view from a local care manager. Quality management and strategy need a different horizon again. If CareFlow presents all information in the same way to all roles, the system risks either overloading senior leadership with operational detail or reducing operational leaders to mere data suppliers.

Therefore, CareFlow requires a formal leadership-view model that distinguishes between three levels of visibility and responsibility:

1. operational home and residential unit leadership,
2. area or overall leadership across units or sites,
3. strategy, quality management and organisational development.

This decision defines the basic model for these three levels.

---

## Decision

CareFlow-Swiss will use a **Three-Level Leadership View Model**.

The system will structure leadership visibility across three distinct but connected levels:

### Level 1 – Operational Home Leadership

Level 1 supports operational home leadership, residential unit leadership and local care management.

The primary purpose of this level is immediate operational orientation. It focuses on the current care situation, upcoming shifts, critical staffing gaps, qualification coverage, deviations, interventions and short-term action needs.

The core question of this level is:

**What must be done now to keep care delivery stable?**

This level is close to the operational reality of the home or residential unit. It supports immediate leadership judgement but does not replace local decision-making.

---

### Level 2 – Area and Overall Leadership

Level 2 supports area leadership, overall leadership, multi-site management and senior operational roles responsible for more than one residential unit or care home.

The primary purpose of this level is prioritisation and support. It does not provide a micromanagement interface for senior leaders. Instead, it aggregates operational situations into a leadership view that shows where support, escalation, coordination or additional attention may be required.

The core question of this level is:

**Where do I need to help, prioritise or relieve pressure now?**

This level focuses on patterns across organisational units: which homes, residential units or teams are stable, which are under pressure, and where recurring support needs are emerging.

---

### Level 3 – Strategy, Quality Management and Organisational Development

Level 3 supports strategic leadership, quality management, organisational development and long-term learning.

The primary purpose of this level is pattern recognition and organisational learning. It does not assess individual performance and does not generate automatic quality judgements. It identifies recurring organisational stress patterns, structural risks, capability gaps, qualification constraints and development themes.

The core question of this level is:

**Why does pressure repeatedly emerge in the same place or pattern?**

This level transforms repeated operational signals into strategic learning material. It supports quality reflection, workforce planning, organisational resilience and leadership development.

---

## Rationale

The three-level model reflects the reality of care organisations. Operational leadership requires immediate visibility. Overall leadership requires prioritised support views. Strategy and quality management require long-term patterns.

Without this distinction, CareFlow would risk one of two design failures.

The first failure would be excessive operational detail at senior levels. This would turn CareFlow into a control interface and could undermine local responsibility.

The second failure would be excessive abstraction at operational levels. This would weaken the system’s usefulness for daily leadership and make the demo less credible for care managers.

The three-level model prevents both failures. It allows CareFlow to support different leadership horizons without confusing their responsibilities.

---

## Leadership Logic

The model is based on four principles.

### 1. Support instead of control

CareFlow is designed as a leadership support system, not as a surveillance or control system.

The system helps leaders see pressure earlier, prioritise attention and identify support needs. It must not be used to monitor employees in a punitive way or to centralise every operational decision.

### 2. Aggregation instead of micromanagement

Information becomes more aggregated as it moves from Level 1 to Level 3.

Level 1 may show concrete operational details because local leadership needs them. Level 2 receives prioritised and aggregated leadership signals. Level 3 receives patterns, trends and learning indicators.

The higher the level, the less the system should expose operational detail unless explicitly required for justified analysis.

### 3. Complement instead of replacement

CareFlow does not replace existing systems such as duty planning, HR, time recording or care documentation systems.

Existing systems remain the primary systems of record. CareFlow adds a leadership visibility layer that translates available operational signals into decision-relevant views.

### 4. From crisis to pattern

CareFlow should help organisations move from reactive crisis management to pattern-based leadership.

A single deviation may require immediate intervention. A repeated deviation across time or units becomes a leadership pattern. A stable pattern becomes material for quality management, organisational development and strategic workforce planning.

---

## Consequences

CareFlow must distinguish between role-specific and level-specific views.

Operational views may remain detailed, but cross-site or strategic views must be aggregated and interpreted carefully.

The demo should show that CareFlow can serve a home manager and a multi-site leader without becoming a centralised command-and-control system.

Future reports, simulation views, sensitivity analyses and AI/RAG-supported situation reports must be mapped to the three leadership levels.

The system must avoid language that suggests automatic control, automatic quality assessment or replacement of human leadership judgement.

---

## Implications for the Demo

The current demo should continue to show the operational care reality at Level 1.

A new or extended leadership framing should show how the same underlying operational signals can be translated into Level 2 and Level 3 views.

For Level 2, the demo should emphasise:

* support needs across units or homes,
* prioritisation of leadership attention,
* aggregated risk or pressure signals,
* identification of areas requiring coordination.

For Level 3, the demo should emphasise:

* recurring patterns,
* long-term learning,
* quality management relevance,
* organisational development themes,
* strategic workforce and qualification questions.

The demo must explicitly state that CareFlow supports leadership judgement but does not replace it.

---

## Non-Goals

This ADR does not define a full multi-tenant architecture.

This ADR does not define the final permission model for all roles.

This ADR does not introduce automatic quality scoring.

This ADR does not define a full reporting engine.

This ADR does not define AI or RAG behaviour. These topics require separate ADRs.

This ADR does not permit centralised micromanagement of individual employees by higher leadership levels.

---

## Design Boundary

The following boundary is binding for future development:

**CareFlow may aggregate operational signals upward, but it must not convert higher-level leadership visibility into direct operational micromanagement.**

This means that Level 2 and Level 3 views should primarily display patterns, priorities, support needs and structural signals. They should not become interfaces for direct control of individual staff members or local daily decisions.

---

## Implementation Notes

The first implementation may remain conceptually simple.

The existing demo can be extended by adding explanatory framing around the current views and, later, by adding one aggregated leadership view for Level 2 and one pattern-oriented QM/strategy view for Level 3.

A possible implementation path is:

1. document the three-level leadership model,
2. add a demo explanation or visual section,
3. introduce a Level 2 aggregate view,
4. refine the existing QM view into a Level 3 learning and pattern view,
5. later connect reports, simulations and sensitivity analyses to these three levels.

The implementation should proceed incrementally and avoid premature complexity.

---

## Accepted Decision

CareFlow-Swiss will formally use the Three-Level Leadership View Model as its leadership visibility architecture.

The system will distinguish between:

* Level 1: operational home and residential unit leadership,
* Level 2: area and overall leadership,
* Level 3: strategy, quality management and organisational development.

Each level receives a different degree of aggregation, time horizon and decision support.

The model is binding for future demo development, documentation, reporting logic, simulation design and AI/RAG-supported situation reporting.

CareFlow’s core leadership promise is therefore:

**CareFlow makes care planning visible as a leadership situation without replacing existing systems, centralising local responsibility or substituting human judgement.**
