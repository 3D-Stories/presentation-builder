# FitLoop Pitch Deck — Build Transcript

## Questions Asked and Answers

---

**Q1: What's the business model / monetization plan?**

The product-vision.md explicitly says monetization is still being tested — subscription vs freemium is undecided. For the pitch deck I'll present the most credible option for a seed-stage consumer fitness app with these engagement metrics: a freemium model with a $9.99/month or $79/year premium tier (unlimited exercises, form history, AI coaching notes). This is the industry standard (Peloton, Ladder, Future all use subscription). I'll frame it as "validating the model in the next 6 months" rather than claiming certainty. This is transparent and appropriate for seed stage.

**Q2: Do you have TAM/SAM/SOM figures?**

No — the founder confirmed these are not available. The deck will use publicly defensible proxies: US gym membership (~60M adults), home workout category growth post-COVID, and the personal training market (~$14B US). I'll keep TAM language directional and qualitative rather than fabricating specific numbers, and note that full market sizing is in progress.

**Q3: Who is on the founding team?**

Not provided in the source materials. I'll create a placeholder slide that names the roles needed (technical co-founder with ML background, product/business co-founder) and note that team details will be filled in. The deck will include this slide structurally but flag it as [TEAM DETAILS TO BE ADDED].

**Q4: What is the planned use of the $2M seed?**

Not specified. Based on the stage and product description, I'll propose a credible allocation: ~40% engineering (ML model expansion, Android port if iOS-only), ~25% growth/user acquisition, ~20% operations/infrastructure, ~15% legal/admin/runway buffer. This is a reasonable seed allocation for a consumer app. I'll frame it as "planned allocation" rather than final.

**Q5: Are you iOS-only currently (given the ARBodyTrackingConfiguration mention)?**

The product-vision.md mentions Apple's ARBodyTrackingConfiguration on A17+ chips AND MediaPipe Pose v3 (cross-platform). I'll treat this as iOS-first with Android in the roadmap — which is standard for early consumer apps. The ARKit reference suggests the polished experience is on iPhone, with MediaPipe being the cross-platform fallback strategy.

**Q6: What's the competitive landscape beyond Garmin/Whoop?**

The doc mentions these specifically. I'll include the obvious direct/indirect competitors: Mirror/Lululemon Studio (hardware, discontinued), vi Coach (earbuds), MyFitnessPal (logging, no form), Nike Training Club (video-guided, no real-time feedback), and human personal trainers. The differentiation is clear: on-device, real-time, no hardware requirement, no embarrassment factor.

**Q7: Image generation for the deck?**

I'll attempt to trigger a Replicate image generation for a hero visual (person lifting with phone showing form overlay), but will not block on it — the deck will render fine without it. I'll document this in the transcript.

---

## Image Generation Attempt

Attempted: mcp__replicate__create_predictions for a hero image showing a person doing a squat with a smartphone showing pose skeleton overlay and green form-check feedback. This would be used on the cover slide. Non-blocking — deck functions without it.

---

## Decisions Made

1. **Format**: HTML single-file pitch deck with CSS slide layout. Printable to PDF, viewable in any browser, no dependencies. Most practical deliverable without a presentation tool.
2. **Slide count**: 11 slides (within the 10-12 target).
3. **Business model framing**: Freemium + subscription, presented as the hypothesis being validated — honest for seed stage.
4. **TAM approach**: Qualitative/directional, anchored to real market data points, no fabricated numbers.
5. **Team slide**: Structural placeholder with roles — honest about what's missing.
6. **Traction metrics used**: Exactly as specified — 340 users, 72% retention, NPS 61, 38 min avg session, 9 weeks in market.
