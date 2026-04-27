# ADR-067 Open Incidents Without Known End Date

## Status

Accepted

## Context

CareFlow must support operational leadership when an incident starts but its end date is not yet known.

A typical case is sickness: an employee reports sick, but the confirmed return date is still open.

CareFlow must make this uncertainty visible without pretending to know the future.

This ADR defines fachliche semantics only. It introduces no code, database migration, data model, service, route, test, API extension, or implementation.

## Decision

An open incident without known end date affects operative effective availability from its start date onward.

The affected person remains visible in the reference plan, because the reference plan is not overwritten by operative events.

However, from the beginning of the open incident, the person does not count as securely effective operative staffing until a confirmed return date exists.

CareFlow must not claim that the person will certainly be absent for the full rolling horizon.

CareFlow only treats the person as not securely available while the incident remains open.

## Data Status

Open incidents should receive an explicit data status such as:

- `return_open`
- `return_date_unknown`
- `open_incident`

The exact technical value is not decided by this ADR.

The fachliche meaning is:

- the incident has started
- the end date is not confirmed
- future availability is uncertain
- the person must not be counted as secure effective coverage until the uncertainty is resolved

## Relationship to ReferencePlan

The reference plan remains unchanged.

The person remains visible in the reference plan assignment or planned structure.

The open incident is an operative event, not a rewrite of the reference baseline.

Reference-plan comparison must preserve the distinction between:

- originally planned staffing
- currently effective operative staffing
- uncertainty caused by an open incident

## Relationship to Rolling View

In a rolling 28-day view, an open incident may affect all future days in the horizon as uncertainty.

CareFlow must phrase this carefully.

It may say that the person is not currently a secure effective staffing contribution while return is open.

It must not say that the person is definitively absent for 28 days unless such a date range is confirmed.

## Risks

The main risks are:

- open incidents are treated as confirmed long absences
- reference-plan staffing is silently overwritten
- future absence is overstated
- operational coverage is overstated by counting an uncertain person as secure
- leadership-facing language implies certainty where only uncertainty exists
- sensitive absence reasons become too visible

## Consequences

CareFlow should later model open incidents as operational uncertainty with explicit data status.

Open incidents should reduce effective secure staffing from their start date, but they should not create false certainty about the future.

This ADR is documentation only. A later implementation needs separate data-model and API decisions.

## Summary

Open incidents without confirmed end date remain visible as uncertainty.

The employee stays in the reference plan, but does not count as secure operative staffing while the return date is open.
