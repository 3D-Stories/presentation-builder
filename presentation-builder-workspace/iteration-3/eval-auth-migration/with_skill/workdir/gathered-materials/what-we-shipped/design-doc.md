# Auth v2 — Technical Design (excerpt)

**Status:** Shipped 2026-03-28
**Authors:** Platform team (C. Androsoff, R. Patel, S. Kim)
**Jira epic:** PLAT-842

## Context

Our legacy auth system (`auth-v1`, ca. 2021) used server-rendered session cookies with
a sticky-session load-balancer tier. It worked, but it blocked three things we've been
asked to deliver this year:

1. **Mobile clients** — the sticky-session model is painful to support from a native app;
   refreshing a session from a background thread requires round-tripping an HTML form.
2. **Horizontal autoscaling** — sticky sessions pin a user to a pod until it dies, which
   makes our autoscaler pessimistic and keeps us over-provisioned.
3. **Third-party integrations** — partners keep asking for an OIDC endpoint we don't have.

## Approach

Replace the cookie/session model with signed JWTs (RS256), rotated every 15 min, plus a
refresh-token in a `HttpOnly; SameSite=Strict` cookie. The identity provider is an
in-house OIDC service (`id.internal`, new) that wraps our existing user table.

```
  [ client ]
     │
     │ POST /oauth/token  (authorization_code)
     ▼
  [ id.internal ]  ──issues──▶  JWT (access) + opaque refresh
     │                               │
     │                               ▼
     │                         HttpOnly cookie
     ▼
  [ backend services ]  verify JWT via JWKS, no DB hit
```

### Migration strategy

Dual-read for 4 weeks. Services accept either `Cookie: session_id=...` (legacy) or
`Authorization: Bearer <jwt>` (new). Frontend fleet flipped over in three waves.

- Wave 1 (week 1): internal tools
- Wave 2 (week 2-3): customer web
- Wave 3 (week 4): mobile app (gated behind a remote flag — see `migration-notes.md`)

## Key decisions

| Decision | Choice | Rejected alternative |
|----------|--------|----------------------|
| Token algo | RS256 | HS256 (shared secret means every service is a key-holder) |
| Refresh storage | HttpOnly cookie | LocalStorage (XSS-reachable) |
| Token lifetime | 15 min access / 30 day refresh | 1 hr / 7 day (too much lateral risk from stolen access token) |
| Logout model | Refresh-token revocation + short access TTL | Session kill list (needs distributed cache we don't have) |

## Out of scope

Device binding, hardware-key flows, SSO with our parent company's IdP.
These are on the roadmap for Q3.
