# Style Guide — OTel Migration Deck

**Applies to:** All slides and AI-generated images for the OTel migration presentation.
**Created:** 2026-04-21 — Phase 4 (Style Guide)

---

## 1. Color Palette

Theme: **Midnight Executive** (modified for technical credibility)

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Primary (60%) | Deep Navy | `1B2A4A` | Dark slide backgrounds, section dividers, title slide |
| Secondary (20%) | Steel Blue | `2D6A9F` | Subheadings, card borders, chart series 2 |
| Accent (10%) | Signal Teal | `00B4D8` | Key stats, CTAs, highlight boxes, chart series 1 |
| Content Background | Cloud White | `F8FAFC` | All light content slide backgrounds |
| Text on Dark | Ice White | `E8F4FD` | Body text on navy/dark slides |
| Text on Light | Slate | `1E3A5F` | Body text on light content slides |
| Semantic: Success | Moss Green | `2D7D46` | "What went well" items, positive outcomes |
| Semantic: Warning | Amber | `D97706` | "What didn't go well" items, caution notes |
| Semantic: Danger | Coral | `DC3545` | Cost overruns, critical findings |
| Chart Base | Light Gray | `E2E8F0` | Chart backgrounds, divider lines |

**Color roles summary:**
- `1B2A4A` Deep Navy: Title slide, section dividers, closing slide
- `F8FAFC` Cloud White: All content slides background
- `00B4D8` Signal Teal: Key statistics, headline numbers, accent borders on cards
- `2D6A9F` Steel Blue: Supporting headers, chart elements, code block backgrounds
- `1E3A5F` Slate: All body copy on light slides

---

## 2. Typography

All fonts are system-safe.

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Slide title (dark) | Calibri | 40pt | Bold | `E8F4FD` Ice White |
| Slide title (light) | Calibri | 38pt | Bold | `1E3A5F` Slate |
| Section divider title | Calibri | 48pt | Bold | `E8F4FD` Ice White |
| Section divider subtitle | Calibri | 20pt | Regular | `00B4D8` Signal Teal |
| Body text | Calibri | 16pt | Regular | `1E3A5F` Slate |
| Bullet point | Calibri | 15pt | Regular | `1E3A5F` Slate |
| Big stat number | Calibri | 60pt | Bold | `00B4D8` Signal Teal |
| Big stat label | Calibri | 14pt | Regular | `2D6A9F` Steel Blue |
| Code snippet | Consolas | 13pt | Regular | `E8F4FD` Ice White (on `1E3A5F` bg) |
| Caption / footnote | Calibri | 11pt | Regular | `2D6A9F` Steel Blue |
| Card heading | Calibri | 17pt | Bold | `1E3A5F` Slate |
| Callout / highlight box | Calibri | 15pt | Bold | `1B2A4A` Deep Navy |

---

## 3. Slide Structure Patterns

### Dark slides (navy background `1B2A4A`)
Use for:
- Title slide (Section 0, slide 1)
- All 5 section divider slides
- Closing / Q&A slide (Section 6)

Pattern: Full-bleed navy background. Section number in Signal Teal top-left. Title centered or
left-aligned in Ice White at 48pt. Optional subtitle in Signal Teal 20pt below title.
Optional hero image (right half or full bleed with 60% opacity navy overlay).

### Light slides (cloud white background `F8FAFC`)
Use for:
- All content slides (Sections 1–5)
- Agenda slide

Pattern: 2pt Signal Teal accent bar across top (full width, 4px height).
Title in Slate 38pt top-left. Body content area begins at y=1.2in.
Bottom strip: 0.3in deep, Deep Navy `1B2A4A`, with section name in Ice White 11pt.

### Card pattern (for list content)
A content card is a white rectangle with a 4pt left-border accent in Signal Teal or Steel Blue,
very subtle drop shadow (soft, 4pt offset). Used for "what went well / what didn't" lists,
the three-traps section, and actionable takeaways. Cards sit on the cloud-white slide background.

### Stat callout pattern
Big number (60pt Signal Teal) above a small label (14pt Steel Blue). Used on slides with
1–3 key metrics. Always accompanied by 1-line context sentence below the label.

