# Presentation Best Practices

Principles discovered through real presentation builds. Reference these during Phase 2
(requirements), Phase 7 (implementation), and speaker notes review.

## Design Principles

### Problem-First Openings
Every section should open with the PROBLEM, not the solution. Problems create tension.
Solutions release it. That's story structure.

**Bad:** "Hooks are scripts that fire at lifecycle events."
**Good:** "The AI doesn't know your team's rules. It'll push to main at 2 AM if you let it."

### "Where to Start" Beats
For mixed audiences, include an actionable takeaway after technical sections.
Non-technical audience members should leave knowing their first step.

**Example:** "If you take one thing from today -- write a 5-line hook that enforces your
team's most-forgotten rule. That's your entry point."

Place these at the end of sections 2 (Hooks), 3 (Skills), 4 (Composability), and 6 (Shift-Left)
-- or wherever the audience includes people who might think "impressive but what do I do with this?"

### Visual Backbone
Choose ONE recurring visual element that appears across multiple slides. It orients the
audience and shows progression. Examples:
- A maturity ladder/progress bar that lights up across sections
- A pipeline diagram that grows
- A before/after comparison that evolves

### Honest Limitations
Credibility comes from acknowledging what doesn't work. Include at least one "what AI can't do"
moment. The audience trusts your positive claims more when they've heard you be honest about
the negatives.

### Callback Structure
The closing should reference the opening. This creates a narrative loop that makes the talk
feel complete.

**Opening:** "I spent four hours debugging a function ChatGPT wrote for me."
**Closing:** "Recently I ran a similar change through adversarial review. [X] agents found [Y]
issues in [Z] minutes. Not because the AI is smarter. Because I built a system that asks the
questions I forget to ask."

## Speaker Notes Format

### Bad Notes (stage directions):
```
Tell the debugging story. Mention ChoreStory.
Transition to hooks section.
```

### Good Notes (speakable script):
```
TALKING POINTS:
• "[Time] ago, I spent four hours debugging a function that ChatGPT wrote for me."
• "It passed the tests I asked for. It missed the twelve edge cases I didn't think to ask about."
• [PAUSE] "That's when I realized: the problem isn't the AI. The problem is me."
• "I was building ChoreStory -- a full-stack family app. And I was using AI the way most people do:"
  - No guardrails -- it could do anything, push anywhere
  - No consistency -- every session started from scratch

PACING:
[~2 min. The pause after "the problem is me" is critical -- let the audience relate.]

TRANSITION:
"The first thing I built was the simplest: a way to stop the AI from doing things it shouldn't." [CLICK]
```

### Required Elements in Every Slide's Notes:
1. **TALKING POINTS** -- speakable sentences, not summaries
2. **PACING** -- timing, [PAUSE], [SLOW DOWN], [CLICK] cues
3. **TRANSITION** -- exact bridge sentence to the next slide
4. **Audience callouts** where relevant: `[FOR PMs:]`, `[FOR DEVS:]`, `[FOR MANAGERS:]`

## Slide Layout Variety

Don't repeat the same layout on consecutive slides. Vary across these patterns:

| Pattern | Use For |
|---------|---------|
| Two-column (text + image) | Case studies, concept + illustration |
| Card grid (2x3 or 3x2) | Features, events, options |
| Code block + callouts | Technical examples |
| Big stat + small label | Key metrics, impact numbers |
| Full-width image | Section dividers, demos |
| Pipeline/flow diagram | Processes, architectures |
| Comparison columns | Before/after, with/without |

### Cut Plan
For presentations over 20 minutes, define a cut plan in the design spec: "If told you have
[shorter time], cut in this order: ..." Prioritize dropping sections that are least essential
to the primary takeaway. Keep the opening, the climax, and the close intact.

## Timing Rules of Thumb

- ~1.5-2 minutes per slide (average)
- Section divider slides: ~30 seconds (they're visual beats, not content)
- Maturity ladder/progress slides: ~15 seconds
- Demo slides: 2-3 minutes (include time for switching + recovery)
- Always budget 10-15% buffer for questions and delays
- Lead with your most impactful stat, don't bury it
