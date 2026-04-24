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
- `contrastCheck(fg, bg)` -- WCAG contrast ratio validation (see below)
- Any recurring visual patterns from the style guide

**Contrast validation function** (include in every theme.js):
```javascript
function contrastCheck(fg, bg) {
  function luminance(hex) {
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    const [rs, gs, bs] = [r, g, b].map(c =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }
  const l1 = luminance(fg), l2 = luminance(bg);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  if (ratio < 3) console.error(`CONTRAST FAIL: ${fg} on ${bg} = ${ratio.toFixed(2)}:1 (< 3:1, invisible)`);
  else if (ratio < 4.5) console.warn(`CONTRAST WARN: ${fg} on ${bg} = ${ratio.toFixed(2)}:1 (< 4.5:1, fails WCAG AA)`);
  return ratio;
}
```
Call `contrastCheck` for every text color / background color pair defined
in the `colors` object. Run these checks at build time (in `build.js`
before generating slides) so warnings appear in the build output.

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

## document-skills Availability

The `/pptx`, `/pdf`, `/frontend-design`, and `/docx` skills come from the
document-skills plugin. Setup should have installed it (see `setup.md`),
but if the plugin is unavailable at build time:

- **For PPTX:** Build with `pptxgenjs` directly using the architecture
  below. Do NOT stall waiting for `/pptx` — the modular theme.js +
  slides-s{N}.js + build.js pattern works standalone with just
  `pptxgenjs` installed (`npm install pptxgenjs`).
- **For HTML:** Build with plain HTML + CSS + inline JS. Fall back from
  `/frontend-design` to a static HTML file with the presentation
  embedded as slides (one `<section>` per slide).
- **For PDF / DOCX:** If the skill is unavailable, halt and ask the user
  how to proceed. Unlike PPTX/HTML, these formats don't have a
  generally-available drop-in library equivalent.

A common Sonnet failure pattern is stalling with "document-skills plugin
not installed" when PPTX pptxgenjs-direct would have worked. Do not
stall — fall through to the direct-library path for PPTX/HTML.

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

### Colors & Shapes
- **NEVER use `#` in hex colors** -- causes file corruption
- **NEVER encode opacity in hex strings** (8-char hex) -- use `opacity` property
- **NEVER reuse option objects** -- pptxgenjs mutates them. Use factory functions.
- **`rectRadius` only works with `roundRect`** not `rect`. If you want rounded
  corners, use `addShape(pres.ShapeType.roundRect, { rectRadius: 0.2, ... })`.

### Text
- **Use `bullet: true`** not unicode `•` -- causes double bullets
- **Use `breakLine: true`** between text array items

### Images (critical -- most common source of silent failures)
- **NEVER use `path` for local images.** The `path` property resolves
  relative to the PPTX output location and fails silently (broken
  placeholder, no error). Always use base64 `data` URIs:
  ```javascript
  // theme.js helper
  function imgData(filePath) {
    const buf = require('fs').readFileSync(filePath);
    const magic = buf.slice(0, 4).toString('hex').toUpperCase();
    let mime = 'image/png';
    if (magic.startsWith('FFD8FF')) mime = 'image/jpeg';
    else if (magic.startsWith('52494646')) mime = 'image/webp'; // should not happen -- see below
    return `data:${mime};base64,${buf.toString('base64')}`;
  }
  ```
  Then use: `slide.addImage({ data: imgData('images/01-hero.png'), x, y, w, h })`
- **NEVER use `sizing: { type: 'contain' }` with base64 `data`.** Images
  render blank. Use `cover` or set explicit `w`/`h` dimensions instead.
- **Always validate image format via magic bytes, not file extension.**
  AI image tools (Recraft, Replicate bg-removal) may return WebP files
  saved with a `.png` extension. PowerPoint cannot display these.
  Magic bytes: PNG = `89504E47`, JPEG = `FFD8FF`, WebP = `52494646...57454250`.
  If a `.png` file is actually WebP, convert it before embedding.
