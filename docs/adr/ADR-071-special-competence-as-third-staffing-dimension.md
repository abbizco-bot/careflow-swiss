# ADR-071 Special Competence as Third Staffing Dimension

## Status

Accepted

## Context

CareFlow already distinguishes stable qualification from daily function.

Stable qualification describes formal professional qualification.

Daily function describes the operational role on a specific day or shift.

Care institutions also need visibility into additional specialized capabilities that are neither the formal base qualification nor the daily function.

Examples include wound management, palliative care, hygiene, dementia competence, and vocational training.

This ADR defines fachliche semantics only. It introduces no code, database migration, model, service, route, test, API extension, or implementation.

## Decision

CareFlow will treat special competence as a third staffing dimension alongside base qualification and daily function.

The three dimensions are:

- base qualification
- daily function
- special competence

They must not be merged.

## Base Qualification

Base qualification describes the formal core qualification of an employee.

Examples:

- dipl. HF
- FaGe
- AGS

It is relatively stable master-data information.

## Daily Function

Daily function describes the operative role assigned for a specific day or shift.

Examples:

- house responsibility
- day responsibility
- floater
- shift coordination

It may change from day to day.

## Special Competence

Special competence describes additional professional capability or additional role competence.

Examples:

- wound management
- palliative care
- hygiene
- dementia competence
- vocational training

Special competence can exist independently from daily function.

An employee may have a special competence without being assigned a corresponding daily function.

An employee may hold a daily function without having every special competence relevant to the day.

## Boundary Rules

Special competence must not be used as a hidden replacement for base qualification.

Special competence must not be flattened into daily function.

Daily function must not be used as proof of special competence.

Base qualification must not automatically imply all special competences.

## Risks

The main risks are:

- formal qualification, daily function, and special competence are merged
- special competence becomes an untraceable scoring field
- daily roles are interpreted as professional certifications
- special competence coverage is implemented before the domain model is explicit
- staffing warnings become opaque

## Consequences

Future Skill-Mix or Competence Coverage work should model special competence explicitly.

This ADR does not implement special competence storage or validation.

## Summary

Special competence is a separate staffing dimension and must remain distinct from both base qualification and daily function.
