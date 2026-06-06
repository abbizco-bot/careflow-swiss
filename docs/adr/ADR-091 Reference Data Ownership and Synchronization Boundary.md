# ADR-091: Reference Data Ownership and Synchronization Boundary

**Status:** Proposed  
**Date:** 2026-05-16  
**Context:** CareFlow-Swiss  
**Decision Area:** Reference data, master data ownership, synchronization boundary, SaaS architecture

---

## Context

CareFlow-Swiss depends on employee, qualification, organizational, planning and absence-related data in order to provide reliable leadership views for care institutions.

These data normally originate in existing operational systems or processes, such as HR systems, duty planning systems, care administration tools, absence management solutions, Excel files, CSV exports or local institutional databases.

CareFlow must not become a duplicate HR system, payroll system, duty planning tool or ERP system. Its purpose is to provide a calm, explainable leadership layer based on selected operational and reference data.

If CareFlow were to become the primary owner of all master data, this would create double maintenance, support burden, conflicting data responsibilities and unnecessary implementation complexity.

At the same time, CareFlow needs a stable internal representation of relevant data in order to calculate leadership signals, staffing gaps, qualification warnings and planning risks reliably.

---

## Decision

CareFlow treats externally maintained master data as **reference data**, not as fully owned primary data.

The authoritative source for operational master data remains the respective external system or institutional process in which the data are originally maintained.

CareFlow may import, mirror, validate, map and interpret these data, but it does not become the primary source of truth for the full master data domain.

The guiding principle is:

```text
External systems own operational master data.
CareFlow owns the leadership interpretation of synchronized reference data.