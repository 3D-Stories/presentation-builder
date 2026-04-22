# Presentation Materials Index
## Gathered: 2026-04-21 | Total Files: 5 (3 unique source files, organized across 3 topics)

## Topic 1: What We Shipped
| File | Purpose |
|------|---------|
| `gathered-materials/what-we-shipped/design-doc.md` | Technical design doc for auth-v2: context (legacy system pain), JWT+OIDC approach, key decisions table (RS256, HttpOnly, 15min TTL), migration strategy (dual-read, 3 waves), out-of-scope items |
| `gathered-materials/what-we-shipped/migration-notes.md` | Brain dump from the team: shipped components, numbers (23 services, 142 PRs, 7-week ramp, ~12% cost estimate), good calls in retrospect |

## Topic 2: Gnarly Bug — 14-hour Mobile Lockout
| File | Purpose |
|------|---------|
| `gathered-materials/gnarly-bug/postmortem.md` | P1 postmortem: root cause (JWT aud mismatch + SameSite=Strict in webview), full timeline (08:12–23:04 UTC), impact (31k users), why rollback failed |

## Topic 3: Retrospective — What We'd Do Differently
| File | Purpose |
|------|---------|
| `gathered-materials/retrospective/postmortem.md` | "What we'd do differently" section: canary strategy, explicit test matrix, state-aware rollback definition |
| `gathered-materials/retrospective/migration-notes.md` | "Lessons we keep talking about": rollback definition, webview as its own platform, test matrices in code, cost attribution uncertainty |

## Gaps

- **No cost/savings data with confidence:** migration-notes.md flags "~12% on API tier but don't quote me" — the cost savings story will need a hedge or a range with explicit uncertainty.
- **No slide-ready visuals or architecture diagrams:** the design-doc.md includes ASCII art for the auth flow diagram; will need to render this as a proper slide diagram.
- **Open questions section in migration-notes.md is unresolved:** passkeys, refresh TTL, auth-v1 deprecation — these are NOT in scope for the talk but should be acknowledged briefly in closing as "what's next."
- **No quantified business impact beyond login failures:** 31k users, 14h window, 68% login success rate — present, but no revenue/churn figure. Speaker will need to decide whether to include or hedge.
- **Personal experience is the primary source for speaker notes:** The narrative voice (what it felt like at 12:35 when C. found the aud mismatch, the 3-hour wrong-track investigation) will come from speaker experience, not docs.
