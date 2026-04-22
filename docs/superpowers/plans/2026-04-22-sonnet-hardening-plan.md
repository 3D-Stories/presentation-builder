# Sonnet-Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply iteration-2 Sonnet-hardening changes to the presentation-builder skill per the design at `docs/superpowers/specs/2026-04-22-sonnet-hardening-design.md`, then validate via iteration-2 evals against the Appendix B assertion set.

**Architecture:** Instruction-level changes to SKILL.md and phase reference files — no code. Changes are sequenced so foundational additions (Q8 Visual Strategy, substantiated-waiver definition) land before the files that depend on them. Evidence-backed changes (Phase 6/7) are sequenced first; provisional changes (all other phases) follow and get validated by the iteration-2 eval run.

**Tech Stack:** Markdown editing + bash verification + iteration-2 eval run via the skill-creator eval framework.

**Branch:** `iter-2-sonnet-hardening` (already created; design doc already committed at `ad29c93`).

---

## Task Order & Dependency Rationale

1. **Stale header fixes** — isolated mechanical changes, first commit to get them out of the way.
2. **Phase 2 Q8 addition** — foundational; Phase 4, Phase 6, and setup.md all depend on Q8 values.
3. **Phase 6 rewrite + SKILL.md Phase 6 summary** — primary evidence-backed fix.
4. **setup.md** — depends on Q8; clarifies Phase 6 prerequisite handling.
5. **Phase 7 fix** — evidence-backed (document-skills fallback ambiguity).
6. **Phase 4 conditional image prompts** — depends on Q8.
7. **fallback-review-prompts.md** — updates the review substance expectations + substantiated-waiver pattern.
8. **SKILL.md Phase 3 + Phase 5 inline gates** — use the updated fallback prompts.
9. **review-tiers.md** — Tier 1/2 acknowledgment.
10. **Phase 1 hardening** — independent provisional changes.
11. **Phase 8 new file + SKILL.md Phase 8 reference** — build-before-review.
12. **SKILL.md Phase 9 inline** — final build verification.
13. **Eval setup** — update evals.json and per-eval metadata with Appendix B assertions.
14. **Run iteration-2 evals** — 8 subagents, same 4 scenarios, Sonnet.
15. **Verify acceptance criteria** — grade, aggregate, compare to iteration-1.

---

## Task 1: Stale header fixes

**Files:**
- Modify: `skills/presentation-builder/references/phase-6-visuals.md` (line 1)
- Modify: `skills/presentation-builder/references/phase-7-implementation.md` (line 1)

Separate mechanical commit per the design's "ship as a separate commit" note.

- [ ] **Step 1: Fix phase-6-visuals.md header**

Change line 1 from `# Phase 8: Visual Generation` to `# Phase 6: Visual Generation`.

- [ ] **Step 2: Fix phase-7-implementation.md header**

Change line 1 from `# Phase 6: Implementation Scripts` to `# Phase 7: Implementation Scripts`.

- [ ] **Step 3: Verify**

```bash
head -1 skills/presentation-builder/references/phase-6-visuals.md
head -1 skills/presentation-builder/references/phase-7-implementation.md
```
Expected output:
```
# Phase 6: Visual Generation
# Phase 7: Implementation Scripts
```

- [ ] **Step 4: Commit**

```bash
git add skills/presentation-builder/references/phase-6-visuals.md skills/presentation-builder/references/phase-7-implementation.md
git commit -m "$(cat <<'EOF'
docs(skill): fix stale phase-number headers in reference files

phase-6-visuals.md was titled "Phase 8"; phase-7-implementation.md was
titled "Phase 6". Left over from a prior refactor.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Phase 2 — add Q8 Visual Strategy + mechanical section design + cut plan + setup re-entry + gate

**Files:**
- Modify: `skills/presentation-builder/references/phase-2-requirements.md`

Phase 2 is foundational for Phase 4, Phase 6, and setup.md. Land it first.

- [ ] **Step 1: Replace the core-questions block with the 8-question version**

In `references/phase-2-requirements.md`, locate section `### 1. Core Questions (One at a Time)` (starts at current line 10). Replace the entire section through the end of `**Q7: Output Format**` with:

```markdown
### 1. Core Questions (One at a Time)

Ask these questions one per message, in order. Use multiple choice where possible.

**Q1: Primary Takeaway**
"What's the ONE thing you want the audience to remember tomorrow?"
- Offer 3-4 options based on the gathered materials, plus "something else"

**Q2: Audience**
"Who is in the room? What's their technical level?"
- Developers, managers, PMs, sysops, mixed?
- Have they seen this topic before? Baseline knowledge?

**Q3: Duration**
"How long is the talk?"
- This drives slide count: ~1.5-2 min per slide is a good rule
- 30 min = ~15-18 slides, 45 min = ~22-28 slides

**Q4: Structure Approach**
Propose 2-3 structural approaches with trade-offs. Common patterns:
- **The Journey** -- chronological evolution (best when presenter lived the story)
- **The Maturity Ladder** -- levels of sophistication (best for technical progression)
- **The Methodology** -- philosophy first, then proof (best for frameworks)
- **Problem-Solution** -- pain points then answers (best for sales/pitch)

**Q5: Key Topics**
"What must be covered?" Map gathered materials to topics.

**Q6: Demos**
"Any live demos? What's the backup plan if they fail?"

**Q7: Output Format**
"PPTX (default), HTML, PDF, or DOCX?"

**Q8: Visual Strategy**
"Do you want AI-generated images throughout the deck, or a text-only deck
(charts/shapes/icons built natively, no AI-generated imagery)?"
- Choices: `full` (all slides get images), `selective` (specific slides only — the spec will list which), `text-only` (no AI images)
- Thread the answer into the design spec's "Visual direction" section.
- If answer is `full` or `selective` AND Replicate MCP is not yet configured,
  pause Phase 2 and run the Replicate setup flow inline (see `setup.md`
  step 2). Resume Phase 2 on successful setup. If user declines to configure
  Replicate, offer to change Q8 to `text-only` — otherwise the skill cannot
  proceed to Phase 6 and halts with an explanation.
```

- [ ] **Step 2: Replace "Section Design" with mechanical requirements**

Locate `### 2. Section Design` and replace the entire section through the end of its bullet list with:

```markdown
### 2. Section Design (mechanical — enforceable)

After core questions, design the section-by-section structure. For EACH
section in the spec, produce a labelled subsection that contains ALL 6
of the following fields. A section subsection with fewer than 6 labelled
fields is incomplete — return to the user and ask for the missing fields
explicitly.

Required fields per section:
1. **Title** (and duration in minutes)
2. **Problem opening** — what pain point does this section address?
3. **Content** — key talking points (3-5 per section)
4. **Materials** — which gathered files support this section (or "none" if scratch)
5. **Slide concepts** — rough visual ideas per slide in the section
6. **Transition** — exact bridge sentence to the next section

A common Sonnet failure pattern is producing a thin section plan with 2-3
fields filled and the rest omitted. Do not do this — every section needs
all 6 labels, even if a field's content is "none" or "N/A".
```

- [ ] **Step 3: Make the Cut Plan conditional and mandatory when duration > 20min**

Locate `### 4. Cut Plan` and replace with:

```markdown
### 4. Cut Plan (mandatory when duration > 20 min)

If the presentation duration is GREATER than 20 minutes, the spec MUST
include a cut plan: "If told you have [shorter time], cut in this order: ..."
Prioritize dropping sections least essential to the primary takeaway.

If duration is 20 minutes or less, the spec must contain the exact line:

> Cut plan: not required (duration under 20min)

This converts "skip the cut plan quietly" into an explicit, gate-checkable
artifact state.
```

- [ ] **Step 4: Add the phase-complete gate at the end of the file**

Append to end of file:

