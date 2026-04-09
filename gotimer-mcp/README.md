# GoTimer MCP Server

An MCP (Model Context Protocol) server for GoTimer. Lets AI assistants like Claude manage timer challenges, view leaderboards, and more.

## Tools

| Tool | Description | Auth Required |
|------|-------------|---------------|
| `list_timer_types` | Returns all available timer types | No |
| `list_public_challenges` | Lists public challenges with scores | No |
| `get_leaderboard` | Gets leaderboard for a specific challenge | No |
| `create_challenge` | Creates a new challenge | Yes (API key) |
| `join_challenge` | Joins a group challenge with a join code | Yes (API key) |

## Setup

### 1. Install dependencies

```bash
cd gotimer-mcp
npm install
```

### 2. Get an API key

Log in to GoTimer as an admin, then go to the admin panel and generate an API key under API Keys.

### 3. Configure Claude Desktop

Add the server to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "gotimer": {
      "command": "node",
      "args": ["/absolute/path/to/gotimer-mcp/index.js"],
      "env": {
        "GOTIMER_API_KEY": "gtmr_your_api_key_here",
        "GOTIMER_API_URL": "https://gotimer.org/api/v1"
      }
    }
  }
}
```

Replace `/absolute/path/to/gotimer-mcp` with the actual path to the `gotimer-mcp` directory.

### 4. Restart Claude Desktop

After saving the config, restart Claude Desktop. You should see the GoTimer tools available.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GOTIMER_API_KEY` | For write operations | — | Your GoTimer API key |
| `GOTIMER_API_URL` | No | `https://gotimer.org/api/v1` | API base URL (useful for local dev) |

## Local Development

To point at a local GoTimer instance:

```json
"env": {
  "GOTIMER_API_KEY": "gtmr_your_key",
  "GOTIMER_API_URL": "http://localhost:3000/api/v1"
}
```
