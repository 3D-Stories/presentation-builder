# First Run Setup

## Prerequisites Check Order

Run these checks in sequence on first invocation. After all pass, create
`~/.claude/.presentation-builder-setup-complete` (global marker -- prerequisites are machine-level).

### 0. Environment Pre-flight (WSL2 detection)

Before any dependency checks, detect the runtime environment. WSL2 has a
known failure mode where Windows binaries on PATH shadow Linux equivalents,
causing silent MCP setup failures.

```bash
if uname -r 2>/dev/null | grep -qi microsoft; then
  echo "WSL2 environment detected"

  # Check if npx resolves to a Windows binary
  NPX_PATH=$(which npx 2>/dev/null)
  if echo "$NPX_PATH" | grep -q '/mnt/c/'; then
    echo "WARNING: npx resolves to Windows binary: $NPX_PATH"
    echo "MCP servers launched with this npx will fail silently."
    echo "Fix: install Node.js natively in WSL2:"
    echo "  sudo apt update && sudo apt install -y nodejs npm"
    echo "  OR use nvm: https://github.com/nvm-sh/nvm"
  fi

  # Check if node resolves to a Windows binary
  NODE_PATH_CHECK=$(which node 2>/dev/null)
  if echo "$NODE_PATH_CHECK" | grep -q '/mnt/c/'; then
    echo "WARNING: node resolves to Windows binary: $NODE_PATH_CHECK"
    echo "Fix: install Node.js natively in WSL2 (same as above)"
  fi
fi
```

If warnings are printed, **STOP** and tell the user:

> "Your WSL2 environment has Windows Node.js on PATH instead of Linux
> Node.js. MCP servers (including Replicate for image generation) will
> fail silently with this configuration. Install Node.js natively in WSL2
> before continuing:
> `sudo apt update && sudo apt install -y nodejs npm`
> Then restart Claude Code."

Do NOT proceed with setup if npx resolves to a `/mnt/c/` path — the
Replicate MCP server will fail to start and Phase 6 will be unreachable.

### 1. document-skills Plugin

```bash
ls ~/.claude/plugins/cache/anthropic-agent-skills/document-skills/ 2>/dev/null
```

If missing, tell the user:
> "This skill needs the document-skills plugin for building presentations (PPTX, PDF, HTML, DOCX)
> and generating images. Let me set that up -- this only happens once."

Then run these commands:
```
/plugin marketplace add anthropics/skills
/plugin install document-skills@anthropic-agent-skills
/reload-plugins
```

Wait for reload to complete before continuing.

### 2. generate-image skill (for AI Image Generation)

Required when Phase 2 Q8 (Visual Strategy) is `full` or `selective`.
Skipped when Q8 = `text-only`.

Image generation is delegated to the `/generate-image` skill, which owns
Replicate MCP configuration and model selection. This skill does NOT
configure Replicate directly — it relies on `/generate-image` being
installed and set up.

Check current state by looking for Replicate MCP tools (the
`/generate-image` skill itself uses this check):

```bash
# If mcp__replicate__ tools are visible, /generate-image is ready.
# Otherwise, setup is needed.
```

If `/generate-image` is not set up, tell the user:

> "Image generation needs the `/generate-image` skill. Run
> `/generate-image:setup` to configure it — you'll need a free Replicate
> API token from replicate.com/account/api-tokens. The setup skill
> handles MCP configuration for you."

After the user runs `/generate-image:setup`:

> "Once `/generate-image:setup` completes, run `/mcp` to reconnect (or
> restart Claude Code) and then continue with the presentation."

**If the user declines to configure `/generate-image`:**

Do NOT proceed with a silent downgrade. The skill cannot produce AI-generated
images without `/generate-image`. Offer the user a concrete choice:

> "Without `/generate-image` configured, the skill cannot generate AI images. I can either:
> (a) Proceed with Q8 = `text-only` (native shapes/charts/typography only — no AI images), or
> (b) Pause here so you can run `/generate-image:setup` later and resume.
> Which would you prefer?"

If the user chooses (a), change Q8 to `text-only` in the design spec and continue. If the user chooses (b), halt with the reason documented in the transcript.

The prior "I can design the presentation and create placeholder slides
for images" language has been removed — it was a silent-downgrade path
that let Sonnet skip image generation without user opt-in.

**Post-setup MCP connectivity test:**

After the user runs `/generate-image:setup` and reconnects MCP, verify
the Replicate tools are actually available before continuing:

```bash
# Check that Replicate MCP tools loaded successfully
# In the Claude Code session, mcp__replicate__* tools should be visible.
# If they are not, the MCP server failed to start.
```

If tools are still not visible after setup:
1. Check MCP server status: `claude mcp list`
2. On WSL2: re-run the environment pre-flight (step 0) — Windows npx is
   the most common cause of "setup succeeded but tools not available"
3. Try restarting Claude Code entirely (not just `/mcp` reconnect)

If the MCP server is listed but tools don't appear, the server is crashing
at startup. Common causes:
- Invalid or expired Replicate API token
- Network connectivity issues (corporate proxy, VPN)
- npx version incompatibility (try `npx@latest`)

### 3. Review Tools (Optional)

Check availability -- don't install, just note what's available:

```
/bmad-party-mode  → Tier 1 review (best: multi-agent debate with specialized personas)
/reflexion:critique → Tier 2 review (good: structured multi-judge critique)
Neither → Tier 3 review (built-in: simulated multi-perspective prompts)
```

Report to user:
> "Review capability: [Tier level]. [Brief description of what's available]."

### 4. pptxgenjs (for PPTX output)

If the user chose PPTX format, ensure pptxgenjs is available:

```bash
node -e "require('pptxgenjs')" 2>/dev/null || NODE_PATH=/usr/local/lib/node_modules node -e "require('pptxgenjs')" 2>/dev/null
```

If missing:
```bash
npm init -y 2>/dev/null
npm install pptxgenjs
```

Or if using global:
```bash
npm install -g pptxgenjs
```

Note: When running build scripts, use `NODE_PATH=/usr/local/lib/node_modules` if installed globally.
