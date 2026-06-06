# ADR-092: Master Data Change Detection and Validity

**Status:** Proposed  
**Date:** 2026-05-16  
**Context:** CareFlow-Swiss  
**Decision Area:** Master data changes, validity, historical interpretation, import safety, leadership reliability

---

## Context

CareFlow leadership views depend on the correctness and stability of reference data.

In care institutions, master data change regularly. Employees enter or leave the organization. Qualifications change. Employment percentages are adjusted. Employees move between teams or residential units. Shift models are modified. Absence types are reclassified. Minimum staffing assumptions may be adapted.

If CareFlow simply overwrites existing reference data during every import, leadership views may become unstable or historically misleading.

For example, if an employee becomes qualified as of 1 July, CareFlow must not automatically treat the same employee as qualified in earlier historical periods.

Similarly, if an employee disappears from an import file, CareFlow must not automatically assume that the employee has left the organization. The missing record may result from an incomplete export, a changed filter, a changed identifier or a data preparation error.

CareFlow therefore needs a controlled approach to detecting, classifying and applying master data changes.

---

## Decision

CareFlow detects and classifies relevant reference data changes during import or synchronization processes.

Important changes must not be treated as simple overwrites. They must be evaluated according to their relevance for leadership interpretation.

CareFlow distinguishes at least three categories of changes:

```text
administrative_change
leadership_relevant_change
interpretation_critical_change