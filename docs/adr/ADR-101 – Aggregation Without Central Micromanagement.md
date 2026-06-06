# ADR-101 – Aggregation Without Central Micromanagement

**Status:** Proposed
**Date:** 2026-06-06
**Project:** CareFlow-Swiss
**Decision Area:** Leadership aggregation, role boundaries, ethical system design
**Related ADRs:** ADR-079, ADR-080, ADR-081, ADR-088, ADR-097, ADR-098, ADR-100

---

## Context

CareFlow-Swiss introduces a three-level leadership visibility model. Operational home leadership receives detailed day-to-day visibility, area and overall leadership receive aggregated support and prioritisation views, and strategy or quality management receives long-term pattern and learning views.

This structure creates an important design risk.

If operational information is aggregated upward without clear boundaries, higher leadership levels could unintentionally receive too much detail. This could shift CareFlow from a leadership support system into a centralised monitoring or micromanagement instrument. Such a development would conflict with the intended philosophy of CareFlow-Swiss.

CareFlow is not designed to supervise individual employees from a central level. It is not designed to remove operational responsibility from local leadership. It is not designed to create a command-and-control structure across homes or residential units.

The system must therefore define how information may be aggregated upward without undermining local leadership, professional trust or organisational responsibility.

---

## Decision

CareFlow-Swiss will use the principle of **aggregation without central micromanagement**.

Operational signals may be aggregated upward to support leadership orientation, prioritisation and organisational learning. However, the higher the leadership level, the more information must be filtered, condensed and contextualised.

Level 2 and Level 3 views must not become interfaces for direct operational control of individual employees, individual shifts or local day-to-day decisions.

The system will distinguish between:

* operational detail,
* aggregated leadership signals,
* organisational patterns,
* strategic learning indicators.

Operational detail remains primarily at Level 1. Aggregated leadership signals may be shown at Level 2. Organisational patterns and learning indicators may be shown at Level 3.

---

## Rationale

CareFlow-Swiss is intended to strengthen leadership capacity, not weaken local responsibility.

In care organisations, operational leadership requires proximity to the team, the residents, the daily situation and the professional judgement of those responsible on site. If a central or senior leadership level receives too much operational detail, several problems may occur.

First, senior leadership may be tempted to intervene directly in local decisions. This can undermine the authority and professional judgement of local care leaders.

Second, employees may experience the system as surveillance. This would weaken trust and reduce acceptance.

Third, the organisation may confuse visibility with control. Seeing a situation does not automatically mean that the higher level should decide it.

Fourth, too much detail can reduce leadership clarity. Senior leadership does not need every operational signal. It needs prioritised orientation: where support is needed, where pressure is building, and where recurring patterns require structural attention.

Therefore, aggregation must be designed as a leadership support function, not as an escalation of control.

---

## Leadership Principle

The core principle is:

**CareFlow may make operational pressure visible upward, but it must not transfer local operational responsibility upward.**

This means that Level 2 and Level 3 views should answer different questions than Level 1 views.

Level 1 asks:

**What must be done now?**

Level 2 asks:

**Where must support, prioritisation or relief be provided?**

Level 3 asks:

**Which recurring patterns require organisational learning or structural change?**

These questions must not be collapsed into one central view.

---

## Aggregation Rules

CareFlow will follow the following aggregation rules.

### 1. Detail remains local by default

Detailed shift, employee and operational intervention data should remain primarily available to the responsible local leadership level.

Higher levels may access detail only when this is necessary, justified and aligned with the defined role model.

### 2. Higher levels receive signals, not raw operational noise

Area, overall and strategic leadership views should display prioritised signals rather than raw operational data.

Examples include:

* repeated staffing pressure,
* qualification coverage risks,
* recurring shift instability,
* accumulated deviations,
* unresolved support needs,
* emerging quality-relevant patterns.

### 3. Individual employee visibility is restricted

CareFlow must avoid unnecessary exposure of individual employee-level information in higher-level views.

Where individual data is required for legitimate operational reasons, it must remain linked to role-based permissions and clear purpose limitation.

### 4. Aggregation must preserve context

Aggregated indicators must not strip away the context needed for fair interpretation.

A residential unit under pressure should not automatically be interpreted as poorly managed. Pressure may result from resident acuity, sickness patterns, structural staffing shortages, temporary absences, qualification constraints or external demands.

### 5. No automatic blame logic

CareFlow must not translate deviations into blame.

The system may identify pressure, instability or recurring risk patterns. It must not automatically attribute responsibility to individuals, teams or local leaders.

### 6. Escalation means support

Escalation in CareFlow should be understood as a support signal.

A red or critical status does not mean failure. It means that attention, support, coordination or decision-making may be required.

---

## Consequences

CareFlow’s user interface must clearly distinguish operational views from aggregated leadership views.

The demo must avoid the impression that senior leadership can or should directly manage every shift, every absence or every local intervention.

Language in the system should favour terms such as:

* support need,
* leadership attention,
* prioritisation,
* pressure pattern,
* organisational learning,
* coordination need,
* structural risk.

The system should avoid language such as:

* control,
* surveillance,
* performance failure,
* employee ranking,
* automatic compliance score,
* blame indicator.

Future AI, RAG, reporting, simulation and sensitivity analysis features must respect the same boundary.

---

## Implications for the Demo

The demo may show detailed operational situations at Level 1.

For Level 2, the demo should show aggregated pressure and support signals across units or homes. The emphasis should be on where leadership attention is needed, not on controlling individual shifts from above.

For Level 3, the demo should show recurring patterns and learning themes. The emphasis should be on organisational development, quality reflection and strategic workforce questions.

A possible Level 2 demo text could be:

“Wohnbereich A shows repeated pressure in late shifts over the next 14 days. The situation does not require central intervention in daily planning, but it indicates a need for leadership attention and possible support.”

A possible Level 3 demo text could be:

“Across the observed period, late-shift qualification coverage appears as a recurring structural pressure point. This should be reviewed as part of workforce planning and quality management.”

The demo should explicitly state that higher-level views do not replace local responsibility.

---

## Non-Goals

This ADR does not define the full role and permission model.

This ADR does not define the final data protection architecture.

This ADR does not define employee privacy rules in full detail.

This ADR does not define all escalation workflows.

This ADR does not prohibit justified access to operational details by authorised roles.

This ADR does not prevent senior leadership from supporting local units. It prevents the system from being designed as a central micromanagement tool.

---

## Design Boundary

The following boundary is binding:

**Higher-level visibility must be designed for support, prioritisation and organisational learning, not for centralised control of local operational decisions.**

Where operational detail is required at higher levels, it must be justified by role, purpose and situation.

---

## Implementation Notes

The current demo can apply this ADR in a simple way.

The Level 1 views may remain operational and detailed.

The Level 2 view should be introduced as an aggregated support dashboard, not as a central planning cockpit.

The Level 3 or QM view should be framed as a pattern and learning view, not as an automatic quality scoring system.

Future implementation should connect this principle to:

* role-based access control,
* tenant-specific configuration,
* reporting boundaries,
* AI/RAG output restrictions,
* employee data minimisation,
* escalation workflows,
* audit and explanation logic.

---

## Accepted Decision

CareFlow-Swiss will aggregate operational signals upward only in a way that supports leadership orientation, prioritisation and organisational learning.

The system will not be designed as a central micromanagement tool.

Operational responsibility remains local unless explicitly escalated through a defined and justified process.

The guiding rule for future development is:

**The higher the leadership level, the more CareFlow must move from operational detail to contextualised support signals and organisational patterns.**
