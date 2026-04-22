# FitLoop — Seed Round Pitch Deck
### $2M Pre-Revenue Seed | 15-Minute VC Presentation
---

## Slide 1 — Cover

**FitLoop**
Real-time AI form coaching for every lift, entirely on your phone.

- Round: Pre-Seed / Seed
- Raise: $2,000,000
- Stage: Pre-Revenue
- In Beta: 9 Weeks

---

## Slide 2 — The Problem

**Most people train alone. Nobody tells them when their form breaks.**

For 60M US gym-goers lifting 3–5x/week, bad form is silent until it causes injury.

**Three core pain points:**

1. **Personal trainers are unaffordable** — $60–120/session. Adults who know the movements but want form accountability can't justify the cost for every workout.

2. **Form-check subreddits are async and unreliable** — Film yourself, upload, wait 24h+, maybe get a useful response. No feedback mid-set, when it actually matters.

3. **Poor form = preventable injury** — 70% of recreational lifters develop overuse injuries. Most trace to chronic form faults compounding over months.

> *"it caught the thing my trainer missed"*
> — Top unsolicited feedback phrase from FitLoop beta users

---

## Slide 3 — The Solution

**Your phone becomes your form coach. In real-time. No video upload. No waiting.**

- **On-device AI — fully private.** No video ever leaves the phone. Pose estimation runs locally using MediaPipe Pose v3 and Apple ARKit on A17+.
- **Rep-by-rep coaching cues.** Text + subtle audio cues during the set — you don't need to look at the screen mid-rep. 40 exercises covered.
- **Home gym or commercial gym.** Works anywhere. Prop your phone like you would to film a video — that's all the setup.
- **Form history over time.** Track how your squat depth or deadlift hinge improves across sessions.

---

## Slide 4 — Why Now

**Three converging forces make 2025 the right moment.**

1. **On-device ML finally good enough.** MediaPipe Pose v3 (2024) and Apple's ARBodyTrackingConfiguration on A17+ chips deliver the pose accuracy required. This was not possible at acceptable latency 3 years ago.

2. **Post-GLP-1 gym wave.** Ozempic/Wegovy users returning to strength training are re-learning compound lifts. They need form coaching without embarrassment — a perfect FitLoop use case.

3. **Data-informed fitness is now the default expectation.** Garmin and WHOOP have trained 30M+ users to expect detailed performance data. Neither does real-time form. FitLoop fills that gap.

**The window is now.** The ML infrastructure unlocked this in 2024–2025. No well-funded competitor has shipped a credible on-device form coaching product. First-mover advantage compounds because form correction requires longitudinal data on each user — early adoption creates a moat.

---

## Slide 5 — Market Opportunity

**A large, underserved segment inside an established category.**
*(Market sizing in progress — directional anchors below.)*

| Layer | Size | Anchor |
|-------|------|--------|
| TAM | ~$14B | US personal training market (IBIS 2024) |
| SAM | ~60M users | US gym members who lift, smartphone-equipped adults 25–45 |
| SOM | Y1–2 target | iOS-first home + gym lifters, early adopter segment |

**Addressable pricing proxy:** If 1M users pay $9.99/mo (1.7% of US gym members) — that's $120M ARR. Peloton grew to 3M+ paid subscribers from the same base.

**Tailwind:** Home fitness market grew 70%+ post-COVID. 34% of active gym-goers also maintain a home setup (IHRSA 2024).

*Note: Full bottom-up TAM/SAM/SOM analysis in progress. Numbers above are directional anchors from public sources, not modeled projections.*

---

## Slide 6 — Traction

**9 weeks. Closed beta. The numbers already tell a story.**
*No paid acquisition. Zero marketing spend. Invite-only TestFlight.*

| Metric | Value | Context |
|--------|-------|---------|
| Active Beta Users | **340** | Closed TestFlight, invite-only |
| Week-4 Retention | **72%** | Industry avg: 20–25% |
| Median Session Length | **38 minutes** | vs. 12m for fitness apps typically |
| NPS | **61** | World class: >50. Excellent: >70. |

**Retention benchmarks:**
- Typical fitness app (D30): 4–8%
- Top-quartile consumer app (D30): ~15%
- Peloton (subscription, W4): ~60%
- **FitLoop beta (W4): 72%**

