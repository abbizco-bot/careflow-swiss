# ADR-094: Controlled Import before Automated Integration

**Status:** Proposed  
**Date:** 2026-05-16  
**Context:** CareFlow-Swiss  
**Decision Area:** Import strategy, synchronization risk, early SaaS architecture, support reduction, integration maturity

---

## Context

CareFlow-Swiss may eventually need to receive data from external systems such as HR tools, duty planning software, care administration systems, absence management solutions or institutional data exports.

A fully automated integration architecture with APIs, scheduled jobs, event streams, webhooks and bidirectional synchronization could become complex, expensive and support-intensive.

For a small early-stage SaaS product, premature integration complexity would create significant risks:

```text
high development effort
individual customer-specific integrations
unclear responsibility for data errors
dependency on third-party system availability
difficult troubleshooting
higher support burden
data drift between systems
increased security and compliance complexity