```markdown
## Phase 2 — Phase-complete gate

Phase 2 is not complete until ALL of the following hold:

1. The design spec file exists at `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`.
2. Answers to Q1–Q8 are all recorded in the spec (including Q8 Visual Strategy).
3. Every section has a labelled subsection with all 6 required fields.
4. Cut plan is present (duration > 20 min) OR the line "Cut plan: not required (duration under 20min)" is present.
5. If Q8 = `full` or `selective`: Replicate MCP is configured (`grep -q "replicate" ~/.claude/mcp.json`) OR the user has explicitly changed Q8 to `text-only`.

A common Sonnet failure pattern is advancing to Phase 3 with condition
(3), (4), or (5) unmet. Do not advance until all five conditions hold.
```

- [ ] **Step 5: Verify**

```bash
grep -c "^\*\*Q[1-8]:" skills/presentation-builder/references/phase-2-requirements.md
grep -c "Phase-complete gate" skills/presentation-builder/references/phase-2-requirements.md
grep -c "Cut plan: not required (duration under 20min)" skills/presentation-builder/references/phase-2-requirements.md
```
Expected: `8`, `1`, `1`.

- [ ] **Step 6: Commit**

```bash
git add skills/presentation-builder/references/phase-2-requirements.md
git commit -m "$(cat <<'EOF'
docs(skill): add Q8 Visual Strategy and mechanical Phase 2 gate

Phase 2 now asks Q8 (full/selective/text-only) to gate Phase 6. Section
design requires 6 labelled fields per section. Cut plan becomes
mandatory for decks > 20 min, with an explicit 'not required' line for
shorter decks. Setup re-entry path for Replicate when Q8 = full/selective.

Part of iteration-2 Sonnet hardening.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Phase 6 full rewrite

**Files:**
- Modify (overwrite): `skills/presentation-builder/references/phase-6-visuals.md`

- [ ] **Step 1: Overwrite phase-6-visuals.md with the hardened version**

Replace entire file contents with:

```markdown
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
```

- [ ] **Step 2: Verify**

```bash
head -1 skills/presentation-builder/references/phase-6-visuals.md
grep -c "Phase-complete gate" skills/presentation-builder/references/phase-6-visuals.md
grep -c "Known failure modes" skills/presentation-builder/references/phase-6-visuals.md
grep -c "mcp__replicate__create_predictions" skills/presentation-builder/references/phase-6-visuals.md
```
Expected: `# Phase 6: Visual Generation`, `1`, `1`, and `≥ 2`.

- [ ] **Step 3: Commit**

```bash
git add skills/presentation-builder/references/phase-6-visuals.md
git commit -m "$(cat <<'EOF'
docs(skill): rewrite Phase 6 with action-first pattern and hard gate

Replaces 'plan-first' language with per-image action loop. Inlines
mcp__replicate__create_predictions and download_files call shapes.
Adds content-aware phase-complete gate (ls images/ count check),
names the IMAGE_PLAN.md failure mode, and ties prerequisites to Q8
Visual Strategy from Phase 2.

Addresses the primary real-user failure: Sonnet writing IMAGE_PLAN.md
in place of actually generating images when Replicate MCP was
configured and working.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: SKILL.md — Phase 6 summary update

**Files:**
- Modify: `skills/presentation-builder/SKILL.md` (Phase 6 section)

- [ ] **Step 1: Replace the Phase 6 section in SKILL.md**

Locate the section starting with `### Phase 6: Visual Generation` in `SKILL.md`. Replace through the end of that section (up to but not including `### Phase 7: Implementation Scripts`) with:

```markdown
### Phase 6: Visual Generation

**Hard prerequisite:** Replicate MCP configured and working AND Q8 ≠ `text-only`.
If Replicate is absent, STOP (Phase 2 should have caught this — see setup re-entry path in `references/phase-2-requirements.md`).
If Q8 = `text-only`, skip Phase 6 entirely and advance to Phase 7.

Read `references/phase-6-visuals.md` and follow it end-to-end. This phase is not complete until `images/` contains one file per image in the style guide's plan. Writing `IMAGE_PLAN.md` without files on disk is a known failure mode — do not advance to Phase 7 in that state.

**Important:** This phase runs BEFORE implementation because build scripts reference image paths.

**Outputs:** `images/` directory with all generated assets (unless Q8 = `text-only`).
```

- [ ] **Step 2: Verify**

```bash
grep -A4 "^### Phase 6: Visual Generation" skills/presentation-builder/SKILL.md | head -6
```
Expected output should include "Hard prerequisite:" line.

- [ ] **Step 3: Commit**

```bash
git add skills/presentation-builder/SKILL.md
git commit -m "$(cat <<'EOF'
docs(skill): tighten Phase 6 summary in SKILL.md

Inlines hard prerequisite (Q8 ≠ text-only AND Replicate configured),
names IMAGE_PLAN.md failure mode, and points at the rewritten
phase-6-visuals.md. Part of iteration-2 Sonnet hardening.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: setup.md — remove escape hatch, tie to Q8

**Files:**
- Modify: `skills/presentation-builder/references/setup.md` (Replicate MCP section)

- [ ] **Step 1: Replace the Replicate MCP section opening and escape-hatch block**

Locate the section starting with `### 2. Replicate MCP (for AI Image Generation)` in `setup.md`. Replace the entire section (through the end of the `**If user doesn't want to set up Replicate:**` block) with:

```markdown
### 2. Replicate MCP (for AI Image Generation)

Required when Phase 2 Q8 (Visual Strategy) is `full` or `selective`.
Skipped when Q8 = `text-only`.

Check current state:
```bash
grep -q "replicate" ~/.claude/mcp.json 2>/dev/null
```

If missing, guide the user through setup:

> "Image generation needs Replicate MCP. Here's what we need:
>
> 1. Go to **replicate.com/account/api-tokens** and create a free API token
> 2. Paste the token here and I'll configure everything
>
> The token will be stored locally in `~/.claude/mcp.json` (never sent anywhere except Replicate).
> The free tier is sufficient for most presentations (~50 images)."

Once the user provides the token:

1. Check if `~/.claude/mcp.json` exists.
2. If it exists, read it and MERGE the replicate server config (don't overwrite other servers).
3. If it doesn't exist, create it.

**Config to add/merge:**

```json
{
  "mcpServers": {
    "replicate": {
      "command": "npx",
      "args": ["-y", "replicate-mcp-server"],
      "env": {
        "REPLICATE_API_TOKEN": "<USER_PROVIDED_TOKEN>"
      }
    }
  }
}
```

After writing the config:

> "Replicate MCP configured. Run `/mcp` to reconnect, or restart Claude Code for the changes to take effect."

**If the user declines to configure Replicate:**

Do NOT proceed with a silent downgrade. The skill cannot produce AI-generated
images without Replicate. Offer the user a concrete choice:

> "Without Replicate MCP, the skill cannot generate AI images. I can either:
> (a) Proceed with Q8 = `text-only` (native shapes/charts/typography only — no AI images), or
> (b) Pause here so you can configure Replicate later and resume.
> Which would you prefer?"

If the user chooses (a), change Q8 to `text-only` in the design spec and continue. If the user chooses (b), halt with the reason documented in the transcript.

The prior "I can design the presentation and create placeholder slides
for images" language has been removed — it was a silent-downgrade path
that let Sonnet skip image generation without user opt-in.
```

- [ ] **Step 2: Verify**

```bash
grep -c "placeholder slides for images" skills/presentation-builder/references/setup.md
grep -c "text-only" skills/presentation-builder/references/setup.md
```
Expected: `0` (old language removed), `≥ 2` (Q8 references added).

- [ ] **Step 3: Commit**

```bash
git add skills/presentation-builder/references/setup.md
git commit -m "$(cat <<'EOF'
docs(skill): remove Replicate escape hatch, tie to Q8

Removes the 'placeholder slides for images' silent-downgrade language.
Replicate MCP is now required whenever Q8 = full/selective; users who
decline setup must either opt in to text-only or pause the skill.

Part of iteration-2 Sonnet hardening.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Phase 7 — resolve document-skills fallback + add gate

**Files:**
- Modify: `skills/presentation-builder/references/phase-7-implementation.md`
- Modify: `skills/presentation-builder/SKILL.md` (Phase 7 section)

- [ ] **Step 1: Add the document-skills fallback clarification to phase-7-implementation.md**

In `references/phase-7-implementation.md`, locate the section `## Architecture (Other Formats)`. Insert immediately BEFORE that section the following new block:

