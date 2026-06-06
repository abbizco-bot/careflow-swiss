# ADR-106 – AI-Supported Situation Report Generation

**Status:** Proposed
**Date:** 2026-06-06
**Project:** CareFlow-Swiss
**Decision Area:** AI-supported reporting, narrative situation reports, leadership communication, epistemic boundaries
**Related ADRs:** ADR-079, ADR-080, ADR-081, ADR-088, ADR-097, ADR-098, ADR-100, ADR-101, ADR-102, ADR-103, ADR-104, ADR-105

---

## Context

CareFlow-Swiss is designed as a leadership support system for care organisations. It makes operational situations, staffing pressure, qualification coverage, deviations, interventions, simulation results, sensitivity patterns and quality-relevant signals visible.

ADR-105 defines statistical leadership reporting as the descriptive foundation for future reports. Statistics may show recurring patterns, pressure accumulation, support needs and repeated sensitivity signals. However, statistical indicators alone are not always sufficient for leadership communication. Leaders need concise, understandable and role-appropriate situation reports.

Generative AI can support this by translating structured data and statistical observations into readable leadership language.

However, AI-supported reporting introduces significant risks. If not properly bounded, AI may overinterpret data, generate unsupported claims, sound more certain than the underlying evidence allows, create blame-oriented language, imply quality judgements or present assumptions as facts.

CareFlow therefore needs a clear decision on how AI may be used for situation report generation.

---

## Decision

CareFlow-Swiss will use AI only as a **support layer for situation report generation**.

AI may generate, reformulate or summarise leadership reports based on structured CareFlow data, statistical observations, simulation outputs, sensitivity results and, later, RAG-provided organisational context.

AI must not create new operational facts.
AI must not make autonomous decisions.
AI must not assign blame.
AI must not produce automatic quality judgements.
AI must not override the statistical or rule-based basis of the report.
AI must not present assumptions as confirmed facts.

The primary role of AI is:

**to translate structured leadership signals into clear, cautious and reviewable situation language.**

---

## Rationale

CareFlow’s leadership value depends not only on showing indicators, but also on making them understandable.

A dashboard may show that a shift is tense, that qualification coverage is reduced, that a sensitivity factor is high or that a deviation pattern repeats. But leadership often needs a short explanatory text:

What is visible?
Why is it relevant?
Which dimension is affected?
What should be reviewed?
Where does human judgement remain necessary?

AI can help generate such summaries quickly and consistently.

At the same time, care organisations operate in a sensitive environment. Staffing, quality, resident care, workload, leadership responsibility and team trust are not neutral data topics. Language matters. A poorly phrased AI-generated report could undermine trust, create unnecessary alarm or imply responsibility where no conclusion is justified.

Therefore, AI-supported reports must be epistemically cautious, source-bound and leadership-oriented.

---

## Definition

In CareFlow-Swiss, AI-supported situation report generation means the controlled use of generative AI to create narrative summaries from already available and structured information.

The AI may work with:

* current operational status,
* staffing and qualification signals,
* deviation patterns,
* intervention states,
* statistical reporting outputs,
* simulation results,
* sensitivity analysis results,
* predefined explanation templates,
* approved terminology,
* later: RAG-provided organisational context.

AI-supported reporting does not mean autonomous analysis without data grounding.

It means language generation based on structured, traceable inputs.

---

## Permitted AI Functions

AI may be used for the following functions.

### 1. Narrative Summarisation

AI may summarise structured status information into concise leadership language.

Example:

“Wohnbereich A shows a tense situation in the late shift. The main visible factors are reduced qualification coverage and limited reserve capacity. The situation should be reviewed before the shift is finalised.”

---

### 2. Role-Specific Report Adaptation

AI may adapt the same underlying situation to different leadership levels.

For Level 1, the report may be operational and immediate.

For Level 2, the report may be aggregated and support-oriented.

For Level 3, the report may be pattern-oriented and linked to organisational learning or quality review.

The underlying facts must remain the same. Only the framing and level of aggregation may change.

---

### 3. Explanation of Simulation and Sensitivity Results

AI may explain why a simulated or sensitivity-based situation changed from stable to tense or critical.

Example:

“The simulation indicates that the late shift becomes critical when staff absence coincides with reduced key qualification coverage. This suggests that the shift is particularly sensitive to qualification loss.”

---

### 4. Review Path Formulation

AI may formulate possible review paths based on predefined intervention logic.

Examples:

* check reserve capacity,
* review qualification coverage,
* consider cross-unit support,
* clarify communication need,
* review documentation load,
* escalate for leadership attention.