The 38-minute median sessions indicate FitLoop is being used *during actual workouts*, not reviewed post-workout. Users are staying for the full coaching session.

> *"it caught the thing my trainer missed"* — Most common unprompted feedback

---

## Slide 7 — Product Depth

**How it works — and why it's hard to copy.**

- **Pose detection at 30fps** — identifies 33 body landmarks per frame, on-device, <50ms latency
- **Exercise recognition** — model classifies movement pattern from pose sequence, no manual selection required
- **Form rules engine** — 40 exercises, expert-reviewed biomechanics rules, per-rep scoring with cue generation
- **Progressive coaching** — cue complexity adapts as user's form improves; doesn't repeat advice already internalized
- **Zero data egress** — no video, no pose data leaves device; privacy as a product feature

**Core Technology:** MediaPipe Pose v3 · Apple ARBodyTracking · A17 Neural Engine · On-device inference · SwiftUI

**Key stats:** 40 exercises · <50ms feedback latency · 0 bytes of video uploaded

**Moat in progress:** Per-user form history creates personalized longitudinal coaching data. Switching cost compounds with every workout logged.

---

## Slide 8 — Competitive Landscape

**No one does real-time, on-device, no-hardware form coaching.**

| Competitor | Real-time | No hardware | On-device | Strength focus |
|-----------|-----------|-------------|-----------|----------------|
| Personal Trainer | ✓ | ✗ ($60–120/session) | ✓ | ✓ |
| Lululemon Studio | ✓ | ✗ ($1,500 hardware) | ✗ | ~ |
| Nike Training Club | ✗ (video guides) | ✓ | ✓ | ~ |
| Garmin / WHOOP | ✗ | ✗ (wearable) | ✓ | ✗ |
| Reddit Form Checks | ✗ (async) | ✓ | ✓ | ✓ |
| **FitLoop** | **✓** | **✓** | **✓** | **✓** |

FitLoop is the only product that delivers all four simultaneously. The nearest alternatives require either expensive hardware, a human trainer, or accept async feedback with hours of latency.

---

## Slide 9 — Business Model

**Freemium-to-subscription. Hypothesis we're validating this round.**

**Free (Core):** 10 exercises, 3 sessions/week, basic form scoring, 7-day history

**Paid — FitLoop+ (~$9.99/mo or $79/yr):** All 40+ exercises, unlimited sessions, full form history + trends, progressive coaching adaptation

**Honest framing:** We have conviction on retention and engagement, not yet on willingness to pay. The $2M raise funds 6–9 months of monetization experiments: paywall placement, price point testing, annual vs monthly conversion, and whether a gym/trainer B2B2C channel unlocks faster growth than pure DTC.

---

## Slide 10 — Team

**Built by people who lift, ship, and know the technical edge.**

- **[Co-Founder] — CEO / Product:** Consumer product background. Lifts 4x/week. Identified the problem from personal experience. *[Background details to be added]*
- **[Co-Founder] — CTO / ML:** Deep expertise in on-device computer vision and pose estimation. Previously worked on real-time inference pipelines. *[Background details to be added]*
- **[Open Role] — Head of Growth:** Seed-funded hire. Consumer app growth background, fitness vertical preferred.

*Note: Full bios and credentials in data room. Advisors to be confirmed. Direct introductions available on request.*

---

## Slide 11 — The Ask

**$2,000,000 Seed Round**

Funds monetization validation, exercise library expansion, and reaching 10K users — without touching growth spend until retention benchmarks hold at scale.

**Use of Funds:**
- 40% — Engineering (ML expansion, Android port, infrastructure)
- 25% — Growth (UA experiments once LTV is known)
- 20% — Operations (compute, tooling, team ops)
- 15% — Legal / Admin / Runway buffer

**Milestones this round funds:**
- **Month 3–4:** Public TestFlight launch, monetization paywall live, price point A/B tests running
- **Month 6:** 10K active users, first paid conversion data, Android MVP in beta
- **Month 12–18:** Series A-ready — proven LTV, CAC visibility, 50K+ user target, expansion exercises (mobility, yoga) in pipeline

---

*[Founder Name] · [email] · [phone]*
*Data room available on request. Confidential.*
