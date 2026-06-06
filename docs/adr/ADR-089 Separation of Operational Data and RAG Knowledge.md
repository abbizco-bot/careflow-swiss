# ADR-089: Separation of Operational Data and RAG Knowledge

## Status

Accepted

## Date

2026-05-16

## Context

CareFlow-Swiss operates with structured operational data. This includes planning data, staffing data, employee qualifications, assignments, absences, availability requests, reference plans, operational shifts, planning months, rolling planning windows, and leadership severity signals.

These data are not merely textual information. They represent operational states that require deterministic interpretation, strict validation, traceability, and auditability.

At the same time, CareFlow may later use Retrieval-Augmented Generation (RAG) to retrieve relevant documents and rules for explanation and contextualization. Such documents may include CareFlow ADRs, pilot documents, internal tenant rules, escalation processes, role definitions, qualification guidelines, product documentation, and curated leadership knowledge.

A key architectural risk is that future AI/RAG features could blur the boundary between structured operational truth and retrieved textual knowledge. For example, uploading shift plans into a vector database and asking an LLM whether a day is critical would be methodologically unsafe and difficult to validate.

CareFlow must avoid becoming a black-box AI system. Its credibility depends on clear separation between:

- structured operational data;
- deterministic validation logic;
- retrieved document context;
- AI-generated explanation;
- human decision-making.

## Decision

CareFlow shall maintain a strict architectural separation between operational data and RAG knowledge.

Operational staffing situations, warning levels, qualification gaps, coverage gaps, absence-driven risks, planning comparisons, and leadership severity states shall be calculated from structured data using deterministic CareFlow logic.

RAG shall not be used as the primary mechanism for determining operational truth.

RAG may only be used to retrieve relevant contextual knowledge, such as:

- CareFlow ADRs;
- product logic explanations;
- tenant-specific rules;
- escalation guidelines;
- role and function descriptions;
- qualification requirements;
- policy documents;
- leadership guidance;
- support and onboarding material.

The core architectural rule is:

> Operational truth is calculated.  
> Documentary context is retrieved.  
> Leadership explanation is generated.  
> Decisions remain human.

## Explicit Non-Goals

CareFlow shall not:

- store operational shift data primarily as vectorized text for criticality calculation;
- ask an LLM to infer staffing gaps directly from unstructured shift documents;
- allow RAG retrieval to override deterministic validation results;
- allow an LLM to invent missing operational data;
- treat retrieved documents as live operational state;
- use semantically retrieved text as a substitute for structured database queries;
- allow AI-generated explanations to modify assignments, shifts, absences, or planning records.

## Correct Use of Operational Data

Operational data shall remain in PostgreSQL and shall be accessed through controlled backend services and domain functions.

Examples of acceptable operational functions include:

- loading a leadership day situation;
- loading a rolling planning window;
- loading critical shifts in a date range;
- loading planning comparison data;
- loading validation findings;
- calculating coverage gaps;
- calculating qualification gaps;
- deriving leadership severity;
- identifying absence-driven risk signals.

Such functions may produce structured JSON context for explanation purposes.

Example:

```json
{
  "date": "2026-05-15",
  "shiftType": "early",
  "severity": "critical",
  "signals": [
    "coverage_gap",
    "qualification_gap",
    "absence_driven_gap"
  ],
  "effectiveCoverageGap": 1,
  "effectiveQualificationGap": 1,
  "primaryCause": "mixed"
}