# ADR-074 Special Competence Coverage as Future Skill-Mix Extension

## Status

Accepted

## Context

ADR-071 defines special competence as a third staffing dimension.

ADR-072 defines special need as aggregated demand without resident details.

ADR-073 defines who may later enter special needs.

The actual logic for checking whether special needs are covered by available employees is not part of the current Phase 8 implementation.

This ADR documents the roadmap boundary only. It introduces no code, database migration, model, service, route, test, API extension, validation logic, or implementation.

## Decision

Special competence coverage is a future Skill-Mix Intelligence or Competence Coverage extension.

It should not be technically implemented in the current Phase 8 work.

Later, CareFlow may check whether a special need is covered by available employees with the matching special competence.

## Future Coverage Logic

A future coverage check may evaluate:

- required special need
- relevant shift or area
- available employees
- employee special competences
- effective availability
- assignments
- gap severity context
- need level or urgency

This is a future target direction only.

## Warning Levels

Missing special competence may later appear as:

- must warning
- should hint
- fachlicher note

The warning level should depend on the need level and operational relevance.

The exact severity model is not decided by this ADR.

## Relationship to Existing Dimensions

Special competence coverage must not replace:

- base qualification coverage
- daily function coverage
- coverage count validation

It extends Skill-Mix Intelligence as an additional dimension.

## Non-Goals for Current Phase

The current phase must not introduce:

- special competence persistence
- special need persistence
- coverage validation logic
- warnings based on special need
- API output
- UI behavior
- automatic recommendations
- resident-level data

## Risks

The main risks are:

- special competence coverage is implemented before the domain model is stable
- special need creates hidden resident-data storage
- special competence is mixed with base qualification or daily function
- warning levels become opaque
- CareFlow drifts into automatic decision-making

## Consequences

The roadmap should preserve special competence coverage as a later extension.

Before implementation, CareFlow needs explicit model, privacy, authorization, and warning-semantics decisions.

## Summary

Special competence coverage is important, but it belongs to a later Skill-Mix Intelligence or Competence Coverage phase, not to the current Phase 8 implementation.