```markdown
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
```

- [ ] **Step 2: Add the phase-complete gate**

Append to end of `references/phase-7-implementation.md`:

```markdown
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

A common Sonnet failure pattern is declaring Phase 7 complete with build
scripts written but never executed. Do NOT advance to Phase 8 with an
unrun build.
```

- [ ] **Step 3: Update SKILL.md Phase 7 summary**

In `skills/presentation-builder/SKILL.md`, locate `### Phase 7: Implementation Scripts` and replace through the end of that section with:

```markdown
### Phase 7: Implementation Scripts

Read `references/phase-7-implementation.md` for the detailed process.

**Summary:** Build the presentation using modular scripts. Delegate to the
document-skills skill for the chosen format:
- **PPTX:** `/pptx` skill (pptxgenjs). **Fallback:** if `/pptx` is
  unavailable, use `pptxgenjs` directly with the modular theme.js +
  slides-s{N}.js + build.js architecture. Do NOT stall — this is a
  documented fall-through.
- **HTML:** `/frontend-design` skill. **Fallback:** plain HTML+CSS+JS.
- **PDF:** `/pdf` skill.
- **DOCX:** `/docx` skill.

For PPTX: `theme.js` + `slides-s{N}.js` per section + `build.js` orchestrator.

Speaker notes are NOT optional. Every slide gets the full treatment. Read
`references/presentation-best-practices.md` for the speaker notes format.

**Phase-complete gate:** Phase 7 is not complete until `build.js` runs with
zero errors and produces a presentation file of the expected slide count.
See `references/phase-7-implementation.md` for details.

**Outputs:** Build scripts in `build-deck/` directory + generated presentation file.
```

- [ ] **Step 4: Verify**

```bash
grep -c "Phase-complete gate" skills/presentation-builder/references/phase-7-implementation.md
grep -c "Fallback:" skills/presentation-builder/SKILL.md
grep -c "document-skills Availability" skills/presentation-builder/references/phase-7-implementation.md
```
Expected: `1`, `≥ 2`, `1`.

- [ ] **Step 5: Commit**

```bash
git add skills/presentation-builder/references/phase-7-implementation.md skills/presentation-builder/SKILL.md
git commit -m "$(cat <<'EOF'
docs(skill): resolve Phase 7 document-skills fallback and add gate

Explicit fall-through to pptxgenjs-direct when /pptx is unavailable,
so Sonnet doesn't stall. Adds Phase 7 phase-complete gate requiring
a successful build with matching slide count.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Phase 4 — conditional image prompts + 6-section gate

**Files:**
- Modify: `skills/presentation-builder/references/phase-4-style-guide.md`

- [ ] **Step 1: Make the image-prompts section conditional on Q8**

In `references/phase-4-style-guide.md`, locate `### 4. Define Image Generation Prompts` and replace with:

```markdown
### 4. Define Image Generation Prompts (conditional on Q8)

Skip this section entirely if Phase 2 Q8 = `text-only` — the style guide
should not include AI image-prompt prefixes when no AI images will be
generated. Instead, add a "Native Visual Patterns" subsection that
specifies how the deck expresses visual variety without AI images
(color blocks, typographic hierarchy, shape-based diagrams, icon sets).

Otherwise (Q8 = `full` or `selective`), create TWO prompt prefixes
that ALL image generation should use:

**For light-background content slides:**
> "[Style]. [Subject]. On solid white background. [Palette hex codes]. Clean modern style. Centered."

**For dark-background section dividers:**
> "[Style]. [Subject]. Dark [primary color] background hex [code]. [Palette hex codes]. Clean modern style. Centered."

The prefixes should use specific style and palette descriptors that trace
back to the color palette chosen in step 1 of this phase.
```

- [ ] **Step 2: Add content-aware phase-complete gate at the end of the file**

Append to end of file:

```markdown
## Phase 4 — Phase-complete gate

Phase 4 is NOT complete until `style-guide.md` exists AND contains all
6 required sections:

1. **Color palette** with at least 4 colors (each with hex code and role label).
2. **Typography table** with at least 4 element types (title, body, code, big-stats, captions, etc.).
3. **Slide structure patterns** (dark/light slide mapping, accent patterns, etc.).
4. **Visual motifs** — at least 1 recurring element (card pattern, progress bar, icon style, etc.).
5. **Image-prompt prefixes** IF Q8 ≠ `text-only`. If Q8 = `text-only`, a
   "Native Visual Patterns" subsection replaces this.
6. **File written** — the content above is saved to `style-guide.md` at
   the project root (not just presented in chat).

A common Sonnet failure pattern is a thin style guide with 3-4 of these
sections and the rest missing. Do NOT advance to Phase 5 with any
required section empty or absent.
```

- [ ] **Step 3: Verify**

```bash
grep -c "Phase-complete gate" skills/presentation-builder/references/phase-4-style-guide.md
grep -c "conditional on Q8" skills/presentation-builder/references/phase-4-style-guide.md
grep -c "Native Visual Patterns" skills/presentation-builder/references/phase-4-style-guide.md
```
Expected: `1`, `1`, `≥ 2`.

- [ ] **Step 4: Commit**

```bash
git add skills/presentation-builder/references/phase-4-style-guide.md
git commit -m "$(cat <<'EOF'
docs(skill): Phase 4 — conditional image prompts + 6-section gate

Image-prompt section is now conditional on Q8 (omitted for text-only,
replaced with Native Visual Patterns subsection). Adds a content-aware
phase-complete gate requiring all 6 style-guide sections present.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: fallback-review-prompts.md — substance + substantiated-waiver

**Files:**
- Modify: `skills/presentation-builder/references/fallback-review-prompts.md`

- [ ] **Step 1: Add substance expectations + substantiated-waiver definition at the top**

In `references/fallback-review-prompts.md`, locate the `## How to Use` section and REPLACE it with:

```markdown
## How to Use

For each reviewer, adopt their persona and review the design spec (or
implementation code) from their specific perspective. Present all 4 reviews,
then synthesize the findings.

## Substance expectations (gate requirement)

Each persona MUST produce at least 3 **substantive findings**. A
substantive finding is one that:

- Names a concrete location in the artifact — a section name, slide number,
  or exact quoted phrase.
- States what specifically is wrong and why.

Example of substantive: "Slide 12 ('The Cardinality Curve') shows the chart
before introducing the cardinality concept in slide 11 — the audience sees
the payoff before the setup. Reorder so the concept lands before the chart."

Example of NOT substantive (too vague): "Some slides feel dense."

A persona review with fewer than 3 substantive findings is too shallow.
Re-prompt with: "Be more specific — name slides, sections, or exact
phrases in the artifact, and say what specifically is wrong."

## Substantiated waivers (when a persona finds no issues)

If a persona genuinely finds no issues from their perspective, they do NOT
write "no issues from this perspective" as a bare statement. That phrasing
is an escape hatch and does not satisfy the gate. Instead, they write a
**substantiated waiver** — a single line naming what they checked and
against what criteria:

> "No issues — I reviewed the opening of each of the 5 sections for
> problem-first framing and found all 5 start with a problem."

Or:

> "No issues — I audited the timing table against the duration (25 min
> stated; sections sum to 23 min + 10% buffer = 25.3 min)."

A bare "no issues from this perspective" does NOT satisfy the gate. The
waiver must name what was checked.
```

- [ ] **Step 2: Update the synthesis format to require spec edits**

Locate `## Synthesis Format` and REPLACE it with:

```markdown
## Synthesis Format

After all 4 reviews, synthesize findings into a table:

| Severity | Count | Key Issues |
|----------|-------|------------|
| Must fix | N | ... |
| Should fix | N | ... |
| Nice to have | N | ... |

Then, for each Must fix finding, apply a corresponding edit to the artifact
(spec, style guide, or code) and record the edit in the artifact's
review-log section:

```
## Review Log (Phase N)

