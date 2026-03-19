# First Run Setup

## Prerequisites Check Order

Run these checks in sequence on first invocation. After all pass, create
`~/.claude/.presentation-builder-setup-complete` (global marker -- prerequisites are machine-level).

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

### 2. Replicate MCP (for AI Image Generation)

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

1. Check if `~/.claude/mcp.json` exists
2. If it exists, read it and MERGE the replicate server config (don't overwrite other servers)
3. If it doesn't exist, create it

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

**If user doesn't want to set up Replicate:**
> "No problem -- I can design the presentation and create placeholder slides for images.
> You can add images manually later, or set up Replicate MCP anytime with `/presentation-builder setup`."

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
