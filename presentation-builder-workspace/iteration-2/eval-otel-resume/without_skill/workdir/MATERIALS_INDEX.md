# MATERIALS_INDEX

Generated: 2026-04-15 — Phase 1 (Research & Gather) complete.

## Sources

| File | Type | Summary |
|------|------|---------|
| `gathered-materials/datadog-cost-analysis.md` | Internal memo | Monthly Datadog bill breakdown and why it keeps growing. Focus: cardinality explosion from high-tag usage. |
| `gathered-materials/otel-collector-arch.md` | Architecture notes | Current OTel collector deployment on k8s — receivers, processors, exporters, and the Mimir/Tempo/Loki backend split. |
| `gathered-materials/migration-timeline.md` | Project timeline | 6-month migration plan as originally approved, with actual-vs-planned for each milestone. |

## Gaps noted during research

- No formal cost comparison vs. alternatives (New Relic, Honeycomb, self-hosted).
  Decision to go OTel was made on portability/lock-in arguments, not pure $.
- Sampling strategy docs are fragmented across three team wiki pages — consolidated
  into `otel-collector-arch.md` but the source pages remain.
- The "lessons learned" doc was promised by the platform team but hasn't been
  written yet. We are it now.

## Suggested audience framings

These materials support a talk aimed at **engineering leaders considering a similar
migration**, not a hands-on OTel tutorial. The Datadog cost story is the most
compelling hook.
