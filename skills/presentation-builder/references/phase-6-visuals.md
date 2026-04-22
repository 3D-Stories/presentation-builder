# Phase 6: Visual Generation

## Purpose

Generate AI images for the presentation using the style guide's prompt prefixes.
Every content slide should have a visual element -- text-only slides are forgettable.

## Prerequisites

- `/generate-image` skill must be available (from document-skills)
- Replicate MCP must be configured for image generation
- `style-guide.md` must exist and be read BEFORE generating any images

If Replicate MCP is not available, document placeholder descriptions for manual creation.

## Process

### 1. Plan ALL Images First

Before generating anything, create an image plan mapping every slide to its visual need:

| # | Slide | Image Needed | Background | Aspect Ratio |
|---|-------|-------------|------------|-------------|
| 1 | Title | Hero visual | Dark bg | 16:9 |
| 2 | Content | Illustration | Light bg (white, for bg removal) | 16:9 |
| ... | ... | ... | ... | ... |

Identify which images:
- Need to be AI-generated (illustrations, diagrams, concepts)
- Are screenshots the user will provide (demos, real output)
- Are charts built natively in the presentation tool (bar charts, tables)
- Are native shapes built in code (maturity bars, flow diagrams)

### 2. Generate in Batches

Use the `/generate-image` skill. Generate in batches of 4 (parallel MCP calls).

**For dark background section dividers:**
Use the dark prompt prefix from `style-guide.md`:
```
"[Style] in [accent] and [secondary] color scheme. Dark [primary] background hex [code].
[Subject description]. Clean modern tech style. Centered."
```

**For light background content slides:**
Use the light prompt prefix from `style-guide.md`:
```
"[Style] in [accent] and [primary] color scheme. On solid white background.
[Subject description]. Clean modern tech style. Centered."
```

### 3. Review Generated Images

After each batch, visually inspect the results:
- Do they match the style guide palette?
- Are they appropriate for the slide content?
- Is the composition clean and centered?
- Will text overlay be readable (for dark bg images)?

Regenerate any that don't meet quality standards.

### 4. Background Removal

Images on light content slides (off-white `F5F6FA` or similar) will have a visible
white rectangle if the image has a white background. Remove backgrounds for these.

**Process:**
1. Save originals to `images/originals/`
2. Run background removal via recraft-ai/recraft-remove-background
3. Save transparent PNGs with the same filename but `.png` extension
4. Update build script image references from `.jpg` to `.png`

**Skip background removal for:**
- Dark section divider images (used as full-bleed backgrounds)
- Full infographics where the background IS the design
- Charts or diagrams with colored bands that would be damaged

**Always remove backgrounds for:**
- Character illustrations (people, robots) on light slides
- Icon/flow diagrams on light slides
- Any illustration with a distinct white background on a non-white slide

### 5. Name Consistently

Use a numbered naming convention matching slide order:
```
images/
  01-title-hero.jpg         # dark bg, keep as jpg
  02-content-illustration.png  # light bg, transparent png
  03-section-divider.jpg    # dark bg, keep as jpg
  ...
```

### 6. Verify & Rebuild

After all images are generated and processed:
1. Verify all image paths in build scripts match actual filenames
2. Run the build script
3. Check the output for any missing image errors

## Image Generation Tips

- **Be specific** in prompts: "a gold trophy with two handles" not "an award"
- **Include hex codes** for colors: "teal hex 0891B2" not just "teal"
- **Use Nano Banana 2** (google/nano-banana-2) for production quality
- **Use FLUX Schnell** only for quick drafts when iterating on concepts
- **White backgrounds** produce cleaner bg removal than black
- **4:3 aspect ratio** gives more vertical space if 16:9 crops subjects
