# ADR-078 SaaS-Ready but Pilot-First Delivery Model

## Status

Accepted

## Context

CareFlow is positioned as a leadership and decision layer for nursing homes and care institutions.

The current MVP can be demonstrated locally and reproducibly.

The current MVP does not yet include:

- productive frontend
- deployment
- productive import module
- tenant management
- billing
- self-service onboarding

CareFlow should be developed so that a later SaaS model remains possible.

Market introduction should happen step by step:

1. MVP / Demonstrator
2. pilotiertes Fuehrungsinstrument
3. Managed-SaaS-Angebot
4. skalierbares SaaS-Produkt

## Decision

CareFlow will be built SaaS-ready.

CareFlow will not initially be sold or operated as a finished self-service SaaS product.

CareFlow will first be introduced as a piloted leadership instrument with a small number of pilot institutions.

Future SaaS capability should be architecturally prepared, but not fully implemented too early.

## Delivery Phases

### Phase 1: MVP / Demonstrator

Characteristics:

- local or controlled demo
- reproducible demo data
- Leadership Day View
- Planning Comparison
- Decision-Layer story
- no productive tenancy
- no billing
- no self-service onboarding

### Phase 2: Piloted Leadership Instrument

Characteristics:

- use with 2 to 4 pilot institutions
- close domain support
- learning from real leadership situations
- controlled data flows
- no broad SaaS marketing as a finished product

### Phase 3: Managed SaaS

Characteristics:

- supported multi-tenant offer
- technical operational capability
- controlled onboarding
- support and operations concept
- not yet fully scaled self-service

### Phase 4: Scalable SaaS

Only after:

- validated product logic
- clear tenancy model
- stable data integration
- robust support model
- possible self-service onboarding
- possible billing
- more automated operations

## Technical Consequences Now

Useful now:

- clear backend/API structure
- clean separation between core logic and demo/pilot data
- no hard coupling to a single institution
- keeping later tenancy in mind
- clean environment configuration
- reproducible demo/seed data
- clear governance documentation
- frontend built so that a later SaaS UI remains possible

Not useful yet:

- full multi-tenant implementation
- productive billing
- self-service onboarding
- complex roles and permissions model
- public SaaS deployment
- automatic tenant provisioning
- scaling optimization
- productive import platform for many third-party systems

## Pilot-First Boundary

The first real deployments should be understood as pilot deployments, not as a fully scalable SaaS product.

Pilot deployment means:

- consciously limited user group
- close support
- controlled data quality
- feedback loops
- domain validation
- technical stabilization

Pilot deployment does not mean:

- finished mass product
- unattended self-service onboarding
- fully automated operations
- broad SaaS marketing

## Relationship to the MVP

The current MVP demonstrates the Decision-Layer story.

The MVP does not need:

- productive import
- tenancy
- billing
- productive deployment
- ReferencePlan freeze
- Rolling Snapshot
- DecisionOption engine
- PeriodClosing
- self-service administration

The MVP should show:

- operative situation
- Coverage/Qualification Gaps
- PrimaryGapCause
- Severity
- Planning Comparison
- leadership visibility instead of staff scheduling

## Relationship to Later SaaS Capability

SaaS capability remains a target model.

Later relevant topics include:

- tenant/institution model
- data isolation
- authentication and roles
- hosting/deployment concept
- monitoring and backups
- data protection and data processing agreements
- import/integration strategy
- support and operations model
- pricing/billing later

These topics are not fully implemented now.

## Risks

Key risks:

- SaaS capability is confused with immediate SaaS sales.
- MVP is confused with finished product.
- Too early multi-tenant implementation slows the MVP.
- Too early self-service onboarding creates support and quality risks.
- Pilot institutions expect full SaaS maturity if positioning is unclear.
- Technical architecture is built too locally and blocks later SaaS capability.
- Too much SaaS infrastructure is built before product logic is validated.

## Consequences

ADR-078 is strategy and architecture governance, not implementation.

The next technical step remains the MVP frontend prototype.

No immediate multi-tenant model.

No billing.

No self-service onboarding.

No productive SaaS deployment.

Later SaaS readiness will be prepared deliberately.

Pilot strategy should also be described in a governance document.
