# Style Guide: Auth Migration All-Hands Talk

**Version:** 1.0 (approved after Phase 5 review)
**Date:** 2026-04-21

---

## 1. Color Palette

Theme: **Midnight Executive** (adapted for engineering credibility — dark, technical, trustworthy)

| Role | Hex | Name | Usage |
|------|-----|------|-------|
| Primary (60%) | `1E2761` | Navy | Dark slide backgrounds, section dividers, header bars |
| Secondary | `CADCFC` | Ice Blue | Light accent text on dark slides, subtle borders |
| Accent | `0891B2` | Teal | Key stats, highlights, call-to-action text, progress indicators |
| Content background | `F8F9FC` | Off-White | All content slide backgrounds |
| Text on dark | `FFFFFF` | White | Body text on navy slides |
| Text on light | `1E2761` | Navy | Body text and titles on off-white slides |
| Code block background | `2D2D2D` | Charcoal | Code snippet backgrounds (added Phase 5) |
| Success | `16A34A` | Green | Completed action items (✓) |
| Warning | `D97706` | Amber | Warnings, caveats (e.g., unconfirmed cost figures) |
| Danger | `DC2626` | Red | Incident severity indicators, critical findings |

**Palette rule:** No off-palette colors. If a color isn't in this table, it doesn't belong in the deck.

---

## 2. Typography

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Slide title (dark bg) | Calibri | 40pt | Bold | `FFFFFF` |
| Slide title (light bg) | Calibri | 36pt | Bold | `1E2761` |
| Section header / subtitle | Calibri | 22pt | Bold | `0891B2` |
| Body text | Calibri | 16pt | Regular | `1E2761` (light bg) / `CADCFC` (dark bg) |
| Code snippets | Consolas | 13pt | Regular | `CADCFC` on `2D2D2D` bg |
| Big stats / numbers | Calibri | 56pt | Bold | `0891B2` |
| Stat labels | Calibri | 14pt | Regular | `1E2761` |
| Captions / footnotes | Calibri | 11pt | Regular | `6B7280` (gray — acceptable off-palette for caption use only) |
| Table headers | Calibri | 13pt | Bold | `FFFFFF` on `1E2761` bg |
| Table body | Calibri | 12pt | Regular | `1E2761` |

---

## 3. Slide Structure Patterns

### Dark slides (navy `1E2761` background)
- Title slide (Slide 1)
- Section dividers (Slides 5, 10, 14)
- Closing slide (Slide 17)

Layout for dark slides:
- Full bleed navy background
- AI-generated image (where applicable) as right-side or center accent
- Title in 40pt white Bold, centered or left-aligned at 55% height
- Subtitle/tagline in 18pt ice-blue `CADCFC`
- No content cards — these are visual beats, not content slides

### Light slides (off-white `F8F9FC` background)
- All content slides (Slides 2–4, 6–9, 11–13, 15–16)

Layout for light slides:
- Off-white background `F8F9FC`
- 4pt navy left accent border on all content card elements (color: `1E2761`)
- Slide title top-left, 36pt navy Bold
- Content area starts at Y=1.2in

### Card pattern
- Cards use `FFFFFF` fill with 3pt `1E2761` left-border accent
- Subtle drop shadow (soft, 2pt offset)
- 8pt internal padding
- Card grid: 2-column or 3-column; never 4-column (too dense)

### Code blocks
- Background: `2D2D2D` charcoal
- Font: Consolas 13pt `CADCFC`
- 8pt internal padding
- Rounded corners (4pt radius) — use ROUNDED_RECTANGLE shape

### Stats callout
- Big number: 56pt Bold teal `0891B2`
- Label: 14pt Regular navy `1E2761`, below the number
- Used on "By the Numbers" beats and closing callback

### Timeline visual (Slide 11)
- Horizontal line in teal `0891B2`
- Event dots: teal circles with white labels
- Critical "logins do NOT recover" moment: red `DC2626` dot with ALLCAPS label and bold font
- Background: light `F8F9FC`

---

## 4. Visual Motifs

**Motif 1: Teal left-accent border on content cards**
Every content card has a 4pt left-border in teal `0891B2`. This creates visual rhythm and a sense of "engineered precision" across the deck.

**Motif 2: Progress section indicators**
Each section divider slide (5, 10, 14) includes a small progress row at the bottom:
`○ Legacy Pain  ●●● What We Built  ○ The Incident  ○ Lessons`
(filled circles = completed, hollow = upcoming)
This orients the audience and shows progression.

**Motif 3: Icon-style visual vocabulary**
Where icons are used (action items, checklist), use flat-vector outlined style in navy or teal — no filled/3D icons.

---

## 5. Image-Prompt Prefixes (Q8 = selective)

These prefixes apply to all AI-generated images in this deck.

**For dark-background section divider slides:**
> "Flat vector illustration, minimal style. [Subject]. Dark navy background hex 1E2761. Accents in teal hex 0891B2 and ice blue hex CADCFC. Clean modern technical aesthetic. Centered composition."

**For light-background content slides (transparent PNG):**
> "Flat vector illustration, minimal style. [Subject]. On solid white background. Accent colors teal hex 0891B2, navy hex 1E2761. Clean modern style. Centered."

---

## 6. Image Plan (Q8 = selective — 5 images total)

| # | Slide | File | Type | Subject | Prompt suffix |
|---|-------|------|------|---------|---------------|
| 1 | 1 (Title) | `images/01-title-hero.jpg` | Dark bg divider | Abstract circuit/network pattern suggesting auth infrastructure | "Abstract circuit board network pattern suggesting secure authentication infrastructure. Subtle depth, not busy." |
| 2 | 5 (Section: What We Built) | `images/05-section-divider-built.jpg` | Dark bg divider | Architecture/building blocks motif | "Clean architectural blocks or building layers stacked, suggesting engineering construction." |
| 3 | 10 (Section: The Incident) | `images/10-section-divider-incident.jpg` | Dark bg divider | Alert/incident flame or warning motif | "Minimalist warning triangle or alert symbol with dramatic light rays. Not cartoonish — serious and clean." |
| 4 | 11 (Bug illustration) | `images/11-bug-illustration.png` | Light bg transparent | A broken chain link or mismatched connector | "Two connector pieces that don't match — like mismatched plugs or broken chain links. Symbolizes incompatibility." |
| 5 | 14 (Section: Lessons) | `images/14-section-divider-lessons.jpg` | Dark bg divider | Reflective/path-forward motif | "Abstract path or road diverging into a clear direction, suggesting lessons learned and a better way forward." |