- **Always use PNG or JPEG for pptxgenjs, never WebP.** When invoking
  `/generate-image`, explicitly request PNG output. If a WebP file
  appears in `images/`, convert it with sharp/ImageMagick before build.

### General
- **Test build after every change** -- don't batch multiple untested changes

## Font availability check

pptxgenjs silently substitutes fonts when the specified font is not
installed on the build machine. Add a check to `build.js` that runs
before slide generation:

```javascript
const { execFileSync } = require('child_process');

function checkFont(fontName) {
  try {
    const installed = execFileSync('fc-list', [':' , 'family'], { encoding: 'utf8' });
    if (!installed.toLowerCase().includes(fontName.toLowerCase())) {
      console.warn(`FONT WARNING: "${fontName}" not found on this system.`);
      console.warn(`  pptxgenjs will silently substitute a default font.`);
      console.warn(`  Install it, or update theme.js with a fallback.`);
      return false;
    }
    return true;
  } catch (e) {
    return true; // fc-list not available (Windows), skip check
  }
}

// Run at build start
const { fonts } = require('./theme');
checkFont(fonts.title);
checkFont(fonts.body);
```

Define a fallback chain in `theme.js` for each brand font:

```javascript
const fonts = {
  title: 'Rubik',         // brand font
  titleFallback: 'Arial', // safe fallback if brand font unavailable
  body: 'Rubik',
  bodyFallback: 'Calibri',
  code: 'Consolas',
};
```

The build script should warn but not fail — font substitution is cosmetic,
not a broken build. The user can install the font or accept the fallback.

## Template-aware generation

When Phase 0 has extracted a template (`template-analysis.md` exists),
the build can optionally inject slides into the original template PPTX
rather than generating a standalone file.

**pptxgenjs limitation:** pptxgenjs does not natively support opening an
existing PPTX and adding slides to it. The workaround is:

1. Build the presentation with pptxgenjs as normal (standalone).
2. Use the extracted template colors/fonts/assets so the output visually
   matches the template.
3. If exact template master slides are required (e.g., corporate footer,
   logo placement enforced by the template's slide layouts), document
   this as a **manual post-processing step**: open both files in
   PowerPoint, copy slides from the generated deck into the template.

**Alternative approach (python-pptx):** If the user needs true
template-aware generation (injecting slides into the template file
directly), suggest using python-pptx instead of pptxgenjs. python-pptx
can open an existing PPTX and add slides using its slide layouts:

```python
from pptx import Presentation
prs = Presentation('template.pptx')
layout = prs.slide_layouts[1]  # Use template's layout
slide = prs.slides.add_slide(layout)
# ... add content using template placeholders
prs.save('output.pptx')
```

This is a separate code path — do not mix pptxgenjs and python-pptx in
the same build. If the user requests template-aware generation, confirm
which approach they prefer before Phase 7 begins.

## Key Principles

- **Modular** -- one file per section, always
- **Try-catch** -- wrap each section load so errors are traceable
- **Assert slide count** -- catch accidental additions/removals
- **Speaker notes are NOT optional** -- every slide gets the full treatment
- **Build early, build often** -- run the build script after any change

## Phase 7 — Phase-complete gate

Phase 7 is NOT complete until the following all hold:

1. Build scripts exist at `build-deck/` (theme.js, slides-s{N}.js per
   section, build.js orchestrator).
2. Running the build command (e.g., `node build-deck/build.js`) exits
   with code 0 (no errors).
3. The generated presentation file exists at the expected path
   (e.g., `output.pptx`).
4. The slide count in the generated file matches the spec's total slide
   count (pptxgenjs assertion in build.js covers this).

NOTE: Phase 9's build gate partially overlaps this one — that is
intentional. Phase 7 requires that the build was made to work during
implementation; Phase 9 re-verifies that the final build succeeds after
any code-review edits. This belt-and-suspenders redundancy is
deliberate for Sonnet reliability.

A common Sonnet failure pattern is declaring Phase 7 complete with build
scripts written but never executed. Do NOT advance to Phase 8 with an
unrun build.
