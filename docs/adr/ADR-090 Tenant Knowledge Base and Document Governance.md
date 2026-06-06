# ADR-090: Tenant Knowledge Base and Document Governance

## Status

Accepted

## Date

2026-05-16

## Context

CareFlow-Swiss may later support a RAG-based Evidence & Knowledge Layer. Such a layer may retrieve and use documents for explanation, contextualization, support, onboarding, and leadership-oriented reflection.

In a SaaS context, different nursing homes or organizations may use CareFlow as separate tenants. Each tenant may have its own internal rules, processes, role descriptions, qualification requirements, escalation paths, communication routines, and planning conventions.

This creates a governance challenge.

If CareFlow uses tenant-specific documents for AI-supported explanations, the system must ensure that:

- documents are tenant-bound;
- documents are authorized and approved;
- outdated documents are not silently used;
- confidential tenant information is protected;
- one tenant cannot access another tenant’s knowledge base;
- generated explanations do not rely on unapproved or obsolete documents;
- personal data is minimized;
- document provenance remains traceable.

Without clear document governance, a RAG-based layer could create trust, privacy, legal, and support risks.

## Decision

CareFlow shall treat tenant-specific RAG knowledge as a governed Tenant Knowledge Base.

Each tenant may have its own logically separated knowledge base containing approved documents and rules relevant to that tenant’s CareFlow usage.

Tenant-specific knowledge must be separated from:

- CareFlow Product Knowledge;
- general leadership knowledge;
- other tenants’ knowledge bases;
- raw operational data.

The Tenant Knowledge Base may contain:

- internal planning rules;
- staffing and qualification requirements;
- role and function descriptions;
- escalation procedures;
- absence management processes;
- communication routines;
- internal leadership guidelines;
- relevant policy documents;
- tenant-specific onboarding material;
- locally approved CareFlow usage notes.

The Tenant Knowledge Base shall not be treated as operational truth. It provides contextual and explanatory knowledge only.

## Document Governance Requirements

Every document or document chunk used in a Tenant Knowledge Base shall include sufficient metadata for controlled retrieval.

Required or strongly recommended metadata includes:

- `tenantId`;
- `documentId`;
- `documentType`;
- `title`;
- `version`;
- `language`;
- `source`;
- `sourcePage` or `sourceSection` where applicable;
- `validFrom`;
- `validTo`;
- `approved`;
- `approvedBy` where applicable;
- `approvedAt` where applicable;
- `confidentialityLevel`;
- `createdAt`;
- `updatedAt`;
- `tags`;
- `moduleReference` where applicable.

Example:

```json
{
  "tenantId": "pilot-home-a",
  "documentType": "staffing_rule",
  "title": "Minimum Staffing and Qualification Requirements",
  "version": "2026-05",
  "language": "de-CH",
  "source": "Internal tenant guideline",
  "sourceSection": "2.1",
  "validFrom": "2026-05-01",
  "validTo": null,
  "approved": true,
  "approvedBy": "tenant-admin",
  "approvedAt": "2026-05-10",
  "confidentialityLevel": "internal",
  "tags": [
    "early-shift",
    "qualification",
    "minimum-staffing"
  ],
  "moduleReference": "leadership-view"
}