# CareFlow v0.1 Cockpit and Absence Plan

## Leadership Logic
- CareFlow is a leadership cockpit, not a raw data dump.
- The core backend language is `situation -> priority -> reason`.
- Technical status values remain `critical`, `warning`, `ok`.
- Later UI wording can map these to `kritisch`, `auffaellig`, `stabil`.
- `issues[]` are the technical carriers for risk hints shown to leadership.

## Existing Cockpit Endpoints
- `GET /validations/shifts/overview?date=...`
- Meaning: daily supply situation, focused on shifts and coverage risks.
- `GET /validations/employees/overview?date=...`
- Meaning: daily people situation, focused on employee assignment conflicts.

## Detail API Target Picture
### Shift Detail
- Target status for one shift on one day
- Situation description for leadership
- Required vs assigned staffing
- Required vs assigned qualification coverage
- Risk hints with explainable reasons
- Concrete assignment list

### Employee Detail
- Target status for one employee on one day
- Situation description for leadership
- Assignments of the day
- Conflict and risk hints
- Assignment structure for that day

## Technical Readiness Check
- Existing `Shift`, `Assignment`, `Employee`, overview services and validation services already cover the main read model needed for later shift and employee detail endpoints.
- The current repository structure is sufficient for a first detail implementation with focused read queries and orchestration services.
- No broad schema refactor is required before detail endpoints, as long as the scope stays on operational planning and explainable validation.

## Absence as a Separate Truth Layer
- Absences must be modeled as an operational reality layer, not merged into assignments.
- Planned assignments stay historically visible even when someone becomes unavailable.
- Operational availability can override planning truth, but must not delete or rewrite planning truth.
- Administrative hints must stay separate from shift validation and employee conflict validation.

## Minimal Absence Model for v0.1
- `id`
- `employeeId`
- `type`
- Example first value: `sick`
- `startDate`
- `endDate` optional for open absences
- `status`
- Example first values: `active`, `closed`
- `createdAt`
- `note` optional

## Binding Architecture Rule
- Assignments are planning truth.
- Absences are operational reality truth.
- Administrative hints are a third signal layer.
- These three layers must not be collapsed into one object or one status.

## Employee Category and Policy Separation
- `role` is currently a legacy/display/import field and remains for compatibility.
- `baseQualification` is the fachlich massgebliche field for the stable employee qualification.
- `assignedFunction` is the fachlich massgebliche field for the operational shift/day function on an assignment.
- `qualified` and `qualificationLevel` remain for compatibility with existing validation and import logic.
- A later migration from `qualified` / `qualificationLevel` to `baseQualification` must be decided separately.
- A future `staffCategory` should hold policy-relevant grouping.
- Example `staffCategory` values:
- `regular`
- `apprentice`
- `intern`
- This category must not be overloaded into `role`.

## Minimal Absence Policy Target Model
- `staffCategory`
- `medicalCertificateAfterDays`

### Example shape
```ts
type AbsencePolicy = {
  staffCategory: "regular" | "apprentice" | "intern";
  medicalCertificateAfterDays: number;
};
```

## Dynamic Medical Certificate Principle
- Certificate due logic must be based on running absence duration, not only on initially known total duration.
- If `endDate` is open, absence duration grows day by day.
- Due state must be calculated from:
- `startDate`
- current date
- `staffCategory`
- policy threshold

## Minimal Administrative Signal Target
- `not_required_yet`
- `due`
- `received`

## Explicit Non-Goals for This Stage
- No automatic replacement planning
- No automatic assignment deletion
- No HR document workflow
- No automatic recommendations engine
- No complex reminder system

## Cockpit Impact Target Picture
- Shift overview reacts through operational supply impact.
- Employee overview reacts through assignment and conflict impact.
- Daily cockpit situation reacts through the combined effect of shift and employee changes.
- Administrative signals such as medical certificate due stay visible, but separate from core operational validation.

## Recommended Next Small Technical Step
- Introduce the Prisma schema for `Absence` and a minimal read/write module without downstream cockpit effects yet.
- Keep the first implementation narrow: create absence, list active absences, and calculate a basic administrative signal from `staffCategory` policy.
