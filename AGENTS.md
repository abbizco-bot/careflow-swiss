# AGENTS.md

## Project identity

This repository contains the MVP implementation of **Abbizco CareFlow**.

CareFlow is a leadership and decision layer for care institutions, especially nursing homes.
It is not a full ERP, payroll, or HR suite.

The purpose of CareFlow is to make staffing situations readable for leadership, highlight operational risks early, and support traceable decisions based on explicit business rules and structured data.

## Product focus

The current product focus is:

- monthly staff planning
- staffing risk visibility
- qualification coverage
- early warning signals
- likely temporary staffing needs
- leadership-oriented operational visibility

## Product philosophy

When implementing features, always prioritize:

1. clarity over cleverness
2. transparency over black-box logic
3. practical usability over feature abundance
4. modular architecture over quick hacks
5. leadership decision support over full automation

Prefer transparent and testable solutions over clever but opaque ones.

## Governance references

When relevant, align changes with these project governance documents:

- `docs/governance/ki-einsatzmatrix-v0.1.md`
- `docs/governance/entwicklungszyklus-v0.1.md`

These documents refine the current AI usage boundaries and the standard development sequence for CareFlow.

## Working model

This project is developed in a guided, human-responsible, AI-assisted way.

- ChatGPT is used for conceptual clarification, modeling, architecture reflection, and documentation support.
- Codex is used for implementation, refactoring, test support, and structured code changes.
- Final domain responsibility remains with the human product owner.

Do not act as if Codex defines domain truth. Codex supports implementation inside a defined domain model.

## Scope discipline

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

Also avoid casually introducing:

- recommendation logic where none exists yet
- predictive reasoning in read-only leadership layers
- hidden scoring systems not defined in code
- write-side side effects in descriptive views

## Core product principles

- CareFlow is a decision layer, not an ERP.
- Deterministic business logic must remain in code.
- AI must not replace explicit validation logic.
- Explanatory or leadership-facing language must always be traceable to backend facts.
- Human-in-the-loop responsibility remains mandatory for operational decisions.
- Prefer readable domain logic over abstract technical sophistication.
- Do not introduce silent behavior changes.

## Domain principles

Preserve and respect the core domain distinctions of CareFlow.

### Important domain distinctions

- qualification vs daily function
- planned staffing vs effective operational staffing
- event exists vs event is operationally tipping-relevant
- administrative information vs leadership-relevant operational signal
- data state vs explanatory interpretation
- read-only visibility vs write-side operational change

### Qualification and daily function

Qualification is a stable employee property in the employee master data.

Daily function is an operational role assigned for a specific day or shift.

A person may keep the same qualification but have different daily functions on different days.

Not every daily function is valid for every qualification. Do not flatten, merge, or blur these concepts.

In the current implementation, `Employee.baseQualification` is the prepared domain model for stable qualification, and `Assignment.assignedFunction` is the daily operational function.

`Employee.qualified` remains the operational counting basis for `requiredQualifiedCount` for now. Do not silently migrate `requiredQualifiedCount` to `baseQualification`; that requires an explicit domain decision.

Qualification-function mismatches must be surfaced as explainable warnings in validation and leadership views. They must not automatically block assignment creation.

## Recommended stack

Current and expected stack elements include:

- Node.js
- TypeScript
- PostgreSQL
- Prisma

Older planning assumptions may mention frontend or infra options such as Next.js, Tailwind CSS, or Docker. Do not assume they are active implementation requirements unless they are present in the repository or explicitly requested.

## Coding rules

- Use clear domain-oriented naming.
- Keep business logic separated from UI and presentation layers.
- Prefer small composable modules.
- Add comments only where they help understanding.
- Avoid premature abstraction.
- Use typed interfaces and schemas where possible.
- Validate critical inputs.
- Keep warning and validation logic explicit and readable.
- Keep business truth in core services and validations.
- Preserve existing module boundaries unless there is a strong reason to refactor.
- Avoid unnecessary schema changes.
- Do not change Prisma schema unless the task explicitly requires it.

## Domain objects

Main objects currently relevant or historically expected in the system include:

