# Phase 1: Research & Gather

## Purpose

Collect all source material the presentation will draw from. The goal is to have everything
in one place before brainstorming begins -- you can't design what you don't understand.

## Process

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

### 5. Identify Gaps

After gathering, review the index and flag:
- Topics with thin coverage (need more material)
- Topics with no real-world examples (need case studies)
- Missing statistics or metrics (need data)
- Areas where the user's personal experience is the primary source (note for speaker notes)

Present gaps to the user and ask how to fill them.

## Key Principles

- **Parallel exploration** -- don't explore sources sequentially
- **Over-gather** -- it's cheaper to have too much than too little
- **Organize by topic** -- not by source location
- **Index everything** -- the index is the bridge to Phase 2
- **Ask clarifying questions** -- if something seems missing, ask before assuming