### [Reviewer name] — [Finding title]
- **Finding:** [what was wrong, with location]
- **Severity:** Must fix
- **Resolution:** [concrete edit made, or "Dismissed because X"]
```

A common Sonnet failure pattern is producing the synthesis table and
advancing without applying any edits. Must fix findings that are not
applied (or not explicitly dismissed with reasoning) fail the Phase 3 /
Phase 5 / Phase 8 gate.
```

- [ ] **Step 3: Verify**

```bash
grep -c "substantive finding" skills/presentation-builder/references/fallback-review-prompts.md
grep -c "substantiated waiver" skills/presentation-builder/references/fallback-review-prompts.md
grep -c "Review Log" skills/presentation-builder/references/fallback-review-prompts.md
```
Expected: `≥ 2`, `≥ 2`, `≥ 1`.

- [ ] **Step 4: Commit**

```bash
git add skills/presentation-builder/references/fallback-review-prompts.md
git commit -m "$(cat <<'EOF'
docs(skill): strengthen fallback review prompts (substance + waivers)

Each persona must now produce ≥ 3 substantive findings (with locations)
or a substantiated waiver naming what was checked. Synthesis step
requires concrete edits to the artifact for every Must-fix finding,
recorded in the artifact's Review Log.

Closes the 'no issues from this perspective' escape hatch flagged by
the reflexion critique.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: SKILL.md — Phase 3 and Phase 5 inline gates

**Files:**
- Modify: `skills/presentation-builder/SKILL.md`

- [ ] **Step 1: Replace the Phase 3 section**

Locate `### Phase 3: Multi-Agent Review` in `SKILL.md` and replace through the end of that section with:

```markdown
### Phase 3: Multi-Agent Review

Read `references/review-tiers.md` for the tiered review detection process and
`references/fallback-review-prompts.md` for the Tier 3 persona prompts,
substance expectations, and substantiated-waiver format.

Refine the design spec through multi-perspective review using the best available mechanism.

**Phase-complete gate:** Phase 3 is NOT complete until:
1. The design spec contains a "Review Log (Phase 3)" section with ≥ 3 substantive findings per persona (or a substantiated waiver per persona — bare "no issues from this perspective" does NOT satisfy this gate).
2. Every Must-fix finding has a corresponding spec edit or explicit documented dismissal in the review log.

A common Sonnet failure pattern is producing shallow reviews (one or zero findings per persona) or advancing without applying Must-fix edits. Do NOT advance to Phase 4 in that state.

**Outputs:** Refined design spec with Review Log (Phase 3) section.
```

- [ ] **Step 2: Replace the Phase 5 section**

Locate `### Phase 5: Design Review` and replace through the end of that section with:

```markdown
### Phase 5: Design Review

Run another review pass, this time on the complete design (spec + style guide together) using the same tiered mechanism from Phase 3.

For Complex presentations, use full multi-agent review. For Quick/Standard, an inline check is sufficient — but substance expectations and the substantiated-waiver rule still apply.

**Phase-complete gate:** Phase 5 is NOT complete until:
1. The spec contains a "Review Log (Phase 5)" section with ≥ 3 substantive findings per persona (or substantiated waiver), reviewing spec + style-guide together.
2. Every Must-fix finding has a corresponding spec/style-guide edit or explicit dismissal.

**Outputs:** Final approved spec + style guide with Review Log (Phase 5) section.
```

- [ ] **Step 3: Verify**

```bash
grep -c "Review Log (Phase 3)" skills/presentation-builder/SKILL.md
grep -c "Review Log (Phase 5)" skills/presentation-builder/SKILL.md
grep -c "substantiated waiver" skills/presentation-builder/SKILL.md
```
Expected: `≥ 1`, `≥ 1`, `≥ 2`.

- [ ] **Step 4: Commit**

```bash
git add skills/presentation-builder/SKILL.md
git commit -m "$(cat <<'EOF'
docs(skill): inline Phase 3 and Phase 5 gates in SKILL.md

Inlines content-aware gates per Principle 1 of the iter-2 design:
Review Log section with ≥ 3 substantive findings per persona and
every Must-fix applied or dismissed. Closes the 'no issues from this
perspective' escape hatch.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: review-tiers.md — Tier 1/2 acknowledgment

**Files:**
- Modify: `skills/presentation-builder/references/review-tiers.md`

- [ ] **Step 1: Add an execution-context note at the top**

In `references/review-tiers.md`, insert the following block immediately AFTER the `# Review Tiers` heading and the introductory paragraph:

```markdown
## Execution Context Note (iteration 2)

Tier 1 (BMAD party mode) and Tier 2 (Reflexion critique) invoke orchestrated
sub-agents that require interactive multi-turn execution with the user. In
single-agent / autonomous sessions (subagents running this skill, headless
runs, evaluation harnesses), Tier 1 and Tier 2 do not execute reliably —
they fall through to Tier 3.

**For single-agent / autonomous runs:** default to Tier 3 (built-in fallback
review from `fallback-review-prompts.md`). This is a deliberate
reliability-over-quality-ceiling tradeoff.

**For interactive Opus sessions:** Tier 1 is still preferred when available —
it produces the richest feedback. Tier 2 is next.

The substance expectations (≥ 3 substantive findings per persona, or a
substantiated waiver — see `fallback-review-prompts.md`) apply to ALL
tiers. Tier 1's reviewer agents must still hit the same bar.
```

- [ ] **Step 2: Verify**

```bash
grep -c "Execution Context Note" skills/presentation-builder/references/review-tiers.md
grep -c "substantiated waiver" skills/presentation-builder/references/review-tiers.md
```
Expected: `1`, `≥ 1`.

- [ ] **Step 3: Commit**

```bash
git add skills/presentation-builder/references/review-tiers.md
git commit -m "$(cat <<'EOF'
docs(skill): clarify review tier defaults for autonomous runs

Tier 1/2 require interactive orchestration; single-agent runs default
to Tier 3. Substance expectations (≥ 3 substantive findings or
substantiated waiver) apply across all tiers.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Phase 1 — restructure + exception + gate

**Files:**
- Modify: `skills/presentation-builder/references/phase-1-research.md`

- [ ] **Step 1: Add the exception-clause detection as the first step**

In `references/phase-1-research.md`, locate the `## Process` heading. Insert the following new section immediately AFTER `## Process` and BEFORE the existing `### 1. Identify Sources`:

```markdown
### 0. Check for the "no materials" scratch-start

Before any gathering, ask the user exactly:

> "Do you have any source materials (files, notes, docs, links) I should work from, or should I brainstorm from scratch?"

If the user says they want to brainstorm from scratch (no existing
materials), write a single-line marker file at the project root:

```bash
echo "User is starting from scratch — Phase 1 skipped." > NO_MATERIALS.md
```

Then SKIP the rest of Phase 1 and advance directly to Phase 2.

If the user has materials, proceed to step 1 below.
```

- [ ] **Step 2: Reorder Copy & Organize before Create Materials Index**

Locate `### 3. Copy & Organize` and `### 4. Create Materials Index`. The current order already has Copy before Create Index — verify this is the case; if not, swap. (As of this writing the file has the correct order; this step is a verification.)

- [ ] **Step 3: Expand "Identify Gaps" into a required artifact section**

Locate `### 5. Identify Gaps` and REPLACE with:

```markdown
### 5. Identify Gaps (required artifact)

After gathering, review the index and flag:
- Topics with thin coverage (need more material)
- Topics with no real-world examples (need case studies)
- Missing statistics or metrics (need data)
- Areas where the user's personal experience is the primary source (note for speaker notes)

The gaps MUST be written to `MATERIALS_INDEX.md` as a "Gaps" section at the
end of the index. If no gaps are identified, the section is still required
but reads:

```
## Gaps

Gaps: none identified — coverage audited against [list of topics from index].
```

This converts what was previously an interactive dialogue step into an
artifact-backed one, which Sonnet handles more reliably.

After writing the Gaps section to the index, surface the gaps (if any)
to the user and ask how to fill them.
```

- [ ] **Step 4: Add the phase-complete gate**

Append to end of file:

```markdown
## Phase 1 — Phase-complete gate

Phase 1 is complete when EITHER of the following holds:

**(a) Starting from scratch:** `NO_MATERIALS.md` exists at the project root.
No `MATERIALS_INDEX.md` is required; no `gathered-materials/` is required.

**(b) Materials exist:** ALL of the following hold:
1. `MATERIALS_INDEX.md` exists at the project root.
2. `gathered-materials/` contains at least 1 file (`find gathered-materials/ -type f | wc -l` ≥ 1).
3. Every file path referenced in `MATERIALS_INDEX.md` points to a file that actually exists under `gathered-materials/` (no imaginary files).
4. `MATERIALS_INDEX.md` contains a "Gaps" section (either with identified gaps or the "none identified — audited against [list]" sentinel).

A common Sonnet failure pattern is writing `MATERIALS_INDEX.md`
referencing files that were "meant to be copied" but weren't. Do NOT
advance to Phase 2 until condition (a) OR all four parts of (b) hold.
```

- [ ] **Step 5: Verify**

```bash
grep -c "NO_MATERIALS.md" skills/presentation-builder/references/phase-1-research.md
grep -c "Phase-complete gate" skills/presentation-builder/references/phase-1-research.md
grep -c "none identified" skills/presentation-builder/references/phase-1-research.md
```
Expected: `≥ 2`, `1`, `≥ 1`.

- [ ] **Step 6: Commit**

```bash
git add skills/presentation-builder/references/phase-1-research.md
git commit -m "$(cat <<'EOF'
docs(skill): Phase 1 — scratch-start marker, gap artifact, gate

Adds NO_MATERIALS.md marker for scratch-start users (no gate fires).
Converts 'Identify Gaps' dialogue into a required Gaps section in
MATERIALS_INDEX.md. Adds content-aware phase-complete gate requiring
gathered-materials/ non-empty AND all indexed files exist.

Part of iteration-2 Sonnet hardening (provisional — evidence base is
inferred risk, not observed failure).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Phase 8 — new reference file

**Files:**
- Create: `skills/presentation-builder/references/phase-8-code-review.md`
- Modify: `skills/presentation-builder/SKILL.md`

- [ ] **Step 1: Create phase-8-code-review.md**

Create `skills/presentation-builder/references/phase-8-code-review.md` with:

```markdown
# Phase 8: Code Review

## Purpose

Review the build scripts for correctness and spec conformance BEFORE
declaring Phase 7 complete. This catches runtime errors, layout overflow,
style-guide deviations, spec gaps, dead code, and terse speaker notes.

## Mandatory pre-review step: run the build

Before any code review happens, run the build command and capture the
output:

```bash
cd build-deck && node build.js 2>&1 | tee ../build-output.log ; echo "EXIT=$?"
```

Record in the review context:
- Exit code (must be 0 for review to proceed).
- stdout + stderr (captured in `build-output.log`).
- Generated file size (e.g., `ls -la output.pptx | awk '{print $5}'`).

If the build FAILS (exit code ≠ 0), that's the FIRST finding. All
subsequent review is conditional on fixing the build failure — re-run
the build after fixes until exit code 0.

A common Sonnet failure pattern is reading the build scripts and
commenting on them without running the build. The build failure class
is the most important thing code review catches — don't skip the run.

## Review process

Use the tiered review mechanism from `review-tiers.md`. For code review,
the relevant personas from `fallback-review-prompts.md` are:
- **Presentation Expert** — reviews slide layout, timing, visual hierarchy.
- **Technical Architect** — reviews code structure, module boundaries,
  error handling.
- **Product Manager** — reviews whether the deck delivers the primary
  takeaway.

The substance expectations apply: each persona produces ≥ 3 substantive
findings (or a substantiated waiver) with locations cited.

Focus on:
- Runtime errors (exit code ≠ 0 in the build — but this is already a
  blocker caught in the pre-review step)
- Layout overflow (text clipping, off-palette colors)
- Style-guide deviations (did a slide use an off-palette color?
  off-typography size?)
- Spec gaps (is every section from the spec represented in slides?)
- Dead code (unused helper functions, unused imports)
- Terse speaker notes (notes that are stage directions rather than
  speakable talking points — per `presentation-best-practices.md`)

## Phase-complete gate

Phase 8 is NOT complete until:

1. The build was executed at least once (transcript contains evidence of
   `node build.js` invocation with captured output).
2. The most recent build run exited with code 0 OR the failure is
   recorded in the review log and subsequently fixed (re-run to 0).
3. A "Review Log (Phase 8)" section is written to a reviewable location
   (either the spec or a new `code-review.md` file — pick one per project
   convention).
4. The review log contains ≥ 3 substantive findings per persona (or
   substantiated waivers).
5. Every Must-fix finding has a corresponding code edit applied (or
   explicit documented dismissal).

A common Sonnet failure pattern is reading the code and advancing
without running the build. Do NOT advance to Phase 9 without the
mandatory pre-review step complete.

## Outputs

- `build-output.log` (captured build stderr/stdout) — informational.
- `Review Log (Phase 8)` section in the spec (or `code-review.md`).
- Code edits applied for Must-fix findings.
```

- [ ] **Step 2: Update SKILL.md Phase 8 section**

Locate `### Phase 8: Code Review` in `SKILL.md` and replace through the end of that section with:

```markdown
### Phase 8: Code Review

Read `references/phase-8-code-review.md` for the detailed process, including the MANDATORY pre-review build run.

**Summary:** Run the build FIRST (capture exit code, stderr/stdout, file size). Then review build scripts via the tiered review mechanism (see `references/review-tiers.md`). Apply Must-fix findings.

**Phase-complete gate:** Phase 8 is NOT complete until:
1. Build was executed with captured output.
2. Latest build run exits with code 0.
3. Review Log (Phase 8) exists with ≥ 3 substantive findings per persona (or substantiated waivers).
4. Every Must-fix finding has a code edit applied or explicit dismissal.

A common Sonnet failure pattern is reviewing code without running the build. Do NOT advance to Phase 9 in that state.

**Outputs:** Verified build scripts + Review Log (Phase 8).
```

- [ ] **Step 3: Verify**

```bash
test -f skills/presentation-builder/references/phase-8-code-review.md && echo "FILE EXISTS"
grep -c "Mandatory pre-review step: run the build" skills/presentation-builder/references/phase-8-code-review.md
grep -c "Review Log (Phase 8)" skills/presentation-builder/SKILL.md
```
Expected: `FILE EXISTS`, `1`, `≥ 1`.

- [ ] **Step 4: Commit**

```bash
git add skills/presentation-builder/references/phase-8-code-review.md skills/presentation-builder/SKILL.md
git commit -m "$(cat <<'EOF'
docs(skill): Phase 8 — add reference file + mandatory build-before-review

New references/phase-8-code-review.md makes the pre-review build run
mandatory and captures exit code + output. SKILL.md Phase 8 summary
inlines the gate (build run, exit 0, Review Log with substantive
findings per persona, Must-fix applied).

Closes the 'review code without running build' failure mode.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: SKILL.md — Phase 9 inline gate

**Files:**
- Modify: `skills/presentation-builder/SKILL.md`

- [ ] **Step 1: Replace Phase 9 section with fully-inlined version**

Locate `### Phase 9: Build & Iterate` and replace through the end of that section with:

```markdown
### Phase 9: Build & Iterate

Run the build script to generate the presentation file:

```bash
cd build-deck && node build.js
```

**Phase-complete gate:** Phase 9 is NOT complete until:

1. The output file exists at the expected path (e.g., `output.pptx`).
2. The output file size exceeds the minimum threshold:
   - PPTX: ≥ 10 KB
   - PDF: ≥ 5 KB
   - DOCX: ≥ 5 KB
   - HTML: ≥ 5 KB
3. The slide count in the output matches the spec's total slide count
   (pptxgenjs' built-in assertion in `build.js` covers this; parse the
   generated file for other formats if needed).
4. The build invocation is recorded in the transcript (exit code captured).

A common Sonnet failure pattern is declaring Phase 9 complete based on
build scripts existing rather than on actually running them. Do NOT skip
the build invocation — the build script must execute and produce a file
on disk that passes the size and slide-count checks.

Iterate based on user feedback using the iteration protocol below.

**Outputs:** Final presentation file.
```