- Employee
- Shift
- Assignment
- Absence
- DailySituation
- PlanningMonth
- PlanningDay
- PlanningShiftTemplate
- AvailabilityRequest

Older conceptual object names may still appear in earlier notes, such as:

- OrganizationUnit
- AvailabilityProfile
- QualificationProfile
- PlanningEvent
- StaffingRequirement
- PlanAssignment
- WarningSignal
- MonthlyReport

Prefer the objects and names that are actually present in the codebase. Do not reintroduce older conceptual names into implementation unless explicitly required.

## Leadership and explanation layer

CareFlow may produce leadership-facing summaries, context signals, and condensed views, but these must remain grounded in existing validations and backend facts.

Warnings and signals must be explainable. If the system shows a staffing or qualification risk, the reason must be visible.

Typical reasons may include:

- absence overlap
- staffing below required minimum
- missing required qualification
- unstable function coverage
- foreseeable shortage due to planned leave or request context

Do not introduce:

- speculative explanations
- fake prioritization
- advanced reasoning where only descriptive context exists
- recommendation logic unless explicitly requested

## Warning logic principles

Warnings must be explainable and operationally meaningful.

Keep warning logic:

- explicit
- readable
- domain-grounded
- traceable to data and validations

Do not let warning layers drift into hidden scoring or vague AI-style interpretation.

## Read-only discipline

The following layers are especially sensitive and must remain read-only unless explicitly changed by task:

- situation summary / history / trend / dashboard
- planning comparison
- leadership context derivation
- descriptive gap or signal layers

Do not let read-only comparison or summary layers mutate planning, assignments, validations, or other operational records.

## Testing rules

Testing is mandatory for domain-relevant behavior changes.

When changing any of the following, add or update tests:

- staffing coverage logic
- qualification logic
- daily function logic
- absence handling
- leadership view behavior
- situation read layer behavior
- planning comparison behavior
- context or signal derivation

Prefer integration tests when domain behavior emerges across modules.

Tests in CareFlow are not only technical checks. They are behavioral documentation of domain truth.

## UX principles

The UI should feel:

- calm
- simple
- readable
- managerial
- practical
- not overloaded

Do not design or implement UI behavior that feels noisy, decorative, or overly complex without explicit reason.

## Important functional priorities

Implement in this order unless told otherwise:

1. preserve domain truth
2. preserve core validations and read-only discipline
3. extend operational visibility
4. improve leadership usefulness
5. improve planning structure
6. improve reporting and export only where useful

If older planning notes show a different sequence, prefer the current repository reality and current product direction over outdated staged lists.

## Documentation discipline

Update documentation when the change affects project understanding.

Typical cases:

- new domain distinctions
- changed business behavior
- new endpoint families
- changed architectural rules
- new stable product capabilities
- newly introduced constraints or boundaries

Do not update README for every small refactor. Update it when project understanding would otherwise become misleading.

## Output expectations

When making major implementation steps:

- explain what was added
- explain which files were created or changed
- explain architectural decisions briefly
- explain relevant domain impact briefly
- suggest the next smallest logical step

## Development workflow

Use this default sequence for substantial changes:

1. Clarify the domain question.
2. Preserve or refine the relevant domain distinction.
3. Implement the smallest coherent change.
4. Add or adjust tests.
5. Verify behavior against domain intent.
6. Update documentation if project understanding changed.

## Code style and change strategy

- Follow the existing project structure.
- Keep names explicit and domain-oriented.
- Prefer readability over compression.
- Do not over-abstract too early.
- Avoid mixing unrelated concerns in one change.
- If a change reveals a domain ambiguity, make it explicit rather than hiding it.
- Prefer small, reviewable, traceable changes.

## Non-goals

Do not turn this MVP into a generic workforce platform.

Keep focus on nursing home planning, staffing visibility, qualification clarity, operational risk readability, and leadership decision support.

## When unsure

If the request is ambiguous, prefer preserving domain safety over adding clever behavior.

If there is tension between technical convenience and domain clarity, choose domain clarity.

If a requested change would weaken deterministic truth, traceability, read-only discipline, or leadership explainability, do not implement it casually.
