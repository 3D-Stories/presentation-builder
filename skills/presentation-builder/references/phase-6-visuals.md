# Phase 6: Visual Generation

## Prerequisite (hard gate)

Phase 6 runs ONLY when Q8 (Visual Strategy) is `full` or `selective`.
If Q8 = `text-only`, SKIP this phase entirely and advance to Phase 7.

If Q8 ≠ `text-only` AND Replicate MCP is NOT configured, STOP. Do NOT
proceed. Do NOT produce an `IMAGE_PLAN.md` as a substitute. An empty
`images/` directory is not acceptable output. Phase 2 should have
caught this via the setup re-entry path — if it wasn't caught, halt
here and ask the user to configure Replicate now.

## Process

Read `style-guide.md`. It defines the image plan (which slides get images,
with what prompts, at what aspect ratio). For each image in the plan:

1. **Generate.** Call `mcp__replicate__create_predictions` with:
   - `model`: `"google/nano-banana-2"` (production quality) or
     `"black-forest-labs/flux-schnell"` (quick drafts when iterating on
     concepts)
   - `input.prompt`: `<style guide's prompt prefix> + <image subject
     description from the plan>`
   - `input.aspect_ratio`: `"16:9"` (or `"4:3"` if the style guide
     specifies it)

2. **Download.** Call `mcp__replicate__download_files` and save the
   result to `images/NN-<slug>.jpg`, where `NN` is the slide number
   (zero-padded) and `<slug>` is a short kebab-case name from the
   plan.

3. **Background-remove** for slides with a light background
   (content slides). Call `mcp__replicate__create_predictions` with:
   - `model`: `"recraft-ai/recraft-remove-background"`
   - `input.image`: the generated image file
   Then download to `images/NN-<slug>.png` (same slug, different
   extension). Update the build script's image reference.

Batch 4 image generations in parallel — call `create_predictions` four
times in the same message, wait for all four to complete, then download
all four, then proceed to the next batch of 4.

## Skip rules for background removal

- **Skip** for dark section-divider images (used as full-bleed backgrounds).
- **Skip** for full-infographic images where the background IS the design.
- **Skip** for charts or diagrams with colored bands that would be damaged.
- **Always run** for character illustrations on light slides.
- **Always run** for icon/flow diagrams on light slides.
- **Always run** for any illustration with a distinct white background on
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
what would be generated, then advancing to Phase 7 without calling the
MCP. This is NOT Phase 6 completion. The output of this phase is image
files on disk, not a plan document.

Another failure: generating images one-at-a-time sequentially. Four
parallel calls per batch is explicit — do not serialize what the MCP
supports concurrently.

## Image generation tips

- **Be specific** in prompts: "a gold trophy with two handles" not "an award".
- **Include hex codes** for colors: "teal hex 0891B2" not just "teal".
- **White backgrounds** produce cleaner bg removal than black.
- **4:3 aspect ratio** gives more vertical space if 16:9 crops subjects.
