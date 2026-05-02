# ADR-080: Employee Requests and Leadership Approval Workflow

Date: 2026-05-02  
Status: Accepted

## Context

Employees in nursing homes regularly need to communicate wishes, absences, availability changes, shift swap requests, training absences, holiday wishes, and other planning-relevant information.

CareFlow must support these inputs because they affect the operational rolling plan. At the same time, employees must not directly modify the operational plan without leadership review. In care institutions, staffing decisions have consequences for coverage, qualification requirements, fairness, workload distribution, compliance, and resident care.

The leadership role must therefore remain responsible for deciding whether a request becomes a plan change.

## Decision

CareFlow distinguishes between employee input and operational plan modification.

Employees may submit planning-relevant requests or signals, but they do not directly alter the operational rolling plan.

Employee inputs may include:

- holiday requests,
- absence wishes,
- planned training absences,
- shift swap requests,
- availability messages,
- willingness to take an additional shift,
- short-term unavailability,
- confirmations of received plan changes,
- comments on specific planning situations.

These inputs create structured requests or planning signals.

A request becomes operationally effective only after review, approval, rejection, or modification by the responsible leadership role.

## Request Lifecycle

CareFlow should support a basic request lifecycle.

A typical lifecycle is:

1. Submitted
2. In Review
3. Approved
4. Rejected
5. Modified
6. Applied to Plan
7. Published
8. Acknowledged, if confirmation is required

Not every request type needs all lifecycle states in the first implementation. However, the architecture should allow request states to be expanded later.

## Leadership Responsibility

Leadership remains responsible for:

- evaluating requests,
- considering team and department impact,
- checking staffing coverage,
- checking qualification requirements,
- deciding whether a request can be approved,
- documenting relevant decisions,
- approving or rejecting operational plan changes.

CareFlow supports this process by showing consequences and risks.

CareFlow does not replace human leadership decisions.

## Employee Transparency

Employees should be able to see the status of their own requests.

For example:

- submitted,
- under review,
- approved,
- rejected,
- modified,
- applied to plan.

Employees should also receive clear feedback when a request has been decided.

However, employees should not receive unnecessary or confidential information about other employees or internal leadership considerations.

## Consequences

This decision preserves the human-in-the-loop principle.

It prevents uncontrolled plan changes while still allowing employees to participate actively in planning communication.

It also creates a structured basis for later features such as:

- request dashboards,
- approval workflows,
- fairness analysis,
- holiday planning,
- availability pools,
- shift swap validation,
- audit logs,
- employee self-service.

## Pilot Scope

For the first pilot, employee requests should be implemented or demonstrated in a minimal form.

Recommended pilot request types are:

- absence request,
- availability message,
- shift change request,
- confirmation of a published plan change.

The first pilot does not need a full employee self-service portal, but the request logic should already be visible in the product concept and data architecture.

## Not Decided Yet

This ADR does not decide:

- the final list of employee request types;
- the detailed UI for employee request submission;
- whether employee access is provided through a mobile app, PWA, or web portal;
- the final notification mechanism;
- whether some request types may later be auto-approved under specific rules.