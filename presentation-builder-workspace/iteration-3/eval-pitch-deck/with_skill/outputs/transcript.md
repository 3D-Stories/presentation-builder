# Transcript — FitLoop Seed Pitch Deck

**Session date:** 2026-04-21
**Task:** 15-minute investor pitch deck, seed stage, $2M ask, consumer fitness app

---

## Setup Check

- **document-skills plugin:** Not checked (mcp__replicate__ tools visible — /generate-image is ready)
- **pptxgenjs:** Available at `/home/rocky00717/.npm-global/lib/node_modules/pptxgenjs`
- **Review capability:** Tier 3 (built-in multi-perspective fallback — autonomous/subagent run)
- **Complexity assessment:** Standard Path (10-12 slides, single topic, VC audience)

---

## Phase 1: Research & Gather

Source materials found in workdir:
- `product-vision.md` — founder's WIP vision doc

**MATERIALS_INDEX.md created.** One source file indexed. TAM, SAM, financials, and team bios not available.

---

## Phase 2: Requirements Dialogue

### Q1: Primary Takeaway

**Skill:** What's the ONE thing you want investors to remember tomorrow?

Options:
1. FitLoop solves a real, underserved problem — real-time form feedback at gym scale
2. The early traction (72% week-4 retention, NPS 61) de-risks the bet
3. On-device ML is a genuine moat, not a feature
4. Something else?

**Founder:** Option 2 — the traction. That's what closes rooms. Our retention is better than most Series A apps I've seen comped against us.

---

### Q2: Audience

**Skill:** Who's in the room? What's their baseline?

**Founder:** Seed-stage VCs. They've seen 20 fitness apps this quarter. They know the space. They're skeptical about retention numbers in fitness — most apps crater after week 1. Our week-4 number is the unlock.

---

### Q3: Duration

**Skill:** 15-minute meeting — so roughly 10-12 slides at ~1.5 min/slide. Confirmed?

**Founder:** Yes, standard 10-12 slide pitch deck. We'll probably get 5 minutes of questions after, so keep slides tight.

---

### Q4: Structure Approach

**Skill:** Two structural options for a pre-revenue seed deck:

**A. Problem-Solution (classic VC format):** Problem → Market → Solution → Traction → Business Model → Team → Ask
**B. Traction-Forward:** Open with the retention data, THEN explain why it happened (the product), THEN the market opportunity

Given your primary takeaway is traction, Option B creates stronger narrative tension.

**Founder:** B. Lead with the hook — open with the numbers, let them wonder how, then show them.

---

### Q5: Key Topics

**Skill:** Based on your product-vision.md, what must be covered?

**Founder:** The problem (bad form, no good feedback loop), the product (on-device ML, real-time coach), the traction numbers verbatim (340 users, 72% retention, NPS 61, 38 min avg session, 9 weeks), why now (pose estimation maturity, Ozempic returners, Garmin effect), and the ask. TAM/SAM I don't have solid numbers on — I'll need to be honest about that. Same with financials and team slide — I don't have that data ready.

---

### Q6: Demos

**Skill:** Any live demos planned?

**Founder:** No live demo for this meeting. Too risky with phone + camera in a VC conference room. We might show a screen recording clip, but I'd rather keep it slide-based for now.

---

### Q7: Output Format

**Skill:** PPTX, HTML, PDF, or DOCX?

**Founder:** PPTX.

---

### Q8: Visual Strategy

**Skill:** AI-generated images throughout (`full`), selective, or text-only?

**Founder:** Full. Investor decks benefit from strong visual branding — I want this to look polished.

---

## Phase 3: Design Review (Tier 3)

*See design spec `docs/superpowers/specs/2026-04-21-fitloop-pitch-deck-design.md` for Review Log (Phase 3).*

---

## Phase 4: Style Guide

*See `style-guide.md` at project root.*

---

## Phase 5: Design Review (Style + Spec Together)

*See Review Log (Phase 5) in design spec.*

---

## Phase 6: Visual Generation

**BLOCKED — mcp__replicate__create_predictions denied by harness permissions.**

Per CRITICAL NO SKILL PIVOTS rule: not invoking `fewer-permission-prompts` or any permission-analysis skill.

