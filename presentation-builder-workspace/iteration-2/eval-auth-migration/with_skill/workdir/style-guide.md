# Style Guide: Auth Migration All-Hands Talk

## 1. Color Palette

Theme: **Midnight Executive** — security/trust connotations (navy + ice blue + teal), professional tone for an engineering all-hands.

| Role | Color Name | Hex | Usage |
|------|-----------|-----|-------|
| Primary (60-70%) | Deep Navy | `1E2761` | Dark slide backgrounds, section dividers, header bars |
| Secondary | Ice Blue | `CADCFC` | Subtle text on dark bg, light accents, secondary labels |
| Accent | Teal | `0891B2` | Key stats, highlights, CTA callouts, accent borders |
| Content Background | Off-white | `F4F6FB` | All content slide backgrounds |
| Text on Dark | White | `FFFFFF` | Headings on dark slides |
| Text on Light | Dark Slate | `1C2340` | Body text on content slides |
| Semantic — Danger | Incident Red | `DC2626` | Used ONLY for incident/outage section (Slide 6-9) accents |
| Semantic — Success | Moss Green | `16A34A` | Used for "✓ delivered" callouts in closing section |

**Dominance rule:** Navy is the dominant color on all dark slides. Off-white is the dominant color on all content slides. Teal is used sparingly as accent only — never as background.

## 2. Typography

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Slide title (dark bg) | Calibri | 40pt | Bold | White `FFFFFF` |
| Slide title (light bg) | Calibri | 36pt | Bold | Dark Slate `1C2340` |
| Section header / divider title | Calibri | 48pt | Bold | White `FFFFFF` |
| Body text | Calibri | 16pt | Regular | Dark Slate `1C2340` |
| Bullet item | Calibri | 15pt | Regular | Dark Slate `1C2340` |
| Code snippets | Consolas | 13pt | Regular | Ice Blue `CADCFC` on dark card |
| Big stats / key numbers | Calibri | 56pt | Bold | Teal `0891B2` |
| Stat label (under big number) | Calibri | 12pt | Regular | Dark Slate `1C2340` or White |
| Captions / footnotes | Calibri | 10pt | Regular | `6B7280` (muted gray) |
| Callout card header | Calibri | 14pt | Bold | Teal `0891B2` or Accent color |

## 3. Slide Structure Patterns

### Dark Slides (title, section dividers, closing)
- Background: Deep Navy `1E2761`
- Text: White `FFFFFF`
- AI-generated image: centered or right-aligned, full or partial bleed
- Used for: Slide 1 (title), Slide 6 (incident divider), Slide 14 (closing)

### Light Content Slides
- Background: Off-white `F4F6FB`
- Left accent border on cards: 4px left border in Teal `0891B2` or Navy `1E2761`
- Text: Dark Slate `1C2340`
- Used for: Slides 2-5, 7-13

### Incident-Special Slides (Section 3 only)
- Background: Off-white `F4F6FB` (same as content)
- Accent color overrides: use Incident Red `DC2626` for danger callouts, timeline event markers at 09:10
- Use sparingly — only for the 14-hour outage section to create visual alertness
- Revert to Teal accent from Section 4 onward

### Card Pattern
- Rectangle with 4px left border in Teal `0891B2`
- Background: White `FFFFFF` (on Off-white slide bg)
- Drop shadow: subtle (2px offset, 20% opacity, `1E2761`)
- Padding: 12px internal
- Use for: key insight callouts, "what we'd do differently" items

### Stat Callout Pattern
- Big number: 56pt Bold Teal `0891B2`
- Label below: 12pt Regular Dark Slate `1C2340`
- Optional sub-label/caveat: 10pt italic muted gray `6B7280` — REQUIRED when using soft metrics like "~12% savings" — must read "estimated, autoscaler still settling" verbatim to maintain speaker credibility
- Used for: 14h 22m, ~31k users, 68% login rate, etc.

## 4. Visual Motifs

### Recurring Visual Anchor: Auth Flow Diagram
The auth-v1 → auth-v2 architecture diagram appears in two forms:
- **Slide 2 (auth-v1):** Simplified box diagram showing: [Browser] → [Session Cookie] → [Sticky LB] → [App Pod]. Grayed-out / "broken" visual treatment (dashed borders, warning color)
- **Slide 3 (auth-v2):** Full architecture from design-doc: [Client] → POST /oauth/token → [id.internal] → JWT + refresh cookie → [Backend services via JWKS]. Clean/green treatment.
This before/after creates a recurring anchor the audience can orient to.

### Accent Border Cards
All key insight callouts use the 4px teal left-border card pattern. Consistent across all sections.

### Icon Style
Flat vector icons, line style (not filled), Dark Slate or Teal color. Used sparingly alongside bullet items.

### Progress Indicator (required on all content slides)
Section number indicator in footer of all content slides: "Section N/5" in small muted caption (10pt, `6B7280`). Required — engineers may arrive late or leave early at all-hands; they need to orient immediately.

## 5. Image-Prompt Prefixes (Q8 = selective)

**For dark-background slides (title, section dividers, closing):**
> "Clean modern digital security illustration. [Subject description]. Dark deep navy background hex 1E2761. Ice blue hex CADCFC and teal hex 0891B2 accent colors. Minimal, professional, no text, no letters. Centered composition. 16:9 aspect ratio."

**For light-background content slides (transparent PNG):**
> "Clean modern flat illustration on pure white background. [Subject description]. Color palette: teal hex 0891B2, navy hex 1E2761, ice blue hex CADCFC. Minimal clean style, no text, no letters. Centered composition with clear edges for background removal."

## 6. Image Plan (Selective — 5 images)

| Slide | Filename | Type | Subject | Bg removal? |
|-------|----------|------|---------|-------------|
| 1 (title) | `images/01-title-hero.jpg` | Dark bg | Locked padlock with circuit board motif, digital security aesthetic | No |
| 6 (incident divider) | `images/06-incident-divider.jpg` | Dark bg | Storm cloud with lightning bolt and broken circuit, incident/warning feeling | No |
| 9 (rollback failed) | `images/09-rollback-failed.png` | Light bg (transparent) | A broken chain link or a door handle that won't turn — concrete visceral image of something that fails to work, more impactful than abstract undo arrow | Yes |
| 11 (rollback ≠ undo) | `images/11-rollback-not-undo.png` | Light bg (transparent) | Two arrows pointing in opposite directions, one labeled with a lock, showing state vs flag concepts | Yes |
| 14 (closing) | `images/14-closing-hero.jpg` | Dark bg | Open padlock with light emanating from it, sense of resolution/achievement | No |

All images: 16:9 aspect ratio.