### Code block pattern
Dark background rectangle (`1E3A5F` Slate), Consolas 13pt Ice White text, 8pt padding.
Used for any YAML/config snippets. Maximum 12 lines per block.

### Comparison column pattern (Before / After)
Two columns, separated by a thin vertical divider line in Light Gray `E2E8F0`.
Left column header: "Before (Datadog)" in Amber. Right column header: "After (OTel)" in Moss Green.
Used in Section 5.

---

## 4. Visual Motifs

### Primary motif: Cost-curve line
A simple line chart showing cost over time (`$180k → $720k` Datadog trajectory) first appears
in Section 1. The SAME chart style reappears in Section 5 with an extended data point showing
OTel run-rate. This is the narrative anchor — it bookends the talk visually.

**Chart spec:** Single line, Signal Teal `00B4D8`. X-axis: years (Year 1–5). Y-axis: annual
cost in USD ($0–$800k). Data point markers as solid dots. Gridlines in Light Gray.
The Section 1 instance ends at Year 3 ($720k) with a dotted line projecting further growth.
The Section 5 instance shows Year 4 data point dropping to the OTel run-rate.

### Secondary motif: Section progress indicator
A subtle row of 5 dots appears at the bottom-right of each section divider slide.
The current section's dot is filled Signal Teal; previous sections are filled Steel Blue;
future sections are hollow (outline only). Diameter: 8pt. Spacing: 12pt.

### Card border color convention
- Signal Teal `00B4D8` border: positive outcomes, "what went well"
- Amber `D97706` border: warnings, "what didn't go well"
- Coral `DC3545` border: critical findings, must-fix items

### Icon style
Flat vector icons only (no 3D, no gradients). Line-weight icons in Steel Blue `2D6A9F`
or Signal Teal `00B4D8`. Size: 32–48pt. Sources: built-in PowerPoint shapes or Unicode
characters at 24pt in Wingdings/Segoe UI Symbol as fallback.

---

## 5. Image-Prompt Prefixes (Q8 = selective)

AI-generated images are used for: section divider hero images and the Section 4
"three traps" motif illustration. Native PPTX diagrams are used for: collector
architecture, Gantt timeline, cost-curve chart.

**For light-background content slides (transparent PNG requested):**
> "Technical corporate illustration. [Subject]. Solid white background. Colors: deep navy hex 1B2A4A, steel blue hex 2D6A9F, signal teal hex 00B4D8. Clean modern minimal style. Centered subject. No text labels."

**For dark section-divider slides (full-bleed JPG, no transparency):**
> "Technical corporate illustration. [Subject]. Dark navy background hex 1B2A4A. Accent colors: signal teal hex 00B4D8, steel blue hex 2D6A9F. Clean modern style. Cinematic lighting. No text."

---

## 6. AI Image Generation Plan (selective — 5 images)

| # | File | Slide | Type | Subject | Transparency |
|---|------|-------|------|---------|--------------|
| 1 | `images/01-title-hero.jpg` | Title (slide 1) | Dark divider | Abstract network topology, signal flowing through nodes — OTel pipeline metaphor | No |
| 2 | `images/05-s1-divider.jpg` | Section 1 divider | Dark divider | Close-up of a financial report with a red-trending cost line | No |
| 3 | `images/10-s2-divider.jpg` | Section 2 divider | Dark divider | Crossroads / decision path, two routes diverging in a data center corridor | No |
| 4 | `images/17-s3-divider.jpg` | Section 3 divider | Dark divider | Four sequential building blocks assembling into a pipeline, industrial/technical style | No |
| 5 | `images/22-s4-divider.jpg` | Section 4 divider | Dark divider | Three glowing warning signs emerging from technical infrastructure fog | No |

Section 5 and Section 6 dividers use the recurring cost-curve chart (native element) rather
than a new AI image — the callback is stronger when it uses the same visual language.

---

## 7. Slide-by-Slide Layout Plan