- [ ] **Step 2: Verify**

```bash
grep -c "Phase 9 is NOT complete until" skills/presentation-builder/SKILL.md
grep -c "10 KB" skills/presentation-builder/SKILL.md
```
Expected: `1`, `1`.

- [ ] **Step 3: Commit**

```bash
git add skills/presentation-builder/SKILL.md
git commit -m "$(cat <<'EOF'
docs(skill): Phase 9 — inline build + content-aware gate

Phase 9 summary now shows the build invocation directly and gates on
output file existence, minimum size threshold per format, and slide-
count match. Closes the 'declare build success without running build'
failure mode.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: Eval setup — update evals.json and per-eval metadata with Appendix B assertions

**Files:**
- Modify: `skills/presentation-builder/evals/evals.json`
- Modify: `presentation-builder-workspace/iteration-2/eval-*/eval_metadata.json` (new iteration dir)

Iteration-2 evals use the same 4 scenarios as iteration-1 but stricter assertions.

- [ ] **Step 1: Create iteration-2 workspace skeleton**

```bash
cd presentation-builder-workspace
mkdir -p iteration-2
# Copy fixtures from iteration-1 (unchanged)
cp -r iteration-1/fixtures iteration-2/fixtures
# Create eval directories and workdirs
for test in team-update auth-migration pitch-deck otel-resume; do
  for cond in with_skill without_skill; do
    mkdir -p "iteration-2/eval-${test}/${cond}/workdir" "iteration-2/eval-${test}/${cond}/outputs"
  done
done
# Copy fixtures into workdirs
for test in team-update auth-migration pitch-deck otel-resume; do
  fixture_num=$(case $test in
    team-update) echo 1;;
    auth-migration) echo 2;;
    pitch-deck) echo 3;;
    otel-resume) echo 4;;
  esac)
  case $test in
    team-update) ;;  # empty fixture
    auth-migration)
      cp -r iteration-2/fixtures/test-2-auth-migration/. iteration-2/eval-auth-migration/with_skill/workdir/
      cp -r iteration-2/fixtures/test-2-auth-migration/. iteration-2/eval-auth-migration/without_skill/workdir/ ;;
    pitch-deck)
      cp -r iteration-2/fixtures/test-3-pitch-deck/. iteration-2/eval-pitch-deck/with_skill/workdir/
      cp -r iteration-2/fixtures/test-3-pitch-deck/. iteration-2/eval-pitch-deck/without_skill/workdir/ ;;
    otel-resume)
      cp -r iteration-2/fixtures/test-4-otel-resume/. iteration-2/eval-otel-resume/with_skill/workdir/
      cp -r iteration-2/fixtures/test-4-otel-resume/. iteration-2/eval-otel-resume/without_skill/workdir/ ;;
  esac
