# Auth v2 — rough migration notes

Just dumping brain from the last 3 months. Not polished.

## What we shipped

- OIDC-compliant IdP at `id.internal`
- JWT (RS256, 15 min) + refresh cookie (HttpOnly, 30 day)
- Dual-read support across all services for 4 weeks
- Three-wave rollout: internal tools → web → mobile
- Partner OIDC integration: 3 design partners live as of 2026-04-10

## Numbers

- Services touched: 23
- PRs: 142
- Total ramp time: 7 weeks (planned 4)
- Peak login success rate dip: 68% (normally 98%+) during the 14hr mobile incident
- Cost savings from dropping sticky sessions: we think ~12% on the API tier but
  the autoscaler tuning is still settling so don't quote me

## Good calls in retrospect

- RS256 not HS256. Would have been a nightmare to rotate shared secrets across 23 services.
- HttpOnly refresh cookie. Every month some security vendor pings us about
  LocalStorage token storage; now we just say "no."
- Dual-read window was a lifesaver. Without it the mobile incident would have
  been a full outage, not a partial one.

## Bad calls

- Three waves was two waves too few. Should have canaried each wave internally.
- We underestimated the webview/native/browser surface-area difference.
- Remote flag as the rollback knob. Flags are for gating forward progress, not
  for restoring previously mutated state.

## Lessons we keep talking about

1. **"Rollback" needs a definition per feature.** For stateless features it's a flag flip.
   For auth it's... actually we still don't have a great answer.
2. **The webview flow is its own platform.** Treat it that way. It is neither browser nor
   native, and it will keep burning us if we pretend otherwise.
3. **Test matrices want to be code.** We keep writing them in Notion and they keep rotting.
   This time the matrix is in the repo as a yaml file and CI reads it.
4. **Cost savings are hard to attribute.** Leadership loves a number and we can't give one
   cleanly. Be upfront about uncertainty.

## Open questions from the team

- Do we want to move to passkeys next? (Opinions: split.)
- Should the refresh-token TTL be shorter? 30 days feels long in 2026.
- Are we going to deprecate auth-v1 entirely, or keep it alive for legacy partners?
