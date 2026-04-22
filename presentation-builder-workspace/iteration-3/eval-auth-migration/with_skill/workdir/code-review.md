# Code Review — Auth Migration All-Hands Talk

**Phase 8 Review**
**Date:** 2026-04-21
**Status:** BLOCKED — build could not be executed (Bash permission denied in eval environment)

> NOTE: Per Phase 8 gate, a build run is mandatory before review. The review below is a
> static code review only, conducted without a build execution. This satisfies the substance
> requirement but does NOT satisfy the Phase 8 gate fully. The build must be run and exit 0
> before Phase 9 can begin.
>
> Recommended command:
> ```bash
> cd workdir && NODE_PATH=/home/rocky00717/.npm-global/lib/node_modules node build-deck/build.js 2>&1 | tee build-output.log; echo "EXIT=$?"
> ```

---

## Review Log (Phase 8)

### Presentation Expert — Layout Issues Across Slides

**Finding 1:** `slides-s2.js` Slide 7 (Key Decisions Table) uses `colXs` and `colWidths` arrays for manual column layout. The "Because" column (index 3) at x=6.45 with w=3.1 extends to x=9.55, which slightly exceeds the 10-inch slide width with 0.5in margins — total effective width needed is 9.1in (0.5 + 1.8 + 2.0 + 2.0 + 3.1 = 9.4 from x=0.5) = right edge at 9.9in. This is inside the 10in boundary but leaves only 0.1in margin. The table text at 11pt in a 3.1-wide column wraps acceptably but is very tight for the "Because" cells which contain full sentences.
- **Severity:** Should fix
- **Resolution:** Reduce the four column widths to [1.7, 1.9, 1.9, 2.9] starting at x=0.4 — right edge becomes 9.8in with comfortable margin. Apply when build is available.

**Finding 2:** `slides-s3.js` Slide 11 timeline — 9 events spaced at `9.2 / 8 = 1.15in` spacing on a 10in slide. With the time label width set to 0.7in centered on each dot, adjacent labels at 1.15in spacing can overlap at 9pt. Particularly risky at events 4 (09:10) and 5 (12:35) where the label text "Flag reverted to 0%" is 18 characters wide.
- **Severity:** Should fix
- **Resolution:** Reduce font to 8pt for time labels, or reduce event count to 7 by merging 13:10 and 14:02 (both are hotfix milestones). Apply when build is available to verify visually.

**Finding 3:** `slides-s1.js` Slide 4 (Why Not Patch?) has a no-op line `pres.addSlide; // (no-op — already on slide4 context)` inside the forEach loop. This is dead code left from copy-paste and does nothing, but it signals the developer was confused about context — worth removing to avoid future maintenance confusion.
- **Severity:** Should fix
- **Resolution:** Remove the dead `pres.addSlide;` line. Applied below.

---

### Technical Architect — Code Structure and Safety

**Finding 1:** `theme.js` exports `IMG` as a directory path but also exports `imgPath()` as a helper. The `addDividerSlide()` function takes a raw `imagePath` parameter, so callers in slides-sN.js call `imgPath("filename.jpg")` explicitly — this is consistent. However, `slides-s3.js` Slide 13 directly calls `imgPath("11-bug-illustration.png")` inside the slide function rather than in the `addDividerSlide` helper, so the pattern is split. Not a bug, but inconsistent.
- **Severity:** Nice to have

**Finding 2:** `build.js` imports `pptxgenjs` as `const pptx = require("pptxgenjs")` and then does `new pptx()`. This is the correct instantiation pattern for pptxgenjs v3+. However, `pres.defineLayout()` is called before `pres.layout = "LAYOUT_WIDE"`. In pptxgenjs, `defineLayout` must be called before any slides are added AND before `layout` is set — this order is correct. Confirmed: no issue.
- **Severity:** Substantiated waiver — I reviewed the pptxgenjs initialization sequence: `new pptx()` → `defineLayout` → `layout` assignment → section loaders → `writeFile`. This matches the documented API order.

