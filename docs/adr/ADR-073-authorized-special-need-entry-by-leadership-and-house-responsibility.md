# ADR-073 Authorized Special Need Entry by Leadership and House Responsibility

## Status

Accepted

## Context

ADR-072 defines special need as aggregated staffing demand without resident details.

Such needs should not be entered by every employee in the MVP.

CareFlow must distinguish the right to enter a special need from the professional competence to cover it.

This ADR defines fachliche semantics only. It introduces no code, database migration, authorization model, route, service, test, API extension, or implementation.

## Decision

In the MVP direction, special needs may later be entered or managed by defined leadership roles only.

Leadership may record, change, confirm, and close special needs across areas according to their responsibility.

House responsibility may record special needs for the responsibility area and time period assigned to them on that day.

The permission to enter a special need is separate from having the special competence itself.

## Leadership Role

Leadership may later be allowed to:

- create special needs across areas
- update special needs
- confirm special needs
- close special needs
- review unresolved special needs

The exact permission model is not decided by this ADR.

## House Responsibility Role

House responsibility may later be allowed to record special needs for:

- their assigned area
- their assigned time period
- the day or shift where the responsibility applies

This reflects operational knowledge close to daily care reality.

## Separation from Special Competence

Entry authorization and professional competence are different dimensions.

A person may have wound competence without being authorized to create special-need entries.

A house-responsible person may report a wound-related need even if they are not a wound expert.

The report describes operational demand. It does not certify the reporter as the person who can cover the demand.

## Risks

The main risks are:

- all employees can enter needs without governance
- special competence is confused with entry authorization
- reported need is interpreted as personal expertise
- house responsibility is allowed to edit outside its assigned context
- special needs become uncontrolled task notes

## Consequences

A later implementation needs explicit role and scope rules before special-need entry becomes technical behavior.

This ADR does not implement permissions or write flows.

## Summary

Special-need entry should later be restricted to leadership and assigned house responsibility, and this permission must remain separate from the competence required to cover the need.
