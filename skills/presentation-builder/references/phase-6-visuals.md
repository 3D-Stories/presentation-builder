# Phase 6: Visual Generation

## Prerequisite (hard gate)

Phase 6 runs ONLY when Q8 (Visual Strategy) is `full` or `selective`.
If Q8 = `text-only`, SKIP this phase entirely and advance to Phase 7.

If Q8 ≠ `text-only` AND the `/generate-image` skill is not available
(Replicate MCP not configured), STOP. Do NOT proceed. Do NOT produce an
`IMAGE_PLAN.md` as a substitute. An empty `images/` directory is not
acceptable output. Phase 2 should have caught this via the setup re-entry
path — if it wasn't caught, halt here and ask the user to run
`/generate-image:setup` now.

## Process

Image generation is delegated to the `/generate-image` skill. That skill
owns Replicate MCP calls, model selection (Nano Banana 2 vs FLUX Schnell),
and the two-step transparency pipeline (generate on white → background
removal). This Phase 6 file tells you WHAT to generate; `/generate-image`
tells you HOW.

Read `style-guide.md`. It defines the image plan (which slides get images,
with what prompts, at what aspect ratio). For each image in the plan,
invoke the `/generate-image` skill with:

- **Prompt:** The style guide's prompt prefix (light-bg or dark-bg variant,
  per the "Skip rules" section below) + the image subject description from
  the plan.
- **Aspect ratio:** `16:9` by default, or `4:3` if the style guide specifies.
- **Transparency:** Request transparent PNG (triggers automatic bg removal)
  ONLY for light-background slides where the image will sit on an
  off-white card — see "Skip rules" below. Dark section-divider images
  should NOT request transparency.
- **Output path:** `images/NN-<slug>.{jpg|png}` where `NN` is the slide
  number (zero-padded) and `<slug>` is a short kebab-case name from the
  plan. Use `.png` when transparency was requested (it's already a
  transparent PNG); use `.jpg` for full-bleed dark backgrounds.

Batch 4 images in parallel — invoke `/generate-image` four times in the
same message, wait for all four to complete, then proceed to the next batch.

## Skip rules for background removal

These rules decide whether to request transparency when invoking
`/generate-image`. (The `/generate-image` skill handles the two-step
pipeline itself once you've requested transparency — you do not call the
background-removal model directly from here.)

- **No transparency** for dark section-divider images (used as full-bleed backgrounds).
- **No transparency** for full-infographic images where the background IS the design.
- **No transparency** for charts or diagrams with colored bands that would be damaged.
- **Transparency** for character illustrations on light slides.
- **Transparency** for icon/flow diagrams on light slides.
- **Transparency** for any illustration with a distinct white background on
  a non-white slide.

## Naming consistently

```
images/
  01-title-hero.jpg            # dark bg, keep as jpg
  02-content-illustration.png  # light bg, transparent png
  03-section-divider.jpg       # dark bg, keep as jpg
  ...
```

## Phase-complete gate

Before advancing to Phase 7, verify:

```bash
ls images/ | wc -l
```

The count MUST equal the number of images in the style guide's plan (or
ALL slides if Q8 = `full`). If the count is 0 or less than the plan,
Phase 6 is NOT complete. Return to the process — generate the missing
images.

If Q8 = `text-only`, no `images/` directory is expected and no gate
applies — the style guide should not list any AI-generated images in
the first place.

## Known failure modes

A common Sonnet failure pattern is writing `IMAGE_PLAN.md` describing
what would be generated, then advancing to Phase 7 without actually
invoking `/generate-image`. This is NOT Phase 6 completion. The output
of this phase is image files on disk, not a plan document.

Another failure: generating images one-at-a-time sequentially. Four
parallel invocations per batch is explicit — do not serialize what
`/generate-image` supports concurrently.

## AI vs. programmatic generation (decision matrix)

Not every visual should be AI-generated. AI image models hallucinate
text — word clouds, labeled diagrams, charts with data labels, and
anything where exact text matters will contain fabricated words.

| Visual type | Method | Why |
|-------------|--------|-----|
| Word clouds | **Programmatic** (d3-cloud / wordcloud2) | AI hallucinates words |
| Charts / graphs | **Programmatic** (chart.js / d3) | Data accuracy required |
| Labeled diagrams | **Programmatic** (SVG / HTML canvas) | Text must be exact |
| Timelines with dates | **Programmatic** | Dates/labels must be accurate |
| Icons / illustrations | **AI** (`/generate-image`) | No text content to corrupt |
| Hero backgrounds | **AI** (`/generate-image`) | Atmospheric, no text needed |
| Abstract patterns | **AI** (`/generate-image`) | Decorative, no accuracy requirement |

When Phase 4 (style guide) defines image prompts, tag each image with
`method: ai` or `method: programmatic`. Phase 7 builds programmatic
visuals as part of the build script; Phase 6 generates AI images only.

## Image format requirements

When invoking `/generate-image` for pptxgenjs builds, always request
**PNG** output. Never request WebP — pptxgenjs has limited WebP support
and PowerPoint may fail to display it. If `/generate-image` returns a
WebP file (check magic bytes, not extension), convert to PNG before
proceeding.

## Cost tracking

Track cumulative Replicate API costs during image generation. After each
`/generate-image` invocation, log the model used and estimated cost:

| Model | Approx. cost per image |
|-------|----------------------|
| Nano Banana 2 | ~$0.01-0.02 |
| FLUX Schnell | ~$0.003-0.01 |
| Background removal | ~$0.01-0.02 |

After all images are generated, print a cost summary:

```
Image Generation Cost Summary
=============================
Images generated: 7
  - AI generated: 5 (Nano Banana 2)
  - Background removed: 3
  - Programmatic: 2 (no API cost)
Estimated total: ~$0.13
```

This is informational — do not block on cost. Present the summary to the
user after Phase 6 completes so they have visibility into API usage.

## Image generation tips

- **Be specific** in prompts: "a gold trophy with two handles" not "an award".
- **Include hex codes** for colors: "teal hex 0891B2" not just "teal".
- **White backgrounds** produce cleaner bg removal than black.
- **4:3 aspect ratio** gives more vertical space if 16:9 crops subjects.
