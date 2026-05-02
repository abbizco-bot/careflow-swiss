# ADR-081: Rolling Plan Publication and Version Visibility

Date: 2026-05-02  
Status: Accepted

## Context

CareFlow distinguishes between a reference plan and an operational rolling plan.

The reference plan represents the original planning intention, usually based on a monthly plan imported from an existing planning system, Excel file, or CSV source.

The operational rolling plan represents the current operational reality and is updated as incidents, absences, requests, availability changes, and leadership decisions occur.

Because the rolling plan can change frequently, it must not become confusing for employees. Employees need to know which plan version is binding and which changes are merely internal drafts or leadership simulations.

Without publication and version visibility, CareFlow could create uncertainty instead of clarity.

## Decision

CareFlow treats the operational rolling plan as a versioned and publishable planning object.

Internal plan states may exist for leadership review, operational adjustment, or scenario evaluation. However, employees should only see plan information that has been approved and published for their role.

The system distinguishes between internal planning states and externally visible plan states.

## Plan States

CareFlow should support a clear plan status model.

Possible states are:

- Draft
- In Review
- Approved
- Published
- Superseded
- Archived

The exact naming may be adapted in the UI language.

German UI terms may include:

- Entwurf
- in Prüfung
- freigegeben
- veröffentlicht
- ersetzt
- archiviert

## Visibility Principle

The visibility principle is:

Leadership may see drafts, risks, unresolved conflicts, open decisions, and unpublished changes.

Employees see only:

- their own published plan,
- approved changes affecting them,
- relevant team plan information according to role permissions,
- requests and confirmations related to their own planning situation.

Unpublished internal drafts are not visible to employees.

## Published Plan Version

A published rolling plan version represents the currently valid operational view for a defined time window.

The published version should include:

- effective shifts,
- relevant plan changes,
- affected employees,
- publication timestamp,
- responsible approving role,
- previous version reference, if applicable,
- confirmation requirement, if applicable.

## Acknowledgement

For certain changes, CareFlow may require acknowledgement.

For example:

- an employee confirms a changed shift;
- a department lead confirms that a published adjustment has been seen;
- leadership confirms that a critical change has been communicated.

Acknowledgement does not necessarily mean approval by the employee. It can also mean that the information has been received.

## Consequences

This decision makes the rolling plan reliable and understandable.

It avoids confusion between internal planning work and published operational reality.

It creates the foundation for:

- plan version history,
- auditability,
- employee confirmations,
- publication workflows,
- communication status,
- leadership accountability,
- comparison between reference plan and operational plan.

## Pilot Scope

For the first pilot, the plan version model can be simple.

A minimal pilot implementation may include:

- one current operational rolling plan,
- a published/not-published distinction,
- visibility of approved changes,
- simple status indicators,
- basic history or log entries.

Full version history, detailed plan diffing, and advanced publication workflows can be introduced later.

## Not Decided Yet

This ADR does not decide:

- the final database schema for plan versions;
- the exact UI design of plan publication;
- whether employees must acknowledge every plan change;
- how long old plan versions are retained;
- whether plan publication is global, department-specific, or role-specific in the first implementation.