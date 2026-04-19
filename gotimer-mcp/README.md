# GoTimer MCP Server

An MCP (Model Context Protocol) server for [GoTimer](https://gotimer.org). Create, share, and embed countdown timers, Pomodoro sessions, chess clocks, and interval timers from any AI assistant.

## Quick Start

### Option 1: npx (recommended)

Add to your Claude Desktop config:

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

### Option 2: Local install

```bash
cd gotimer-mcp
npm install
```

```json
{
  "mcpServers": {
    "gotimer": {
      "command": "node",
      "args": ["/path/to/gotimer-mcp/index.js"]
    }
  }
}
```

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

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GOTIMER_API_KEY` | For challenges | — | API key for write operations |
| `GOTIMER_API_URL` | No | `https://gotimer.org/api/v1` | API base URL |

## How Shared Timers Work

When you create a timer, the URL encodes the start time and duration. Anyone opening the URL sees the same synchronized countdown — no server polling needed. Timers expire after 24 hours.

## Widget Embedding

Use `get_embed_code` to generate iframe HTML for any website. Widgets are customizable:
- **Theme**: light, dark, or auto
- **Size**: compact (300x250), standard (480x400), large (640x500)
- **Controls**: full, minimal, or none

See the [Embed Documentation](https://gotimer.org/developers/embeds) for details.

## MCP Registries

GoTimer MCP is available on:
- [Official MCP Registry](https://registry.modelcontextprotocol.io)
- [Smithery](https://smithery.ai)
- [Glama](https://glama.ai/mcp/servers)
