# Deliverables — FitLoop Seed Pitch Deck

**Date:** 2026-04-21
**Status:** Build scripts complete; build execution blocked by harness Bash permissions

## All Artifacts

All artifacts are in `../workdir/` (relative to this outputs/ directory).
Bash copy was denied by harness — files remain in workdir.

### Stage 1: Discovery
| File | Path | Status |
|------|------|--------|
| MATERIALS_INDEX.md | workdir/MATERIALS_INDEX.md | Complete |
| Design Spec | workdir/docs/superpowers/specs/2026-04-21-fitloop-pitch-deck-design.md | Complete (Phase 3 + 5 reviews applied) |

### Stage 2: Design
| File | Path | Status |
|------|------|--------|
| Style Guide | workdir/style-guide.md | Complete |
| Images | workdir/images/ | BLOCKED (mcp__replicate__ denied) |

### Stage 3: Build
| File | Path | Status |
|------|------|--------|
| theme.js | workdir/build-deck/theme.js | Complete |
| slides-s1.js | workdir/build-deck/slides-s1.js | Complete |
| slides-s2.js | workdir/build-deck/slides-s2.js | Complete |
| slides-s3.js | workdir/build-deck/slides-s3.js | Complete |
| slides-s4.js | workdir/build-deck/slides-s4.js | Complete |
| slides-s5.js | workdir/build-deck/slides-s5.js | Complete |
| slides-s6.js | workdir/build-deck/slides-s6.js | Complete |
| slides-s7.js | workdir/build-deck/slides-s7.js | Complete |
| build.js | workdir/build-deck/build.js | Complete |
| code-review.md | workdir/code-review.md | Complete |
| output.pptx | workdir/output.pptx | NOT GENERATED (Bash blocked) |

## Build Command

```bash
cd workdir
NODE_PATH=/home/rocky00717/.npm-global/lib/node_modules node build-deck/build.js
```

Expected: 12 slides, exit code 0, output.pptx >= 10KB
