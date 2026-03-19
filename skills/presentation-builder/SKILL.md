---
name: presentation-builder
description: >
  End-to-end presentation creation through structured phases: research, requirements, design,
  visual generation, implementation, and iteration. Handles PPTX, HTML, PDF, and DOCX output
  formats via document-skills. Use this skill whenever the user wants to create a presentation,
  slide deck, pitch deck, talk, or lecture — even if they just say "build me a deck about X" or
  "I need slides for a talk on Y." Also use when the user has existing content (notes, docs,
  research) they want turned into a presentation. Triggers on: "create presentation", "build slides",
  "make a deck", "presentation about", "slide deck for", "put together a talk", "pitch deck",
  "build me a pptx", or any request that involves creating structured visual content for an audience.
argument-hint: "<topic or description of the presentation>"
---

# Presentation Builder

Build professional presentations through a structured, iterative workflow. This skill captures the
methodology of spending the most effort on requirements and design (shift-left), using AI to handle
orchestration, and verifying output through multi-agent review.

## First Run: Prerequisites & Setup

On first invocation, check and install dependencies in order. Read `references/setup.md` for the
full setup process including MCP configuration.

**1. document-skills plugin** (required for output format skills + /generate-image):
```bash
ls ~/.claude/plugins/cache/anthropic-agent-skills/document-skills/ 2>/dev/null
```
If not found, guide the user:
> "This skill needs the document-skills plugin for building presentations. Let me set that up."

Then run:
```
/plugin marketplace add anthropics/skills
/plugin install document-skills@anthropic-agent-skills
/reload-plugins
```

**2. Replicate MCP** (required for AI image generation):
```bash
grep -q "replicate" ~/.claude/mcp.json 2>/dev/null
```
If not found, guide the user:
> "Image generation requires Replicate MCP. You'll need a free API token from replicate.com/account/api-tokens. Paste your token and I'll configure everything."

Read `references/setup.md` for the MCP configuration process.

**3. Review tools** (optional, enhances quality):
- Check for `/bmad-party-mode` (Tier 1 review)
- Check for `/reflexion:critique` (Tier 2 review)
- If neither available, the skill uses built-in multi-perspective review prompts (Tier 3)

After first successful setup, create `~/.claude/.presentation-builder-setup-complete`
so subsequent runs skip the check. This is global (not per-project) because the prerequisites
(document-skills, Replicate MCP) are machine-level, not project-level.

## Complexity Detection

Before starting, assess presentation complexity to choose the right workflow:

**Quick Path** (<10 slides, single topic, no external research needed):
- Skip Phase 1 (Research)
- Compress Phases 2-3 into one brainstorm
- Skip Phase 5 (Design Review)
- Generate visuals and build in one pass
- Example: "Make a 5-slide team update on Q4 progress"

**Standard Path** (10-20 slides, moderate complexity):
- Full workflow with single review passes
- Example: "Build a 20-minute talk on our new API for the dev team"

**Complex Path** (>20 slides, multiple sources, mixed audience):
- Full workflow with multi-agent reviews at every gate
- Example: "Put together a 45-minute presentation on advanced AI coding practices"

## Workflow Overview

The workflow has three user-facing stages with internal phases. At each check-in, show the
progress indicator so the user always knows where they are.

```
STAGE 1: DISCOVERY
  Phase 1: Research & Gather ──→ MATERIALS_INDEX.md
  Phase 2: Requirements ────────→ Presentation design spec

STAGE 2: DESIGN
  Phase 3: Multi-Agent Review ──→ Refined spec
  Phase 4: Style Guide ─────────→ style-guide.md
  Phase 5: Design Review ───────→ Approved spec + style guide
  Phase 6: Visual Generation ───→ AI-generated images

STAGE 3: BUILD
  Phase 7: Implementation ──────→ Build scripts (modular)
  Phase 8: Code Review ─────────→ Verified scripts
  Phase 9: Build & Iterate ─────→ Final presentation file
```

**Check-in format:** At the end of each phase, present:
> "[Stage N/3 — Phase M: Phase Name] Here's what we have so far: [brief summary].
> Does this look right? Anything to adjust before we move on?"

**Do NOT skip phases** -- the shift-left principle means most effort goes into Stages 1-2.
The implementation in Stage 3 becomes almost mechanical because the design is solid.

## Resuming a Presentation

If invoked in a directory with existing presentation artifacts, detect partial progress:

| If this exists... | Resume from... |
|-------------------|----------------|
| `MATERIALS_INDEX.md` only | Phase 2 (Requirements) |
| Design spec in `docs/superpowers/specs/` | Phase 3 (Review) |
| `style-guide.md` | Phase 5 (Design Review) or Phase 6 (Visuals) |
| `images/` directory with files | Phase 7 (Implementation) |
| `build-deck/` directory with scripts | Phase 8 (Code Review) or Phase 9 (Build) |
| `.pptx`/`.html`/`.pdf`/`.docx` output | Phase 9 (Iterate) |

