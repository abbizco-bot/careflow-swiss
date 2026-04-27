# ADR-072 Special Need as Aggregated Demand Without Resident Details

## Status

Accepted

## Context

Special competence coverage can only be evaluated if a corresponding special need is known.

CareFlow does not automatically know special needs.

Special needs may later be entered manually, imported, or received from other systems.

The MVP must avoid storing person-related resident details.

This ADR defines fachliche semantics only. It introduces no code, database migration, model, service, route, test, API extension, or implementation.

## Decision

In the MVP, special need is treated as aggregated staffing demand without resident-level details.

CareFlow should not store resident names, room numbers, diagnoses, or medical details for this purpose.

Instead, CareFlow may later store aggregated demand such as:

- "early shift house A requires wound competence"
- "late shift area B requires palliative-care competence"
- "day responsibility requires dementia competence coverage"

## Source of Special Need

Special need may later come from:

- manual entry
- import
- structured external system handover
- future integration with other systems

CareFlow must not assume that it can infer special need automatically.

## Resident Data Boundary

The MVP must not store:

- resident names
- room numbers
- diagnoses
- treatment details
- medical notes
- resident-level care documentation

The stored concept is an aggregated operational need, not a resident record.

## Relationship to Special Competence

Special need describes demand.

Special competence describes employee capability.

These concepts must remain separate.

A later coverage check may compare them, but this ADR does not implement such logic.

## Risks

The main risks are:

- resident-level data enters the MVP unintentionally
- medical details are stored where only staffing demand is needed
- special need is treated as automatically known
- source-specific details become core model fields
- aggregated needs are misunderstood as full care documentation

## Consequences

Future special-need modeling must be aggregated, data-minimal, and separate from resident documentation.

Any later import or entry mechanism requires a separate implementation decision.

## Summary

CareFlow may later track special need as aggregated staffing demand, but the MVP must avoid resident names, room numbers, diagnoses, and medical detail data.
