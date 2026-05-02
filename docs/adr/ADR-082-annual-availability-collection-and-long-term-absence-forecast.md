# ADR-082: Annual Availability Collection and Long-Term Absence Forecast

Date: 2026-05-02  
Status: Accepted

## Context

Many nursing homes and care institutions collect employee absence wishes and known absence information for the following year.

For example, employees may be asked to submit their planned holidays, training absences, maternity or parental leave, military service, longer expected absences, or other known availability constraints by a fixed deadline such as 30 September 2026 for the planning year 2027.

This long-term information is important for CareFlow because operational staffing risks often become visible months before they affect the daily schedule.

Without long-term availability and absence information, CareFlow would mainly operate at the short-term operational level. With long-term absence forecasting, CareFlow can support proactive workforce and capacity planning.

## Decision

CareFlow includes annual availability collection and long-term absence forecasting as part of its product architecture.

Employees may submit known or desired absence periods for a future planning year.

These inputs are not automatically treated as approved absences. They are treated as planning-relevant requests, signals, or forecast information until reviewed and confirmed by the responsible leadership or administrative role.

## Planning Horizons

CareFlow distinguishes between several planning horizons:

1. Annual Forecast  
   Long-term known or desired absences, availability constraints, training absences, and capacity risks.

2. Monthly Reference Plan  
   The official planned month, usually imported from an existing planning system or planning file.

3. Rolling Operational Plan  
   The current operational planning window, typically covering the next three to four weeks.

4. Daily and Weekly Leadership View  
   The current leadership situation, including risks, coverage, qualification, open decisions, and operational events.

The annual forecast informs the monthly reference plan and the rolling operational plan.

## Absence and Availability Inputs

Long-term inputs may include:

- holiday wishes,
- planned training,
- maternity leave,
- parental leave,
- military service,
- civil service,
- unpaid leave,
- sabbatical,
- known long-term absence,
- planned medical absence, if disclosed appropriately,
- availability restrictions,
- expected workload or employment percentage changes,
- special date-related preferences.

CareFlow should not require unnecessary private details. The planning-relevant information is usually the person, time period, availability impact, status, and planning relevance.

## Status Model

Long-term absence inputs should support a status model.

Possible statuses are:

- Submitted
- In Review
- Approved
- Rejected
- Modified
- Tentative
- Confirmed
- Confidential

The exact statuses may differ by implementation phase.

## Confidentiality

Certain absence categories may be sensitive.

CareFlow must separate planning relevance from confidential personal details.

For most operational planning purposes, the system only needs to know:

- who is unavailable,
- when,
- to what extent,
- with which planning certainty,
- whether the absence is approved or tentative.

The detailed reason should only be visible to roles that are authorized to see it.

## Consequences

This decision extends CareFlow beyond short-term operational planning.

It creates the basis for:

- annual absence planning,
- long-term staffing forecasts,
- early detection of holiday clusters,
- training absence coordination,
- maternity and long-term absence planning,
- early identification of external staffing needs,
- HR and management reporting,
- improved rolling planning quality.

This decision also supports the long-term positioning of CareFlow as a proactive leadership and workforce visibility layer.

## Pilot Scope

The first pilot does not need a complete annual planning module.

However, the architecture should not contradict this future requirement.

A minimal pilot may include:

- planned absences as data objects,
- absence status,
- approval status,
- visibility in rolling planning,
- basic long-term forecast references.

The full annual availability collection process can be implemented after the first pilot.

## Not Decided Yet

This ADR does not decide:

- the exact annual deadline logic;
- whether deadlines are configurable by institution;
- the final employee input UI;
- the final role model for approving annual absences;
- integration with HR or payroll systems;
- automatic conflict resolution between competing holiday requests.