Present what was found and ask: "It looks like you have a presentation in progress. Want to
pick up where you left off, or start fresh?"

## Phase Details

### Phase 1: Research & Gather

Read `references/phase-1-research.md` for the detailed process.

**Summary:** Identify and collect source material. Use parallel agents to explore multiple
locations simultaneously. Organize into `MATERIALS_INDEX.md`.

If the user has NO source materials (starting from scratch), skip this phase and go directly
to Phase 2. The brainstorm will generate content.

**Outputs:** `gathered-materials/` directory + `MATERIALS_INDEX.md`

**First:** Create a project directory if one doesn't exist. Ask the user where to create it
or use the current working directory.

### Phase 2: Requirements & Design

Read `references/phase-2-requirements.md` for the detailed process.

**Summary:** Brainstorm structure through one-question-at-a-time dialogue. Cover: primary
takeaway, audience, duration, sections, timing, demos, output format.

**Outputs:** Design spec at `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`

### Phase 3: Multi-Agent Review

Read `references/review-tiers.md` for the tiered review detection process.

Refine the design spec through multi-perspective review using the best available mechanism.
Apply findings to the spec. Get user approval before proceeding.

**Outputs:** Refined design spec

### Phase 4: Style Guide

Read `references/phase-4-style-guide.md` for the detailed process.

**Summary:** Create `style-guide.md` governing ALL visual output -- slides and generated images.
Present to user for approval before generating any images.

**Outputs:** `style-guide.md`

### Phase 5: Design Review

Run another review pass on the complete design (spec + style guide) using the same tiered
mechanism from Phase 3. For Complex presentations, use full multi-agent review.
For Quick/Standard, an inline check is sufficient.

**Outputs:** Final approved spec + style guide

### Phase 6: Visual Generation

Read `references/phase-6-visuals.md` for the detailed process.

**Summary:** Generate images using `/generate-image` skill (or direct Replicate MCP calls) with
the style guide's prompt prefixes. Plan ALL images before generating. Batch in groups of 4.
Handle background removal for images on light slides.

**Important:** This phase runs BEFORE implementation because build scripts reference image paths.

**Outputs:** `images/` directory with all generated assets

### Phase 7: Implementation Scripts

Read `references/phase-7-implementation.md` for the detailed process.

**Summary:** Build the presentation using a modular architecture. Delegate to the appropriate
document-skills skill for the chosen format:
- **PPTX:** `/pptx` skill (pptxgenjs)
- **HTML:** `/frontend-design` skill
- **PDF:** `/pdf` skill
- **DOCX:** `/docx` skill

For PPTX: `theme.js` + `slides-s{N}.js` per section + `build.js` orchestrator.

Speaker notes are NOT optional. Every slide gets the full treatment. Read
`references/presentation-best-practices.md` for the speaker notes format and common patterns.

**After building:** Do a dedicated speaker notes review pass. Initial notes tend to be terse
"stage directions." The review should transform them into speakable talking points with pacing
cues, audience callouts, and transitions. Use the tiered review mechanism for this.

**Outputs:** Build scripts in `build-deck/` directory

### Phase 8: Code Review

Review build scripts for correctness and spec conformance. Read `references/review-tiers.md`.

For Complex presentations (>15 slides): Full multi-agent review.
Check for: runtime errors, layout overflow, style guide deviations, spec gaps, dead code,
terse speaker notes.

Fix all issues, then test build to verify zero errors and correct slide count.

**Outputs:** Verified, building scripts

### Phase 9: Build & Iterate

1. Run the build script to generate the presentation file
2. Verify: correct slide count, no errors
3. Present to user for review
4. Iterate based on feedback (targeted fixes, not full rewrites)

**Outputs:** Final presentation file

## Iteration Protocol

The modular architecture makes changes cheap:
- **Content change:** Edit specific `slides-s{N}.js`, rebuild
- **Image change:** Regenerate specific image, update reference, rebuild
- **Style change:** Update `style-guide.md` + `theme.js`, regenerate affected images, rebuild
- **Structure change:** Update spec, add/remove section files, update `build.js`, rebuild
- **Speaker notes:** Update notes in specific section file, rebuild

Always rebuild and verify after changes.

## Output Format Selection

| Format | Skill | Best For |
|--------|-------|----------|
| PPTX | `/pptx` | Conference talks, corporate presentations, speaker notes |
| HTML | `/frontend-design` | Interactive presentations, web-based delivery |
| PDF | `/pdf` | Handouts, read-along decks, print |
| DOCX | `/docx` | Narrative presentations, proposal decks with heavy text |

Default to **PPTX** unless the user specifies otherwise.
