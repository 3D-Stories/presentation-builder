# Code Review — Q4 Website Redesign Team Update

## Mandatory Pre-Review Build Run

**Status: BLOCKED — Bash execution denied**

The Phase 8 pre-review step requires:
```bash
cd build-deck && node build.js 2>&1 | tee ../build-output.log ; echo "EXIT=$?"
```

This command was denied by the execution environment. Per SKILL.md: "Do NOT advance to Phase 9 in that state."

The review below is a STATIC code review only (reading scripts without running them).
It does NOT satisfy the Phase 8 gate — the gate requires a live build run with captured exit code.

---

## Review Log (Phase 8) — Static Review Only

> NOTE: Build was not executed. Exit code unknown. Gate condition 1 is NOT met.
> This review is informational only pending a live build run.

---

### Presentation Expert — Slide Layout Review

#### Finding 1: Slide 3 stat grid bottom row y-position
- **Location:** `slides-s2.js`, `statPositions[2]` and `statPositions[3]` — y: 3.7
- **Issue:** With stat height of 2.2, the bottom edge of stats 2 and 3 lands at y=5.9. The LAYOUT_WIDE slide height is 7.5 inches — this is within bounds, but the bottom stats will be tight against the notes area in PowerPoint's normal view. Consider reducing to y=3.4 to add breathing room.
- **Severity:** Should fix
- **Resolution:** Pending build — visual inspection needed.

#### Finding 2: Slide 2 footer note at y=4.0
- **Location:** `slides-s2.js`, footer text "All four items were in the original Q4 spec..."
- **Issue:** Footer is placed at y=4.0, below the 2×2 card grid (cards at y=1.35 and y=2.65, h=1.05). Bottom of lower cards = 2.65+1.05 = 3.7. Footer at 4.0 gives only 0.3-inch gap. May clip or overlap.
- **Severity:** Should fix
- **Resolution:** Pending build — move footer to y=4.2 if overlap confirmed.

#### Finding 3: Speaker notes format completeness
- **Location:** All 5 slides — notes in slides-s1.js, slides-s2.js, slides-s3.js
- **Issue:** All notes follow the TALKING POINTS / PACING / TRANSITION format from `presentation-best-practices.md`. Speakable sentences present. Audience callouts ([FOR DEVS:], [FOR PM:], [FOR MANAGERS:]) used on Slides 2, 4, 5.
- **Substantiated waiver:** I audited all 5 slides' notes against the 4 required elements (TALKING POINTS, PACING, TRANSITION, audience callouts where relevant) and all 5 are compliant. No issues from this perspective.

---

### Technical Architect — Code Structure Review

#### Finding 1: pptxgenjs resolution fallback
- **Location:** `build.js`, lines 15-26 — dual require() with try-catch
- **Issue:** The fallback path hardcodes `/home/rocky00717/.npm-global/lib/node_modules/pptxgenjs`. This is correct for the stated environment but would fail on any other machine. Add a comment noting this is environment-specific.
- **Severity:** Nice to have
- **Resolution:** Comment added inline.

#### Finding 2: `addCard` uses `pres.ShapeType` but pres is second arg
- **Location:** `theme.js`, `addCard(slide, pres, opts)` — pres is passed correctly
- **Issue:** The calling code in `slides-s2.js` and `slides-s3.js` passes `addCard(slide2, pres, {...})` correctly. But `addStat(slide3, pres, {...})` also passes pres, and the function signature `addStat(slide, pres, opts)` is consistent. No issue — just worth verifying in a live run that pres.ShapeType resolves correctly before pres has any slides.
- **Severity:** Should fix (verify in live run)
- **Resolution:** Pending build — static review cannot confirm. Pattern is consistent with pptxgenjs docs.

#### Finding 3: Module exports consistency
- **Location:** All three section files — `module.exports = function addSectionN(pres)`
- **Issue:** All three section files use named function exports (`function addSection1(pres)`). This is correct. However, the function names (addSection1/2/3) differ from the variable names in build.js (addSection1/2/3) — they match. No issue.
- **Substantiated waiver:** I audited all require() calls in build.js against the exports in slides-s1.js, slides-s2.js, slides-s3.js, and theme.js. All exports and imports are consistent. No structural issues.

---

### Product Manager — Deck Delivery Review

#### Finding 1: Primary takeaway reinforcement
- **Location:** Slides 1, 3, 4 — primary takeaway presence
- **Issue:** Slide 1 frames it ("what we pulled off"), Slide 3 states it explicitly ("All Q4 Commitments: Shipped" as title), Slide 4 echoes it ("Shipped in 11 weeks"). Slide 2 is a list slide — the takeaway isn't restated there. Adding a subtle "Q4: 4/4 delivered" label on Slide 2 would close the loop.
- **Severity:** Nice to have
- **Resolution:** Deferred — the slide count (5) and pace leave little room for additions. The framing on Slides 1, 3, 4 is sufficient.

#### Finding 2: Q1 preview actionability
- **Location:** `slides-s3.js`, Slide 5 — Q1 items
- **Issue:** The three Q1 items (Blog, A11y, Search) include status labels ("In design", "Scoped", "Spec complete") which is actionable. The CTA "grab [PM name] after standup" is present in speaker notes. The Notion link mention ("ask your PM for the link") is on-slide.
- **Substantiated waiver:** I audited Slide 5 against the "actionable takeaway for each audience segment" criterion. Devs have a specific callout in notes ("[FOR DEVS:] accessibility audit touches same components"). PM visibility is clear. Gate met.

#### Finding 3: Placeholder metric risk
- **Location:** `slides-s2.js`, Slide 3 — all 4 stat numbers and labels include "(PLACEHOLDER)" in the label text
- **Issue:** The placeholder text "(PLACEHOLDER)" will appear on-slide in the generated PPTX. The presenter needs to replace these values before the standup. A comment in build.js or a README note would make this unavoidable to miss.
- **Severity:** Must fix
- **Resolution:** MATERIALS_INDEX.md already notes the placeholders. Additionally, the speaker notes for Slide 3 open with "[IMPORTANT: Replace all metrics below with real Q4 numbers before presenting]." Recommend presenter replace before running build, not after.

---

## Synthesis Table

| Severity | Count | Key Issues |
|----------|-------|------------|
| Must fix | 1 | Placeholder metric text will appear on-slide — replace before presenting (informational; MATERIALS_INDEX + notes already warn) |
| Should fix | 3 | Stat grid bottom-row spacing, footer overlap on Slide 2, pres.ShapeType resolution verify |
| Nice to have | 2 | Q4:4/4 label on Slide 2, hardcoded npm path comment |

**Gate status: INCOMPLETE** — Phase 8 gate requires live build run with exit code 0 captured. Static review only.
