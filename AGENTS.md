# AGENTS.md

## Project Identity

This repository contains the MVP implementation of **Abbizco CareFlow V0.1**.

CareFlow is a leadership-oriented personnel planning tool for nursing homes.
It is not a full ERP, payroll, or HR suite.

The product focus is:

- monthly staff planning
- staffing risk visibility
- qualification coverage
- early warning signals
- likely temporary staffing needs

## Product Philosophy

When implementing features, always prioritize:

1. clarity over cleverness
2. transparency over black-box logic
3. practical usability over feature abundance
4. modular architecture over quick hacks
5. leadership decision support over full automation

## Scope Discipline

Do not introduce features outside MVP scope unless explicitly requested.

Especially avoid adding:

- payroll logic
- time tracking
- chat systems
- complex employee self-service
- deep optimization engines
- ERP connectors
- advanced simulation engines
- unnecessary AI features

## Recommended Stack

- Next.js
- TypeScript
- PostgreSQL
- Prisma
- Tailwind CSS
- Docker

## Coding Rules

- Use clear domain-oriented naming
- Keep business logic separated from UI
- Prefer small composable modules
- Add comments only where they help understanding
- Avoid premature abstraction
- Use typed interfaces and schemas where possible
- Validate critical inputs
- Keep warning logic explicit and readable

## Domain Objects

Main objects expected in the system:

- OrganizationUnit
- Employee
- AvailabilityProfile
- QualificationProfile
- PlanningEvent
- StaffingRequirement
- PlanAssignment
- WarningSignal
- MonthlyReport

## UX Principles

The UI should feel:

- calm
- simple
- readable
- managerial
- practical
- not overloaded

## Important Functional Priorities

Implement in this order unless told otherwise:

1. project scaffold
2. database schema
3. seed data
4. employee master data
5. planning events
6. monthly planning view
7. warning signals
8. monthly report
9. export

## Warning Logic Principles

Warnings must be explainable.
If the system shows a staffing or qualification risk, the reason must be visible.

Examples:

- absence overlap
- staffing below required minimum
- missing special qualification
- future shortage due to planned leave or exit

## Output Expectations

When making major implementation steps:

- explain what was added
- explain which files were created or changed
- explain architectural decisions briefly
- suggest the next smallest logical step

## Non-Goals

Do not turn this MVP into a generic workforce platform.
Keep focus on nursing home monthly planning and staffing risk visibility.