**Finding 3:** `slides-s2.js` `addCode` calls in the key decisions area are absent (the table uses `addShape` + `addText` directly, not `addCode`). The `addCode` helper is imported but only used in `slides-s3.js`. In `slides-s2.js`, the `addCode` import is unused. This would be a lint warning.
- **Severity:** Should fix
- **Resolution:** Remove `addCode` from the `require` destructuring in `slides-s2.js`. Applied.

**Finding 4:** All `try/catch` blocks around `slide.addImage()` calls catch the error and continue silently. This is correct behavior for the eval environment (images not generated), but in production, a silent image skip could mask a broken image path. Consider logging a warning (not an error) so the speaker knows an image is missing before a live presentation.
- **Severity:** Should fix
- **Resolution:** Changed `// Image not available — slide still functional` comment to `console.warn(\`[WARN] Image not found, skipping: \${imagePath}\`);` in theme.js `addDividerSlide` and in slides-s3.js Slide 13 try-catch. Applied.

---

### Product Manager — Spec Conformance and Message Delivery

**Finding 1:** The closing slide (Slide 17, `slides-s5.js`) includes the callback sentence verbatim as required by Phase 5 review. However, the opening slide (Slide 1, `slides-s0.js`) does NOT include the matching callback setup in visible slide text — only in speaker notes. The visible slide text says "This is what those 14 hours bought us." which is the callback setup phrase. This is correct — the callback is a speaker-line, not a visible text item on Slide 1. Confirmed as intentional.
- **Severity:** Substantiated waiver — I reviewed the callback structure: Slide 1 visible text includes "This is what those 14 hours bought us." as the setup; Slide 17 delivers the resolution. Both speaker notes contain the verbatim callback sentence. Spec requirement satisfied.

**Finding 2:** The cost savings hedge appears on Slide 9 as a yellow warning callout with the text "Early estimate: ~12% reduction on API tier compute cost. Autoscaler still settling — we'll share a firmer number next quarter." This is exactly the language specified in the Phase 3 review fix. Confirmed: correctly implemented.
- **Severity:** Substantiated waiver — I reviewed the cost savings treatment against the Phase 3 Must-fix resolution. The warning callout box with amber styling matches the spec.

**Finding 3:** Slide 15 (Three Changes) includes the junior-actionable beat `[FOR JUNIORS:]` in speaker notes but does NOT include the text "FOR JUNIORS:" as a visible slide element. For a mixed-seniority audience, it may be more impactful to make this callout visible on the slide — a small badge or label that signals "this one applies to everyone."
- **Severity:** Should fix
- **Resolution:** Add a small teal badge with text "For every engineer →" before the third change description in Slide 15. This signals the change in register without requiring the speaker to explicitly call it out. Applied conceptually — will implement as a text addition in slides-s4.js when build is available.

**Finding 4:** The "Open questions" line on Slide 17 (`passkeys · refresh TTL · auth-v1 deprecation`) is styled in italic iceBlue at 11pt — it is visually de-emphasized, which is correct (these are not the takeaway). However, at 11pt on a dark navy background, contrast may be insufficient for the back of a room. Consider 12pt or white.
- **Severity:** Should fix
- **Resolution:** Changed color from `colors.iceBlue` to `colors.white` and size from 11 to 12pt for the open questions line. Applied.

---

## Applied Code Fixes

The following fixes were applied to the build scripts based on Must-fix and Should-fix findings:

### Fix 1: Remove dead `pres.addSlide;` line (slides-s1.js)
Applied — removed the no-op line inside the forEach loop in Slide 4.

### Fix 2: Remove unused `addCode` import (slides-s2.js)
Applied — removed `addCode` from the require destructuring.

### Fix 3: Add console.warn to image skip catch blocks (theme.js, slides-s3.js)
Applied — silent catch blocks now emit a console.warn with the missing image path.

### Fix 4: Open questions line — contrast fix (slides-s5.js)
Applied — color changed to white, font size to 12pt.

### Remaining (deferred to build-available run):
- Should fix: column widths on Slide 7 key decisions table (verified tight but not overflow)
- Should fix: timeline label font size on Slide 11 (9 events at 1.15in spacing)
- Should fix: "For every engineer →" badge on Slide 15 (junior-actionable callout)
