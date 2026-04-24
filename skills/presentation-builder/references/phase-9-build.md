# Phase 9: Build & Iterate

## Purpose

Run the final build, validate the output structurally, and iterate based
on user feedback. Phase 9 is the last quality gate before the presentation
is delivered.

## Process

### 1. Run the build

```bash
cd build-deck && node build.js 2>&1 | tee ../build-output.log ; echo "EXIT=$?"
```

Record the exit code. If non-zero, fix and re-run before proceeding.

### 2. Post-build PPTX validation (PPTX format only)

After a successful build (exit code 0), inspect the generated PPTX file
structurally. A PPTX is a ZIP archive — extract and verify its contents.

```bash
PPTX_PATH="output.pptx"  # adjust to actual output path
PPTX_CHECK=$(mktemp -d)
unzip -o "$PPTX_PATH" -d "$PPTX_CHECK"
```

Run ALL of the following checks. A failure in ANY check is a **Must-fix**
finding — do not deliver the presentation until resolved.

#### 2a. Media count check

```bash
EXPECTED_MEDIA=<number from style guide image plan>
ACTUAL_MEDIA=$(ls "$PPTX_CHECK"/ppt/media/ 2>/dev/null | wc -l)
echo "Media files: expected=$EXPECTED_MEDIA actual=$ACTUAL_MEDIA"
```

If `ACTUAL_MEDIA < EXPECTED_MEDIA`, images were lost during build. Check
`addImage` calls against the image plan. If `ACTUAL_MEDIA == 0` and
images were expected, the image loading method is likely wrong (see Phase
7 pitfall: use `data` not `path`).

Note: pptxgenjs may embed additional media (e.g., slide backgrounds
defined via shapes). `ACTUAL_MEDIA >= EXPECTED_MEDIA` is acceptable;
`ACTUAL_MEDIA < EXPECTED_MEDIA` is a failure.

#### 2b. Zero-byte file detection

```bash
find "$PPTX_CHECK"/ppt/media/ -size 0 -print
```

Any 0-byte file is a **Must-fix**. A 0-byte media file means the image
was referenced but empty — PowerPoint will show a broken placeholder.

#### 2c. Image format validation (magic bytes)

```bash
for f in "$PPTX_CHECK"/ppt/media/*; do
  MAGIC=$(xxd -l 4 -p "$f" 2>/dev/null)
  EXT="${f##*.}"
  case "$MAGIC" in
    89504e47*) FORMAT="PNG" ;;
    ffd8ff*)   FORMAT="JPEG" ;;
    52494646*) FORMAT="WebP" ;;
    *)         FORMAT="UNKNOWN($MAGIC)" ;;
  esac
  echo "$(basename $f): $FORMAT"

  # Flag mismatches
  if [ "$EXT" = "png" ] && [ "$FORMAT" = "WebP" ]; then
    echo "  ERROR: $f is WebP masquerading as PNG — PowerPoint cannot display"
  fi
  if [ "$FORMAT" = "WebP" ]; then
    echo "  ERROR: WebP file embedded — pptxgenjs has limited WebP support"
  fi
done
```

Any format mismatch or WebP file is a **Must-fix**. Convert to PNG before
re-building.

#### 2d. Speaker notes existence check

```bash
SLIDE_COUNT=0
NOTES_MISSING=0
for slide in "$PPTX_CHECK"/ppt/slides/slide*.xml; do
  SLIDE_COUNT=$((SLIDE_COUNT + 1))
  NUM=$(basename "$slide" | grep -oP '\d+')
  NOTES_FILE="$PPTX_CHECK/ppt/notesSlides/notesSlide${NUM}.xml"
  if [ ! -f "$NOTES_FILE" ]; then
    echo "WARNING: Slide $NUM has no speaker notes file"
    NOTES_MISSING=$((NOTES_MISSING + 1))
  elif ! grep -q '<a:t>' "$NOTES_FILE" 2>/dev/null; then
    echo "WARNING: Slide $NUM has empty speaker notes"
    NOTES_MISSING=$((NOTES_MISSING + 1))
  fi
done
echo "Speaker notes: $((SLIDE_COUNT - NOTES_MISSING))/$SLIDE_COUNT slides have notes"
```

Missing or empty speaker notes is a **Should-fix** (not blocking, but the
skill mandates comprehensive notes on every slide). Flag in the review log.

#### 2e. Clean up

```bash
rm -rf "$PPTX_CHECK"
```

### 3. Color contrast validation (at build time)

The `contrastCheck()` function in `theme.js` (see Phase 7 reference)
should be called during the build to validate all text/background color
combinations. Any pair below WCAG AA ratio (4.5:1 for normal text, 3:1
for large text) should print a warning.

Build scripts should call this for every text element's color against its
slide background:
- Light slide background vs body text color
- Dark slide background vs light text color
- Card background vs card text color
- Stat number color vs slide background

A contrast ratio below 3:1 is a **Must-fix** (text is effectively
invisible). A ratio between 3:1 and 4.5:1 is a **Should-fix** (readable
but fails WCAG AA).

### 4. Iterate

After validation passes, present the output to the user. Iterate based on
feedback using the modular architecture — content changes touch one
`slides-sN.js` file, style changes touch `theme.js`, etc.

Re-run the post-build validation after every rebuild.

## Phase-complete gate

Phase 9 is NOT complete until ALL of the following hold:

1. The output file exists at the expected path.
2. The output file size exceeds the minimum threshold:
   - PPTX: >= 10 KB
   - PDF: >= 5 KB
   - DOCX: >= 5 KB
   - HTML: >= 5 KB
3. The slide count matches the spec's total slide count.
4. The build invocation is recorded in the transcript (exit code captured).
5. **(PPTX only)** Post-build validation passed:
   - Media count >= expected count
   - No 0-byte media files
   - No WebP files or format mismatches in embedded media
   - No contrast ratio below 3:1 (Must-fix threshold)
6. Any Must-fix validation failures have been resolved and the build
   re-run.

A common Sonnet failure pattern is declaring Phase 9 complete based on
build scripts existing rather than on actually running them AND validating
the output. The build must execute, produce a file, and that file must
pass structural validation.

## Known failure modes

- **Build exits 0 but images are broken.** The `path` property in
  pptxgenjs fails silently. Post-build media count check catches this.
- **WebP disguised as PNG.** AI image tools return WebP saved with `.png`
  extension. Magic byte check catches this.
- **Invisible text.** Low-contrast text (e.g., `E7E6E6` on white) is not
  a build error. Contrast validation catches this.
- **Empty speaker notes.** pptxgenjs creates the notes slide structure
  even for empty strings. The `<a:t>` content check catches this.
