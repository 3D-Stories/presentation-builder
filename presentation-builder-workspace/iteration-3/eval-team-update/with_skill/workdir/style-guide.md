# Style Guide — Q4 Website Redesign Team Update

**Presentation:** Q4 Website Redesign — What We Shipped
**Format:** PPTX (pptxgenjs)
**Visual Strategy:** text-only (no AI-generated images)

---

## 1. Color Palette

Theme: **Charcoal Minimal** — clean, professional, respects an informal standup setting.

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Primary (dark) | Charcoal | `36454F` | Title slide bg, section divider bg, slide 4 accent bg |
| Secondary (light) | Off-White | `F2F2F2` | Content slide backgrounds |
| Accent | Deep Teal | `0D7377` | Left-border cards, stat numbers, CTAs |
| Text on dark | Ice White | `FFFFFF` | Titles and body on dark slides |
| Text on light | Near Black | `212121` | Body text on light slides |
| Semantic — Success | Moss Green | `4CAF50` | Positive metrics, improvement callouts |
| Semantic — Muted | Mid Gray | `9E9E9E` | Captions, footnotes, secondary labels |

**Color rules:**
- Charcoal (`36454F`) is dominant (60-70%) — used on title + divider slides.
- Off-White (`F2F2F2`) is the content-slide background — keeps it clean and readable.
- Deep Teal (`0D7377`) is the single accent — used sparingly for emphasis only.
- Never introduce off-palette colors. No gradients.

---

## 2. Typography

All fonts are system-safe (no custom font installs required).

| Element | Font | Size | Weight | Color (context) |
|---------|------|------|--------|-----------------|
| Slide title (dark bg) | Calibri | 40pt | Bold | `FFFFFF` |
| Slide title (light bg) | Calibri | 36pt | Bold | `212121` |
| Section header / subtitle | Calibri | 22pt | Bold | `0D7377` (accent) |
| Body text | Calibri | 16pt | Regular | `212121` |
| Big stat number | Calibri | 54pt | Bold | `0D7377` |
| Stat label | Calibri | 12pt | Regular | `9E9E9E` |
| Captions / footnotes | Calibri | 11pt | Regular | `9E9E9E` |
| CTA / action line | Calibri | 14pt | Bold | `0D7377` |

**Typography rules:**
- One font family throughout (Calibri) — avoids font-substitution issues in pptxgenjs.
- Title + body line-height 1.2 — compact for standup pace.
- No italic, no underline for emphasis — use bold or color instead.

---

## 3. Slide Structure Patterns

### Dark slides (Charcoal `36454F` background):
- Slide 1: Title slide — full dark bg, centered title + subtitle + date
- Slide 4: Team recognition — dark bg, large pull-quote, role list below

### Light slides (Off-White `F2F2F2` background):
- Slide 2: Shipped features list — light bg, left-accent card per item
- Slide 3: Metrics — light bg, 2×2 stat callout grid
- Slide 5: Q1 Preview — light bg, card-with-divider layout, CTA line at bottom

### Accent patterns:
- **Left-border card:** 3px solid teal (`0D7377`) on left edge of text block. Used for feature list items (Slide 2) and Q1 items (Slide 5).
- **Stat callout:** Big number in teal (`0D7377`, 54pt bold) + label below in gray (`9E9E9E`, 12pt). Used in 2×2 grid on Slide 3.
- **Pull quote:** Large text (28pt bold, `FFFFFF`) centered on dark slide. Used on Slide 4.
- **CTA line:** 14pt bold teal, bottom of slide. Used on Slide 5.

### Layout rules:
- Content slides: 10% margin on all sides (pptxgenjs: x=0.5, y=0.8, w=9.0 inches)
- Title area: top 15% of slide
- No more than 5 items per bullet list
- No text smaller than 11pt on any slide

---

## 4. Visual Motifs

### Motif 1: Left-accent card border (recurring)
A 3px solid teal vertical bar on the left edge of any card or list item. Appears on Slides 2 and 5. Creates visual rhythm and signals "actionable item."

Implementation in pptxgenjs: a thin rectangle shape (`0D7377`, w=0.05in) placed to the left of each text block.

### Motif 2: Big-stat callout (recurring)
Used on Slide 3. Format: large bold number centered in a quadrant, smaller label below. The teal color on numbers makes the grid scannable at a glance.

### Overall cadence: dark → light → light → dark → light
Slide 1 (dark) → Slide 2 (light) → Slide 3 (light) → Slide 4 (dark) → Slide 5 (light).
This dark/light sandwich creates visual rhythm and makes each slide feel distinct.

---

## 5. Native Visual Patterns (Q8 = text-only)

Since Q8 = `text-only`, no AI-generated images will be used. Visual variety is achieved through:

- **Color blocking:** Dark vs. light slide backgrounds alternate to create rhythm.
- **Typographic hierarchy:** Three size levels per slide (title → header → body) ensure clear visual structure at a glance.
- **Shape-based accents:** Left-border teal bars replace image decoration on content slides.
- **Stat grid:** 2×2 big-number layout on Slide 3 provides visual impact without images.
- **Pull quote:** Large centered text on dark bg (Slide 4) creates an emotionally resonant visual beat.

---

## 6. Slide Dimensions & pptxgenjs Settings

- Layout: `LAYOUT_WIDE` (13.33 × 7.5 inches — standard widescreen)
- Background colors applied via `background: { color: 'HEX' }` on each slide
- No `#` prefix on hex colors (pptxgenjs requirement)
- Shadow factory functions used to avoid option mutation bug