These must be framed as review paths, not instructions.

---

### 5. Plain-Language Translation

AI may translate technical or structured indicators into plain leadership language.

Example:

Instead of:

“Qualification coverage threshold violated.”

AI may write:

“The required qualification coverage is no longer fully secured under the selected scenario.”

---

### 6. Report Drafting for Human Review

AI may draft reports that a responsible user can review, edit, approve or reject.

AI-generated reports must be treated as drafts unless explicitly reviewed and accepted by a human user.

---

## Prohibited AI Functions

AI must not be used for the following purposes.

### 1. Creating Unsupported Facts

AI must not invent data, incidents, staffing details, resident-related details or organisational context.

If a fact is not present in the structured input or retrieved source context, it must not appear as fact in the report.

---

### 2. Making Autonomous Decisions

AI must not decide:

* who should be scheduled,
* which intervention must be implemented,
* whether a unit is failing,
* whether quality is insufficient,
* whether leadership action is mandatory,
* whether an employee or team is responsible.

AI may identify review needs. It may not decide outcomes.

---

### 3. Producing Automatic Quality Judgements

AI must not write statements such as:

“The quality of care is poor.”

“The unit does not meet quality standards.”

“The leadership is insufficient.”

Acceptable wording is:

“This is a quality-relevant signal and should be reviewed.”

---

### 4. Assigning Blame

AI must not attribute responsibility or blame to individual employees, teams or leaders.

It may describe a situation or pattern. It must not moralise or personalise it.

---

### 5. Overstating Certainty

AI must not present scenario results, sensitivity outputs or statistical patterns as certain future outcomes.

It must avoid language such as:

“This will happen.”

“The cause is definitely …”

“The unit will become unsafe.”

Preferred wording includes:

“The data indicate …”

“This may suggest …”

“The situation should be reviewed …”

“Under the selected assumptions …”

---

### 6. Replacing Human Review

AI-generated reports must not bypass human judgement in contexts where leadership, quality management or operational responsibility is involved.

---

## Epistemic Marking

AI-supported reports must distinguish between different types of statements.

A report should, where appropriate, mark or clearly separate:

* observation,
* statistical pattern,
* simulation result,
* sensitivity result,
* assumption,
* interpretation,
* review path,
* human decision requirement.

Example:

**Observation:** The late shift is currently marked as tense.
**Pattern:** Similar late-shift pressure occurred repeatedly in the rolling period.
**Interpretation:** This may indicate reduced resilience in this shift pattern.
**Review path:** Check qualification coverage and reserve options.
**Boundary:** This is not an automatic quality assessment.

This epistemic marking is central to CareFlow’s credibility.

---

## Leadership-Level Adaptation

AI-supported reports must respect the Three-Level Leadership View Model.

### Level 1 – Operational Home and Residential Unit Leadership

Reports may be concrete, immediate and action-oriented.

They may include:

* current shift status,
* affected staffing or qualification dimension,
* immediate review needs,
* suggested intervention review paths.

The tone should support operational clarity.

---

### Level 2 – Area and Overall Leadership

Reports must be aggregated and support-oriented.

They may include:

* comparison of units or homes,
* prioritised support needs,
* recurring pressure signals,
* units requiring leadership attention.

The tone must avoid micromanagement and must not expose unnecessary operational detail.

---

### Level 3 – Strategy, Quality Management and Organisational Development

Reports must be pattern-oriented and learning-oriented.

They may include:

* recurring structural vulnerabilities,
* qualification planning issues,
* repeated sensitivity patterns,
* QM-relevant review points,
* organisational resilience themes.

The tone must avoid automatic quality scoring.

---

## Source Grounding

AI-generated reports must be grounded in defined inputs.

Potential inputs include:

* structured operational data,
* statistical report outputs,
* simulation results,
* sensitivity analysis outputs,
* predefined CareFlow rules,
* approved terminology,
* later: RAG-retrieved organisational documents.

The report should be able to indicate its basis.

Example:

“Based on the rolling 28-day view and the current simulation scenario …”

or:

“Based on the selected sensitivity factor and current demo rules …”

If the data basis is limited, the report must not hide this limitation.

---

## Human Review and Approval

AI-generated reports should be treated as draft outputs.

Before such reports are exported, shared or used as formal leadership documents, they should be reviewable by an authorised human user.

Human review may include:

* checking factual correctness,
* editing language,
* removing unsupported interpretation,
* adding local context,
* approving the report,
* rejecting the report.