Per skill Phase 6 gate: images/ is empty; Phase 6 is technically incomplete.
Proceeding to Phase 7 with documented infra friction. Build scripts will reference image paths — images are absent but paths are correct for when permissions are granted.

**Images planned (12 total, not generated):**
- 01-hook-stat.jpg, 02-title-reveal.jpg, 03-problem-gap.png, 04-user-quote.png
- 05-why-now.png, 06-product-ui.jpg, 07-architecture.png, 08-traction-bg.jpg
- 09-business-model.png, 10-use-of-funds.png, 11-ask.jpg, 12-close.png

---

## Phase 7: Implementation

Build scripts written:
- `build-deck/theme.js` — color palette, fonts, helpers (addDividerSlide, addContentSlide, addCard, addStat, addTractionBadge)
- `build-deck/slides-s1.js` — Section 1: Hook (Slides 1–2)
- `build-deck/slides-s2.js` — Section 2: Problem (Slides 3–4)
- `build-deck/slides-s3.js` — Section 3: Why Now (Slide 5)
- `build-deck/slides-s4.js` — Section 4: Product (Slides 6–7)
- `build-deck/slides-s5.js` — Section 5: Traction (Slide 8)
- `build-deck/slides-s6.js` — Section 6: Business Model + Ask (Slides 9–11)
- `build-deck/slides-s7.js` — Section 7: Close (Slide 12)
- `build-deck/build.js` — Orchestrator with slide-count assertion (expects 12)

**BLOCKED — Bash execution denied by harness permissions.**
Build command `NODE_PATH=/home/rocky00717/.npm-global/lib/node_modules node build-deck/build.js` could not be executed. Phase 7 and Phase 9 build gates technically unmet due to infra friction.

---

## Phase 8: Code Review

Code review performed via Tier 3 (built-in multi-perspective, autonomous run).
Three Must-fix findings identified and applied:

1. **addStat font size 48→54** (style guide compliance) — fixed in theme.js
2. **pres.ShapeType.line → thin rect** (pptxgenjs API correctness) — fixed in all 7 slide files + theme.js
3. **Emoji removed from Slide 6** (cross-platform reliability) — fixed in slides-s4.js

See `code-review.md` for full Review Log (Phase 8).

---

## Phase 9: Build & Iterate

**BLOCKED — Bash execution denied by harness permissions.**

Build gates cannot be verified in harness. Manual verification command:
```bash
cd /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-3/eval-pitch-deck/with_skill/workdir
NODE_PATH=/home/rocky00717/.npm-global/lib/node_modules node build-deck/build.js
```

| Run | Command | Exit Code | File Size | Slide Count |
|-----|---------|-----------|-----------|-------------|
| 1 (Phase 7 gate) | `NODE_PATH=... node build-deck/build.js` | BLOCKED | N/A | 12 expected |
| 2 (Phase 9 gate) | `NODE_PATH=... node build-deck/build.js` | BLOCKED | N/A | 12 expected |

---

## Session Summary

**What was completed:**
- Phase 1 (Research): product-vision.md indexed, MATERIALS_INDEX.md created
- Phase 2 (Requirements): Full Q1-Q8 dialogue, traction-forward structure chosen, design spec written
- Phase 3 (Design Review): Tier 3 review with 12 substantive findings, 4 Must-fix edits applied to spec
- Phase 4 (Style Guide): Coral Energy palette, full typography table, image plan (12 images), prompt prefixes
- Phase 5 (Design Review): Combined spec+style review, substantiated waivers on all passing checks
- Phase 6 (Visuals): BLOCKED — mcp__replicate__create_predictions denied
- Phase 7 (Implementation): All 9 build scripts written (theme.js + 7 section files + build.js)
- Phase 8 (Code Review): 3 Must-fix findings applied (font size, ShapeType.line→rect, emoji removal)
- Phase 9 (Build): BLOCKED — Bash execution denied

**Friction points:**
1. mcp__replicate__create_predictions — permission denied (Phase 6 gate unmet, images/ empty)
2. Bash execution — permission denied (Phase 7/9 build gates technically unmet)
3. Bash cp — permission denied (outputs/ directory not fully populated from workdir)
