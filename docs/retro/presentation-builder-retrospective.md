# Presentation-Builder Plugin v1.0.0 — Retrospective & Improvement Recommendations

**Date:** 2026-04-22
**Session:** Built a 12-slide CTMA KPI Roundtable PPTX for STARS Air Ambulance
**Environment:** WSL2 (Ubuntu on Windows), Node.js v18, Claude Code CLI
**Reviewers:** End-user (flight paramedic), Plugin Architect, QA Engineer

---

## Executive Summary

The presentation-builder plugin produced a **conference-ready 12-slide PPTX** with professional design, comprehensive speaker notes, and a well-structured narrative arc. The shift-left workflow (spending most effort on design before code) is the plugin's greatest strength. However, the path to that output included **significant friction** from MCP setup, unreliable AI image generation, and pptxgenjs format edge cases that a non-developer should never have to debug.

**Overall assessment:** The design methodology is excellent. The implementation pipeline has critical bugs that produce silent failures.

---

## Part 1: End-User Perspective

### What Worked Well

1. **The design spec was the single most valuable output.** The structured one-question-at-a-time brainstorming (Phase 2) forced thoughtful consideration of audience, timing, structure, and cut plan before any slides existed. The resulting 240-line spec could have been handed to a colleague to build the deck independently.

2. **The multi-agent review (`/reflexion:critique`) was genuinely useful for the design spec.** Three distinct perspectives (EMS SME, panel format veteran, storytelling expert) caught real issues: a missing universal HEMS metric, an opening that was too long for a panel format, and an under-timed emotional climax. All three were right.

3. **The style guide extracted from the STARS template was accurate and thorough.** Correct brand font (Rubik), correct hex codes, correct dark/light slide mapping. This tedious work would normally be skipped, and the presentation would suffer.

4. **The modular build architecture made iteration painless.** Fixing one slide meant editing one file and rebuilding in seconds. Visual consistency was enforced by code (`theme.js`), not by memory.

5. **Speaker notes are presentation-ready.** Full talking points as speakable sentences, pacing cues with time estimates, transition lines, and audience engagement prompts. Could rehearse directly from these.

6. **The programmatic word cloud (d3-cloud) was the right pivot.** After AI-generated garbled text, switching to code produced a clean, accurate word cloud with every medical term spelled correctly.

### What Was Frustrating

1. **First-run setup was a wall.** Installing document-skills, configuring Replicate MCP, getting API tokens, restarting sessions — it felt like assembling IKEA furniture before cooking dinner. Setup took longer than expected with no visible payoff yet.

2. **Replicate MCP on WSL was painful.** Windows npx binary, environment variables not propagating, multiple session restarts. A paramedic does not know what npx is.

3. **AI-generated images were a source of repeated problems.** Word cloud had hallucinated words. Background removal produced WebP disguised as PNG. `sizing: contain` broke silently with base64. Three different image failure modes in one session.

4. **Nearly invisible text.** `lightGray` (E7E6E6) on white background — caught during review but shouldn't have been possible.

### What Nearly Caused Abandonment

- The **MCP setup** (3 session restarts on WSL)
- **Broken images in the first build** (multiple causes, no error messages)

### User's Top Asks

1. Make image generation **optional** with a graceful fallback path
2. Fix the image pipeline reliability **before adding features**
3. Add a complexity detection fast-path that **actually skips overhead** for simple decks
4. Flag text-in-image generation as a **known failure mode**

---

## Part 2: Architecture Assessment

### Well-Designed

- **Modular build architecture** (`theme.js` / `slides-sN.js` / `build.js`) — worked exactly as intended
- **Shift-left phase structure** — 9 phases front-loading design into Stages 1-2
- **Complexity detection** — Quick/Standard/Complex routing is a smart gate
- **Speaker notes mandate** — enforced quality with TALKING POINTS/PACING/TRANSITION format
- **Theme factory functions** — `makeShadow()`/`makeCardShadow()` correctly address pptxgenjs mutation bug

### Structural Issues

- **No image format validation layer** — zero verification that file content matches declared format
- **Phase numbering mismatch** — `phase-6-visuals.md` internally titled "Phase 8", `phase-7-implementation.md` titled "Phase 6"
- **No template extraction phase** — user had a branded PPTX but no documented process for extracting brand assets
- **Redundant brainstorming** — rawgentic:setup Sub-flow C invokes `superpowers:brainstorm`, then presentation-builder Phase 2 brainstorms again independently
- **MCP config path is wrong** — `setup.md` references `~/.claude/mcp.json` but Claude Code uses `claude mcp add` which writes to project-level config

