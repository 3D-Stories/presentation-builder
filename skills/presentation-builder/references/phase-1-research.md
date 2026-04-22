# Phase 1: Research & Gather

## Purpose

Collect all source material the presentation will draw from. The goal is to have everything
in one place before brainstorming begins -- you can't design what you don't understand.

## Process

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

### 1. Identify Sources

Ask the user where the source material lives. Common sources:
- Local directories (project files, docs, session notes)
- Remote servers (SSH accessible)
- Git repositories (GitHub, GitLab)
- Existing documents (PDFs, zips, markdown files)
- Web resources (documentation sites, articles)

### 2. Parallel Exploration

Launch explore agents in parallel for each source location. For each source, look for:
- Session notes and documentation (`session_notes*.md`, `claude_docs/`)
- Product docs and specs (`docs/`, `specs/`, `*.md`)
- CLAUDE.md files (project context)
- README files
- Design documents and architecture docs
- Relevant code files that illustrate concepts
- Configuration files that show patterns

For remote servers, use SSH commands to explore directory structures before copying files.

### 3. Copy & Organize

Create a `gathered-materials/` directory in the project root. Organize by topic, not by source:

```
gathered-materials/
  topic-1/        # e.g., hooks/
  topic-2/        # e.g., skills/
  topic-3/        # e.g., multi-agent/
  ...
```

Copy relevant files from all sources into topic directories.

### 4. Create Materials Index

Write `MATERIALS_INDEX.md` at the project root. This is the master reference that maps
every gathered file to its purpose and relevant presentation topic.

Structure:
```markdown
# Presentation Materials Index
## Gathered: YYYY-MM-DD | Total Files: N

## Topic 1: [Name]
| File | Purpose |
|------|---------|
| `path/to/file` | Brief description |

## Topic 2: [Name]
...
```

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

## Key Principles

- **Parallel exploration** -- don't explore sources sequentially
- **Over-gather** -- it's cheaper to have too much than too little
- **Organize by topic** -- not by source location
- **Index everything** -- the index is the bridge to Phase 2
- **Ask clarifying questions** -- if something seems missing, ask before assuming

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
