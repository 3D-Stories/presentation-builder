# Style Guide: Q4 Website Redesign — Team Update Standup

**Visual Strategy:** text-only (no AI-generated imagery)
**Format:** PPTX via pptxgenjs

---

## 1. Color Palette

Theme: **Charcoal Minimal** — clean, professional, low-distraction. Appropriate for an internal engineering standup where content is the focus.

| Role | Color Name | Hex | Usage |
|------|-----------|-----|-------|
| Primary (dominant 60%) | Charcoal | `2D3748` | Dark slide backgrounds, section dividers |
| Secondary | Off-white | `F7FAFC` | Light slide backgrounds, body text on dark |
| Accent | Teal | `0891B2` | Key stats, highlights, CTAs, ship-date badges |
| Content BG | Near-white | `FFFFFF` | Main slide background |
| Text (on dark) | Ice white | `F7FAFC` | Title text on dark slides |
| Text (on light) | Near-black | `1A202C` | Body text, bullets on light slides |
| Semantic: Success | Green | `38A169` | "Shipped" indicators, ✓ badges |
| Semantic: Pending | Amber | `D69E2E` | "In flight" items |

**Note:** NO `#` prefix in hex values in pptxgenjs code.

---

## 2. Typography

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Slide title (dark bg) | Calibri | 40pt | Bold | `F7FAFC` |
| Slide title (light bg) | Calibri | 36pt | Bold | `1A202C` |
| Section subtitle | Calibri | 22pt | Regular | `0891B2` |
| Body / bullets | Calibri | 16pt | Regular | `1A202C` |
| Big stats / numbers | Calibri | 48pt | Bold | `0891B2` |
| Stat label | Calibri | 13pt | Regular | `4A5568` |
| Badge / tag text | Calibri | 12pt | Bold | `FFFFFF` |
| Captions / footnotes | Calibri | 11pt | Regular | `718096` |

Use system-safe fonts only (Calibri is safe for PowerPoint).

---

## 3. Slide Structure Patterns

### Dark slides (primary `2D3748` background):
- **Used for:** Slide 1 (title/context-setter)
- Title: large, centered or left-aligned, color `F7FAFC`
- Subtitle: color `0891B2`, 22pt
- Tag line badge: small rectangle, fill `38A169`, white text

### Light slides (background `FFFFFF`):
- **Used for:** Slides 2, 3, 4, 5
- Title bar: left-aligned, 36pt bold, color `1A202C`
- Thin left-border accent line: 4px, color `0891B2`, runs full height
- Bullets: 16pt, `1A202C`, indent 0.4"

### Accent card patterns:
- **Stat callout:** Rectangle box, fill `EBF8FF` (light teal tint), border `0891B2` 1.5pt, big number `48pt bold 0891B2` + label `13pt 4A5568`
- **Badge:** Small rounded pill, fill `38A169` (shipped) or `D69E2E` (pending), white 12pt bold text
- **Before/after pair:** Two short bullets with → arrow, before in `718096`, after in `1A202C` bold

### Slide dimensions:
- widescreen 16:9 (13.33" × 7.5")

---

## 4. Native Visual Patterns (Q8 = text-only)

Since no AI images are used, visual variety is achieved through:

1. **Accent left-border:** Every light content slide has a 4px vertical teal bar on the left edge, 0.2" from the left margin. Creates consistent visual identity without imagery.

2. **Stat callout boxes:** Numeric wins (Lighthouse scores, A/B lift) get boxed callouts with `EBF8FF` fill and `0891B2` border. These draw the eye to the headline number without needing a chart.

3. **Ship-date badge:** A small green pill badge (`38A169`) with date text appears on nav and hero slides to visually confirm delivery.

4. **Before → After framing:** On slides with before/after content (nav item count, Lighthouse scores), render as two-column text pairs or `old → new` arrow bullets in subdued → bold styling.

5. **Section-opener contrast:** Slide 1 uses the dark charcoal background as a visual "chapter title" moment that snaps the audience to attention before transitioning to the lighter content slides.

---

## 5. Visual Motifs

**Recurring element 1:** The left-border accent bar (4px teal) appears on all light slides. It serves as a visual anchor and shows the audience they're still in the same deck.

**Recurring element 2:** Stat callout boxes (`EBF8FF` fill with teal border) appear whenever a metric is highlighted. Used on slides 3 and 4. The consistent box style makes metrics instantly recognizable.

**Icon style:** No icons — standup context does not need them. Typography hierarchy and color carry the visual weight.

---

## 6. Layout Assignments by Slide

| Slide | Layout | Key Visual Element |
|-------|--------|-------------------|
| 1 — Title | Dark bg, centered | Charcoal bg, teal subtitle, green badge |
| 2 — Navigation | Light bg, left-accent | Before→After bullets, ship-date badge |
| 3 — Hero | Light bg, left-accent | Stat callout box (+12% CTA), bullet list |
| 4 — Performance | Light bg, left-accent | Two stat callout boxes (mobile 42→79, desktop 61→94) |
| 5 — Still Pending | Light bg, left-accent | Two amber-badged pending items, green close line |