| Slide | Section | Layout | Key Elements |
|-------|---------|--------|--------------|
| 1 | Title | Dark, hero image full-bleed | Title, subtitle, speaker name/date |
| 2 | Agenda | Light | 5-row table listing sections + time allocations |
| 3 | S1 divider | Dark, hero image | "The Datadog invoice that broke our brain" |
| 4 | S1-1: The inciting moment | Light | Big-text quote slide, one-sentence story beat |
| 5 | S1-2: The cost curve | Light | Line chart (native), Stat callout ($720k/yr) |
| 6 | S1-3: ROI summary | Light | 3-stat callout: "9 months", "14-month payback", "current run-rate" |
| 7 | S2 divider | Dark, hero image | "Why OTel (and why we rejected the alternatives)" |
| 8 | S2-1: We almost went New Relic | Light | Two-column: New Relic pros vs. OTel pros |
| 9 | S2-2: Decision criteria | Light | Card grid (portability, standardization, ecosystem) |
| 10 | S2-3: The choice | Light | Single statement slide, bold central text |
| 11 | S3 divider | Dark, hero image | "The migration in four acts" |
| 12 | S3-1: Overview / Gantt | Light | Horizontal bar chart, 4 rows (collector/traces/metrics/logs). Planned=hollow outline bar, actual=filled Signal Teal bar. X-axis in weeks. Title: "Migration Timeline: Planned vs. Actual" |
| 13 | S3-2: Collector architecture | Light | Native PPTX flow diagram: Receivers (OTLP, Prometheus) → Processors (batch, filter, sampling) → Exporters → Backend split (Mimir/Tempo/Loki). Left-to-right, Signal Teal arrows, Steel Blue component boxes |
| 14 | S3-3: Act 1 — Collector | Light | Two-column: what went well (teal card) / what didn't (amber card) |
| 15 | S3-4: Act 2 — Traces | Light | Two-column: what went well / what didn't |
| 16 | S3-5: Act 3 — Metrics | Light | Two-column: what went well / what didn't |
| 17 | S3-6: Act 4 — Logs | Light | Different layout from 14–16: Pipeline/flow diagram showing log path (fluentbit → OTel collector → Loki), callout boxes for what changed |
| 18 | S3-7: Timeline lessons | Light | 3 stat callouts: actual vs. planned per phase |
| 19 | S4 divider | Dark, hero image | "The three traps we didn't see coming" |
| 20 | S4-1: Trap 1 — Cardinality | Light | Stat callout (3× cardinality spike in 2 weeks) + code block (label explosion example) + story beat: "Day 14 post-migration, 4000 alerts in one hour" |
| 21 | S4-2: Trap 2 — Sampling | Light | Decision-tree diagram (native). Root: "What's your backend retention cost?" Left: high volume/low cost → tail-based. Right: low volume/high cost → head-based. One decision-rule callout. |
| 22 | S4-3: Trap 3 — Alerting rewrite | Light | Stat callout (30% of total effort) + card: what triggers a rewrite |
| 23 | S4-4: Synthesized lesson | Light | Single bold statement: "OTel doesn't eliminate observability debt — it moves it." Echoed again in Section 5. |
| 24 | S5 divider | Dark | Standard dark section divider. Title: "What we'd do differently." No AI image — uses section progress dots motif only. |
| 25 | S5-1: Cost curve callback | Light | Cost-curve line chart (same style as slide 5), extended with Year 4 OTel data point. Caption: "That Q3 budget line item? Here's what it looks like now." |
| 26 | S5-2: What we'd do differently | Light | Card grid (3 cards: start with traces, do sampling in week 2, budget alerting rewrite). Echo: "OTel moves debt — here's how to move it on your terms." |
| 27 | S5-3: Your first steps | Light | Two-column: Engineering Leaders (3-step checklist) / Platform ICs (3-step checklist) |
| 28 | Q&A / Thank you | Dark | Contact info, deck URL, thank you |

**Total: 28 slides** (updated from 27 — Section 5 has 3 content slides + divider = 4; prior count was 2+divider=3. Spec updated below.)

**Note:** Spec total slide count updated to 28 to match this corrected layout plan.
