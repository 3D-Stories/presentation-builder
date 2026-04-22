# Phase 7: Implementation Scripts

## Purpose

Build the presentation using modular, maintainable scripts. Never one monolithic file.
The modular approach means targeted fixes during iteration instead of full rewrites.

## Architecture (PPTX via pptxgenjs)

```
build-deck/
  theme.js          -- Colors, fonts, shared helpers from style-guide.md
  slides-s1.js      -- Section 1 slides
  slides-s2.js      -- Section 2 slides
  ...
  slides-sN.js      -- Section N slides
  build.js          -- Main orchestrator
```

### theme.js

Translates the style guide into code. Must include:

**Constants:**
- `colors` object with ALL palette colors (no hex `#` prefix -- pptxgenjs requirement)
- `fonts` object with title, body, code font faces
- `IMG` path constant pointing to `../images/`

**Factory functions** (to avoid pptxgenjs option mutation bug):
- `makeShadow()` -- returns fresh shadow options each call
- `makeCardShadow()` -- lighter shadow for cards

**Helper functions:**
- `addDividerSlide(pres, { title, subtitle, imagePath, speakerNotes })` -- dark section divider
- `addContentSlide(pres, { title, speakerNotes })` -- light content slide
- `addCard(slide, pres, { x, y, w, h, accentColor })` -- card with left accent border
- `addStat(slide, { x, y, number, label, color })` -- big stat callout
- `addCode(slide, pres, { x, y, w, h, code })` -- dark code block
- Any recurring visual patterns from the style guide

### slides-sN.js

Each section file exports a single function:
```javascript
module.exports = function(pres) {
  // Add slides for this section
};
```

**Speaker notes format** -- every slide MUST have comprehensive speaker notes:
```
TALKING POINTS:
• "Speakable sentence or phrase"
• "Another point"
• [Point to element:] "Describe what you're pointing at"

PACING:
[~N min. Specific timing guidance and pause markers.]

TRANSITION:
"Exact bridge sentence to next slide." [CLICK]
```

Include audience-specific callouts: `[FOR PMs:]`, `[FOR DEVS:]`, `[FOR MANAGERS:]`
Include pacing cues: `[PAUSE]`, `[SLOW DOWN]`, `[CLICK]`

### build.js

The orchestrator:
1. Creates pptxgenjs presentation instance
2. Sets metadata (author, title, subject, layout)
3. Loads each section with try-catch per section (so errors identify which section failed)
4. Asserts expected slide count
5. Writes the file

Include a comment at the top noting the cut plan for shorter versions.

## Architecture (Other Formats)

For non-PPTX formats, the design phase is identical. The implementation phase delegates
to the appropriate document-skills skill:

**HTML (/frontend-design):** Build as a web-based presentation using React or vanilla HTML/CSS.
Speaker notes can be in a separate view or hidden panel.

**PDF (/pdf):** Build as a formatted PDF with section headers, images, and speaker notes appendix.

**DOCX (/docx):** Build as a Word document with slide-equivalent sections, embedded images,
and speaker notes as footnotes or an appendix.

In all cases, maintain the modular principle -- separate files per section.

## Common pptxgenjs Pitfalls

- **NEVER use `#` in hex colors** -- causes file corruption
- **NEVER encode opacity in hex strings** (8-char hex) -- use `opacity` property
- **NEVER reuse option objects** -- pptxgenjs mutates them. Use factory functions.
- **Use `bullet: true`** not unicode `•` -- causes double bullets
- **Use `breakLine: true`** between text array items
- **`rectRadius` only works with `ROUNDED_RECTANGLE`** not `RECTANGLE`
- **Test build after every change** -- don't batch multiple untested changes

## Key Principles

- **Modular** -- one file per section, always
- **Try-catch** -- wrap each section load so errors are traceable
- **Assert slide count** -- catch accidental additions/removals
- **Speaker notes are NOT optional** -- every slide gets the full treatment
- **Build early, build often** -- run the build script after any change
