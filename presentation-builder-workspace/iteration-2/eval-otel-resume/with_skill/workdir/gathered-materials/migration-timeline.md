# Migration Timeline — Datadog → OTel

## Original plan (Q4 2025)

| Month | Milestone | Status |
|-------|-----------|--------|
| M1 | Collector deployed alongside Datadog agent | Hit |
| M2 | Traces flipped to Tempo for 2 services | Hit |
| M3 | Traces fully on Tempo | 1 month slip |
| M4 | Metrics flipped to Mimir for 2 services | 2 month slip |
| M5 | Metrics fully on Mimir | 3 month slip |
| M6 | Logs + alerting rewrite | 4 month slip |

**Actual duration:** 10 months (planned 6).

## Where the slips came from

- **M3:** Service teams unexpectedly had to rewrite trace instrumentation that had
  been Datadog-APM-specific. ~3 weeks per team × 2 teams concurrently.
- **M4-M5:** The alerting rewrite. Datadog alert definitions didn't translate 1:1
  to Prometheus alert rules. We ended up rebuilding ~120 alerts by hand and got
  the behavior wrong on about 15 of them (all detected in staging, thankfully).
- **M6:** Logs turned out to be the easiest part, but by the time we got to it we
  were already burned out.

## What's actually in production

- 100% of traces in Tempo (as of 2026-02)
- 100% of metrics in Mimir (as of 2026-03)
- 100% of logs in Loki (as of 2026-04-01)
- Datadog agents removed from 19/22 clusters. Remaining 3 are legacy customer
  environments — will remove Q3 2026.
