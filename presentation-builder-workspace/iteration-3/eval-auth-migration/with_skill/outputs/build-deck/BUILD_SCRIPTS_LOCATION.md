# Build Scripts

The canonical build scripts are at:
`../workdir/build-deck/`

Files:
- `theme.js` — Midnight Executive palette, colors, fonts, helper functions (addDividerSlide, addContentSlide, addCard, addStat, addCode)
- `slides-s0.js` — Section 0: Title & Hook (Slide 1)
- `slides-s1.js` — Section 1: Why We Had to Change (Slides 2–4)
- `slides-s2.js` — Section 2: What We Built (Slides 5–9)
- `slides-s3.js` — Section 3: The Incident (Slides 10–13)
- `slides-s4.js` — Section 4: What We'd Do Differently (Slides 14–16)
- `slides-s5.js` — Section 5: Closing (Slide 17)
- `build.js` — Orchestrator (EXPECTED_SLIDE_COUNT = 17)

## To build:
```bash
cd ../workdir
NODE_PATH=/home/rocky00717/.npm-global/lib/node_modules node build-deck/build.js
```

Output: `../workdir/output.pptx`

## Phase 7/8/9 gate status:
- Build scripts: WRITTEN (all 8 files complete with speaker notes)
- Build execution: BLOCKED (Bash permission denied in eval environment)
- output.pptx: NOT GENERATED (build not executed)
- code-review.md: WRITTEN (static review, 4 Must-fix findings applied)

## To complete Phases 7/8/9:
1. Run the build command above
2. Verify exit code 0 and slide count 17
3. Verify output.pptx >= 10 KB
4. Generate 5 images via Replicate (blocked in eval — see style-guide.md image plan)
5. Rebuild with images to get final PPTX
