# ADR-088: CareFlow Evidence & Knowledge Layer

## Status

Accepted

## Date

2026-05-16

## Context

CareFlow-Swiss is designed as a leadership and decision-support layer for Swiss nursing homes. Its core purpose is not to replace existing planning systems, not to automate leadership decisions, and not to act as a generic communication or chat system. CareFlow interprets existing operational data, validates situations, highlights deviations and risks, and supports leadership awareness through calm, structured views.

The current system already distinguishes between operational planning data, validation logic, leadership interpretation, and human decision-making. Existing modules such as the Leadership View, Rolling Planning View, Planning Comparison, Full Validation, gap interpretation, and severity semantics provide structured signals about operational staffing situations.

Future development may include AI-supported explanation, narrative summarization, scenario description, and leadership reflection. Retrieval-Augmented Generation (RAG) is a possible technology for connecting operational CareFlow signals with documented rules, CareFlow ADRs, internal guidelines, tenant-specific documents, and leadership knowledge.

However, CareFlow must not become an uncontrolled AI chatbot or a system that produces unsupported claims. Any AI-supported layer must remain grounded in CareFlow’s epistemic design logic: observable data, explicit rules, documented evidence, marked uncertainty, and human decision authority.

Therefore, a dedicated architectural concept is required: the CareFlow Evidence & Knowledge Layer.

## Decision

CareFlow may introduce a future Evidence & Knowledge Layer that connects operational CareFlow signals with documented rules, product knowledge, tenant-specific organizational knowledge, and leadership-oriented explanatory material.

This layer is defined as a controlled knowledge and explanation layer, not as an autonomous decision-making layer.

The Evidence & Knowledge Layer may support:

- explanation of warning levels and leadership severity states;
- contextualization of operational risks;
- retrieval of relevant CareFlow ADRs, rules, guidelines, and tenant documents;
- generation of leadership-oriented situation summaries;
- formulation of possible options for human review;
- support for product documentation, onboarding, and pilot communication;
- transparent evidence trails for AI-supported explanations.

The Evidence & Knowledge Layer must not:

- replace deterministic CareFlow validation logic;
- decide operational measures;
- automatically change plans, assignments, or employee data;
- evaluate individual employees in a performance-judgmental way;
- issue binding instructions to leadership or staff;
- generate unsupported claims beyond the provided data and retrieved documents;
- obscure whether a statement is based on data, rule, interpretation, or assumption.

The architectural principle is:

> Operational data shows the situation.  
> Rules and documents explain the context.  
> RAG retrieves relevant knowledge.  
> AI formulates understandable leadership interpretation.  
> Human leadership decides.

## Architectural Position

The CareFlow Evidence & Knowledge Layer sits above the existing operational and validation layers.

It depends on:

- PostgreSQL / Prisma operational data;
- CareFlow validation logic;
- Leadership View and Rolling Planning outputs;
- Planning Comparison outputs;
- documented CareFlow product logic;
- approved tenant-specific knowledge sources;
- future knowledge retrieval services.

It may provide input to:

- leadership explanations;
- weekly or daily leadership reports;
- warning-level explanations;
- demo narratives;
- support assistants;
- onboarding material;
- later scenario explanation modules.

It must remain clearly separated from the core calculation and validation logic.

## Conceptual Layers

CareFlow shall distinguish at least four layers:

### 1. Operational Data Layer

This includes structured CareFlow data such as employees, shifts, assignments, absences, qualifications, planning months, planning days, reference plans, rolling planning windows, availability requests, and validation findings.

This layer remains the primary source of operational truth.

### 2. Validation and Rule Layer

This includes deterministic CareFlow logic that calculates staffing gaps, qualification gaps, severity levels, warning states, primary causes, and leadership-relevant signals.

This layer must remain testable, explainable, and independent of generative AI.

### 3. Evidence & Knowledge Layer

This includes documented CareFlow knowledge, ADRs, product principles, tenant-specific rules, organizational documents, escalation guidelines, role definitions, and later curated leadership knowledge.

This layer may use RAG to retrieve relevant knowledge chunks, but only from approved and authorized sources.

### 4. AI Rendering and Explanation Layer

This layer may use a language model to formulate explanations, summaries, and leadership notes based on controlled input from the previous layers.

The language model is not a decision authority. It is a rendering, explanation, and reflection assistant.

## Output Principles

AI-supported outputs from the Evidence & Knowledge Layer must follow these principles:

- distinguish observation, interpretation, option, and decision;
- avoid unsupported certainty;
- mark relevant uncertainty;
- refer to retrieved rules or sources where applicable;
- avoid unnecessary personal data;
- use calm leadership-oriented language;
- avoid alarmist or accusatory wording;
- never present options as automatic decisions;
- maintain human-in-the-loop decision authority.

A preferred output structure is:

1. Situation observed  
2. Relevant signals  
3. Relevant rule or document context  
4. Leadership meaning  
5. Possible options to review  
6. Decision boundary

Example:

> The Friday early shift is currently marked as critical because a coverage gap and a qualification gap coincide. The retrieved staffing rule requires at least one qualified function in this shift. CareFlow therefore highlights the situation for leadership review. Possible options include checking qualified replacement capacity, reviewing internal shift adjustments, or escalating the situation according to the local escalation process. CareFlow does not automatically change the plan.

## Consequences

### Positive Consequences

The Evidence & Knowledge Layer strengthens CareFlow’s differentiation as a leadership-oriented system rather than a generic planning tool.

It supports explainability, trust, and auditability.

It allows CareFlow to connect operational signals with documented reasoning.

It enables future AI-supported features without compromising deterministic validation logic.

It creates a foundation for organization-specific explanations in pilot homes and later SaaS tenants.

It supports CareFlow’s broader epistemic orientation: making situations visible without replacing human judgment.

### Negative Consequences / Risks

The architecture introduces additional complexity.

Document ingestion, metadata, retrieval, versioning, and access control will require careful implementation.

Poor governance could lead to outdated or inappropriate knowledge being used.

AI-generated explanations may create false confidence if not properly constrained.

Tenant-specific knowledge introduces privacy, confidentiality, and support obligations.

### Mitigations

Implementation shall be staged.

The first stage may focus on CareFlow’s own product knowledge, ADRs, roadmap, and pilot documents.

Tenant-specific knowledge bases shall only be introduced after governance, access control, and document versioning are defined.

Operational data and RAG knowledge shall remain separated, as specified in ADR-089.

Tenant document governance shall be handled separately, as specified in ADR-090.

## Implementation Notes

This ADR does not mandate immediate implementation.

Possible future technical components include:

- knowledge document tables;
- knowledge chunk tables;
- embeddings;
- metadata filters;
- retrieval API;
- context builder;
- leadership explanation endpoint;
- source-aware response generation;
- guardrails for generated output.

For an initial prototype, PostgreSQL with `pgvector` is a plausible option because CareFlow already uses PostgreSQL. A specialized vector database such as Qdrant may be evaluated later if scale, performance, or retrieval complexity requires it.

No concrete vector database, embedding model, or LLM provider is decided by this ADR.

## Related ADRs

- ADR-084: Analytical Module Boundary and Leadership Surface Principle
- ADR-085: Communication and Interaction Module Boundary
- ADR-086: Multilingual Rendering and Swiss Localization
- ADR-087: Fairness and Workload Distribution Signals
- ADR-089: Separation of Operational Data and RAG Knowledge
- ADR-090: Tenant Knowledge Base and Document Governance