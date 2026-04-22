# Presentation Design Spec — OTel Migration

**Generated:** 2026-04-15 — Phase 2 (Requirements) complete. Awaiting Phase 3 review.

## Primary takeaway

"If you're paying Datadog more than $400k/yr and you have the platform headcount,
OTel is a 9-month project that pays for itself in 14 months. Here's the shape of
the work and where we got burned."

## Audience

Engineering leaders (dir/VP) at mid-to-large tech orgs considering a migration
from a SaaS observability vendor. Secondary audience: platform ICs who will
actually do the work.

## Duration

25 minutes + 10 min Q&A. Likely venue is our annual internal platform summit;
may be re-recorded for external conference submission.

## Structure (proposed)

| # | Section | Time | Purpose |
|---|---------|------|---------|
| 1 | The Datadog invoice that broke our brain | 3 min | Hook: cost curve from $180k → $720k in 3 years, no usage increase that justified it |
| 2 | Why OTel (and why we rejected alt vendors) | 4 min | Decision criteria; not cost alone — portability, standardization |
| 3 | The migration in four acts | 10 min | Collector deployment → traces first → metrics → logs. What went well, what didn't. |
| 4 | The three things nobody tells you | 5 min | Cardinality still bites, sampling is harder than you think, alerting rewrite is 30% of the work |
| 5 | What we'd do differently | 3 min | The punchline; what to steal |

## Format

PPTX. Speaker notes: full talking-point pass required (this is the punchline
section we want to nail). Output will be used as-is, then reworked for external
submission with less internal-specific data.

## Visual direction

Restrained corporate-technical. Data-heavy but not cluttered. Hero image per act
(collector architecture, timeline, cardinality chart, "things nobody tells you"
motif). Style guide not yet created.

## Open questions

- Will we include real cost numbers or anonymize them? Needs legal check.
- Do we want a live demo of collector config? Probably not — video captures instead.
- Are we OK sharing the "things that went wrong" candidly? Leadership alignment
  needed before external version.
