# Style Guide — OTel Migration Deck

**Generated:** 2026-04-21 — Phase 4 complete.

---

## 1. Color Palette

Theme: **Charcoal Executive** — restrained corporate-technical, optimized for data-heavy slides with dark authority and clean light content areas.

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Primary (dominant) | Charcoal | `1A2332` | Dark slide backgrounds, section dividers, title |
| Secondary | Steel Blue | `2E5D8E` | Card accent borders, section header tints, links |
| Accent | Electric Teal | `00B4A6` | Key stats, CTAs, callout highlights, progress indicator |
| Content Background | Off-White | `F7F8FA` | All light/content slides |
| Text (on dark) | Ice White | `EEF2F7` | Body and title text on dark slides |
| Text (on light) | Charcoal Dark | `1A2332` | Body and title text on light slides |
| Semantic: Warning | Amber | `F59E0B` | Callouts for things that went wrong, gotchas |
| Semantic: Success | Sage Green | `10B981` | Things that went well, ROI confirmation |
| Semantic: Danger | Signal Red | `EF4444` | Critical failures, "cardinality explosion" chart line |

**Palette rules:**
- Primary (Charcoal `1A2332`) is dominant: 60-70% coverage on dark slides.
- Teal `00B4A6` is the accent — use sparingly for maximum visual pop.
- Never introduce off-palette colors. Code blocks use `2D3748` (dark) on dark slides.

---

## 2. Typography

| Element | Font | Size | Weight | Notes |
|---------|------|------|--------|-------|
| Slide title (dark bg) | Calibri | 40pt | Bold | Ice White `EEF2F7`, line-height 1.1 |
| Slide title (light bg) | Calibri | 36pt | Bold | Charcoal `1A2332` |
| Section header | Calibri | 24pt | Bold | Steel Blue `2E5D8E` on light slides |
| Body text | Calibri | 15pt | Regular | Dark `1A2332` on light; `EEF2F7` on dark |
| Code snippets | Consolas | 13pt | Regular | Monospace; on `2D3748` dark block |
| Big stats / numbers | Calibri | 56pt | Bold | Teal `00B4A6`, paired with 13pt label below |
| Captions / footnotes | Calibri | 11pt | Regular | 60% opacity of body color |
| Quote / callout text | Calibri | 17pt | Italic | Amber `F59E0B` for "gotcha" quotes |

---

## 3. Slide Structure Patterns

### Dark slides (bookends + section dividers)
- **Background:** Charcoal `1A2332`
- **Text:** Ice White `EEF2F7`
- **Usage:** Title (slide 1), all 4 section divider slides, closing slide
- **Pattern:** Full-bleed hero image (generated) on right 60% of slide; left 40% has section number + title in large type + subtitle in 17pt; small teal accent rule (3px) above section number

### Light slides (all content)
- **Background:** Off-White `F7F8FA`
- **Title area:** Thin Steel Blue left-border rule (3px, full height) + Charcoal title text
- **Pattern options** (vary across consecutive slides):
  - **Two-column:** Text + chart/image (60/40 split)
  - **Card grid:** 2×2 or 2×3 cards with teal left-border accent and shadow
  - **Big stat + context:** Single giant stat (teal, 56pt) + 2-3 bullet points
  - **Code block + callouts:** Dark `2D3748` code block left, callout cards right
  - **Full-width data table:** Zebra rows (alternating `F7F8FA` / `E8EDF4`)
  - **Timeline row:** Horizontal progress bar across top, milestones below

### Accent patterns
- **Card:** `F7F8FA` background, 3px left-border in `2E5D8E`, `1px` `DADFE8` border, 4px box shadow (soft black 10% opacity)
- **Stat callout:** Large number in teal `00B4A6` 56pt; label in Charcoal 13pt below; enclosed in a subtle card
- **Code block:** Background `2D3748`, text `E2E8F0`, 8px corner radius
- **Warning band:** 3px left-border in Amber `F59E0B`; used on "gotcha" or "what went wrong" callouts
- **Success band:** 3px left-border in Sage `10B981`; used on "what went well" callouts

---

## 4. Visual Motifs

### Motif 1: Section Progress Tracker
A horizontal progress indicator appears on each section divider slide, in the top-right corner.
- 6 small circles (one per section + close), filled with Teal `00B4A6` for completed, outline only for upcoming.
- Labels underneath in 9pt Ice White.
- This gives audience spatial orientation without cluttering content slides.

### Motif 2: Left Accent Border Card
All content cards use a 3px left vertical border in Steel Blue `2E5D8E` (or Amber for warnings, Sage for successes).
Used consistently for: timeline milestones, key findings, "what went wrong" / "what went right" boxes, decision matrix cells.

### Motif 3: Big Stat Callout
Any key metric (cost figures, timeline slips, alert counts) gets the big-number treatment:
- Number in Teal 56pt
- Label in Charcoal 13pt
- Brief context in 11pt below
Example: `$720K` / `annual Datadog spend` / `(up from $180K — 4×)`

