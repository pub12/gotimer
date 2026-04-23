# GoTimer MCP Server

An MCP (Model Context Protocol) server for [GoTimer](https://gotimer.org). Create, share, and embed countdown timers, Pomodoro sessions, chess clocks, and interval timers from any AI assistant.

## Quick Start

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "gotimer": {
      "command": "npx",
      "args": ["-y", "gotimer-mcp"]
    }
  }
}
```

### Claude Code (CLI)

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "gotimer": {
      "command": "npx",
      "args": ["-y", "gotimer-mcp"]
    }
  }
}
```

### Cursor

Open **Settings > MCP Servers > Add Server** and enter:

```json
{
  "gotimer": {
    "command": "npx",
    "args": ["-y", "gotimer-mcp"]
  }
}
```

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "gotimer": {
      "command": "npx",
      "args": ["-y", "gotimer-mcp"]
    }
  }
}
```

### VS Code (Copilot)

Add to your workspace `.vscode/mcp.json`:

```json
{
  "servers": {
    "gotimer": {
      "command": "npx",
      "args": ["-y", "gotimer-mcp"]
    }
  }
}
```

### Local install (any platform)

```bash
npm install -g gotimer-mcp
```

Then use `gotimer-mcp` as the command instead of `npx` in any config above.

## Tools

### Timer Tools

| Tool | Description | Auth |
|------|-------------|------|
| `create_timer` | Create a live, shareable countdown timer | No |
| `create_pomodoro` | Create a Pomodoro focus session (25/5 default) | No |
| `get_timer_url` | Get a URL to a pre-configured timer page | No |
| `get_embed_code` | Generate HTML embed code for any timer | No |
| `list_timer_types` | List all available timer types (strategies) | No |
| `list_timer_presets` | List pre-configured presets (Pomodoro, HIIT, etc.) by category | No |

### Challenge Tools

| Tool | Description | Auth |
|------|-------------|------|
| `list_public_challenges` | List public timer challenges | No |
| `get_leaderboard` | Get challenge leaderboard & scores | No |
| `create_challenge` | Create a new timer challenge | API key |
| `join_challenge` | Join a challenge with a join code | API key |

## Examples

### Create a 5-minute countdown
```
create_timer({ type: "countdown", duration: 300, label: "Quick Break" })
→ https://gotimer.org/countdown?type=countdown&started=...&duration=300&label=Quick+Break
```

### Start a Pomodoro session
```
create_pomodoro({ work_minutes: 25, break_minutes: 5, rounds: 4 })
→ https://gotimer.org/countdown?type=interval&started=...&work=1500&rest=300&rounds=4
```

### List fitness timer presets
```
list_timer_presets({ category: "fitness" })
→ [{ id: "hiit", name: "HIIT Timer", strategy: "interval", ... }, ...]
```

### Create a timer using a preset name
```
create_timer({ type: "pomodoro" })
→ https://gotimer.org/countdown?type=interval&started=...&work=1500&rest=300&rounds=4
```

### Generate embed code
```
get_embed_code({ type: "countdown", duration: 600, theme: "dark", size: "compact" })
→ <iframe src="https://gotimer.org/embed/countdown?..." ...></iframe>
```

## HTTP/SSE Mode (for Smithery, remote hosting)

By default the server runs over **stdio** (for local tools like Claude Desktop, Cursor, etc.). To run as an HTTP server with SSE transport — needed for Smithery and remote deployments:

```bash
# Using PORT env var
PORT=3001 npx gotimer-mcp

# Or using --http flag (defaults to port 3001)
npx gotimer-mcp --http
```

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/sse` | GET | Establish SSE connection |
| `/messages?sessionId=...` | POST | Send JSON-RPC messages |
| `/health` | GET | Health check |

### Smithery / Remote MCP Server URL

GoTimer's hosted MCP endpoint (no deployment needed):

```
https://gotimer.org/api/mcp/sse
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GOTIMER_API_KEY` | For challenges | — | API key for write operations |
| `GOTIMER_API_URL` | No | `https://gotimer.org/api/v1` | API base URL |
| `PORT` | No | `3001` | HTTP server port (activates HTTP/SSE mode) |

## How Shared Timers Work

When you create a timer, the URL encodes the start time and duration. Anyone opening the URL sees the same synchronized countdown — no server polling needed. Timers expire after 24 hours.

## Widget Embedding

Use `get_embed_code` to generate iframe HTML for any website. Widgets are customizable:
- **Theme**: light, dark, or auto
- **Size**: compact (300x250), standard (480x400), large (640x500)
- **Controls**: full, minimal, or none

See the [Embed Documentation](https://gotimer.org/developers/embeds) for details.

## AI Discoverability

GoTimer provides machine-readable documentation for AI systems:

- **llms.txt**: [https://gotimer.org/llms.txt](https://gotimer.org/llms.txt) — concise overview for AI crawlers
- **llms-full.txt**: [https://gotimer.org/llms-full.txt](https://gotimer.org/llms-full.txt) — full documentation
- **OpenAPI spec**: [https://gotimer.org/api/openapi.json](https://gotimer.org/api/openapi.json)
- **Developer docs**: [https://gotimer.org/developers](https://gotimer.org/developers)

## MCP Registries

GoTimer MCP is listed on:
- [npm](https://www.npmjs.com/package/gotimer-mcp)
- [Official MCP Registry](https://registry.modelcontextprotocol.io)
- [Smithery](https://smithery.ai)
- [Glama](https://glama.ai/mcp/servers)

## License

MIT
