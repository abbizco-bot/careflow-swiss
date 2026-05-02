# ADR-083: Qualification-Based Capacity Forecasting

Date: 2026-05-02  
Status: Accepted

## Context

In nursing homes and care institutions, staffing capacity cannot be assessed only by counting the number of available employees.

The relevant operational question is not simply whether enough people are present, but whether the right qualifications and functions are available at the right time and in the right organizational unit.

CareFlow already distinguishes between staffing coverage and qualification coverage in its operational validation logic. The same principle must apply to long-term forecasting.

A future week may look acceptable in terms of total headcount but still be risky if too many qualified employees are absent at the same time.

For example:

- enough employees are available, but too few FAGE staff are present;
- a department lacks HF-level nursing qualification in key shifts;
- multiple qualified employees are on holiday during the same school holiday period;
- training absences cluster in one month;
- long-term absences reduce the effective qualification capacity of a unit;
- external staffing may become necessary even though the headcount appears sufficient.

## Decision

CareFlow adopts qualification-based capacity forecasting as a core long-term planning principle.

Long-term absence and availability data must be evaluated not only by number of employees but also by:

- qualification,
- assigned or possible function,
- department or unit,
- time period,
- shift relevance,
- planning certainty,
- approval status,
- expected operational impact.

CareFlow should therefore be able to identify future staffing risks based on qualification capacity, not only on total availability.

## Forecasting Logic

CareFlow should support forecasts such as:

- expected capacity by department and week,
- expected qualification availability by period,
- holiday clusters affecting specific qualifications,
- training clusters affecting operational stability,
- long-term absence impact on staffing coverage,
- risk periods requiring early leadership attention,
- possible need for external staffing,
- structural mismatch between planned staffing demand and expected availability.

The system should classify future periods in a way that is understandable for leadership.

Possible forecast states may include:

- Stable
- Watch
- At Risk
- Critical

German UI terms may include:

- stabil
- beobachten
- angespannt
- kritisch

## Relation to Existing Validation Logic

Qualification-based capacity forecasting is the long-term counterpart to operational validation.

Operational validation answers:

- Is today's or this week's staffing coverage sufficient?
- Are qualification requirements met?
- Are there operational gaps?

Qualification-based capacity forecasting answers:

- Which future periods are likely to become difficult?
- Which qualifications will become scarce?
- Which units may face recurring shortages?
- Where should leadership or HR act early?

## Leadership and HR Value

This decision creates value for several roles.

Department leads can see upcoming risk weeks early.

Nursing management can coordinate resources across units.

Home management can understand future capacity risks.

HR can prepare recruitment, temporary staffing, workload adjustments, or training coordination.

Quality management can identify recurring structural risks.

## Consequences

This decision differentiates CareFlow from simple holiday planning or duty planning tools.

CareFlow becomes capable of showing not only who is absent, but what the absence means for operational and qualification stability.

It supports:

- proactive staffing decisions,
- annual workforce planning,
- better rolling planning,
- reduced emergency staffing,
- earlier external staffing decisions,
- qualification risk visibility,
- organizational learning.

## Pilot Scope

The first pilot does not need a fully automated forecasting engine.

However, the concept should be visible in the product roadmap and data architecture.

A minimal pilot may include:

- showing planned absences in relation to qualification,
- identifying simple future risk periods,
- displaying qualification-related absence clusters,
- reporting basic long-term staffing warnings.

Advanced simulation, predictive analytics, and recommendation logic are future enhancements.

## Not Decided Yet

This ADR does not decide:

- the final forecasting algorithm;
- whether AI or rule-based methods will be used;
- exact thresholds for stable, at risk, or critical states;
- how external staffing forecasts are calculated;
- how forecast results are displayed in the final UI;
- whether forecasts are generated daily, weekly, monthly, or on demand.