---

## Part 3: Bug List (Prioritized)

### P0 — Critical (Produces broken output silently)

| ID | Bug | Impact | Fix |
|----|-----|--------|-----|
| P0-1 | **Recraft bg removal returns WebP, not PNG.** Files saved as `.png` are actually WebP. PowerPoint displays "picture cannot be displayed." | All bg-removed images broken | Add post-download format detection via magic bytes. Convert WebP→PNG using sharp/Pillow/ImageMagick. Document in `phase-6-visuals.md`. |
| P0-2 | **pptxgenjs `path` property fails silently for local files.** Images appear as broken placeholders. No error thrown. | All locally-referenced images broken | Add to pitfalls: "NEVER use `path` for local images — use base64 `data` URIs via `fs.readFileSync`. The `path` property resolves relative to PPTX output location and fails silently." Add `imgData()` helper to theme template. |
| P0-3 | **`sizing: { type: 'contain' }` incompatible with base64 data URIs.** Images don't render at all. | Images blank in PPTX | Add to pitfalls: "NEVER use `sizing: { type: 'contain' }` with base64 data — use `cover` or set explicit dimensions." |
| P0-4 | **`imgData()` doesn't detect actual format.** Maps MIME from file extension, not file content. WebP-as-.png gets wrong MIME. | Corrupted image embedding | Detect format from magic bytes: PNG=`89504E47`, WebP=`52494646....57454250`, JPEG=`FFD8FF`. |
| P0-5 | **MCP config path wrong in `setup.md`.** References `~/.claude/mcp.json` which doesn't exist. Should delegate to `generate-image:setup` or use `claude mcp add`. | MCP setup fails | Replace manual JSON editing with delegation to `generate-image:setup`. Remove the entire config block from `setup.md`. |

### P1 — High (Significant user friction)

| ID | Bug | Impact | Fix |
|----|-----|--------|-----|
| P1-1 | **No template extraction phase.** User had branded PPTX but no documented process for extracting colors, fonts, logos. | Manual workaround needed | Add "Phase 0: Template Analysis" — unzip `.pptx`, extract `ppt/media/*` and `ppt/theme/theme1.xml`, parse colors/fonts, classify assets. |
| P1-2 | **MCP server fails on WSL2 with no diagnostic.** Windows npx invoked instead of Linux. Generic "tool not available" error. | 3 session restarts, 30+ min lost | Add WSL detection (`uname -r | grep microsoft`), use absolute npx path, add post-config MCP startup test. |
| P1-3 | **AI word clouds produce hallucinated text.** "Ucoriadic", "RavTog", "Ventiligcent" — fabricated medical terms. | Incorrect content in professional presentation | Add decision matrix to `phase-6-visuals.md`: text-heavy visuals (word clouds, charts, labeled diagrams) → programmatic generation ONLY. Icons, illustrations → AI generation. |
| P1-4 | **Phase numbering mismatch in reference files.** `phase-6-visuals.md` titled "Phase 8", `phase-7-implementation.md` titled "Phase 6". | Agent confusion when reading references | Fix internal titles to match filenames. |
| P1-5 | **Redundant brainstorming with rawgentic:setup.** Two independent brainstorm sessions with no shared state. | Wasted time, conflicting context | When `.rawgentic.json` already exists, skip brainstorm delegation. |

### P2 — Medium (Quality improvements)

| ID | Bug | Impact | Fix |
|----|-----|--------|-----|
| P2-1 | **`rectRadius` used with `'rect'` shape type.** Plugin's own docs say it only works with `ROUNDED_RECTANGLE`. Code uses it with `rect` in `theme.js` and multiple slide files. | May silently produce square corners | Change `addShape('rect', { rectRadius })` → `addShape('roundRect', { rectRadius })` in theme helpers. |
| P2-2 | **No color contrast validation.** `lightGray` (E7E6E6) on white has ~1.04:1 contrast ratio. | Invisible text shipped | Add WCAG contrast check function to theme.js. Warn if text-on-background < 4.5:1. |
| P2-3 | **No post-build PPTX validation.** Build exits 0 even when images are broken. | Silent defects in output | After `writeFile`, extract and verify media count in the PPTX ZIP. Check media files > 0 bytes. |
| P2-4 | **Brainstorming tasks persist through build.** 9 tasks from Phase 2 cluttered context through Phases 3-9. | Cognitive noise | Add cleanup step at Phase 2→3 transition. |
| P2-5 | **generate-image save format guidance contradicts pptx needs.** Skill recommends "WebP for opaque images" but pptxgenjs has limited WebP support. | Wrong format chosen | Add context-aware format: if consumer is pptxgenjs, always PNG/JPEG. |