In sensitive areas such as quality management, staffing conflicts, resident-related incidents or formal escalation, human review is mandatory.

---

## Wording Principles

AI-supported reports should use careful leadership language.

Preferred terms include:

* visible signal,
* leadership attention,
* review point,
* support need,
* qualification coverage,
* pressure pattern,
* possible structural issue,
* under the selected assumptions,
* should be reviewed,
* may indicate.

Terms to avoid include:

* failure,
* blame,
* poor quality,
* unsafe without qualification,
* responsible person,
* non-compliant unless formally established,
* must act unless rule-based and authorised,
* prediction.

The language should remain factual, careful and supportive.

---

## Relationship to Statistical Reporting

AI does not replace statistical reporting.

Statistical reporting provides the structured basis. AI generates a readable narrative based on that basis.

A CareFlow report should therefore preserve the distinction between:

* statistical observation,
* AI-generated wording,
* human interpretation,
* leadership decision.

AI may not alter statistical findings to make them sound stronger, clearer or more dramatic.

---

## Relationship to RAG

RAG will be defined in a separate ADR.

AI-supported report generation may later use RAG-provided organisational context. For example, a report may refer to an internal escalation guideline or quality management procedure retrieved from a controlled knowledge base.

However, RAG context must remain traceable and source-bound.

AI may not cite or invoke organisational rules unless they have been retrieved from approved and versioned sources.

---

## Demo Implications

In the demo, AI-supported reporting should be presented carefully.

The demo may show an example of an AI-drafted situation report, but it should be labelled as:

**Draft leadership summary**

or in German:

**Entwurf Führungsbericht**

The demo should include a boundary note such as:

“This text is generated from structured demo data. It is a leadership support draft, not an automatic decision or quality assessment.”

A good demo example would be:

“Wohnbereich A shows a tense situation in the late shift. The main visible factors are reduced qualification coverage and limited reserve capacity. The situation should be reviewed by the responsible leadership. This report is based on the current demo scenario and does not replace professional judgement.”

---

## Non-Goals

This ADR does not define RAG source management.

This ADR does not define the full AI architecture.

This ADR does not define model selection.

This ADR does not define prompt templates in detail.

This ADR does not introduce autonomous decision-making.

This ADR does not introduce automatic quality assessment.

This ADR does not allow AI-generated employee performance evaluation.

This ADR does not replace human leadership, quality management or professional care judgement.

---

## Design Boundaries

The following boundaries are binding.

AI-generated reports must be grounded in structured inputs.

AI must not create new facts.

AI must distinguish observation, pattern, assumption, interpretation and review path.

AI must not produce automatic decisions.

AI must not produce automatic quality judgements.

AI must not assign blame.

AI-supported reports must remain reviewable by humans.

Reports must be adapted to the appropriate leadership level.

---

## Risks

The first risk is hallucination. AI may generate plausible but unsupported statements. This must be mitigated through strict input grounding and output review.

The second risk is overconfidence. AI-generated language may sound more certain than the underlying data allows. This must be mitigated through cautious wording and assumption markers.

The third risk is blame language. AI may unintentionally formulate patterns as personal failure. This must be prevented through prompt rules, terminology constraints and review.

The fourth risk is quality overclaiming. AI may turn quality-relevant signals into quality judgements. This must not be allowed.

The fifth risk is automation bias. Users may accept AI-generated summaries without sufficient review. CareFlow must present AI reports as support drafts, not final authority.

---

## Implementation Notes

The first implementation may use predefined report templates rather than live generative AI.

A later implementation may introduce AI-generated summaries from structured report objects.

Each AI report input should include:

* report type,
* leadership level,
* reporting period,
* structured observations,
* statistical patterns,
* simulation or sensitivity results if applicable,
* permitted interpretation scope,
* prohibited wording,
* assumption markers,
* review paths,
* source markers.

The output should be stored with metadata indicating:

* generation time,
* input basis,
* model or generation method,
* report status,
* human review status,
* version if exported.

Future implementation should support report regeneration, human editing, approval and audit traceability.

---

## Accepted Decision

CareFlow-Swiss will allow AI-supported situation report generation only as a controlled language and summarisation layer.

AI may translate structured CareFlow signals into understandable leadership language.

AI may not create new facts, make decisions, assign blame, produce automatic quality judgements or replace human review.

AI-generated reports are support drafts and must remain grounded, cautious, reviewable and aligned with the appropriate leadership level.

The guiding principle is:

**CareFlow AI writes from structured evidence. It does not invent, decide, judge or blame.**
