# ADR-086: Multilingual Rendering and Swiss Localization

## Status

Accepted

## Date

2026-05-04

## Context

CareFlow-Swiss is initially developed for Swiss elderly care and nursing homes.

The first pilot-facing version will most likely use German, especially Swiss German-oriented terminology in written standard German.

However, Switzerland is multilingual. A future professional Swiss product should be able to support at least:

- de-CH
- fr-CH
- it-CH

English may also become relevant for:

- technical documentation;
- investors;
- partners;
- international expansion;
- internal product and architecture documentation.

CareFlow therefore needs an architecture that can support multilingual user-facing output in the future.

The important architectural question is not whether all languages are implemented immediately. The important question is whether analytical meaning is separated from linguistic rendering.

If backend services return fixed German wording as business meaning, later multilingual support becomes expensive and error-prone.

CareFlow must avoid hard-coding user-facing German leadership wording into backend logic wherever possible.

## Decision

CareFlow shall separate analytical meaning from linguistic rendering.

Backend services shall expose stable codes, enums, message keys and parameters.

User-facing wording shall be rendered through locale-specific frontend or rendering layers.

The central principle is:

Analytical meaning is language-neutral. User-facing text is locale-specific.

Examples of language-neutral backend values include:

- stable;
- tense;
- critical;
- coverage_gap;
- qualification_gap;
- absence;
- request_context;
- operational;
- mixed;
- early;
- late;
- night;
- published;
- approved;
- rejected.

Examples of future message keys include:

- leadership.situation.stable
- leadership.situation.tense
- leadership.situation.critical
- leadership.signal.coverage_gap
- leadership.signal.qualification_gap
- leadership.context.absence_affects_situation
- leadership.detail.affected_shifts
- planning.publication.published
- request.status.approved
- request.status.rejected

## Localization Scope

CareFlow shall prepare for the following locales:

- de-CH
- fr-CH
- it-CH
- en

The primary pilot locale is de-CH.

Full translation into fr-CH, it-CH and en is not required for Phase 10.

However, Phase 10 implementation should avoid decisions that would make later localization difficult.

## Swiss Localization

CareFlow shall not treat localization as simple generic translation.

The Swiss context matters.

Examples of terms requiring careful localization include:

- Alters- und Pflegeheim;
- Heimleitung;
- Pflegedienstleitung;
- Mitarbeitende;
- Einsatzplan;
- Rollplan;
- Referenzplan;
- operativer Stand;
- Führungsaufmerksamkeit;
- Unterdeckung;
- Qualifikationslücke;
- Lage stabil;
- Lage angespannt;
- Lage kritisch;
- fragil;
- resilient;
- veröffentlicht;
- freigegeben.

Equivalent terminology in fr-CH and it-CH must be carefully selected and validated in the care-sector context.

## Consequences

Backend logic shall not rely on German text comparison.

New API fields should use English technical names.

New enum values should use stable English or language-neutral codes.

New user-facing messages should be introduced as message keys and parameters wherever practical.

Frontend UI text should be centralised in translation or terminology files where practical.

A future frontend may contain locale files such as:

- de-CH.json
- fr-CH.json
- it-CH.json
- en.json

The backend may still return temporary rendered strings during early development, but these should be treated as transitional and not as long-term business meaning.

## Acceptable Temporary Exceptions

German text may still appear in:

- documentation;
- ADRs;
- comments;
- test descriptions;
- demo data;
- local sample output;
- temporary prototype UI text.

German text is more problematic when it becomes part of stable API output intended for frontend rendering.

## Non-Goals

This ADR does not require immediate full internationalization.

This ADR does not require Phase 10 to support fr-CH, it-CH or en.

This ADR does not require immediate refactoring of all existing German text literals.

This ADR does not define final translation terminology for all supported locales.

This ADR does not introduce AI-generated translation as a default mechanism.

## Phase 10 Guidance

Phase 10 may use de-CH as the only visible UI language.

However:

- New backend fields should remain language-neutral.
- New backend logic should not depend on German wording.
- New frontend texts should be grouped and structured where possible.
- New UI texts should be written in calm, professional Swiss leadership language.
- The architecture should remain compatible with later localization.

## Future Terminology Governance

A future terminology package should define approved terms for each supported locale.

Possible terminology packages:

- CAREFLOW_TERMS_DE_CH
- CAREFLOW_TERMS_FR_CH
- CAREFLOW_TERMS_IT_CH
- CAREFLOW_TERMS_EN

These packages should define terms for severity, planning states, requests, publication, leadership attention, fairness, workload and operational signals.

## Relationship to Other ADRs

This ADR is related to:

- ADR-084 Analytical Module Boundary and Leadership Surface Principle
- ADR-085 Communication and Interaction Module Boundary
- ADR-087 Fairness and Workload Distribution Signals

It also supports future product expansion beyond German-speaking pilot settings.

## Summary

CareFlow shall be built in a way that allows future multilingual rendering.

The guiding phrase is:

CareFlow separates meaning from wording.

Backend equals analytical meaning.

Frontend or rendering layer equals language-specific expression.