### P3 — Nice-to-Have

| ID | Feature | Value |
|----|---------|-------|
| P3-1 | **HTML preview before PPTX export.** Edit→build→open PowerPoint→check cycle is slow. | Faster iteration |
| P3-2 | **Template-aware PPTX generation.** Inject slides into existing branded template instead of rebuilding from scratch. | Closer to corporate standard |
| P3-3 | **Speaker notes as exportable document.** Print-ready rehearsal script separate from PPTX. | Rehearsal convenience |
| P3-4 | **Cumulative cost tracking.** Running total of Replicate API costs across all generations. | Cost visibility |
| P3-5 | **Template asset renaming.** Extracted assets named `image1.jpg`→`image25.jpg`. Should be `logo-red.png`, `diagonal-stripe-bg.png`. | Clarity |
| P3-6 | **Font fallback chain.** If Rubik not installed, pptxgenjs silently substitutes. Add check or bundle fallback. | Reliability |

---

## Part 4: Missing Test Scenarios

### Environment Compatibility (not tested at all)

| Scenario | Risk |
|----------|------|
| WSL2 + Windows npx on PATH | MCP launch fails silently |
| Node.js version compatibility with pptxgenjs | Potential ESM issues on Node 22+ |
| npm global vs. local install of pptxgenjs | NODE_PATH not set |
| File path separators (WSL `/mnt/c/` vs Windows) | Path resolution failures |

### Image Pipeline (critical gap)

| Scenario | Risk |
|----------|------|
| Recraft output format validation | WebP-as-PNG breaks PowerPoint |
| Image renders in final PPTX (not just builds) | Silent broken images |
| Base64 size limits for large images | PPTX bloat beyond Office limits |
| `sizing` property interactions with `data` | Blank images |

### Post-Build Validation (doesn't exist)

| Check | Priority |
|-------|----------|
| PPTX opens without repair dialog | P0 |
| Expected media file count embedded | P0 |
| No 0-byte media files | P0 |
| Speaker notes exist for every slide | P1 |
| All colors used exist in palette | P1 |
| Color contrast WCAG AA compliance | P1 |

---

## Part 5: Recommended Improvements (Summary)

### Immediate (before next release)

1. **Fix the image pipeline.** Add format detection, WebP→PNG conversion, base64-only image loading, and `contain` sizing warning. This is the #1 source of broken output.
2. **Fix `setup.md` MCP config path.** Delegate to `generate-image:setup` instead of writing `~/.claude/mcp.json`.
3. **Add pptxgenjs pitfalls** for `path` vs `data`, `sizing`+`base64`, `rect` vs `roundRect`.
4. **Fix phase numbering** in reference file titles.

### Short-term (next 1-2 releases)

5. **Add Phase 0: Template Analysis** for extracting brand assets from existing PPTX files.
6. **Add post-build validation** (media count, format verification, contrast check).
7. **Add AI vs. programmatic decision matrix** for visual generation.
8. **Add WSL detection and environment pre-flight checks.**
9. **Make image generation optional** with a "no AI images" graceful fallback.

### Medium-term

10. **HTML preview mode** for faster iteration.
11. **Template-aware generation** (inject into existing branded PPTX).
12. **Speaker notes export** as standalone document.

---

## Appendix: Session Artifacts

| Artifact | Path | Purpose |
|----------|------|---------|
| Design spec | `docs/superpowers/specs/2026-04-21-ctma-kpi-roundtable-design.md` | Full presentation design with section breakdowns |
| Style guide | `style-guide.md` | STARS brand colors, fonts, visual motifs |
| Build scripts | `build-deck/` (6 files) | Modular pptxgenjs build system |
| Generated images | `images/` (7 production + 5 originals) | Word cloud, timeline, 4 pillar icons |
| Template assets | `template-assets/` (25 files) | Extracted from STARS PPTX template |
| Word cloud generator | `generate-wordcloud.js` | Programmatic d3-cloud fallback |
| Materials index | `MATERIALS_INDEX.md` | Source material inventory |
| Final output | `CTMA-KPI-Roundtable-STARS.pptx` | 12-slide presentation (2.4MB) |

---

*Generated via multi-agent retrospective (End-User, Plugin Architect, QA Engineer) on 2026-04-22.*
