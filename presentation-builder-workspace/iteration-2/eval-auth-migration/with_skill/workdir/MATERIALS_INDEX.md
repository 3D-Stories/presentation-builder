# Presentation Materials Index
## Gathered: 2026-04-21 | Total Files: 3 source files (copied into 3 topic directories)

## Topic 1: What We Shipped
| File | Purpose |
|------|---------|
| `gathered-materials/what-we-shipped/design-doc.md` | Technical design doc for auth-v2: context (why we needed to migrate), approach (JWT RS256 + refresh cookie + OIDC IdP), migration strategy (dual-read, 3 waves), key decisions table |
| `gathered-materials/what-we-shipped/migration-notes.md` | Raw brain-dump: shipped items list, metrics (23 services, 142 PRs, 7 weeks), good calls in retrospect, bad calls, open questions |

## Topic 2: The Gnarly Bug (14-hour mobile lockout)
| File | Purpose |
|------|---------|
| `gathered-materials/gnarly-bug/postmortem.md` | P1 postmortem: 14h 22m mobile lockout affecting ~31k users; root cause (JWT aud mismatch + SameSite=Strict webview), timeline, process failures, what we'd do differently, action items |

## Topic 3: Lessons Learned & What We'd Do Differently
| File | Purpose |
|------|---------|
| `gathered-materials/lessons-learned/migration-notes.md` | "Lessons we keep talking about" section + bad calls section: rollback needs a definition, webview as its own platform, test matrices as code, cost attribution uncertainty |

## Gaps

Coverage audited against: What We Shipped, Gnarly Bug, Lessons Learned.

- **Cost savings data is soft**: migration-notes.md notes "~12% on the API tier but autoscaler tuning is still settling — don't quote me." No hard number available; speaker should acknowledge uncertainty explicitly.
- **Partner OIDC story is thin**: 3 design partners live as of 2026-04-10, but no detail on what that unlocked. Low priority for all-hands talk.
- **Open questions (passkeys, refresh TTL, auth-v1 deprecation)** have no answers yet. Fine as a "what's next" beat but not as content.
- **No architectural diagram as a standalone asset**: the ASCII diagram in design-doc.md can be recreated as a slide visual. Speaker must produce this during implementation.
