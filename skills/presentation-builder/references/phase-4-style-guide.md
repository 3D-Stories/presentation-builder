# Phase 4: Style Guide

## Purpose

Create a `style-guide.md` that governs ALL visual output. Every image, every slide, every
color choice should trace back to this document. Consistency is what separates a professional
deck from a collection of slides.

## Process

### 1. Choose a Color Palette

Pick colors that match the TOPIC, not generic blue. Consider the audience and setting.

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

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Slide title | ... | 36-44pt | Bold |
| Section header | ... | 20-24pt | Bold |
| Body text | ... | 14-16pt | Regular |
| Code snippets | Consolas | 12-14pt | Regular |
| Stats/big numbers | ... | 54-60pt | Bold |
| Captions | ... | 10-12pt | Regular |

Use system-safe fonts unless the user specifies custom ones.

### 3. Define Slide Structure Patterns

Specify which slides use which background:
- **Dark slides:** Title, section dividers, closing
- **Light slides:** All content slides
- **Accent patterns:** Left-border cards, stat callouts, code blocks

### 4. Define Image Generation Prompts

Create two prompt prefixes that ALL image generation should use:

**For light-background content slides:**
> "[Style]. [Subject]. On solid white background. [Palette hex codes]. Clean modern style. Centered."

**For dark-background section dividers:**
> "[Style]. [Subject]. Dark [primary color] background hex [code]. [Palette hex codes]. Clean modern style. Centered."

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
