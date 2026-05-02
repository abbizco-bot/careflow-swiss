# ADR-079: Communication and Visibility Model

Date: 2026-05-02  
Status: Accepted

## Context

CareFlow-Swiss is positioned as a leadership and decision layer for Swiss nursing homes and care institutions. It is not intended to become a generic chat system, messaging platform, ERP system, or classical duty planning application.

During the development of the rolling operational planning model, it became clear that communication is a central part of CareFlow. However, communication in CareFlow must not be understood primarily as free-form messaging between people. Instead, communication must be understood as a structured operational and leadership process.

Relevant communication events include:

- operational incidents,
- absence notices,
- availability signals,
- employee requests,
- leadership decisions,
- plan changes,
- approvals,
- plan publications,
- acknowledgements,
- escalations,
- management summaries.

CareFlow must ensure that the right information reaches the right role with the right level of detail. The system must avoid information overload and must protect confidential personal information.

## Decision

CareFlow adopts a structured communication and visibility model.

Communication in CareFlow is treated as a sequence of planning-relevant signals, decisions, approvals, publications, and confirmations. CareFlow does not aim to replace existing informal communication channels such as phone calls, team conversations, e-mail, or messaging apps.

Instead, CareFlow structures the communication that has operational planning relevance.

The core communication chain is:

1. An event, request, or change is submitted or imported.
2. CareFlow evaluates its operational relevance.
3. CareFlow shows the impact on staffing, coverage, qualification, and planning stability.
4. The responsible leadership role decides or approves.
5. The operational rolling plan is updated if necessary.
6. The relevant people are informed according to their role.
7. The communication and decision status is documented.

CareFlow therefore communicates through:

- operational signals,
- status changes,
- decision requirements,
- approvals,
- published plan versions,
- targeted notifications,
- acknowledgements,
- summaries.

## Role-Based Visibility

CareFlow information must be visible according to role and responsibility.

Typical visibility levels are:

- employees see their own plan, their own requests, their own confirmations, and selected team information;
- house-responsible staff or department leads see the operational situation of their own unit;
- nursing management sees cross-unit staffing and qualification risks;
- home management sees aggregated management-level summaries;
- HR and administration see personnel-relevant planning and absence information;
- quality management sees risk and audit-relevant documentation;
- external stakeholders or governing bodies see only aggregated, non-personal information.

The system must not expose sensitive information beyond what is required for the role.

## Consequences

This decision strengthens CareFlow's identity as a decision layer rather than a messaging system.

It implies that future communication features must be modeled as structured operational objects, not as unstructured chat conversations.

Possible future objects include:

- OperationalEvent,
- EmployeeRequest,
- LeadershipDecision,
- PlanPublication,
- Notification,
- Acknowledgement,
- Escalation,
- ManagementSummary.

This ADR does not require immediate implementation of all these objects. It defines the architectural direction for future communication-related features.

## Pilot Scope

For the first pilot, communication should remain simple.

The pilot should focus on:

- basic operational event visibility,
- employee requests as structured inputs,
- leadership review and approval,
- publication of relevant plan changes,
- simple notifications or status indicators,
- visibility of open decisions.

Advanced messaging, push notifications, mobile apps, chat-like interaction, and complex escalation chains are out of scope for the first pilot.

## Not Decided Yet

This ADR does not decide:

- whether notifications will be sent by e-mail, push message, SMS, or internal portal;
- whether employees will use a native app, PWA, or web portal;
- the final UI design of communication screens;
- detailed technical schemas for all future communication objects;
- integration with external communication platforms.