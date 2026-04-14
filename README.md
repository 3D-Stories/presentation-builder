# Presentation Builder

A Claude Code plugin for building professional presentations through a structured, iterative workflow.

## What It Does

Turns raw materials (docs, notes, research) into polished presentations through three stages:

### Stage 1: Discovery
1. **Research & Gather** -- Collect source materials from multiple locations in parallel
2. **Requirements** -- Brainstorm structure, audience, timing through guided dialogue

### Stage 2: Design
3. **Multi-Agent Review** -- Refine design via multi-perspective feedback
4. **Style Guide** -- Define colors, typography, image prompts for consistency
5. **Design Review** -- Final review pass before building
6. **Visual Generation** -- AI-generated images via Replicate with background removal

### Stage 3: Build
7. **Implementation** -- Build modular scripts (one file per section)
8. **Code Review** -- Multi-agent review for bugs and spec conformance
9. **Build & Iterate** -- Generate presentation, review, fix, rebuild

## Smart Complexity Detection

The skill detects presentation complexity and adjusts the workflow:

- **Quick** (<10 slides): Compressed workflow, minimal reviews
- **Standard** (10-20 slides): Full workflow, single review passes
- **Complex** (>20 slides): Full workflow with multi-agent reviews at every gate

## Output Formats

| Format | Via | Best For |
|--------|-----|----------|
| PPTX | `/pptx` | Conference talks, corporate presentations |
| HTML | `/frontend-design` | Interactive, web-based delivery |
| PDF | `/pdf` | Handouts, print materials |
| DOCX | `/docx` | Narrative decks, proposals |

## Prerequisites

On first run, the skill checks for and helps install:

- **document-skills** plugin (auto-guided install for output formats + /generate-image)
- **Replicate MCP** (auto-configured with user-provided API token for image generation)
- **pptxgenjs** (auto-installed for PPTX output)

## Optional (Recommended)

These enhance the multi-agent review quality:

- [BMAD Method](https://github.com/bmad-method/bmad) -- enables party mode for rich multi-agent reviews (Tier 1)
- [Reflexion](https://github.com/context-engineering-kit/reflexion) -- enables structured critique reviews (Tier 2)

Without these, the skill uses built-in multi-perspective review prompts (Tier 3).

## Installation

```bash
# If 3D-Stories marketplace is configured:
claude plugin install presentation-builder@3D-Stories

# Or install directly from GitHub:
claude plugin install 3D-Stories/presentation-builder
```

## Usage

```
/presentation-builder "Build a 30-minute talk on advanced AI coding practices"
```

Or just describe what you need:
```
I need to put together a presentation on our Q4 results for the board meeting
```

The skill guides you through each phase, checking in at every step.

## Resume Support

If you interrupt a session and come back later, the skill detects existing artifacts
(materials index, design spec, style guide, images, build scripts) and offers to resume
from where you left off.

## The Shift-Left Principle

This skill embodies the 1-10-100 rule: spend the most effort on requirements (cheap to change),
less on design, and least on implementation. Most of the AI time goes into Stages 1-2.
The implementation in Stage 3 becomes almost mechanical because the design is solid.

## License

MIT

