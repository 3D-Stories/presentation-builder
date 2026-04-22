# Sonnet-Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply iteration-2 Sonnet-hardening changes to the presentation-builder skill per the design at `docs/superpowers/specs/2026-04-22-sonnet-hardening-design.md`, then validate via iteration-2 evals against the Appendix B assertion set.

**Architecture:** Instruction-level changes to SKILL.md and phase reference files — no code. All paths in this plan are absolute for subagent safety (a fresh subagent's CWD resets between bash calls). SKILL.md is edited in a single consolidated task near the end so intermediate commits don't leave the skill in a partially-hardened state.

**Tech Stack:** Markdown editing + bash verification + iteration-2 eval run via the skill-creator eval framework.

**Branch:** `iter-2-sonnet-hardening` (already created; design doc already committed at `ad29c93`).

**Repo root (absolute path used throughout):** `/home/rocky00717/rawgentic/projects/presentation-builder/`

---

## Task Order & Dependency Rationale

| # | Task | File target | Exec context |
|---|------|-------------|--------------|
| 1 | Stale header fixes | phase-6/7 reference headers | Subagent-safe |
| 2 | Phase 2 — Q8 + section design + cut plan + gate | phase-2-requirements.md | Subagent-safe |
| 3 | Phase 6 rewrite | phase-6-visuals.md | Subagent-safe |
| 4 | setup.md — escape hatch removal + Q8 tie | setup.md | Subagent-safe |
| 5 | Phase 7 fallback + gate | phase-7-implementation.md | Subagent-safe |
| 6 | Phase 4 conditional prompts + 6-section gate | phase-4-style-guide.md | Subagent-safe |
| 7 | fallback-review-prompts — substance + waiver | fallback-review-prompts.md | Subagent-safe |
| 8 | Phase 1 — scratch-start marker + gap artifact + gate | phase-1-research.md | Subagent-safe |
| 9 | Phase 8 new reference file | phase-8-code-review.md (new) | Subagent-safe |
| 10 | review-tiers — execution-context note | review-tiers.md | Subagent-safe |
| 11 | **SKILL.md consolidated edits** (Phases 6, 7, 3, 5, 8, 9) | SKILL.md | Subagent-safe |
| 12 | Eval setup — Appendix B assertions + workspace | evals.json + iteration-2 workspace | Subagent-safe |
| 13 | **Run iteration-2 evals** | iteration-2/ eval runs | **[MAIN SESSION ONLY]** |
| 14 | Verify acceptance criteria | iteration-2/ reports | Subagent-safe |

**Parallelism opportunities (for subagent-driven-development):**
- Tasks 5, 6, 8, 10 are fully independent file edits and can run concurrently after Task 2 completes.
- Task 1 can run concurrently with Tasks 2–4 (different files).
- Task 11 (SKILL.md) depends on Tasks 7 and 9, so must run after them.

**Dependency chain:** 1 → 2 → {3, 4, 5, 6, 7, 8, 9, 10 in parallel} → 11 → 12 → 13 → 14.

---

## Task 1: Stale header fixes

**Files:**
- Modify: `/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-6-visuals.md` (line 1)
- Modify: `/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-7-implementation.md` (line 1)

Separate mechanical commit for causality preservation.

- [ ] **Step 1: Fix phase-6-visuals.md header**

In `/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-6-visuals.md`, replace exact first line:

Exact current text: `# Phase 8: Visual Generation`
Exact new text: `# Phase 6: Visual Generation`

- [ ] **Step 2: Fix phase-7-implementation.md header**

In `/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-7-implementation.md`, replace exact first line:

Exact current text: `# Phase 6: Implementation Scripts`
Exact new text: `# Phase 7: Implementation Scripts`

- [ ] **Step 3: Verify**

```bash
head -1 /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-6-visuals.md
head -1 /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-7-implementation.md
```

Expected output:
```
# Phase 6: Visual Generation
# Phase 7: Implementation Scripts
```

- [ ] **Step 4: Commit**

```bash
cd /home/rocky00717/rawgentic/projects/presentation-builder && \
git add skills/presentation-builder/references/phase-6-visuals.md skills/presentation-builder/references/phase-7-implementation.md && \
git commit -m "$(cat <<'EOF'
docs(skill): fix stale phase-number headers in reference files

phase-6-visuals.md was titled "Phase 8"; phase-7-implementation.md was
titled "Phase 6". Left over from a prior refactor.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Phase 2 — Q8 Visual Strategy + mechanical section design + cut plan + setup re-entry + gate

**Files:**
- Modify: `/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-2-requirements.md`

- [ ] **Step 1: Replace the core-questions block with the 8-question version**

In `/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-2-requirements.md`, replace the block starting with the exact line `### 1. Core Questions (One at a Time)` and ending with the exact line `"PPTX (default), HTML, PDF, or DOCX?"`.

**Exact first line of replace-target:** `### 1. Core Questions (One at a Time)`
**Exact last line of replace-target:** `"PPTX (default), HTML, PDF, or DOCX?"`

Replace those lines and everything between with:

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

Replace the block starting with exact line `### 2. Section Design` and ending with the exact line `- **Transition** -- exact bridge sentence to next section`.

Replace with:

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

- [ ] **Step 3: Replace Cut Plan section with mandatory-or-waived version**

Replace the block starting with exact line `### 4. Cut Plan` and ending with the exact line `"If told you have [shorter time], cut in this order: ..."`.

Replace with:

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

- [ ] **Step 4: Append the phase-complete gate to end of file**

Append to end of `phase-2-requirements.md`:

```markdown
## Phase 2 — Phase-complete gate

Phase 2 is not complete until ALL of the following hold:

1. The design spec file exists at `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`.
2. Answers to Q1–Q8 are all recorded in the spec (including Q8 Visual Strategy).
3. Every section has a labelled subsection with all 6 required fields.
4. Cut plan is present (duration > 20 min) OR the line "Cut plan: not required (duration under 20min)" is present.
5. If Q8 = `full` or `selective`: Replicate MCP is configured. Check BOTH locations:
   - Global: `grep -q "replicate" ~/.claude/mcp.json 2>/dev/null`
   - Project-local: `test -f .mcp.json && grep -q "replicate" .mcp.json 2>/dev/null`
   Either path satisfies the condition. If neither, the user must configure Replicate or explicitly change Q8 to `text-only`.

A common Sonnet failure pattern is advancing to Phase 3 with condition
(3), (4), or (5) unmet. Do not advance until all five conditions hold.
```

- [ ] **Step 5: Verify**

```bash
grep -cE '^\*\*Q[1-9]:' /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-2-requirements.md
test $(grep -c "Phase-complete gate" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-2-requirements.md) -ge 1 && echo "gate-heading: PASS" || echo "gate-heading: FAIL"
grep -Fc "Cut plan: not required (duration under 20min)" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-2-requirements.md
```

Expected:
- Q count: `8`
- `gate-heading: PASS`
- Cut-plan-waiver count: `1`

- [ ] **Step 6: Commit**

```bash
cd /home/rocky00717/rawgentic/projects/presentation-builder && \
git add skills/presentation-builder/references/phase-2-requirements.md && \
git commit -m "$(cat <<'EOF'
docs(skill): add Q8 Visual Strategy and mechanical Phase 2 gate

Phase 2 now asks Q8 (full/selective/text-only) to gate Phase 6. Section
design requires 6 labelled fields per section. Cut plan becomes
mandatory for decks > 20 min, with an explicit 'not required' line for
shorter decks. Setup re-entry path for Replicate when Q8 = full/selective.

Gate 5 checks both ~/.claude/mcp.json and project-local .mcp.json.

Part of iteration-2 Sonnet hardening.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Phase 6 full rewrite

**Files:**
- Overwrite: `/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-6-visuals.md`

- [ ] **Step 1: Overwrite the entire file contents**

Write the following as the complete file contents (replaces everything currently in `phase-6-visuals.md`):

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
head -1 /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-6-visuals.md
test $(grep -c "Phase-complete gate" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-6-visuals.md) -eq 1 && echo "gate: PASS" || echo "gate: FAIL"
test $(grep -c "Known failure modes" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-6-visuals.md) -eq 1 && echo "failure-mode: PASS" || echo "failure-mode: FAIL"
test $(grep -c "mcp__replicate__create_predictions" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-6-visuals.md) -ge 2 && echo "mcp-calls: PASS" || echo "mcp-calls: FAIL"
```

Expected:
- Header: `# Phase 6: Visual Generation`
- `gate: PASS`
- `failure-mode: PASS`
- `mcp-calls: PASS`

- [ ] **Step 3: Commit**

```bash
cd /home/rocky00717/rawgentic/projects/presentation-builder && \
git add skills/presentation-builder/references/phase-6-visuals.md && \
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

## Task 4: setup.md — remove escape hatch, tie to Q8

**Files:**
- Modify: `/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/setup.md`

- [ ] **Step 1: Replace the Replicate MCP section**

In `/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/setup.md`, locate the section starting with the exact line `### 2. Replicate MCP (for AI Image Generation)` and ending with the exact line `> "No problem -- I can design the presentation and create placeholder slides for images.`. The actual end of the section is a multi-line blockquote that ends with `> You can add images manually later, or set up Replicate MCP anytime with \`/presentation-builder setup\`."`.

**Exact first line of replace-target:** `### 2. Replicate MCP (for AI Image Generation)`
**Exact last line of replace-target:** `> You can add images manually later, or set up Replicate MCP anytime with \`/presentation-builder setup\`."`

Replace that block with:

```markdown
### 2. Replicate MCP (for AI Image Generation)

Required when Phase 2 Q8 (Visual Strategy) is `full` or `selective`.
Skipped when Q8 = `text-only`.

Check current state (both global and project-local):
```bash
grep -q "replicate" ~/.claude/mcp.json 2>/dev/null || { test -f .mcp.json && grep -q "replicate" .mcp.json 2>/dev/null; }
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
test $(grep -c "placeholder slides for images" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/setup.md) -eq 0 && echo "escape-hatch-removed: PASS" || echo "escape-hatch-removed: FAIL"
test $(grep -c "text-only" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/setup.md) -ge 2 && echo "q8-refs: PASS" || echo "q8-refs: FAIL"
test $(grep -c "project-local" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/setup.md) -ge 1 && echo "local-mcp: PASS" || echo "local-mcp: FAIL"
```

Expected: all three PASS.

- [ ] **Step 3: Commit**

```bash
cd /home/rocky00717/rawgentic/projects/presentation-builder && \
git add skills/presentation-builder/references/setup.md && \
git commit -m "$(cat <<'EOF'
docs(skill): remove Replicate escape hatch, tie to Q8

Removes the 'placeholder slides for images' silent-downgrade language.
Replicate MCP is now required whenever Q8 = full/selective; users who
decline setup must either opt in to text-only or pause the skill.

MCP check now supports both ~/.claude/mcp.json and project-local .mcp.json.

Part of iteration-2 Sonnet hardening.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Phase 7 — document-skills fallback + gate

**Files:**
- Modify: `/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-7-implementation.md`

SKILL.md Phase 7 summary update is consolidated into Task 11.

- [ ] **Step 1: Insert document-skills availability block before "## Architecture (Other Formats)"**

In `/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-7-implementation.md`, insert the following text IMMEDIATELY BEFORE the exact line `## Architecture (Other Formats)`:

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

(Note: include the trailing empty line so the subsequent `## Architecture (Other Formats)` heading stays properly spaced.)

- [ ] **Step 2: Append phase-complete gate at the end of the file**

Append to end of `phase-7-implementation.md`:

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

NOTE: Phase 9's build gate partially overlaps this one — that is
intentional. Phase 7 requires that the build was made to work during
implementation; Phase 9 re-verifies that the final build succeeds after
any code-review edits. This belt-and-suspenders redundancy is
deliberate for Sonnet reliability.

A common Sonnet failure pattern is declaring Phase 7 complete with build
scripts written but never executed. Do NOT advance to Phase 8 with an
unrun build.
```

- [ ] **Step 3: Verify**

```bash
test $(grep -c "document-skills Availability" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-7-implementation.md) -eq 1 && echo "fallback: PASS" || echo "fallback: FAIL"
test $(grep -c "Phase-complete gate" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-7-implementation.md) -eq 1 && echo "gate: PASS" || echo "gate: FAIL"
```

Expected: both PASS.

- [ ] **Step 4: Commit**

```bash
cd /home/rocky00717/rawgentic/projects/presentation-builder && \
git add skills/presentation-builder/references/phase-7-implementation.md && \
git commit -m "$(cat <<'EOF'
docs(skill): Phase 7 document-skills fallback + phase gate

Explicit fall-through to pptxgenjs-direct when /pptx is unavailable,
so Sonnet doesn't stall. Adds Phase 7 phase-complete gate requiring
a successful build with matching slide count. Notes the intentional
Phase 7 / Phase 9 gate overlap.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Phase 4 — conditional image prompts + 6-section gate

**Files:**
- Modify: `/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-4-style-guide.md`

- [ ] **Step 1: Replace the "Define Image Generation Prompts" section**

In `/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-4-style-guide.md`, replace the block starting with the exact line `### 4. Define Image Generation Prompts` and ending with the exact line `> "[Style]. [Subject]. Dark [primary color] background hex [code]. [Palette hex codes]. Clean modern style. Centered."`.

**Exact first line of replace-target:** `### 4. Define Image Generation Prompts`
**Exact last line of replace-target:** `> "[Style]. [Subject]. Dark [primary color] background hex [code]. [Palette hex codes]. Clean modern style. Centered."`

Replace with:

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

- [ ] **Step 2: Append content-aware phase-complete gate**

Append to end of `phase-4-style-guide.md`:

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
test $(grep -c "Phase-complete gate" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-4-style-guide.md) -eq 1 && echo "gate: PASS" || echo "gate: FAIL"
test $(grep -c "conditional on Q8" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-4-style-guide.md) -eq 1 && echo "conditional: PASS" || echo "conditional: FAIL"
test $(grep -c "Native Visual Patterns" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-4-style-guide.md) -ge 2 && echo "native-pattern: PASS" || echo "native-pattern: FAIL"
```

Expected: all three PASS.

- [ ] **Step 4: Commit**

```bash
cd /home/rocky00717/rawgentic/projects/presentation-builder && \
git add skills/presentation-builder/references/phase-4-style-guide.md && \
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

## Task 7: fallback-review-prompts.md — substance + substantiated-waiver

**Files:**
- Modify: `/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/fallback-review-prompts.md`

- [ ] **Step 1: Replace the "How to Use" section with substance expectations and waiver definition**

Replace the block starting with exact line `## How to Use` and ending with the exact line `Synthesize all 4 reviews into a prioritized findings table.` (the very last line of the original `## How to Use` paragraph — this bounds the replacement so Step 2's target is not consumed).

**Exact first line of replace-target:** `## How to Use`
**Exact last line of replace-target:** `Synthesize all 4 reviews into a prioritized findings table.`

Replace with:

```markdown
## How to Use

For each reviewer, adopt their persona and review the design spec (or
implementation code) from their specific perspective. Present all 4 reviews,
then synthesize the findings (see "Synthesis Format" below).

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

- [ ] **Step 2: Replace the "Synthesis Format" section**

Replace the block starting with exact line `## Synthesis Format` and ending with the exact line `Then list each fix with the reviewer who identified it.`.

**Exact first line of replace-target:** `## Synthesis Format`
**Exact last line of replace-target:** `Then list each fix with the reviewer who identified it.`

Replace with:

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
test $(grep -c "substantive finding" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/fallback-review-prompts.md) -ge 2 && echo "substantive: PASS" || echo "substantive: FAIL"
test $(grep -c "substantiated waiver" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/fallback-review-prompts.md) -ge 2 && echo "waiver: PASS" || echo "waiver: FAIL"
test $(grep -c "Review Log" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/fallback-review-prompts.md) -ge 1 && echo "review-log: PASS" || echo "review-log: FAIL"
```

Expected: all three PASS.

- [ ] **Step 4: Commit**

```bash
cd /home/rocky00717/rawgentic/projects/presentation-builder && \
git add skills/presentation-builder/references/fallback-review-prompts.md && \
git commit -m "$(cat <<'EOF'
docs(skill): strengthen fallback review prompts (substance + waivers)

Each persona must produce ≥ 3 substantive findings (with locations) or
a substantiated waiver naming what was checked. Synthesis step requires
concrete edits to the artifact for every Must-fix finding, recorded in
the artifact's Review Log.

Closes the 'no issues from this perspective' escape hatch flagged by
the reflexion critique.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Phase 1 — scratch-start marker + gap artifact + gate

**Files:**
- Modify: `/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-1-research.md`

- [ ] **Step 1: Insert Step 0 immediately after "## Process"**

In `/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-1-research.md`, insert the following block IMMEDIATELY AFTER the exact line `## Process` and BEFORE the exact line `### 1. Identify Sources`:

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

- [ ] **Step 2: Verify existing Copy-before-Index ordering (unconditional check)**

The current file already has `### 3. Copy & Organize` before `### 4. Create Materials Index` — this is the correct order and no change is needed. Confirm via:

```bash
grep -n "^### [34]\." /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-1-research.md
```

Expected: Section 3 line number should be less than Section 4 line number. If this fails, halt and report — do not proceed.

- [ ] **Step 3: Replace the "Identify Gaps" section with the required-artifact version**

Replace the block starting with exact line `### 5. Identify Gaps` and ending with the exact line `Present gaps to the user and ask how to fill them.`.

**Exact first line of replace-target:** `### 5. Identify Gaps`
**Exact last line of replace-target:** `Present gaps to the user and ask how to fill them.`

Replace with:

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

- [ ] **Step 4: Append phase-complete gate**

Append to end of `phase-1-research.md`:

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
test $(grep -c "NO_MATERIALS.md" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-1-research.md) -ge 2 && echo "marker: PASS" || echo "marker: FAIL"
test $(grep -c "Phase-complete gate" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-1-research.md) -eq 1 && echo "gate: PASS" || echo "gate: FAIL"
test $(grep -c "none identified" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-1-research.md) -ge 1 && echo "gaps-sentinel: PASS" || echo "gaps-sentinel: FAIL"
```

Expected: all three PASS.

- [ ] **Step 6: Commit**

```bash
cd /home/rocky00717/rawgentic/projects/presentation-builder && \
git add skills/presentation-builder/references/phase-1-research.md && \
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

## Task 9: Phase 8 — new reference file

**Files:**
- Create: `/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-8-code-review.md`

SKILL.md Phase 8 summary update is consolidated into Task 11.

- [ ] **Step 1: Create the new file**

Write the following as the full contents of `/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-8-code-review.md`:

```markdown
# Phase 8: Code Review

## Purpose

Review the build scripts for correctness and spec conformance BEFORE
declaring Phase 7 complete. This catches runtime errors, layout overflow,
style-guide deviations, spec gaps, dead code, and terse speaker notes.

## Reviewer reading list

Reviewers should read these before forming findings:
- `references/review-tiers.md` — the review tier detection mechanism
- `references/fallback-review-prompts.md` — substance expectations and
  substantiated-waiver format
- `references/presentation-best-practices.md` — the standard for
  "substantive" speaker notes (so the "terse speaker notes" criterion
  has a concrete reference)

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
- Terse speaker notes — notes that are stage directions rather than
  speakable talking points. Reference `references/presentation-best-practices.md`
  for the "good notes (speakable script)" standard.

## Review log location (canonical)

The Phase 8 review log is written to `code-review.md` at the project root
(a sibling of the spec and `style-guide.md`). This is the canonical
location — NOT the spec — so the Phase 8 review can be updated in
iteration without modifying the immutable design record.

The file contains a `## Review Log (Phase 8)` section in the same format
as `references/fallback-review-prompts.md` describes.

## Phase-complete gate

Phase 8 is NOT complete until:

1. The build was executed at least once (transcript contains evidence of
   `node build.js` invocation with captured output).
2. The most recent build run exited with code 0 OR the failure is
   recorded in the review log and subsequently fixed (re-run to 0).
3. The canonical `code-review.md` file exists at the project root with a
   `## Review Log (Phase 8)` section.
4. The review log contains ≥ 3 substantive findings per persona (or
   substantiated waivers).
5. Every Must-fix finding has a corresponding code edit applied (or
   explicit documented dismissal).

A common Sonnet failure pattern is reading the code and advancing
without running the build. Do NOT advance to Phase 9 without the
mandatory pre-review step complete.

## Outputs

- `build-output.log` (captured build stderr/stdout) — informational.
- `code-review.md` with `## Review Log (Phase 8)` section — canonical.
- Code edits applied for Must-fix findings.
```

- [ ] **Step 2: Verify**

```bash
test -f /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-8-code-review.md && echo "file: PASS" || echo "file: FAIL"
test $(grep -c "Mandatory pre-review step: run the build" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-8-code-review.md) -eq 1 && echo "pre-review: PASS" || echo "pre-review: FAIL"
test $(grep -c "code-review.md" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-8-code-review.md) -ge 2 && echo "canonical-location: PASS" || echo "canonical-location: FAIL"
test $(grep -c "presentation-best-practices" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/phase-8-code-review.md) -ge 1 && echo "practices-ref: PASS" || echo "practices-ref: FAIL"
```

Expected: all four PASS.

- [ ] **Step 3: Commit**

```bash
cd /home/rocky00717/rawgentic/projects/presentation-builder && \
git add skills/presentation-builder/references/phase-8-code-review.md && \
git commit -m "$(cat <<'EOF'
docs(skill): Phase 8 — add reference file with mandatory pre-review build

New phase-8-code-review.md makes the pre-review build run mandatory,
captures exit code + output, points to presentation-best-practices.md
for the 'terse speaker notes' standard, and declares code-review.md at
project root as the canonical review-log location.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: review-tiers.md — Tier 1/2 acknowledgment

**Files:**
- Modify: `/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/review-tiers.md`

- [ ] **Step 1: Insert execution-context note**

In `/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/review-tiers.md`, insert the following block IMMEDIATELY AFTER the line starting with `# Review Tiers` and its introductory paragraph. Find the line:

**Exact anchor line to insert AFTER:** `- Ad-hoc: Speaker notes review, image review`

Insert immediately after (before the next blank line and `## Detection Order`):

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
test $(grep -c "Execution Context Note" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/review-tiers.md) -eq 1 && echo "note: PASS" || echo "note: FAIL"
test $(grep -c "substantiated waiver" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/references/review-tiers.md) -ge 1 && echo "waiver-ref: PASS" || echo "waiver-ref: FAIL"
```

Expected: both PASS.

- [ ] **Step 3: Commit**

```bash
cd /home/rocky00717/rawgentic/projects/presentation-builder && \
git add skills/presentation-builder/references/review-tiers.md && \
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

## Task 11: SKILL.md — consolidated edits for Phases 3, 5, 6, 7, 8, 9

**Files:**
- Modify: `/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/SKILL.md`

Consolidates all SKILL.md section replacements into one task with one commit, so intermediate commits don't leave the skill in a partially-hardened state.

- [ ] **Step 1: Replace Phase 3 section**

Replace the block starting with exact line `### Phase 3: Multi-Agent Review` and ending with the exact line `**Outputs:** Refined design spec`.

**Exact first line:** `### Phase 3: Multi-Agent Review`
**Exact last line:** `**Outputs:** Refined design spec`

Replace with:

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

- [ ] **Step 2: Replace Phase 5 section**

Replace the block starting with exact line `### Phase 5: Design Review` and ending with the exact line `**Outputs:** Final approved spec + style guide`.

**Exact first line:** `### Phase 5: Design Review`
**Exact last line:** `**Outputs:** Final approved spec + style guide`

Replace with:

```markdown
### Phase 5: Design Review

Run another review pass, this time on the complete design (spec + style guide together) using the same tiered mechanism from Phase 3.

For Complex presentations, use full multi-agent review. For Quick/Standard, an inline check is sufficient — but substance expectations and the substantiated-waiver rule still apply.

**Phase-complete gate:** Phase 5 is NOT complete until:
1. The spec contains a "Review Log (Phase 5)" section with ≥ 3 substantive findings per persona (or substantiated waiver), reviewing spec + style-guide together.
2. Every Must-fix finding has a corresponding spec/style-guide edit or explicit dismissal.

**Outputs:** Final approved spec + style guide with Review Log (Phase 5) section.
```

- [ ] **Step 3: Replace Phase 6 section**

Replace the block starting with exact line `### Phase 6: Visual Generation` and ending with the exact line `**Outputs:** \`images/\` directory with all generated assets`.

**Exact first line:** `### Phase 6: Visual Generation`
**Exact last line:** `**Outputs:** \`images/\` directory with all generated assets`

Replace with:

```markdown
### Phase 6: Visual Generation

**Hard prerequisite:** Replicate MCP configured and working AND Q8 ≠ `text-only`.
If Replicate is absent, STOP (Phase 2 should have caught this — see setup re-entry path in `references/phase-2-requirements.md`).
If Q8 = `text-only`, skip Phase 6 entirely and advance to Phase 7.

Read `references/phase-6-visuals.md` and follow it end-to-end. This phase is not complete until `images/` contains one file per image in the style guide's plan. Writing `IMAGE_PLAN.md` without files on disk is a known failure mode — do not advance to Phase 7 in that state.

**Important:** This phase runs BEFORE implementation because build scripts reference image paths.

**Outputs:** `images/` directory with all generated assets (unless Q8 = `text-only`).
```

- [ ] **Step 4: Replace Phase 7 section**

Replace the block starting with exact line `### Phase 7: Implementation Scripts` and ending with the exact line `**Outputs:** Build scripts in \`build-deck/\` directory`.

**Exact first line:** `### Phase 7: Implementation Scripts`
**Exact last line:** `**Outputs:** Build scripts in \`build-deck/\` directory`

Replace with:

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

- [ ] **Step 5: Replace Phase 8 section**

Replace the block starting with exact line `### Phase 8: Code Review` and ending with the exact line `**Outputs:** Verified, building scripts`.

**Exact first line:** `### Phase 8: Code Review`
**Exact last line:** `**Outputs:** Verified, building scripts`

Replace with:

```markdown
### Phase 8: Code Review

Read `references/phase-8-code-review.md` for the detailed process, including the MANDATORY pre-review build run.

**Summary:** Run the build FIRST (capture exit code, stderr/stdout, file size). Then review build scripts via the tiered review mechanism (see `references/review-tiers.md`). Apply Must-fix findings.

**Phase-complete gate:** Phase 8 is NOT complete until:
1. Build was executed with captured output.
2. Latest build run exits with code 0.
3. `code-review.md` exists at project root with "Review Log (Phase 8)" section containing ≥ 3 substantive findings per persona (or substantiated waivers).
4. Every Must-fix finding has a code edit applied or explicit dismissal.

A common Sonnet failure pattern is reviewing code without running the build. Do NOT advance to Phase 9 in that state.

**Outputs:** Verified build scripts + `code-review.md` with Review Log (Phase 8).
```

- [ ] **Step 6: Replace Phase 9 section**

Replace the block starting with exact line `### Phase 9: Build & Iterate` and ending with the exact line `**Outputs:** Final presentation file`.

**Exact first line:** `### Phase 9: Build & Iterate`
**Exact last line:** `**Outputs:** Final presentation file`

Replace with:

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

NOTE: Phase 7's build gate partially overlaps this one — that is
intentional. Phase 7 requires the build was made to work during
implementation; Phase 9 re-verifies the final build after any code-review
edits. Belt-and-suspenders redundancy is deliberate for Sonnet reliability.

A common Sonnet failure pattern is declaring Phase 9 complete based on
build scripts existing rather than on actually running them. Do NOT skip
the build invocation — the build script must execute and produce a file
on disk that passes the size and slide-count checks.

Iterate based on user feedback using the iteration protocol below.

**Outputs:** Final presentation file.
```

- [ ] **Step 7: Verify**

```bash
test $(grep -Fc "Review Log (Phase 3)" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/SKILL.md) -ge 1 && echo "p3-log: PASS" || echo "p3-log: FAIL"
test $(grep -Fc "Review Log (Phase 5)" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/SKILL.md) -ge 1 && echo "p5-log: PASS" || echo "p5-log: FAIL"
test $(grep -Fc "Review Log (Phase 8)" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/SKILL.md) -ge 1 && echo "p8-log: PASS" || echo "p8-log: FAIL"
test $(grep -c "substantiated waiver" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/SKILL.md) -ge 3 && echo "waivers: PASS" || echo "waivers: FAIL"
test $(grep -c "Hard prerequisite:" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/SKILL.md) -ge 1 && echo "p6-gate: PASS" || echo "p6-gate: FAIL"
test $(grep -c "Phase 9 is NOT complete until" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/SKILL.md) -eq 1 && echo "p9-gate: PASS" || echo "p9-gate: FAIL"
test $(grep -c "10 KB" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/SKILL.md) -eq 1 && echo "size-threshold: PASS" || echo "size-threshold: FAIL"
test $(grep -Fc "Fallback:" /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/SKILL.md) -ge 2 && echo "fallback: PASS" || echo "fallback: FAIL"
```

Expected: all PASS.

- [ ] **Step 8: Commit (single consolidated commit)**

```bash
cd /home/rocky00717/rawgentic/projects/presentation-builder && \
git add skills/presentation-builder/SKILL.md && \
git commit -m "$(cat <<'EOF'
docs(skill): SKILL.md — consolidated Sonnet-hardening edits

Replaces phase summaries for Phases 3, 5, 6, 7, 8, 9 with hardened
versions in a single commit (avoids leaving SKILL.md in a partially-
hardened intermediate state).

- Phase 3/5: inline Review Log gates with substantive-finding /
  substantiated-waiver rules
- Phase 6: hard prerequisite on Q8 + Replicate, IMAGE_PLAN.md failure
  mode named
- Phase 7: explicit document-skills fallback (pptxgenjs direct)
- Phase 8: mandatory pre-review build, code-review.md canonical path
- Phase 9: output file + size + slide-count gate; notes Phase 7/9
  redundancy is intentional

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Eval setup — Appendix B assertions + workspace

**Files:**
- Modify: `/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/evals/evals.json`
- Create: `/home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-*/eval_metadata.json` (4 files)
- Create: fixtures + workdir trees under `presentation-builder-workspace/iteration-2/`

- [ ] **Step 1: Create iteration-2 workspace skeleton with absolute paths**

```bash
WS=/home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace

mkdir -p $WS/iteration-2
cp -r $WS/iteration-1/fixtures $WS/iteration-2/fixtures

for test in team-update auth-migration pitch-deck otel-resume; do
  for cond in with_skill without_skill; do
    mkdir -p "$WS/iteration-2/eval-${test}/${cond}/workdir"
    mkdir -p "$WS/iteration-2/eval-${test}/${cond}/outputs"
  done
done

# Copy fixtures into workdirs (team-update has no fixture)
cp -r $WS/iteration-2/fixtures/test-2-auth-migration/. $WS/iteration-2/eval-auth-migration/with_skill/workdir/
cp -r $WS/iteration-2/fixtures/test-2-auth-migration/. $WS/iteration-2/eval-auth-migration/without_skill/workdir/
cp -r $WS/iteration-2/fixtures/test-3-pitch-deck/. $WS/iteration-2/eval-pitch-deck/with_skill/workdir/
cp -r $WS/iteration-2/fixtures/test-3-pitch-deck/. $WS/iteration-2/eval-pitch-deck/without_skill/workdir/
cp -r $WS/iteration-2/fixtures/test-4-otel-resume/. $WS/iteration-2/eval-otel-resume/with_skill/workdir/
cp -r $WS/iteration-2/fixtures/test-4-otel-resume/. $WS/iteration-2/eval-otel-resume/without_skill/workdir/

echo "Workspace scaffolding complete:"
find $WS/iteration-2 -maxdepth 2 -type d | sort
```

- [ ] **Step 2: Write eval_metadata.json for team-update**

```bash
cat > /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-team-update/eval_metadata.json <<'EOF'
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
EOF
```

- [ ] **Step 3: Write eval_metadata.json for auth-migration**

```bash
cat > /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-auth-migration/eval_metadata.json <<'EOF'
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
    "B6: if Q8 = full/selective, Replicate MCP is configured (either global ~/.claude/mcp.json or project-local .mcp.json)",
    "B7: Review Log Phase 3 has ≥ 3 substantive findings per persona (or substantiated waivers)",
    "B8: every Phase 3 Must-fix has a spec edit or dismissal",
    "B9: style-guide.md has all 6 required sections",
    "B10: Review Log Phase 5 has ≥ 3 substantive findings per persona",
    "B11: every Phase 5 Must-fix has a spec/style-guide edit or dismissal",
    "B12: if Q8 ≠ text-only, images/ has file per plan",
    "B13: no IMAGE_PLAN.md in place of generated files",
    "B14: build.js runs exit 0 and slide count matches spec",
    "B15: build was executed before code review (transcript evidence)",
    "B16: code-review.md exists at project root with Review Log (Phase 8) containing ≥ 3 substantive findings per persona",
    "B17: every Phase 8 Must-fix has a code edit or dismissal",
    "B18: output file exists, size ≥ threshold, slide count matches"
  ]
}
EOF
```

- [ ] **Step 4: Write eval_metadata.json for pitch-deck**

```bash
cat > /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-pitch-deck/eval_metadata.json <<'EOF'
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
    "B16: code-review.md exists with Review Log (Phase 8) containing ≥ 3 substantive findings per persona",
    "B17: every Phase 8 Must-fix has a code edit or dismissal",
    "B18: output file exists, size ≥ threshold, slide count matches"
  ]
}
EOF
```

- [ ] **Step 5: Write eval_metadata.json for otel-resume**

```bash
cat > /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-otel-resume/eval_metadata.json <<'EOF'
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
    "B16: code-review.md exists with Review Log (Phase 8) containing ≥ 3 substantive findings per persona",
    "B17: every Phase 8 Must-fix has a code edit or dismissal",
    "B18: output file exists, size ≥ threshold, slide count matches"
  ]
}
EOF
```

- [ ] **Step 6: Write the iteration-2 evals.json**

```bash
cat > /home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/evals/evals.json <<'EOF'
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
EOF
```

- [ ] **Step 7: Verify**

```bash
WS=/home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace

for eval in team-update auth-migration pitch-deck otel-resume; do
  test -f $WS/iteration-2/eval-${eval}/eval_metadata.json && echo "${eval}: metadata PRESENT" || echo "${eval}: metadata MISSING"
done

python3 -c "
import json
for name, expected in [('team-update', 9), ('auth-migration', 18), ('pitch-deck', 18), ('otel-resume', 16)]:
    path = '/home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-' + name + '/eval_metadata.json'
    d = json.load(open(path))
    n = len(d['assertions'])
    status = 'PASS' if n == expected else 'FAIL'
    print(f'{name}: {n} assertions (expected {expected}) — {status}')
"

python3 -c "
import json
d = json.load(open('/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/evals/evals.json'))
print(f'iteration: {d.get(\"iteration\")}')
print(f'evals: {len(d[\"evals\"])}')
"
```

Expected:
- All 4 metadata files PRESENT
- team-update 9, auth-migration 18, pitch-deck 18, otel-resume 16 — all PASS
- iteration: 2, evals: 4

- [ ] **Step 8: Commit**

```bash
cd /home/rocky00717/rawgentic/projects/presentation-builder && \
git add skills/presentation-builder/evals/evals.json presentation-builder-workspace/iteration-2/ && \
git commit -m "$(cat <<'EOF'
evals(skill): iteration-2 assertion set (Appendix B) and workspace

Builds iteration-2 workspace with fixtures copied from iteration-1.
Per-eval metadata applies the 18 assertions from Appendix B of the
design doc, scoped per scenario (team-update 9, auth/pitch 18,
otel-resume 16 — skipping Phase 1/2 assertions that the resumption
scenario starts past).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Run iteration-2 evals **[MAIN SESSION ONLY]**

> **⚠️ This task cannot be dispatched to a subagent.** It requires main-session orchestration because it spawns 8 parallel subagents and processes their individual timing notifications. If executed via `superpowers:subagent-driven-development`, pause at this task and hand control back to the user.

**Files:**
- Read: `/home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-*/eval_metadata.json`
- Create: `/home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/agent_map.json`
- Create: per-run `timing.json` and `grading.json` files

- [ ] **Step 1: Pre-flight — verify Replicate MCP is configured**

This plan commits to **Option (b)** from the critique discussion: run iteration-2 evals with a **real, working Replicate MCP** so the primary Phase 6 fix (image generation) is actually tested. If Replicate MCP is not configured, B12/B13 assertions degenerate to the text-only path and the primary fix goes unvalidated.

```bash
if grep -q "replicate" ~/.claude/mcp.json 2>/dev/null || (test -f /home/rocky00717/rawgentic/projects/presentation-builder/.mcp.json && grep -q "replicate" /home/rocky00717/rawgentic/projects/presentation-builder/.mcp.json 2>/dev/null); then
  echo "Replicate MCP: CONFIGURED — proceeding with option (b) real-token path"
else
  echo "Replicate MCP: NOT CONFIGURED — halt. Configure first per setup.md step 2, then re-run this task."
  exit 1
fi
```

If the check fails, do NOT proceed. Configure Replicate, then re-run this step.

- [ ] **Step 2: Verify workdirs are staged and empty of outputs**

```bash
WS=/home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace
ls -d $WS/iteration-2/eval-*/with_skill/workdir $WS/iteration-2/eval-*/without_skill/workdir 2>/dev/null | wc -l
# Expected: 8

# Outputs directories should exist but be empty
for d in $WS/iteration-2/eval-*/with_skill/outputs $WS/iteration-2/eval-*/without_skill/outputs; do
  count=$(ls $d 2>/dev/null | wc -l)
  [ "$count" = "0" ] && echo "$d: empty (correct)" || echo "$d: has $count files (WARNING — will be overwritten)"
done
```

- [ ] **Step 3: Spawn 8 subagents in parallel**

Launch all 8 subagents in a single message via 8 concurrent Agent tool invocations. Use model `sonnet` for all 8. Track agent IDs as they are returned.

**With-skill subagent prompt template** (use as-is, substituting `<EVAL_NAME>` and `<TASK_PROMPT>`):

```
You are simulating a real user who wants to build a presentation, using the presentation-builder skill.

SKILL TO FOLLOW: Read and follow end-to-end:
/home/rocky00717/rawgentic/projects/presentation-builder/skills/presentation-builder/SKILL.md
(and its references/ directory as the skill directs you)

WORKING DIRECTORY: /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-<EVAL_NAME>/with_skill/workdir
Do all file work there.

OUTPUTS DIRECTORY: /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-<EVAL_NAME>/with_skill/outputs
Save every final deliverable here — design spec, style guide, MATERIALS_INDEX.md, slide outlines, build scripts, images/, speaker notes, code-review.md, any user-facing artifacts. Also save a `transcript.md` that captures each question the skill asked you and how you answered.

TASK PROMPT (from the user):
"<TASK_PROMPT>"

USER-SIMULATION RULES:
- When the skill asks you questions (takeaway, audience, duration, sections, demos, format, visual strategy Q8, etc.), answer plausibly and consistently as the person in the prompt would. Record each Q/A in transcript.md.
- When the skill asks Q8 (Visual Strategy), answer `full` if the prompt suggests images would add value, `text-only` for informal/small decks, `selective` otherwise. Be consistent across the run.
- If the skill asks for external materials you don't have, say so and ask it to proceed with what's available.
- Replicate MCP is configured and working in this environment — if the skill's Phase 6 gate requires image generation, actually call mcp__replicate__create_predictions and mcp__replicate__download_files as the skill specifies. Do NOT produce an IMAGE_PLAN.md in place of real image files.
- document-skills / /pptx may or may not be installed. If not, fall through to pptxgenjs direct per the Phase 7 fallback.
- Assume check-in confirmations are granted unless something is obviously wrong.

Work the skill end-to-end. Stop when you've produced what you can. Return a 5-line summary of what you produced and any friction points you noticed in the skill.
```

**Without-skill (baseline) prompt template:**

```
You are simulating a real user who wants to build a presentation, using your own judgment — no specific skill or framework.

WORKING DIRECTORY: /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-<EVAL_NAME>/without_skill/workdir
Do all file work there.

OUTPUTS DIRECTORY: /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-<EVAL_NAME>/without_skill/outputs
Save every final deliverable here — any artifacts you produce. Also save a `transcript.md` with any questions you asked and how they were answered.

TASK PROMPT (from the user):
"<TASK_PROMPT>"

USER-SIMULATION RULES:
- When you need information (audience, takeaway, specifics, etc.), answer plausibly and consistently as the person in the prompt would. Record each Q/A in transcript.md.
- Replicate MCP is configured. If you decide to generate images, use mcp__replicate__create_predictions. Document deps in transcript.md. Don't block.

Work end-to-end with whatever approach you think is best. Stop when you've produced what you can. Return a 5-line summary of what you produced.
```

Substitute `<EVAL_NAME>` and `<TASK_PROMPT>` per-agent per the `evals.json` file.

- [ ] **Step 4: Save agent_map.json as IDs are returned**

```bash
cat > /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/agent_map.json <<EOF
{
  "<agentId_team_update_with>": {"eval": "team-update",    "condition": "with_skill"},
  "<agentId_team_update_without>": {"eval": "team-update",    "condition": "without_skill"},
  "<agentId_auth_with>": {"eval": "auth-migration", "condition": "with_skill"},
  "<agentId_auth_without>": {"eval": "auth-migration", "condition": "without_skill"},
  "<agentId_pitch_with>": {"eval": "pitch-deck",     "condition": "with_skill"},
  "<agentId_pitch_without>": {"eval": "pitch-deck",     "condition": "without_skill"},
  "<agentId_otel_with>": {"eval": "otel-resume",    "condition": "with_skill"},
  "<agentId_otel_without>": {"eval": "otel-resume",    "condition": "without_skill"}
}
EOF
```

Fill in the actual agent IDs returned from the 8 Agent tool invocations.

- [ ] **Step 5: Capture timing.json per run as notifications arrive**

When each task-notification arrives with `total_tokens` and `duration_ms`, save to the corresponding run directory:

```bash
cat > <WORKSPACE>/eval-<name>/<condition>/timing.json <<EOF
{"total_tokens": <total_tokens>, "duration_ms": <duration_ms>, "total_duration_seconds": <duration_ms/1000>}
EOF
```

- [ ] **Step 6: Grade all 8 runs with a single grader subagent (with enumerated rubric)**

Spawn ONE grader subagent with the following prompt. Each assertion in Appendix B has a concrete rubric for how to verify it — the grader must use these rubrics, not improvise.

**Grader prompt:**

```
You are a grader for the presentation-builder iteration-2 eval. You must grade 8 runs against their assertions. Follow the rubric below for each Appendix B assertion — do NOT improvise or fall back to existence-only checks.

WORKSPACE: /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2

For each eval (team-update, auth-migration, pitch-deck, otel-resume) and each condition (with_skill, without_skill):
- Assertions: /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-<name>/eval_metadata.json
- Transcript: /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-<name>/<condition>/outputs/transcript.md
- Outputs dir: /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-<name>/<condition>/outputs/
- Workdir: /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-<name>/<condition>/workdir/
- Write grading to: /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-<name>/<condition>/grading.json

## RUBRIC — use exactly these checks for Appendix B assertions

- **B1 (Phase 1: materials OR scratch-start):** Either (a) workdir contains NO_MATERIALS.md, OR (b) `find workdir/gathered-materials -type f | wc -l` ≥ 1 AND every file-path listed in MATERIALS_INDEX.md resolves to an actual file. Check file paths by parsing the "| File |" column rows in the index.

- **B2 (Gaps section in MATERIALS_INDEX.md):** Read MATERIALS_INDEX.md. Contains a heading matching `## Gaps` (case-sensitive). Section has content (either identified gaps OR the sentinel "none identified — audited against [list]").

- **B3 (spec with Q1-Q8):** Open the spec file in outputs/docs/superpowers/specs/ (or wherever produced). Check it contains all of the following label prefixes: "Q1:", "Q2:", "Q3:", "Q4:", "Q5:", "Q6:", "Q7:", "Q8:". Each must have non-empty content on the same line or following lines.

- **B4 (every section has 6 labelled fields):** Find every section subsection in the spec (typically under "## Section-by-Section Breakdown" or equivalent). For each, verify it contains all 6 field labels: Title, Duration (or Time), Problem opening (or Problem), Content, Materials, Slide concepts (or Visual), Transition. A section missing any of the 6 labels FAILS this assertion.

- **B5 (cut plan):** Parse spec duration. If > 20 min, check spec contains a "Cut plan" section with at least one "cut" entry. If ≤ 20 min, check spec contains the exact sentinel line "Cut plan: not required (duration under 20min)".

- **B6 (Replicate MCP configured when Q8 ≠ text-only):** Read the spec's Q8 answer. If Q8 = text-only, assertion passes vacuously. Otherwise, check EITHER `~/.claude/mcp.json` OR `<project>/.mcp.json` contains a "replicate" key. At least one must match.

- **B7 (Review Log Phase 3 — ≥ 3 substantive findings/persona):** Read the spec's "## Review Log (Phase 3)" section. For each of the 4 personas (Presentation Expert, Narrative Specialist, PM, Technical Architect), count findings that (a) name a concrete location — section name, slide number, or quoted phrase — and (b) describe what is wrong. Minimum 3 per persona. A "substantiated waiver" naming specific checked criteria counts as satisfying the minimum for that persona.

- **B8 (Phase 3 Must-fix applied):** For each Must-fix finding in the Phase 3 review log, verify the spec has been edited to address it (check the "Resolution" line for each finding, or trace the finding's described change to actual spec content). Dismissals with a stated reason also count.

- **B9 (style-guide.md 6 sections):** Check outputs has style-guide.md. It must contain all 6 section types: (1) Color palette with ≥ 4 colors, each with hex + role label; (2) Typography table with ≥ 4 element types; (3) Slide structure patterns section; (4) Visual motifs with ≥ 1 recurring element; (5) Image prompts IF Q8 ≠ text-only (else replaced by Native Visual Patterns subsection); (6) file exists and non-empty.

- **B10, B11:** Same as B7/B8 but for "## Review Log (Phase 5)" and Phase 5 Must-fix findings.

- **B12 (images file count):** If Q8 = text-only, assertion passes. Otherwise, count files in workdir/images/ AND count image entries in style-guide.md. Counts must match.

- **B13 (no IMAGE_PLAN.md as completion marker):** If images/ is empty or missing AND an IMAGE_PLAN.md file exists in workdir, FAIL this assertion. If both IMAGE_PLAN.md exists AND images/ contains real files, that's fine (plan + generated). If neither exists and Q8 = text-only, PASS.

- **B14 (build.js ran exit 0, slide count matches):** Search transcript for `node build.js` invocation with exit code. Count must be 0. Parse the generated output file (e.g., with `unzip -p output.pptx docProps/app.xml | grep -oE '<Slides>[0-9]+' | grep -oE '[0-9]+'` for PPTX) and compare to the spec's total slide count.

- **B15 (build executed before code review):** Search transcript for a `node build.js` invocation that appears BEFORE any code-review finding is written. Timestamps or transcript ordering must confirm.

- **B16 (code-review.md at project root with Review Log Phase 8):** Check workdir/code-review.md exists, contains "## Review Log (Phase 8)" section, and each of 3 personas (Presentation Expert, Technical Architect, PM) has ≥ 3 substantive findings or a substantiated waiver.

- **B17 (Phase 8 Must-fix applied):** Same methodology as B8, but for code edits addressing code-review findings.

- **B18 (final output file — exists, size, slide count):** Output file exists at expected path (parse spec's Q7 answer for format). File size ≥ threshold (PPTX 10KB, others 5KB). Slide count matches spec (as in B14).

## RUBRIC — for otel-resume scenario-specific assertions

- **Resumption detected:** Transcript explicitly mentions inspecting MATERIALS_INDEX.md OR the design spec in workdir, before any new work begins.
- **Resumed from Phase 3:** Transcript confirms skipping Phase 1 and Phase 2, entering at Phase 3 (Review).
- **MATERIALS_INDEX.md not overwritten:** `diff workdir/MATERIALS_INDEX.md fixtures/test-4-otel-resume/MATERIALS_INDEX.md` shows no change, OR only additive changes (no original content lost).
- **Existing design spec not overwritten:** Same check for the design spec file.

## Output format per run

Write grading.json with:
- expectations[]: one entry per assertion with {text, passed, evidence}
- summary: {passed, failed, total, pass_rate}
- Also include execution_metrics.output_chars from the corresponding timing.json's total_tokens (for the aggregator)

At the end, write presentation-builder-workspace/iteration-2/grading_summary.md with per-eval pass rates and 3-5 observations.

Return a summary under 300 words.
```

- [ ] **Step 7: Aggregate benchmark**

```bash
# Add run-1/ subdirs for aggregator compatibility
for eval in /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-*; do
  for cond in with_skill without_skill; do
    mkdir -p "$eval/$cond/run-1"
    [ -f "$eval/$cond/grading.json" ] && cp "$eval/$cond/grading.json" "$eval/$cond/run-1/grading.json"
    [ -f "$eval/$cond/timing.json" ] && cp "$eval/$cond/timing.json" "$eval/$cond/run-1/timing.json"
  done
done

# Patch output_chars → total_tokens (iteration-1 workaround)
python3 <<'PY'
import json
from pathlib import Path
root = Path('/home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2')
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
        (eval_dir / cond / 'grading.json').write_text(json.dumps(gd, indent=2))
PY

# Aggregate
cd /home/rocky00717/.claude/plugins/cache/claude-plugins-official/skill-creator/unknown/skills/skill-creator && \
python3 -m scripts.aggregate_benchmark \
  /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2 \
  --skill-name presentation-builder
```

- [ ] **Step 8: Launch eval viewer (static HTML, iteration-1 as previous)**

```bash
cd /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2 && \
python3 /home/rocky00717/.claude/plugins/cache/claude-plugins-official/skill-creator/unknown/skills/skill-creator/eval-viewer/generate_review.py . \
  --skill-name presentation-builder \
  --benchmark benchmark.json \
  --previous-workspace /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-1 \
  --static /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/review.html

# Patch </script> escape (iteration-1 workaround)
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

- [ ] **Step 9: Commit**

```bash
cd /home/rocky00717/rawgentic/projects/presentation-builder && \
git add presentation-builder-workspace/iteration-2/ && \
git commit -m "$(cat <<'EOF'
evals(skill): iteration-2 eval results

Ran 4 scenarios × 2 conditions on Sonnet with Replicate MCP configured
(option (b) — validates Phase 6 image generation gate end-to-end).
Grading uses per-assertion rubric from Appendix B.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: Verify acceptance criteria

**Files:**
- Read: `/home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/benchmark.md`
- Read: `/home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-*/with_skill/grading.json`
- Read: `/home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-*/with_skill/timing.json`
- Create: `/home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/acceptance_report.md`
- Create: `/home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/provisional_evaluation.md`

- [ ] **Step 1: AC1 — image files in Phase 6 runs**

For every with-skill run where Q8 ≠ text-only:

```bash
for eval in auth-migration pitch-deck otel-resume; do
  dir=/home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-${eval}/with_skill/workdir/images
  count=$(ls $dir 2>/dev/null | wc -l)
  q8=$(grep -oE 'Q8.*text-only|Q8.*full|Q8.*selective' /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-${eval}/with_skill/outputs/*.md 2>/dev/null | head -1)
  echo "${eval}: Q8='${q8}', images_count=${count}"
done
```

Expected: for any run with `Q8 != text-only`, `images_count > 0`.

If any run with Q8 ≠ text-only has images_count = 0, **AC1 FAILED**. Investigate the Phase 6 transcript + SKILL.md gating logic. Do NOT merge to main.

- [ ] **Step 2: AC3 — pass rate ≥ 90% on Sonnet**

Read `benchmark.md` and extract with-skill pass rate:

```bash
cat /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/benchmark.md | grep -A10 "^## Summary" | head -15
```

With-skill pass rate must be ≥ 0.90.

- [ ] **Step 3: AC4 — no regression on iteration-1 wins**

Cross-check per scenario:

```bash
# Resumption detection — transcript from otel-resume with_skill should mention prior artifact detection
grep -c "MATERIALS_INDEX.md" /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-otel-resume/with_skill/outputs/transcript.md

# Rich-materials synthesis — auth-migration design spec should reference fixture content
grep -E "aud|SameSite|dual-read|RS256|14-hour" /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-auth-migration/with_skill/outputs/*.md | head -5

# Missing-info handling — pitch-deck should flag gaps
grep -iE "placeholder|missing|don't have|not yet" /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/eval-pitch-deck/with_skill/outputs/transcript.md | head -5
```

All three should return non-zero matches (confirming behavioral continuity with iteration-1).

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

iter1 = total_tokens('/home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-1')
iter2 = total_tokens('/home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2')
ratio = iter2 / iter1 if iter1 else 0
verdict = "PASS" if ratio <= 1.15 else "FAIL"
print(f"iter-1 with_skill tokens: {iter1}")
print(f"iter-2 with_skill tokens: {iter2}")
print(f"Ratio: {ratio:.2f} (target ≤ 1.15) — {verdict}")
PY
```

- [ ] **Step 5: AC6 — provisional-change evaluation (correct denominators)**

Provisional phases are 1, 2, 3, 4, 5, 8, 9. Some phases are not exercised in every scenario:
- **team-update** (Quick path) skips Phase 1 and 3 and 5 and 8 — denominator for those phases is 3 (not 4).
- **otel-resume** (Resumption) starts at Phase 3 — skips Phase 1 and 2 — denominator for those is 3 (auth, pitch, team for Phase 2; auth and pitch for Phase 1).

Per-phase effective denominators:
- Phase 1 (B1, B2): 2 scenarios apply (auth-migration, pitch-deck) — team-update has no materials; otel-resume is resuming past Phase 1
- Phase 2 (B3, B4, B5, B6): 3 scenarios apply (team-update, auth-migration, pitch-deck) — otel-resume skips Phase 2
- Phase 3 (B7, B8): 3 scenarios apply (auth-migration, pitch-deck, otel-resume) — team-update Quick path
- Phase 4 (B9): 4 scenarios apply — all scenarios produce a style guide
- Phase 5 (B10, B11): 3 scenarios apply (auth-migration, pitch-deck, otel-resume) — team-update Quick path
- Phase 8 (B15, B16, B17): 3 scenarios apply (auth-migration, pitch-deck, otel-resume) — team-update Quick path
- Phase 9 (B18): 4 scenarios apply — all scenarios produce a final file

Write `presentation-builder-workspace/iteration-2/provisional_evaluation.md`:

```bash
python3 <<'PY' > /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/provisional_evaluation.md
import json
from pathlib import Path

root = Path('/home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2')

# Effective denominators per phase
denominators = {
    'Phase 1': (['B1', 'B2'], ['auth-migration', 'pitch-deck']),
    'Phase 2': (['B3', 'B4', 'B5', 'B6'], ['team-update', 'auth-migration', 'pitch-deck']),
    'Phase 3': (['B7', 'B8'], ['auth-migration', 'pitch-deck', 'otel-resume']),
    'Phase 4': (['B9'], ['team-update', 'auth-migration', 'pitch-deck', 'otel-resume']),
    'Phase 5': (['B10', 'B11'], ['auth-migration', 'pitch-deck', 'otel-resume']),
    'Phase 8': (['B15', 'B16', 'B17'], ['auth-migration', 'pitch-deck', 'otel-resume']),
    'Phase 9': (['B18'], ['team-update', 'auth-migration', 'pitch-deck', 'otel-resume']),
}

print("# Provisional Change Evaluation — Iteration 2\n")
print("| Phase | Paired assertions | Applicable scenarios | Pass/Applicable | Verdict |")
print("|-------|-------------------|----------------------|-----------------|---------|")

for phase, (bs, scenarios) in denominators.items():
    total_pass = 0
    total_applicable = 0
    for scenario in scenarios:
        grading_path = root / f'eval-{scenario}' / 'with_skill' / 'grading.json'
        if not grading_path.exists():
            continue
        gd = json.loads(grading_path.read_text())
        for exp in gd.get('expectations', []):
            text = exp.get('text', '')
            for b in bs:
                if f'{b}:' in text or f'{b} ' in text:
                    total_applicable += 1
                    if exp.get('passed'):
                        total_pass += 1
    applicable = len(scenarios) * len(bs)
    # Verdict threshold: 75% of applicable asserts must pass
    verdict = 'Keep' if (total_applicable and total_pass / total_applicable >= 0.75) else 'Reduce to minimal gate'
    print(f"| {phase} | {', '.join(bs)} | {len(scenarios)} scenarios | {total_pass}/{total_applicable} | {verdict} |")
PY
```

- [ ] **Step 6: Write acceptance_report.md**

```bash
python3 <<'PY' > /home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2/acceptance_report.md
import json
from pathlib import Path

root = Path('/home/rocky00717/rawgentic/projects/presentation-builder/presentation-builder-workspace/iteration-2')
bench_path = root / 'benchmark.json'
benchmark = json.loads(bench_path.read_text())
with_skill_rate = benchmark.get('run_summary', {}).get('with_skill', {}).get('pass_rate', {}).get('mean', 0)

print("# Iteration-2 Acceptance Report\n")
print(f"**Date:** 2026-04-22 (or actual run date)\n")

print("## AC1 — Phase 6 image files")
for e in ['auth-migration', 'pitch-deck', 'otel-resume']:
    dir = root / f'eval-{e}/with_skill/workdir/images'
    count = len(list(dir.glob('*'))) if dir.exists() else 0
    print(f"- `{e}`: {count} images")
print("")

print(f"## AC3 — With-skill pass rate\n")
print(f"- Measured: {with_skill_rate:.2%}")
print(f"- Target: ≥ 90%")
print(f"- Verdict: {'PASS' if with_skill_rate >= 0.90 else 'FAIL'}\n")

print("## AC4, AC5 — see full report above for details\n")
PY
```

- [ ] **Step 7: Push branch**

Commits for the iteration-2 work span 13 separate commits (Tasks 1-12 + the eval commit from Task 13). Push the full branch before opening a PR:

```bash
cd /home/rocky00717/rawgentic/projects/presentation-builder && \
git push -u origin iter-2-sonnet-hardening
```

- [ ] **Step 8: Commit reports and open PR if all ACs pass**

```bash
cd /home/rocky00717/rawgentic/projects/presentation-builder && \
git add presentation-builder-workspace/iteration-2/provisional_evaluation.md presentation-builder-workspace/iteration-2/acceptance_report.md && \
git commit -m "$(cat <<'EOF'
evals(skill): iteration-2 acceptance + provisional evaluation

Documents AC1-AC6 pass/fail status with correct per-phase denominators
(scenarios that don't exercise a phase don't count against its
provisional evaluation).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)" && \
git push origin iter-2-sonnet-hardening
```

Then (only if all ACs pass) open the PR:

```bash
gh pr create --title "iter-2: Sonnet-hardening pass" --body "$(cat <<'EOF'
## Summary

- Iteration-2 Sonnet-hardening changes per `docs/superpowers/specs/2026-04-22-sonnet-hardening-design.md`.
- All 9 phase reference files + SKILL.md + setup.md hardened with content-aware gates, inlined critical execution steps, named failure modes, and Q8 Visual Strategy.
- New `phase-8-code-review.md` reference file; `code-review.md` at project root as canonical Phase 8 review log location.

## Acceptance criteria

See `presentation-builder-workspace/iteration-2/acceptance_report.md`.

## Test plan

- [x] AC1: images generated in Phase 6 runs (unless Q8 = text-only)
- [x] AC3: ≥ 90% pass rate on Sonnet against Appendix B assertion set
- [x] AC4: no regression on iteration-1 wins
- [x] AC5: token cost ≤ iter-1 × 1.15
- [x] AC6: provisional-change evaluation complete

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

If any AC fails, do NOT open the PR. Investigate, iterate, rerun Task 13, and repeat.

---

## Self-Review (completed during plan writing)

**Spec coverage check:** Every design-specified change maps to a task. SKILL.md is now consolidated into Task 11 (single commit) instead of spread across 4 tasks.

**Placeholder scan:** No "TBD", "implement later", or undefined-term usage.

**Type consistency:** Q8 values (`full` / `selective` / `text-only`), `substantive finding`, `substantiated waiver`, `Review Log (Phase N)`, canonical `code-review.md` location — consistent throughout.

**Subagent safety:** All paths are absolute. All bash commands include their own `cd` or use absolute paths. Verify steps use `grep -F` / `grep -E` with proper escaping, and output via `test ... && echo PASS` rather than raw `grep -c` expected-integer strings.

**Replace-target safety:** Every replace instruction specifies the **exact first line** and **exact last line** of the target block to avoid subagent ambiguity.

**Task 13 flagged [MAIN SESSION ONLY]** in the header and in the Task Order table at the top of the plan.

**Task 15 grader rubric:** Per-assertion rubric provided in Task 13 Step 6 so grader can mechanically check content-aware assertions (not fall back to existence-only).

**Replicate MCP decision:** Task 13 commits to Option (b) — real Replicate MCP configured. Pre-flight check halts if not configured.

**Push before PR:** Task 14 Step 7 explicitly pushes the branch before Step 8 creates the PR.
