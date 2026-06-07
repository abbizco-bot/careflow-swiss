# CareFlow Prisma Data Model

## Purpose

This document summarizes the active Prisma schema used by the current CareFlow MVP backend.

## Current Implementation Status

Active schema:

- `prisma/schema.prisma`

Generated Prisma client output:

- `src/generated/prisma`

`src/generated` should be treated as generated code and should not be edited manually.

## Datasource and Generator

The Prisma datasource uses PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
}
```

The client generator writes generated code to:

```text
../src/generated/prisma
```

## Enums

Active enums:

- `QualificationLevel`: `high`, `medium`, `low`, `none`
- `BaseQualification`: `DIPL_PFLEGE`, `FAGE`, `AGS`, `PFLEGEHILFE`, `LEARNER`, `EXTERNAL`, `OTHER`
- `EmploymentType`: `stable`, `variable`, `flexible`
- `AssignmentFunction`: `Pflegeleitung`, `Hausverantwortung`, `Tagesverantwortung`, `Pflegedienst`, `Springer`, `Lernende`, `Externe`, `Andere`

## Models

Active models:

- `Employee`
- `Shift`
- `Assignment`
- `Absence`
- `DailySituation`
- `PlanningMonth`
- `PlanningDay`
- `PlanningShiftTemplate`
- `AvailabilityRequest`

## Core Relationships

- `Employee` has many `Assignment`, `Absence`, and `AvailabilityRequest` records.
- `Shift` has many `Assignment` records.
- `Assignment` connects an `Employee` to a `Shift`.
- `PlanningMonth` has many `PlanningDay` records.
- `PlanningDay` has many `PlanningShiftTemplate` records.
- `AvailabilityRequest` belongs to an `Employee`.

## Important Domain Notes

`Employee.baseQualification` is the stable qualification field prepared for domain clarity.

`Assignment.assignedFunction` is the daily operational function assigned in a specific shift assignment.

`Employee.qualified` remains present and remains the current operational counting basis for `requiredQualifiedCount` unless a separate domain decision changes that.

Do not silently migrate qualification counting from `Employee.qualified` to `Employee.baseQualification`.

## Known Limitations

- The schema does not by itself describe all business validation semantics; validations live in backend services and rules.
- There is no schema migration summary in this document.
- Database migration history was not inspected in this pass; migration status is to be verified if needed.

## Next Likely Extensions

- Add a model-by-model field reference if external API consumers or migrations require it.
- Add migration documentation if schema evolution becomes part of the technical package.
- Document generated client regeneration commands if they differ from current build/dev workflows.

## Update Triggers

Update this document whenever `prisma/schema.prisma` changes, generated client output path changes, or domain semantics around qualification/function fields change.

