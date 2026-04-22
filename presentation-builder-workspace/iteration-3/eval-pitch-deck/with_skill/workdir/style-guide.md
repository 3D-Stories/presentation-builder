# FitLoop Pitch Deck — Style Guide

**Date:** 2026-04-21
**Presentation:** FitLoop Seed Pitch Deck
**Format:** PPTX (pptxgenjs)
**Q8 Visual Strategy:** `full` — AI-generated images on all content slides

---

## 1. Color Palette

Theme: **Coral Energy** — performance fitness, bold credibility, VC-appropriate warmth

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Primary (60%) | Coral | `F96167` | Accent borders, section divider headings, CTAs |
| Secondary | Deep Navy | `2F3C7E` | Dark slide backgrounds, heavy headers |
| Accent | Gold | `F9E795` | Stat callout highlights, key number backgrounds |
| Content Background | Off-White | `FAFAFA` | All content slides background |
| Text on Dark | White | `FFFFFF` | Text on navy/coral dark slides |
| Text on Light | Charcoal | `222222` | Body text on off-white slides |
| Text Light | Medium Grey | `555555` | Captions, labels, secondary text on light slides |
| Success | Moss Green | `4CAF50` | "What we have" column in close slide |
| Warning | Amber | `FFA726` | "What we're figuring out" column in close slide |

### Color Roles Summary
- **Primary (dominant 60-70%):** Coral `F96167` — accent borders, highlights, CTAs
- **Secondary:** Deep Navy `2F3C7E` — dark slide backgrounds, section dividers
- **Accent:** Gold `F9E795` — stat callout backgrounds, hero number emphasis
- **Content background:** Off-White `FAFAFA` — all content slides

---

## 2. Typography

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Slide title | Montserrat | 40pt | Bold | White (dark slides) / Charcoal `222222` (light) |
| Section header | Montserrat | 24pt | Bold | Coral `F96167` |
| Body text | Open Sans | 15pt | Regular | Charcoal `222222` |
| Stat / big number | Montserrat | 54pt | Bold | Coral `F96167` or Gold `F9E795` |
| Stat label | Open Sans | 13pt | SemiBold | Medium Grey `555555` |
| Stat context note | Open Sans | 11pt | Regular | Medium Grey `555555` |
| Caption | Open Sans | 11pt | Regular | Medium Grey `555555` |
| Pull quote | Montserrat | 22pt | Italic | Deep Navy `2F3C7E` |

**Stat callout block max-height:** 2.5 inches. If context note pushes past that, reduce context note to 11pt.

**System-safe fallback fonts:** Arial (replaces Montserrat), Calibri (replaces Open Sans) — use if embedding not available.

---

## 3. Slide Structure Patterns

### Dark Slides (section openers + title)
- **Background:** Deep Navy `2F3C7E`
- **Title text:** White `FFFFFF`, 40pt Montserrat Bold
- **Subtitle/label:** Coral `F96167`, 24pt Montserrat Bold
- **AI image:** Full-width or right-half placement, no transparency
- **Used on:** Slides 1 (hook), 3 (problem section opener), 5 (why now), 6 (product section opener), 8 (traction), 12 (close)

### Light Content Slides
- **Background:** Off-White `FAFAFA`
- **Title:** Charcoal `222222`, 40pt Montserrat Bold
- **Body:** Charcoal `222222`, 15pt Open Sans Regular
- **Accent border (left):** 4px Coral `F96167`
- **Cards:** White `FFFFFF` with `makeCardShadow()`
- **Used on:** Slides 2, 4, 7, 9, 10, 11

### Title Slide (Slide 2)
- Background: Dark gradient (Navy `2F3C7E` to `1A2458`)
- Company name: White Montserrat Bold 48pt
- Tagline: Coral `F96167` Montserrat 20pt
- Badge: "Closed Beta / TestFlight" — small, amber background

