# Phase 4: Style Guide

## Purpose

Create a `style-guide.md` that governs ALL visual output. Every image, every slide, every
color choice should trace back to this document. Consistency is what separates a professional
deck from a collection of slides.

## Process

### 0. Check for template analysis

Before offering palette choices, check if `template-analysis.md` exists at
the project root (produced by Phase 0).

If it exists:
1. Read the extracted color palette and font families.
2. **Pre-populate** the style guide's color palette (step 1) and typography
   (step 2) from the template data instead of offering generic options.
3. Present the pre-populated values to the user: "Your template uses
   [font] for titles and [font] for body text, with [hex] as the primary
   accent. I'll use these in the style guide — let me know if you want
   to change anything."
4. Skip the "Suggested palettes" table below — the template IS the palette.
5. Reference extracted assets in the visual motifs section (step 5) —
   e.g., if the template has a diagonal stripe pattern, use it as a
   recurring motif.

If `template-analysis.md` does not exist, proceed with the standard
palette selection below.

### 1. Choose a Color Palette

Pick colors that match the TOPIC, not generic blue. Consider the audience and setting.

**If template colors are available** (from step 0), use those directly and
skip the suggested palettes. Only offer the table below as alternatives
if the user wants to deviate from their brand.

Suggested palettes (or create a custom one):

| Theme | Primary | Secondary | Accent |
|-------|---------|-----------|--------|
| Midnight Executive | `1E2761` (navy) | `CADCFC` (ice blue) | `0891B2` (teal) |
| Forest & Moss | `2C5F2D` (forest) | `97BC62` (moss) | `F5F5F5` (cream) |
| Coral Energy | `F96167` (coral) | `F9E795` (gold) | `2F3C7E` (navy) |
| Warm Terracotta | `B85042` (terracotta) | `E7E8D1` (sand) | `A7BEAE` (sage) |
| Charcoal Minimal | `36454F` (charcoal) | `F2F2F2` (off-white) | `212121` (black) |

Define roles for each color:
- **Primary (dominant 60-70%):** Backgrounds, major elements
- **Secondary:** Subtle text, light accents
- **Accent:** Key stats, highlights, CTAs
- **Content background:** Light slide backgrounds
- **Text colors:** On dark bg, on light bg
- **Semantic colors:** Success (green), warning (amber), danger (red)

### 2. Define Typography

If `template-analysis.md` exists, use the extracted majorFont for titles
and minorFont for body text. Fill in the table with those fonts and verify
the user is happy with them before proceeding.

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Slide title | ... | 36-44pt | Bold |
| Section header | ... | 20-24pt | Bold |
| Body text | ... | 14-16pt | Regular |
| Code snippets | Consolas | 12-14pt | Regular |
| Stats/big numbers | ... | 54-60pt | Bold |
| Captions | ... | 10-12pt | Regular |

Use system-safe fonts unless the user specifies custom ones or a template
analysis provides brand fonts.

### 3. Define Slide Structure Patterns

Specify which slides use which background:
- **Dark slides:** Title, section dividers, closing
- **Light slides:** All content slides
- **Accent patterns:** Left-border cards, stat callouts, code blocks

### 4. Define Image Generation Prompts (conditional on Q8)

Skip this section entirely if Phase 2 Q8 = `text-only` — the style guide
should not include AI image-prompt prefixes when no AI images will be
generated. Instead, add a "Native Visual Patterns" subsection that
specifies how the deck expresses visual variety without AI images
(color blocks, typographic hierarchy, shape-based diagrams, icon sets).

Otherwise (Q8 = `full` or `selective`), create TWO prompt prefixes
that ALL image generation should use:

**For light-background content slides:**
> "[Style]. [Subject]. On solid white background. [Palette hex codes]. Clean modern style. Centered."

**For dark-background section dividers:**
> "[Style]. [Subject]. Dark [primary color] background hex [code]. [Palette hex codes]. Clean modern style. Centered."

The prefixes should use specific style and palette descriptors that trace
back to the color palette chosen in step 1 of this phase.

### 5. Define Visual Motifs

Choose 1-2 recurring visual elements:
- A progress bar that builds across sections
- Accent borders on content cards
- Icon style (flat vector, outlined, etc.)
- Stat callout format (big number + small label)

### 6. Write style-guide.md

Save to `style-guide.md` in the project root. Include ALL of the above.
This file will be read by both the build scripts and the image generation prompts.

## Key Principles

- **Commit to the palette** -- don't introduce off-palette colors
- **Dominance over equality** -- one color dominates, others support
- **Dark/light sandwich** -- dark bookend slides, light content middle
- **Consistent motifs** -- if you use a card pattern, use it everywhere
- **Present before generating** -- get user approval before any images are created

## Phase 4 — Phase-complete gate

Phase 4 is NOT complete until `style-guide.md` exists AND contains all
6 required sections:

1. **Color palette** with at least 4 colors (each with hex code and role label).
2. **Typography table** with at least 4 element types (title, body, code, big-stats, captions, etc.).
3. **Slide structure patterns** (dark/light slide mapping, accent patterns, etc.).
4. **Visual motifs** — at least 1 recurring element (card pattern, progress bar, icon style, etc.).
5. **Image-prompt prefixes** IF Q8 ≠ `text-only`. If Q8 = `text-only`, a
   "Native Visual Patterns" subsection replaces this.
6. **File written** — the content above is saved to `style-guide.md` at
   the project root (not just presented in chat).

A common Sonnet failure pattern is a thin style guide with 3-4 of these
sections and the rest missing. Do NOT advance to Phase 5 with any
required section empty or absent.