done
```

- [ ] **Step 2: Write eval_metadata.json per eval — applying Appendix B assertions**

For each eval directory, write an `eval_metadata.json` with the prompt AND the applicable assertions from Appendix B of the design doc. Scenario-to-assertion mapping:

- **team-update** (Quick path, empty workdir, Q8 should be `text-only` or `selective`): applies B3, B4, B5, B6, B9, B12, B13, B14, B18 (skip B1/B2 per the design's note about scenarios without Phase 1). Also add Phase 3/5/8 assertions if those phases run.
- **auth-migration** (Standard, rich materials, Q8 likely `full` or `selective`): applies B1, B2, B3, B4, B5, B6, B7, B8, B9, B10, B11, B12, B13, B14, B15, B16, B17, B18.
- **pitch-deck** (Complex, partial materials, Q8 likely `selective`): same as auth-migration (B1–B18 applicable).
- **otel-resume** (Resumption, prior-run state, starts at Phase 3): skip Phase 1/2 assertions (B1, B2, B3, B4, B5, B6); apply B7–B18.

Write `presentation-builder-workspace/iteration-2/eval-team-update/eval_metadata.json`:

```json
{
  "eval_id": 1,
  "eval_name": "team-update",
  "prompt": "Make me a 5-slide team update on our Q4 website redesign — standup tomorrow, super informal, just the highlights of what shipped.",
  "assertions": [
    "B3: design spec exists and contains answers to Q1-Q8",
    "B4: every section has all 6 labelled fields",
    "B5: cut plan present OR explicit 'not required' line (duration likely ≤ 20 min, so 'not required' line expected)",
    "B6: if Q8 = full/selective, Replicate MCP is configured; otherwise Q8 = text-only and assertion is vacuously true",
    "B9: style-guide.md exists with all 6 required sections (image-prompts iff Q8 ≠ text-only)",
    "B12: if Q8 ≠ text-only, images/ has file per plan; otherwise no images/ expected",
    "B13: no IMAGE_PLAN.md used as completion marker",
    "B14: build.js runs exit 0 and slide count matches",
    "B18: output file exists at expected path, size ≥ threshold, slide count matches spec"
  ]
}
```

Write `presentation-builder-workspace/iteration-2/eval-auth-migration/eval_metadata.json`:

```json
{
  "eval_id": 2,
  "eval_name": "auth-migration",
  "prompt": "I need to give a 20-minute talk at our engineering all-hands about the auth migration we just finished. Audience is ~40 engineers, mixed seniority. I want to cover what we shipped, the gnarliest bug we hit, and what we'd do differently. PPTX please. I have some notes in this directory.",
  "assertions": [
    "B1: gathered-materials/ has ≥ 1 file AND every indexed file exists (OR NO_MATERIALS.md marker if user starts from scratch)",
    "B2: MATERIALS_INDEX.md contains a Gaps section",
    "B3: design spec exists with answers to Q1-Q8",
    "B4: every section has all 6 labelled fields",
    "B5: cut plan present OR 'not required' (20-min duration is the boundary — either acceptable)",
    "B6: if Q8 = full/selective, Replicate MCP is configured",
    "B7: Review Log Phase 3 has ≥ 3 substantive findings per persona (or substantiated waivers)",
    "B8: every Phase 3 Must-fix has a spec edit or dismissal",
    "B9: style-guide.md has all 6 required sections",
    "B10: Review Log Phase 5 has ≥ 3 substantive findings per persona",
    "B11: every Phase 5 Must-fix has a spec/style-guide edit or dismissal",
    "B12: if Q8 ≠ text-only, images/ has file per plan",
    "B13: no IMAGE_PLAN.md in place of generated files",
    "B14: build.js runs exit 0 and slide count matches spec",
    "B15: build was executed before code review (transcript evidence)",
    "B16: Review Log Phase 8 has ≥ 3 substantive findings per persona",
    "B17: every Phase 8 Must-fix has a code edit or dismissal",
    "B18: output file exists, size ≥ threshold, slide count matches"
  ]
}
```

Write `presentation-builder-workspace/iteration-2/eval-pitch-deck/eval_metadata.json` (same assertion set as auth-migration — the scenario applies all of B1-B18):

```json
{
  "eval_id": 3,
  "eval_name": "pitch-deck",
  "prompt": "Put together a pitch deck for a 15-minute investor meeting about our new consumer fitness app — pre-revenue, seed stage, looking for $2M. Standard 10-12 slide structure, VC audience. I've dropped what I have into this directory.",
  "assertions": [
    "B1: gathered-materials/ has ≥ 1 file AND every indexed file exists",
    "B2: MATERIALS_INDEX.md contains a Gaps section",
    "B3: design spec exists with answers to Q1-Q8",
    "B4: every section has all 6 labelled fields",
    "B5: cut plan 'not required' (15-min < 20-min threshold)",
    "B6: if Q8 = full/selective, Replicate MCP is configured",
    "B7: Review Log Phase 3 has ≥ 3 substantive findings per persona",
    "B8: every Phase 3 Must-fix has a spec edit or dismissal",
    "B9: style-guide.md has all 6 required sections",
    "B10: Review Log Phase 5 has ≥ 3 substantive findings per persona",
    "B11: every Phase 5 Must-fix has a spec/style-guide edit or dismissal",
    "B12: if Q8 ≠ text-only, images/ has file per plan",
    "B13: no IMAGE_PLAN.md in place of generated files",
    "B14: build.js runs exit 0 and slide count matches",
    "B15: build was executed before code review",
    "B16: Review Log Phase 8 has ≥ 3 substantive findings per persona",
    "B17: every Phase 8 Must-fix has a code edit or dismissal",
    "B18: output file exists, size ≥ threshold, slide count matches"
  ]
}
```

Write `presentation-builder-workspace/iteration-2/eval-otel-resume/eval_metadata.json` (skips B1-B6; starts at Phase 3):

```json
{
  "eval_id": 4,
  "eval_name": "otel-resume",
  "prompt": "Hey, continue working on my OTel migration deck.",
  "assertions": [
    "Resumption detected: prior artifacts (MATERIALS_INDEX.md, design spec) recognized before any new work begins; transcript announces what was found",
    "Resumed from Phase 3 (Review) — NOT Phase 1 or Phase 2 — per the SKILL.md resumption table",
    "MATERIALS_INDEX.md not overwritten with different content",
    "Existing design spec not overwritten",
    "B7: Review Log Phase 3 has ≥ 3 substantive findings per persona",
    "B8: every Phase 3 Must-fix has a spec edit or dismissal",
    "B9: style-guide.md has all 6 required sections",
    "B10: Review Log Phase 5 has ≥ 3 substantive findings per persona",
    "B11: every Phase 5 Must-fix has a spec/style-guide edit or dismissal",
    "B12: if Q8 ≠ text-only, images/ has file per plan",
    "B13: no IMAGE_PLAN.md in place of generated files",
    "B14: build.js runs exit 0 and slide count matches",
    "B15: build was executed before code review",
    "B16: Review Log Phase 8 has ≥ 3 substantive findings per persona",
    "B17: every Phase 8 Must-fix has a code edit or dismissal",
    "B18: output file exists, size ≥ threshold, slide count matches"
  ]
}
```

- [ ] **Step 3: Update skill-level evals/evals.json**

Replace `skills/presentation-builder/evals/evals.json` with the Appendix-B-aligned version:

```json
{
  "skill_name": "presentation-builder",
  "iteration": 2,
  "evals": [
    {
      "id": 1,
      "name": "team-update",
      "prompt": "Make me a 5-slide team update on our Q4 website redesign — standup tomorrow, super informal, just the highlights of what shipped.",
      "fixture": "empty",
      "expected_path": "Quick",
      "files": [],
      "expectations": ["B3", "B4", "B5", "B6", "B9", "B12", "B13", "B14", "B18"]
    },
    {
      "id": 2,
      "name": "auth-migration",
      "prompt": "I need to give a 20-minute talk at our engineering all-hands about the auth migration we just finished. Audience is ~40 engineers, mixed seniority. I want to cover what we shipped, the gnarliest bug we hit, and what we'd do differently. PPTX please. I have some notes in this directory.",
      "fixture": "test-2-auth-migration",
      "expected_path": "Standard",
      "files": ["design-doc.md", "postmortem.md", "migration-notes.md"],
      "expectations": ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "B14", "B15", "B16", "B17", "B18"]
    },
    {
      "id": 3,
      "name": "pitch-deck",
      "prompt": "Put together a pitch deck for a 15-minute investor meeting about our new consumer fitness app — pre-revenue, seed stage, looking for $2M. Standard 10-12 slide structure, VC audience. I've dropped what I have into this directory.",
      "fixture": "test-3-pitch-deck",
      "expected_path": "Complex",
      "files": ["product-vision.md"],
      "expectations": ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "B14", "B15", "B16", "B17", "B18"]
    },
    {
      "id": 4,
      "name": "otel-resume",
      "prompt": "Hey, continue working on my OTel migration deck.",
      "fixture": "test-4-otel-resume",
      "expected_path": "Resumption (Phase 3)",
      "files": ["MATERIALS_INDEX.md", "docs/superpowers/specs/2026-04-15-otel-migration-design.md", "gathered-materials/"],
      "expectations": ["resumption-detected", "resumed-from-phase-3", "materials-index-preserved", "spec-preserved", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "B14", "B15", "B16", "B17", "B18"]
    }
  ]
}
```

- [ ] **Step 4: Verify**

```bash
cat presentation-builder-workspace/iteration-2/eval-team-update/eval_metadata.json | python3 -c "import json,sys; d=json.load(sys.stdin); print('assertions:', len(d['assertions']))"
cat presentation-builder-workspace/iteration-2/eval-auth-migration/eval_metadata.json | python3 -c "import json,sys; d=json.load(sys.stdin); print('assertions:', len(d['assertions']))"
cat skills/presentation-builder/evals/evals.json | python3 -c "import json,sys; d=json.load(sys.stdin); print('iteration:', d.get('iteration')); print('evals:', len(d['evals']))"
```
Expected: `assertions: 9`, `assertions: 18`, `iteration: 2`, `evals: 4`.

- [ ] **Step 5: Commit**

```bash
git add skills/presentation-builder/evals/evals.json presentation-builder-workspace/iteration-2/
git commit -m "$(cat <<'EOF'
evals(skill): iteration-2 assertion set (Appendix B) and workspace

Builds iteration-2 workspace with fixtures copied from iteration-1.
Per-eval metadata applies the 18 assertions from Appendix B of the
design doc, scoped per scenario (team-update minimal, auth/pitch full,
otel-resume starts at Phase 3).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: Run iteration-2 evals (8 subagents)

**Files:**
- Create: `presentation-builder-workspace/iteration-2/agent_map.json`
- Create: per-run timing.json and grading.json files

This task dispatches the eval — run it from the main Claude Code session (not from within this plan executor), because it uses Agent-tool subagents that need the main-session orchestration.

- [ ] **Step 1: Pre-flight check**

```bash
ls presentation-builder-workspace/iteration-2/eval-*/with_skill/workdir/ 2>/dev/null | wc -l
ls presentation-builder-workspace/iteration-2/eval-*/without_skill/workdir/ 2>/dev/null | wc -l
```
Expected: both directories exist with fixture content copied (team-update workdir will be empty — that's correct).

- [ ] **Step 2: Spawn 8 subagents in parallel**

Use the same prompt shape as iteration-1 (see iteration-1 transcript for the exact prompt templates). Key difference for iteration-2: mention that Replicate MCP is NOT configured in the test environment, so Q8 should be answered as `text-only` when the simulated user is asked. This tests the Q8 text-only path.

Actually — this is a design choice point. Alternatives:
- (a) Test with Q8 = `text-only` (no images expected; tests the skip path + gate accepting no-images-needed)
- (b) Pre-configure a Replicate MCP mock in the test env so Q8 = `full` can be tested (tests the actual image-generation gate)

Option (a) is cheaper and still tests the gate logic (gate B12 passes trivially when Q8=text-only). Option (b) actually exercises the image-generation path. **Recommendation: (b).** The whole point of iteration 2 is to verify the image-generation gate works — if we skip it via text-only, we don't validate the primary fix. The plan executor should ensure the test env has Replicate MCP configured (via the user's real token — skill-creator evals run with full MCP access).

If Replicate MCP is genuinely unavailable in the test env, fall back to (a) and note the limitation in the eval report.

- [ ] **Step 3: Capture timing.json per run as notifications arrive**

Per each task-notification, save `timing.json` to the corresponding run directory. (Same mechanism as iteration-1.)

- [ ] **Step 4: Grade and aggregate**

Spawn a grader subagent that produces `grading.json` for each of 8 runs, then run the aggregate script:

