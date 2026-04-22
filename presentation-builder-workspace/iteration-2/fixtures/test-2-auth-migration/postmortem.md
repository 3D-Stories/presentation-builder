# Postmortem — The 14-hour mobile lockout (2026-03-19)

**Severity:** P1
**Duration:** 14h 22m (first report 08:42 → full recovery 23:04 UTC)
**Impact:** ~31k mobile users silently logged out; many could not log back in for the full window.
**Authors:** R. Patel, C. Androsoff

## What happened

During Wave 3 of the auth-v2 migration, we flipped the remote flag `auth_v2_mobile`
to 100% at 08:12 UTC on a Thursday. By 08:42 we had 40+ crash reports from the
mobile app and Twitter chatter about "can't log in." We assumed a bad build and
reverted the flag at 09:10. Logins did not recover.

## Root cause

Two bugs compounded:

1. **The JWT audience check was too strict on mobile.** The mobile JWT issuer had
   been configured with `aud: "mobile.app"` (a legacy string from a spike). The
   backend's new verifier only accepted `aud: "api.<env>"`. So every mobile token
   was rejected as "audience mismatch."
2. **The refresh cookie's `SameSite=Strict` broke the mobile webview sign-in flow**
   because the webview's top-level navigation looks cross-site from the cookie's
   POV. We'd tested the browser flow extensively and the native flow briefly, but
   not the webview flow.

Bug 1 alone was bad. Bug 2 meant that when we rolled back the flag, sessions that
had been upgraded to v2 during the short ramp couldn't re-establish under v1 either,
because the refresh cookie had been reset with the wrong attributes.

## Timeline

- 08:12 — `auth_v2_mobile` flipped to 100%
- 08:28 — first user-reported login failure (support ticket)
- 08:42 — ops paged by app-crash spike
- 09:10 — flag reverted to 0%. **Logins do not recover** — this should have been our pivot moment but we spent the next 3 hours looking at the mobile build.
- 12:35 — C. notices the `aud` claim mismatch while running the verifier locally
- 13:10 — hotfix PR merged for the audience list
- 14:02 — staged rollout begins
- 17:50 — SameSite issue found (why recovered sessions are re-failing after 15 min)
- 19:30 — second hotfix: `SameSite=Lax` for mobile webview path
- 23:04 — error rate back to baseline

## What went wrong (process)

- **We didn't test the webview flow.** Three engineers had said "we should test
  that" across two sprints, and it never made it into a test plan.
- **Our rollback assumption was naive.** "Flip the flag back" is not a rollback if
  state has already been mutated in-flight.
- **The `aud` claim was set in two places** (issuer config + staged deploy overlay)
  and nobody noticed they disagreed. The staging verification caught neither
  because staging uses a different audience string.

## What we'd do differently

- Canary at 1% → 10% → 50% → 100%, not "dev → staging → 100%".
- Explicit test matrix for every auth surface (browser, native, webview, SDK).
- State-aware rollback: accept v1 OR v2 tokens for a full week after any flip,
  not just during the initial migration.
- One source of truth for the audience claim — deleted the staging override.

## Action items

- [x] Remove staging `aud` override (PLAT-942)
- [x] Add webview flow to CI matrix (PLAT-943)
- [ ] Write a "flag rollback ≠ state rollback" runbook (PLAT-951)
- [ ] Post-migration audit of all SameSite cookie settings across products (PLAT-958)