### Stat Callout Block Pattern
- Container: White card with left border Coral `F96167` (4px)
- Big number: Montserrat Bold 54pt, Coral `F96167`
- Label below number: Open Sans SemiBold 13pt, Grey `555555`
- Context note: Open Sans Regular 11pt, Grey `555555`
- Shadow: `makeCardShadow()`

### Pull Quote Pattern
- Background: Off-White `FAFAFA`
- Quote marks: Coral `F96167`, 60pt
- Quote text: Montserrat Italic 22pt, Deep Navy `2F3C7E`
- Attribution: Open Sans Regular 13pt, Grey `555555`

### Two-Column Layout
- Left column (40%): text/stats
- Right column (60%): image or diagram
- Divider: 1px Coral `F96167` line, 70% height, centered vertically

---

## 4. Visual Motifs

### Motif 1: Left-Border Accent Card
A recurring card pattern with a 4px Coral left border, white fill, subtle shadow. Used for problem framing, product feature callouts, and business model points. Applies to all content cards on light slides.

### Motif 2: Big Stat Callout
Oversized stat number (54pt) with a smaller label and context note below. Used on traction slide (Slide 8) for the four key metrics. The retention stat (72%) gets a Gold `F9E795` background vs. standard white to make it the visual hero.

### Motif 3: Traction Callback Badge
A small "72% / 9 wks" badge appears in the bottom-right corner of Slides 2, 6, and 12 as a visual callback to reinforce the primary takeaway. Coral background, white text, 11pt caption.

---

## 5. Image Prompt Prefixes (Q8 = `full`)

### Light-Background Content Slides
> "Clean modern vector illustration style. [Subject]. On solid white background. Coral hex F96167, Navy hex 2F3C7E, Gold hex F9E795, Off-white hex FAFAFA. Minimalist design, high contrast, professional, no text. Centered composition. 16:9 landscape aspect ratio."

### Dark-Background Section Dividers
> "Clean modern vector illustration style. [Subject]. Dark Navy background hex 2F3C7E. Coral hex F96167, Gold hex F9E795, White accents. Minimalist design, high contrast, professional, no text, atmospheric. Centered composition. 16:9 landscape aspect ratio."

---

## 6. Image Plan (12 Images)

| Slide | File | Background | Subject | Transparency |
|-------|------|-----------|---------|-------------|
| 1 | `images/01-hook-stat.jpg` | Dark | Abstract athletic form silhouette, minimalist, lone figure in gym setting | No |
| 2 | `images/02-title-reveal.jpg` | Dark | FitLoop concept — phone camera beam of light tracking a squat pattern | No |
| 3 | `images/03-problem-gap.png` | Light | Three-column visual: person, smartphone, empty space — the feedback gap | Yes |
| 4 | `images/04-user-quote.png` | Light | Minimalist illustration of person doing barbell squat with form overlay lines | Yes |
| 5 | `images/05-why-now.png` | Light | Three tech icons: AI chip, person silhouette, fitness tracker wearable device | Yes |
| 6 | `images/06-product-ui.jpg` | Dark | Phone screen showing form tracking overlay during exercise, glowing pose lines | No |
| 7 | `images/07-architecture.png` | Light | Clean diagram of on-device ML pipeline: camera → process → feedback, no cloud | Yes |
| 8 | `images/08-traction-bg.jpg` | Dark | Abstract data visualization, ascending line graph, athletic achievement feeling | No |
| 9 | `images/09-business-model.png` | Light | Clean A/B split diagram, two paths, subscription and freemium forks | Yes |
| 10 | `images/10-use-of-funds.png` | Light | Abstract resource allocation visualization, growth-oriented, clean bar shapes | Yes |
| 11 | `images/11-ask.jpg` | Dark | Upward trajectory abstract — mountain peak, ascending path, ambition | No |
| 12 | `images/12-close.png` | Light | Balanced scale visualization: checkmarks on left, question marks on right | Yes |

**Total images:** 12 (matches slide count)