### Motif 4: 4-Phase Timeline (Section 3 only)
A horizontal 4-box pipeline diagram is the visual anchor for Section 3. It appears on every Section 3 slide, with the current act highlighted in Teal and prior acts in Sage, future acts in outline. This is rendered directly in pptxgenjs (rectangles + connectors) — not an AI image.

---

## 5. Image-Prompt Prefixes

Q8 = `selective`. AI-generated images for 4 section divider slides only.

**For dark section-divider images (full-bleed, no transparency):**
> "Minimalist corporate-technical illustration. [SUBJECT]. Dark navy background hex 1A2332. Teal accent hex 00B4A6, steel blue hex 2E5D8E. Clean modern geometric style. No text. Centered composition with left third clear for text overlay."

**For light-background content slide images (with transparency):**
> "Minimalist flat-vector illustration. [SUBJECT]. White background. Teal hex 00B4A6, steel blue hex 2E5D8E, charcoal hex 1A2332. Clean modern style. Centered. Transparent background."

---

## 6. Image Plan (Q8 = selective — 4 images)

Image file names align with actual slide numbers in the Layout Sequence table.

| # | File | Slide # | Subject | Transparency | Aspect |
|---|------|---------|---------|-------------|--------|
| 1 | `images/02-section1-invoice.jpg` | 2 (S1 divider) | "A shattered glass invoice document or escalating bar chart, dark technical aesthetic, cost explosion motif" | No (dark bg) | 16:9 |
| 2 | `images/10-section3-pipeline.jpg` | 10 (S3 divider) | "Abstract data pipeline flow diagram, nodes and connectors, observability / telemetry migration theme" | No (dark bg) | 16:9 |
| 3 | `images/17-section4-warning.jpg` | 17 (S4 divider) | "Warning signal or maze-like labyrinth, complexity and hidden danger theme, technical platform engineering" | No (dark bg) | 16:9 |
| 4 | `images/21-section5-lessons.jpg` | 21 (S5 divider) | "Retrospective or compass / navigation motif, lessons learned theme, forward-looking technical team" | No (dark bg) | 16:9 |

*(Phase 5 must-fix applied: file names now match slide numbers in Layout Sequence.)*

---

## 7. Slide Layout Sequence (23 slides)

Consecutive layouts must vary. Do not repeat the same layout back-to-back.

| Slide | Section | Layout | Image reference |
|-------|---------|--------|-----------------|
| 1 | Title | Dark, typography only | — |
| 2 | S1 divider | Dark, hero image right | `images/02-section1-invoice.jpg` |
| 3 | S1 — Cost curve | Light, big-stat + chart | — |
| 4 | S1 — Cardinality defined | Light, two-column: definition left, tag explosion diagram right | — |
| 5 | S1 — Human moment | Light, pull-quote center: "I had to explain this in a board call without knowing why it was happening." | — |
| 6 | S2 divider | Dark, typography only | — |
| 7 | S2 — Decision matrix | Light, 3-column card grid [Cost / Portability / Operational Burden] | — |
| 8 | S2 — Why portability > cost | Light, two-column | — |
| 9 | S2 — Rejected alternatives | Light, comparison columns | — |
| 10 | S3 divider | Dark, hero image right | `images/10-section3-pipeline.jpg` |
| 11 | S3 — Act 1: Collector | Light, timeline row (4-box pipeline at top, current act highlighted) + code block | — |
| 12 | S3 — Act 2: Traces | Light, timeline row + two-column | — |
| 13 | S3 — Act 3: Metrics | Light, timeline row + two-column | — |
| 14 | S3 — Act 4: Logs + alerting | Light, timeline row + card grid (what went well / what went wrong) | — |
| 15 | S3 — Slip post-mortem | Light, big-stat (10 months vs 6 planned) | — |
| 16 | S3 — Alerting rewrite | Light, code block + callouts | — |
| 17 | S4 divider | Dark, hero image right | `images/17-section4-warning.jpg` |
| 18 | S4 — Cardinality still bites | Light, two-column | — |
| 19 | S4 — Sampling is harder | Light, two-column | — |
| 20 | S4 — Alerting rewrite (30%) | Light, big-stat | — |
| 21 | S5 divider | Dark, hero image right — Subtitle: "That invoice that broke our brain? Here's how you don't get one." | `images/21-section5-lessons.jpg` |
| 22 | S5 — Lessons + first step | Light, card grid (4 lesson cards) + full-width teal accent CTA card below: "Your first step: audit tag cardinality today." | — |
| 23 | Closing | Dark, typography only | — |

**Build path note:** `build-deck/` and `images/` are sibling directories under the workdir root.
In `theme.js`, use `const IMG = path.join(__dirname, '..', 'images');` (i.e., `../images/` from `build-deck/`).

**pptxgenjs connector note:** Motif 4 (timeline pipeline) must be rendered using thin rectangles
and manual line/rectangle connectors — pptxgenjs does not support true SmartArt connectors.
Use 4 rounded rectangles + 3 thin rectangles as arrows between them.

*(Phase 5 must-fix applied: slide count corrected to 23, image file names matched, pull-quote text added, decision matrix headers added, build path clarified.)*
*(Phase 5 should-fix applied: Section 5 divider subtitle set as callback opener; first-step CTA given full-width accent card treatment on slide 22.)*

---