```bash
# Add run-1/ subdirs for aggregator compatibility (iteration-1 workaround)
for eval in iteration-2/eval-*; do
  for cond in with_skill without_skill; do
    mkdir -p "$eval/$cond/run-1"
    cp "$eval/$cond/grading.json" "$eval/$cond/run-1/grading.json" 2>/dev/null || true
    cp "$eval/$cond/timing.json" "$eval/$cond/run-1/timing.json" 2>/dev/null || true
  done
done

# Patch output_chars → total_tokens (iteration-1 workaround)
python3 <<'PY'
import json
from pathlib import Path
root = Path('presentation-builder-workspace/iteration-2')
for eval_dir in root.glob('eval-*'):
    for cond in ('with_skill','without_skill'):
        g = eval_dir / cond / 'run-1' / 'grading.json'
        t = eval_dir / cond / 'run-1' / 'timing.json'
        if not g.exists() or not t.exists():
            continue
        gd = json.loads(g.read_text())
        td = json.loads(t.read_text())
        gd.setdefault('execution_metrics', {})
        gd['execution_metrics']['output_chars'] = td.get('total_tokens', 0)
        g.write_text(json.dumps(gd, indent=2))
        parent_g = eval_dir / cond / 'grading.json'
        parent_g.write_text(json.dumps(gd, indent=2))
PY

# Aggregate
cd /home/rocky00717/.claude/plugins/cache/claude-plugins-official/skill-creator/unknown/skills/skill-creator
python3 -m scripts.aggregate_benchmark \
  /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2 \
  --skill-name presentation-builder
```

- [ ] **Step 5: Launch eval viewer (static output)**

```bash
cd /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2
python3 /home/rocky00717/.claude/plugins/cache/claude-plugins-official/skill-creator/unknown/skills/skill-creator/eval-viewer/generate_review.py . \
  --skill-name presentation-builder \
  --benchmark benchmark.json \
  --previous-workspace /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-1 \
  --static /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/review.html

# Patch the </script> escape issue (iteration-1 workaround)
python3 <<'PY'
from pathlib import Path
import re
p = Path('/home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/review.html')
content = p.read_text()
positions = [m.start() for m in re.finditer(r'</script', content)]
if len(positions) >= 3:
    before = content[:positions[1]]
    after = content[positions[-1]:]
    middle = content[positions[1]:positions[-1]]
    p.write_text(before + middle.replace('</script', '<\\/script') + after)
PY
```

- [ ] **Step 6: Commit**

```bash
git add presentation-builder-workspace/iteration-2/
git commit -m "$(cat <<'EOF'
evals(skill): iteration-2 eval results

Ran 4 scenarios × 2 conditions (with_skill / without_skill) on Sonnet.
Benchmark, grading, and static HTML viewer in iteration-2/.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 16: Verify acceptance criteria

**Files:**
- Read: `presentation-builder-workspace/iteration-2/benchmark.md`
- Read: `presentation-builder-workspace/iteration-2/eval-*/with_skill/grading.json`
- Read: `presentation-builder-workspace/iteration-2/eval-*/with_skill/timing.json`

- [ ] **Step 1: AC1 — image files in Phase 6 runs**

For every eval run where Q8 ≠ `text-only`:

```bash
ls presentation-builder-workspace/iteration-2/eval-auth-migration/with_skill/workdir/images/ 2>/dev/null | wc -l
ls presentation-builder-workspace/iteration-2/eval-pitch-deck/with_skill/workdir/images/ 2>/dev/null | wc -l
ls presentation-builder-workspace/iteration-2/eval-otel-resume/with_skill/workdir/images/ 2>/dev/null | wc -l
```
Expected: all three > 0 (image files generated, not just IMAGE_PLAN.md).

If any is zero, AC1 FAILED. Investigate Phase 6 transcript and SKILL.md gating logic. Iteration failed — do not close the branch.

- [ ] **Step 2: AC3 — pass rate ≥ 90% on Sonnet**

Read `benchmark.md` Summary table. With-skill pass rate must be ≥ 0.90.

- [ ] **Step 3: AC4 — no regression on iteration-1 wins**

Cross-check with iteration-1 benchmark:
- Resumption detection (eval-otel-resume/with_skill): should still show transcript evidence of resumption detection.
- Rich-materials synthesis (eval-auth-migration/with_skill): iteration-1 showed design spec references to specific fixture details. iteration-2 should preserve this.
- Missing-info handling (eval-pitch-deck/with_skill): iteration-1 correctly flagged gaps; iteration-2 should not regress.

- [ ] **Step 4: AC5 — token cost ≤ iter-1 × 1.15**

```bash
python3 <<'PY'
import json
from pathlib import Path

def total_tokens(root):
    total = 0
    for timing in Path(root).glob('eval-*/with_skill/timing.json'):
        d = json.loads(timing.read_text())
        total += d.get('total_tokens', 0)
    return total

iter1 = total_tokens('presentation-builder-workspace/iteration-1')
iter2 = total_tokens('presentation-builder-workspace/iteration-2')
ratio = iter2 / iter1 if iter1 else 0
print(f"iter-1 with_skill tokens: {iter1}")
print(f"iter-2 with_skill tokens: {iter2}")
print(f"Ratio: {ratio:.2f} (target ≤ 1.15)")
PY
```
Expected: Ratio ≤ 1.15.

- [ ] **Step 5: AC6 — provisional-change evaluation**

Per provisional phase (1, 2, 3, 4, 5, 8, 9), check whether its paired Appendix-B assertions measurably improved vs iteration-1. For assertions that did not exist in iteration-1 (most do not), "measurable win" means the assertion passed in ≥ 3 of 4 iteration-2 scenarios.

Produce a short table in `presentation-builder-workspace/iteration-2/provisional_evaluation.md`:

```markdown
# Provisional Change Evaluation — Iteration 2

| Phase | Paired assertions | Passed in N/4 scenarios | Verdict |
|-------|-------------------|-------------------------|---------|
| 1 | B1, B2 | [pass count] | Keep / Reduce to minimal gate |
| 2 | B3, B4, B5, B6 | [pass count] | Keep / Reduce |
| 3 | B7, B8 | [pass count] | Keep / Reduce |
| 4 | B9 | [pass count] | Keep / Reduce |
| 5 | B10, B11 | [pass count] | Keep / Reduce |
| 8 | B15, B16, B17 | [pass count] | Keep / Reduce |
| 9 | B18 | [pass count] | Keep / Reduce |
```

Phases with "Reduce" verdicts are candidates for iteration-3 simplification.

- [ ] **Step 6: Write acceptance-criteria report**

Create `presentation-builder-workspace/iteration-2/acceptance_report.md` with pass/fail per AC and concrete numbers. Commit both reports together.

- [ ] **Step 7: Commit reports and merge to main**

```bash
git add presentation-builder-workspace/iteration-2/provisional_evaluation.md presentation-builder-workspace/iteration-2/acceptance_report.md
git commit -m "$(cat <<'EOF'
evals(skill): iteration-2 acceptance + provisional evaluation

Documents AC1-AC6 pass/fail status and per-phase provisional change
evaluation. Flags phases that did not produce measurable wins for
potential iteration-3 simplification.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

If all ACs pass, open a PR from `iter-2-sonnet-hardening` to `main`. If any AC fails, do NOT merge — investigate and iterate.

---

## Self-Review (completed during plan writing)

**Spec coverage check:**
- ✅ Phase 6 rewrite: Task 3
- ✅ SKILL.md Phase 6 summary: Task 4
- ✅ setup.md: Task 5
- ✅ Phase 7: Task 6
- ✅ Phase 4: Task 7
- ✅ fallback-review-prompts.md: Task 8
- ✅ SKILL.md Phase 3/5 gates: Task 9
- ✅ review-tiers.md: Task 10
- ✅ Phase 1: Task 11
- ✅ Phase 8 new file: Task 12
- ✅ Phase 9 inline: Task 13
- ✅ Phase 2 Q8 + gate: Task 2
- ✅ Stale headers (separate commit): Task 1
- ✅ Appendix B assertions in evals: Task 14
- ✅ Iteration-2 eval run: Task 15
- ✅ Acceptance verification: Task 16

**Placeholder scan:** No "TBD", "implement later", or undefined-term usage.

**Type consistency:** Q8 values (`full` / `selective` / `text-only`) used consistently. `substantive finding`, `substantiated waiver` used consistently. `Review Log (Phase N)` naming consistent across phases.
